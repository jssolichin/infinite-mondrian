/**
 * Created by Jonathan on 11/17/2014.
 */

// set the scene size
var WIDTH = window.innerWidth - 5;
var HEIGHT = window.innerHeight - 5;

// set some camera attributes
var VIEW_ANGLE = 45,
    ASPECT = WIDTH / HEIGHT,
    NEAR = 0.1,
    FAR = 10000;

// scene properties
var backgroundColor = 0xffffff;

var shared = {};
var init = function () {
    // get the DOM element to attach to
    // - assume we've got jQuery to hand
    var $container = document.getElementById('container');

    // create a WebGL renderer
    shared.renderer = new THREE.WebGLRenderer();
    shared.renderer.setClearColor(backgroundColor, 1);
    shared.renderer.setSize(WIDTH, HEIGHT);

    //create a camera
    shared.camera =
        new THREE.PerspectiveCamera(
            VIEW_ANGLE,
            ASPECT,
            NEAR,
            FAR);
    shared.camera.position.z = 300;

    control = new cameraControl(shared.camera);

    //create a light
    var light = new THREE.PointLight(0xFFFFFF);
    light.position.x = 15;
    light.position.y = 50;
    light.position.z = 130;

    //create subtle ambient light
    var ambientLight = new THREE.AmbientLight(0x333355);
     ambientLight = new THREE.AmbientLight(0x111111);

    //create a scene
    shared.scene = new THREE.Scene();
    shared.scene.fog = new THREE.Fog(0xffffff, 0, WIDTH*5);

    // add the camera to the scene

    shared.scene.add(control.getObject());
    shared.scene.add(light);
    shared.scene.add(ambientLight);


    //param for boxes
    boxOption = {
        width: WIDTH/2, height: HEIGHT/2, depth: WIDTH/2, multicolor: true
    };

    //param for bar--function generates which dimension to make really short and long
    barOptionGenerator = function(){
        //make all dimension short. no multicolor since only black
        var barOption = {
            width: WIDTH/15, height: HEIGHT/15, depth: WIDTH/15, multicolor: false
        };

        //choose which dimension to make really long
        var dimensions = ['width', 'height', 'depth'];
        barOption[dimensions[helpers.generateRandom(0,2)]] = 99999;

        return barOption;
    }

    //list of objects in world
    var boxes = [];
    for (var i = 0; i< 400; i++){
        var type; //bar or box

        //create a bar some percent of the time, else boxes
        if(Math.random() > .8)
            type = barOptionGenerator();
        else
            type = boxOption;

        //add object to scene
        boxes[i] =  new Box(type);
        shared.scene.add(boxes[i].mesh);

        //move to a position in world
        boxes[i].generatePosition(shared.camera.position);
        boxes[i].move();
    }

    // attach the render-supplied DOM element
    $container.appendChild(shared.renderer.domElement);
}

var anim = function () {

    stats.begin();

    requestAnimationFrame(anim);

    //move camera overtime slowly
    shared.camera.position.z--;
    shared.renderer.render(shared.scene, shared.camera);

    stats.end();
}

init();
anim();
