/**
 * Created by Jonathan on 11/17/2014.
 */
var device = "host";
var WIDTH = window.innerWidth;
var HEIGHT = window.innerHeight;
var controllerId = Please.make_color().toString().substring(1);

//set link variables
var url = window.location; // return segment1/segment2/segment3/segment4
var controllerUrl = url.origin+'/'+controllerId;
document.getElementById('controller-url').innerHTML = '<a href="'+controllerUrl+'">'+controllerUrl+'</a>';

var shared = {
    controls: {
        mouse: false,
        move: false
    },
    option: {
        cardboard: false,
        peer: {
            name: 'host-'+controllerId,
            host: 'localhost'
        },
        camera: {
            viewAngle: 45,
            near: 0.1,
            far: 10000,
            orthoNear: .001,
            orthoFar: 9000
        },
        distanceFog: WIDTH*4,
        backgroundColor: 0xffffff,
        box: {
            width: WIDTH/2, height: HEIGHT/2, depth: WIDTH/2, multicolor: true
        },
        galleryRemoveTimeout: 10000
    },

    barOptionGenerator: function(){
        //make all dimension short. no multicolor since only black
        var barOption = {
            width: WIDTH/15, height: HEIGHT/15, depth: WIDTH/15, multicolor: false
        };

        //choose which dimension to make really long
        var dimensions = ['width', 'height', 'depth'];
        barOption[dimensions[helpers.generateRandom(0,2)]] = 99999;

        return barOption;
    },
    moveBox: function (indexOfBox, cameraDir){
        //function to move out of bounds box to a new loc nearby camera

        //based on where camera is looking at, project a point inside the fog
        cameraDir.normalize().multiplyScalar(shared.option.distanceFog+1000)

        //then randomly rotate that point within 0 to 180 deg both horizontally and vertically
        var axis = new THREE.Vector3( 0, 1, 0 );
        var angle = helpers.generateRandomFloat(-Math.PI/2, Math.PI/2);
        cameraDir.applyAxisAngle( axis, angle );
        axis = {x: 1, y: 0, z: 0};
        angle = helpers.generateRandomFloat(-Math.PI/2, Math.PI/2);
        cameraDir.applyAxisAngle( axis, angle );

        //move the box to a new place that is within bounds

        //move the box that is currently out of bound to the position of the camera currently
        var box = shared.boxes[indexOfBox].mesh;
        box.position.copy(shared.cameraMan.position);
        //then offset it by the calculation from above
        box.translateX (cameraDir.x);
        box.translateY (cameraDir.y);
        box.translateZ (cameraDir.z);

    }
};

var init = function () {

    // get the DOM element to attach to
    var $container = document.getElementById('container');
    var $hud = document.getElementById('hud');
    var $cardboardToggle = document.getElementById('cardboard-toggle');

    // create a WebGL renderer
    shared.renderer = new THREE.WebGLRenderer({preserveDrawingBuffer: true}); // required to support .toDataURL()
    shared.renderer.setClearColor(shared.option.backgroundColor, 1);
    shared.renderer.setSize(WIDTH, HEIGHT);

    var canvas = $container.appendChild(shared.renderer.domElement);

    //create a camera
    shared.camera =
        new THREE.CombinedCamera(
            WIDTH, HEIGHT, shared.option.camera.viewAngle, shared.option.camera.near, shared.option.camera.far, shared.option.camera.orthoNear, shared.option.camera.orthoFar);
    shared.camera.position.z = 300;

    //cameraMan will handle rotating and moving the camera so that camera itself is always normal
    shared.cameraMan = new THREE.Object3D();
    shared.camera.rotation.set( 0, 0, 0 );
    shared.cameraMan.add(shared.camera)
    shared.gyro = new THREE.DeviceOrientationControls(shared.cameraMan); //for gyroscope control

    //create a light
    var light = new THREE.PointLight(0xFFFFFF);
    light.position.x = 15;
    light.position.y = 50;
    light.position.z = 130;

    //create subtle ambient light
    //var ambientLight = new THREE.AmbientLight(0x333355); //more emotional lighting
    ambientLight = new THREE.AmbientLight(0x111111);

    //create a scene
    shared.scene = new THREE.Scene();
    shared.scene.fog = new THREE.Fog(0xffffff, 0, shared.option.distanceFog);

    // add the camera to the scene
    shared.scene.add(shared.cameraMan);
    shared.camera.add(light);
    shared.scene.add(ambientLight);

    //param for bar--function generates which dimension to make really short and long

    //list of objects in world
    shared.boxes = [];
    for (var i = 0; i< 400; i++){
        var type; //bar or box

        //create a bar some percent of the time, else shared.boxes
        if(Math.random() > .8)
            type = shared.barOptionGenerator();
        else
            type = shared.option.box;

        //add object to scene
        shared.boxes[i] =  new Box(type);
        shared.scene.add(shared.boxes[i].mesh);

        //move it to a position in world
        shared.boxes[i].generatePosition(shared.camera.position);
        shared.boxes[i].move();
    }

    //re-set scene size when window resized
    window.addEventListener('resize', function(){
        helpers.resizeHandler(shared.camera, shared.renderer)
    }, false);

    //add peer listener
    var peer = new Peer(shared.option.peer.name, {host: shared.option.peer.host, port: 3000, path: '/peerjs'});
    peer.on('connection', peerHandler);

    //add mouse listener
    document.addEventListener('mousemove', function(event){
        helpers.onMouseMove(event, shared.cameraMan);
    }, false);

    //add keyboard listener
    document.addEventListener('keydown', handleKeyPresses, false);

    //add hint to rotate if cardboard mode is on and not in landscape
    window.addEventListener("orientationchange", helpers.rotateLandscapeHint, false);

    //add cardboard toggle
    $cardboardToggle.addEventListener('click', function (){
        if(shared.option.instructionVisible){
            var toggle = false;
            if(shared.option.cardboard == false && !helpers.isTouchCapable()){
                var cardboardUrl = url.origin+'/cardboard';
                if(confirm('You should be doing this on a mobile device (go to: '+cardboardUrl+'). Press Ok to proceed anyway'))
                    toggle = true;
                else
                    toggle = false;
            }
            else toggle = true;

            if(toggle)
                helpers.cardboardToggler();
        }
    });

    if(helpers.isTouchCapable()){
        //add touch listener
        $container.addEventListener('touchstart', helpers.enableDeviceControl);
    } else {
        //add pointer listener (and lock them on click)
        var havePointerLock = 'pointerLockElement' in document || 'mozPointerLockElement' in document || 'webkitPointerLockElement' in document;
        if(havePointerLock){
            var element = canvas;

            element.addEventListener('click', function (event){
                helpers.pointerLockHandler(event, element);
            });

            //add pointer-lock listener
            document.addEventListener( 'pointerlockchange', function (event){helpers.onPointerLockChange(event, element);}, false );
            document.addEventListener( 'mozpointerlockchange', function (event){helpers.onPointerLockChange(event, element);}, false );
            document.addEventListener( 'webkitpointerlockchange', function (event){helpers.onPointerLockChange(event, element);}, false );
        }
    }

    //create shaders to render
    shared.shader = {
        renderPass: new THREE.RenderPass(shared.scene, shared.camera),
        copyPass : new THREE.ShaderPass( THREE.CopyShader ),
        hblur : new THREE.ShaderPass(THREE.HorizontalBlurShader),
        vblur : new THREE.ShaderPass(THREE.VerticalBlurShader)
    };
    shared.shader.copyPass.renderToScreen = true;

    //create the composer
    shared.composer = helpers.createComposer(true);

    qr.canvas({
        canvas: document.getElementById('qr-code'),
        value: controllerUrl,
        background: "rgba(0,0,0,0)"
    });

    if(helpers.isTouchCapable()){
        var $controls = document.getElementById('controls');
        var $instructionsWrapper = document.getElementById('instructions-wrapper');
        var $deviceInstruction = document.getElementById('this-device-instruction');

        $controls.style.display = "none";
        $instructionsWrapper.style.bottom = 'auto';
        $deviceInstruction.innerHTML = "Tap anywhere to use your gyroscope"
    }

    //once everything is ready make visible
    $container.style.display ="block";
    $hud.style.display ="block";
    helpers.instructionToggle(true);

};

var frameCounter = 0;
var anim = function () {

    stats.begin();

    //add small boxes behind camera periodically to create movement trails
    if(frameCounter === 20){
        helpers.addTrails();
        frameCounter = 0;
    }
    else
        frameCounter++;

    //update the location of objects
    shared.scene.updateMatrixWorld();

    shared.gyro.update();

    if(!shared.controls.move) {

        //check if boxes are out of bound or not

        //get camera location
        var cameraLoc = new THREE.Vector3( 0, 0, -1 );
        cameraLoc.setFromMatrixPosition( shared.cameraMan.matrixWorld );

        //get camera direction
        var cameraDir = new THREE.Vector3(0,0,-1);
        cameraDir.applyQuaternion(shared.cameraMan.quaternion);

        //go through each box
        for (var i = 0; i < shared.boxes.length; i++) {

            //find the relative position of box to camera
            var p = {
                x:  shared.boxes[i].mesh.position.x - cameraLoc.x,
                y:  shared.boxes[i].mesh.position.y - cameraLoc.y,
                z: shared.boxes[i].mesh.position.z - cameraLoc.z
            };
            var vectorToBox = new THREE.Vector3(p.x, p.y, p.z);

            var angleToBox = cameraDir.angleTo(vectorToBox);
            var distToBox = shared.boxes[i].mesh.position.distanceTo(shared.cameraMan.position)

            //check whether current box is out of bounds and needs to be moved
            //box is out of bounds when it is behind the camera, and inside fog
            var a = angleToBox > 1.67;
            var b = distToBox > shared.option.distanceFog * 1.8;

            if(a && b){
                //move box somewhere nearby if it is out of bounds
                shared.moveBox(i, cameraDir);
            }
        }

        //move forward in the direction the camera is facing
        shared.cameraMan.translateZ(-10);
    }

    if(shared.option.cardboard){
        shared.effect.render( shared.scene, shared.camera );
    }
    else {
        shared.composer.render();
    }

    requestAnimationFrame(anim);

    stats.end();
};

init();
anim();
