/*
 * Created by Jonathan on 12/14/2014.
 */
//editable variable
//var host= 'localhost';
var url = window.location;
var urlArray = url.pathname.split( '/' );
var receiver = 'host-'+urlArray[urlArray.length - 1];

//var receiver = 'receiver';
var device = 'controller';

var $photorollUl = document.getElementById('photo-roll').children[0];


//peerjs to connect with world
var name = 'controller-' + Please.make_color().toString().substring(1);
var peer = new Peer(name, {host: config.server.host, port: config.server.port, path: '/peerjs', debug: 3, config: {'iceServers': [ ]} });
var conn = peer.connect(receiver);
var currentId = 0;

conn.on('data', function(data) {
    if(data.img){
        var id = "id"+currentId;
        currentId++;
        $photorollUl.insertAdjacentHTML('afterbegin', '<li class="animated bounceInUp" ><div id="'+id+'"></div><img src="'+data.img+'"/></li>');
        var shareOption = shareSettings(data);
        var share = new Share('#'+id, shareOption);
        var $newImg = $photorollUl.children[0];

        //remove animation event afterward so can scroll properly
        var events = ["webkitAnimationEnd", "mozAnimationEnd", "MSAnimationEnd", "oanimationend", "animationend"];
        events.forEach(function (event) {
            $newImg.addEventListener(event, function () {
                this.removeAttribute('class');
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
});
