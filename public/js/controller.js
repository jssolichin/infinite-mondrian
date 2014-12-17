/*
 * Created by Jonathan on 12/14/2014.
 */

    var name = Please.make_color();
    name = 'controller-' + name.substring(1);

    var peer = new Peer(name, {host: 'localhost', port: 3000, path: '/peerjs',
    debug: 3, config: {'iceServers': [
        ]}
});
var conn = peer.connect('receiver');

conn.on('data', function(data) {
    if(data.img){
        document.write('<img src="'+data.img+'"/>');
    }
});
//

var difference = 30;

var $decrementFov = document.getElementById('decrement-fov');
var $incrementFov = document.getElementById('increment-fov');

var $toggleFog = document.getElementById('toggle-fog');
var $toggleCamera = document.getElementById('toggle-camera');
var $takePicture = document.getElementById('take-picture');

function bind( scope, fn ) {
    return function () {
        fn.apply( scope, arguments );
    };
};

var orientationControl = {

    onDeviceOrientationChangeEvent : function( rawEvtData ) {
        this.deviceOrientation = rawEvtData;
    },

    onScreenOrientationChangeEvent : function() {
        this.screenOrientation = window.orientation || 0;
    }

};

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
        var option = {change:'fov', increment: difference};
        conn.send(option);
    });

    $toggleCamera.addEventListener('click', function () {
        conn.send({toggleCamera: true});
    });
    $toggleFog.addEventListener('click', function () {
            conn.send({toggleFog: true})
    });
    $takePicture.addEventListener('click', function () {
        conn.send({takePicture: true});
    });
});
