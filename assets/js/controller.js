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

//iOS 13+ only sends deviceorientation events after the user allows it, from a tap.
//Other browsers may have the same API but deliver events anyway, so the "tap to steer"
//button only appears if no real readings have arrived shortly after load.
//The listener further down can be attached first; events simply start flowing once allowed.
var $enableMotion = document.getElementById('enable-motion');
var motionSeen = false;
window.addEventListener('deviceorientation', function (event) {
    if (event.alpha !== null || event.beta !== null) {
        motionSeen = true;
        $enableMotion.hidden = true;
    }
});
if (window.DeviceOrientationEvent && typeof DeviceOrientationEvent.requestPermission === 'function') {
    setTimeout(function () {
        if (!motionSeen)
            $enableMotion.hidden = false;
    }, 1000);
    $enableMotion.addEventListener('click', function () {
        DeviceOrientationEvent.requestPermission().then(function (state) {
            $enableMotion.hidden = true;
            if (state !== 'granted' && !motionSeen)
                alert('Motion access was not allowed, so tilting the phone will not move the view. Reload the page to be asked again.');
        }).catch(function (err) {
            console.log(err);
        });
    });
}

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
