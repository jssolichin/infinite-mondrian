/*
 * Created by Jonathan on 12/14/2014.
 */

//editable variable
//var host= 'localhost';
var host= '192.168.1.6';
var receiver = 'receiver';
var difference = 30;

//html elements
var $decrementFov = document.getElementById('decrement-fov');
var $incrementFov = document.getElementById('increment-fov');
var $toggleFog = document.getElementById('toggle-fog');
var $toggleCamera = document.getElementById('toggle-camera');
var $takePicture = document.getElementById('take-picture');

var $photorollUl = document.getElementById('photo-roll').children[0];


//peerjs to connect with world
var name = 'controller-' + Please.make_color().toString().substring(1);
var peer = new Peer(name, {host: host, port: 3000, path: '/peerjs', debug: 3, config: {'iceServers': [ ]} });
var conn = peer.connect(receiver);

conn.on('data', function(data) {
    if(data.img){
        $photorollUl.insertAdjacentHTML('afterbegin', '<li class="animated bounceInDown"><img src="'+data.img+'"/></li>');
        var $newImg = $photorollUl.children[0];

        //remove animation event afterward so can scroll properly
        var events = ["webkitAnimationEnd", "mozAnimationEnd", "MSAnimationEnd", "oanimationend", "animationend"];
        events.forEach(function (event) {
            $newImg.addEventListener(event, function () {
                this.removeAttribute('class')
            }, false);
        });
    }
});

conn.on('open', function() {
    // Send messages
    conn.send(name);


    window.addEventListener('deviceorientation', function(eventData) {
        var deviceOrientation = {};

        deviceOrientation.compassHeading = eventData.compassHeading;
        deviceOrientation.webkitCompassHeading = eventData.webkitCompassHeading;
        deviceOrientation.alpha = eventData.alpha;
        deviceOrientation.beta = eventData.beta;
        deviceOrientation.gamma = eventData.gamma;

       conn.send(deviceOrientation);

    });

    window.addEventListener('orientationchange', function(eventData){
        var orientation = {orientationChange: window.orientation || 0};

        conn.send(orientation);
    });

    $decrementFov.addEventListener('click', function () {
        var option = {change: 'fov', increment: -difference};
        conn.send(option);
    });
    $incrementFov.addEventListener('click', function () {
        console.log(3)
        var option = {change:'fov', increment: difference};
        conn.send(option);
    });

    $toggleCamera.addEventListener('click', function () {
        conn.send({toggleCamera: true});
    });
    $toggleFog.addEventListener('click', function () {
        this.children[0].classList.toggle('off');
        conn.send({toggleFog: true})
    });
    $takePicture.addEventListener('click', function () {
        conn.send({takePicture: true});
    });
});
