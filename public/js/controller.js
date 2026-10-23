/*
 * Created by Jonathan on 12/14/2014.
 */
//the host's id comes after the # (controller.html#abc123); older links used /abc123
var url = window.location;
var hostId = url.hash.substring(1) || url.pathname.split('/').pop();
var receiver = config.idPrefix + 'host-' + hostId;

var device = 'controller';

var $photorollUl = document.getElementById('photo-roll').children[0];


//peerjs to connect with world
var name = config.idPrefix + 'controller-' + Please.make_color().toString().substring(1);
var peer = new Peer(name, config.peer);
var conn;
var currentId = 0;

peer.on('error', function (err) {
    console.log(err);
    if (err.type === 'peer-unavailable')
        alert('Could not find that Infinite Mondrian. Reload it on the desktop and scan the new code.');
});

peer.on('open', function () {
    conn = peer.connect(receiver);

    conn.on('data', function(data) {
        if(data.img){
            var id = "id"+currentId;
            currentId++;
            $photorollUl.insertAdjacentHTML('afterbegin', '<li class="animated bounceInUp" ><div id="'+id+'"></div><img src="'+data.img+'"/></li>');
            addShareButtons(document.getElementById(id), data.img);
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
});
