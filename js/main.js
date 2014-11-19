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

    //create a scene
    shared.scene = new THREE.Scene();
    
    // add the camera to the scene

    shared.scene.add(control.getObject());
    shared.scene.add(light);
    shared.scene.add(ambientLight);


    //add boxes
    boxOption = {
        width: WIDTH/5, height: HEIGHT/5, depth: WIDTH/5
    }

    var boxes = [];
    for (var i = 0; i< 100; i++){
        boxes[i] =  new Box(boxOption);
        shared.scene.add(boxes[i].mesh);

        boxes[i].generatePosition(shared.camera.position);
        boxes[i].move();
    }
    //box.generatePosition(shared.camera.position);
    //box.move();

    // attach the render-supplied DOM element
    $container.appendChild(shared.renderer.domElement);
}

var anim = function () {

    stats.begin();
    requestAnimationFrame(anim);

    shared.camera.position.z--;
    shared.renderer.render(shared.scene, shared.camera)

    stats.end();
}

init();
anim();
