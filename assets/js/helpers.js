var helpers = {
    generateRandom: function (min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    },
    generateRandomFloat: function (min, max) {
        return Math.random() * (max - min ) + min;
    },
    isTouchCapable: function(){
        return !!('ontouchstart' in window);
    },
    resizeHandler: function(camera, renderer) {
        WIDTH = window.innerWidth;
        HEIGHT = window.innerHeight;

        camera.aspect = WIDTH / HEIGHT;
        camera.updateProjectionMatrix();
        renderer.setSize(WIDTH, HEIGHT);

        if(shared.option.cardboard)
            shared.effect.setSize(WIDTH, HEIGHT);
    },
    requestFullscreen: function (el){
        if (el.requestFullscreen) {
            var entering = el.requestFullscreen();
            if (entering && entering.catch)
                entering.catch(function () {}); //refused outside a real tap; nothing to do
        } else if (el.webkitRequestFullscreen) {
            el.webkitRequestFullscreen();
        } else if (el.mozRequestFullScreen) {
            el.mozRequestFullScreen();
        } else if (el.msRequestFullscreen) {
            el.msRequestFullscreen();
        }

        //good fullscreen on cardboard requires landscape if possible
        if(shared.option.cardboard == true && screen.orientation !== undefined && screen.orientation.lock){
            var locking = screen.orientation.lock('landscape-primary');
            if(locking && locking.catch)
                locking.catch(function () {}); //iOS and non-fullscreen pages refuse; not an error
        }
    },
    cancelFullscreen: function (){
        if (document.exitFullscreen) {
            document.exitFullscreen();
        } else if (document.webkitExitFullscreen) {
            document.webkitExitFullscreen();
        } else if (document.mozCancelFullScreen) {
            document.mozCancelFullScreen();
        } else if (document.msExitFullscreen) {
            document.msExitFullscreen();
        }
    },
    onMouseMove: function (event, cameraMan) {
        if ( shared.controls.mouse === false ) return;

        var movementX = event.movementX || event.mozMovementX || event.webkitMovementX || 0;
        var movementY = event.movementY || event.mozMovementY || event.webkitMovementY || 0;

        cameraMan.rotation.y -= movementX * 0.006;
        cameraMan.rotation.x -= movementY * 0.006;

    },
    pointerLockHandler: function ( event, element ) {

        // Ask the browser to lock the pointer
        element.requestPointerLock = element.requestPointerLock || element.mozRequestPointerLock || element.webkitRequestPointerLock;
        element.requestPointerLock();

    },
    onPointerLockChange: function ( event, element ) {

        var $hint = document.getElementById('hint');

        if ( document.pointerLockElement === element || document.mozPointerLockElement === element || document.webkitPointerLockElement === element ){
            shared.controls.mouse = true;
            helpers.instructionToggle(false);
            $hint.className = 'animated fadeIn';
        }
        else{
            shared.controls.mouse = false;
            helpers.instructionToggle(true);
            $hint.className = 'animated fadeOut';
        }

    },
    instructionToggle: function (on){

        shared.option.instructionVisible = on;
        var $instructionsWrapper = document.getElementById('instructions-wrapper');
        var $controls = document.getElementById('controls');

        if(on){
            shared.composer = helpers.createComposer(true);

            $instructionsWrapper.className = 'animated fadeIn';
            $controls.className = 'animated fadeIn';

        } else {
            shared.composer = helpers.createComposer(false);

            $instructionsWrapper.className = 'animated fadeOut';
            $controls.className = 'animated fadeOut';

        }
    },
    createComposer: function (blur){

        var composer = new THREE.EffectComposer(shared.renderer);
        composer.addPass(shared.shader.renderPass);

        if(blur){
            composer.addPass(shared.shader.hblur);
            composer.addPass(shared.shader.vblur);
        }

        composer.addPass(shared.shader.copyPass);

        return composer;

    },
    manipulateScene: function (data,conn){

        if (shared && shared.gyro) {
            if (data.gamma)
                shared.gyro.changeDeviceOrientation(data);
            else if (data.orientationChange !== undefined)
                shared.gyro.changeOrientation(data.orientationChange);
        }

        if (data.change) {
            console.log(data.increment)

            shared.camera[data.change] += data.increment;
            shared.camera.updateProjectionMatrix();

        } else if (data.toggleCamera) {
            if (shared.camera.inOrthographicMode)
                shared.camera.toPerspective();
            else
                shared.camera.toOrthographic();
        } else if (data.toggleFog) {
            shared.scene.fog.far = shared.scene.fog.far == shared.option.distanceFog ? 9999999 : shared.option.distanceFog;
        } else if (data.takePicture) {
            //the picture goes straight to whoever asked (the phone, or this page's own photo roll); nothing is uploaded
            var img = shared.renderer.domElement.toDataURL("image/png");
            if(conn)
                conn.send({img: img});
        }

    },
    send: function (data){
        //this is both the sender and receiver, since it is sending to itself

        var $photorollUl = document.getElementById('photo-roll').children[0];

        console.log(data)
        if(data.img){
            var id = "id"+currentId;
            currentId++;
            $photorollUl.insertAdjacentHTML('afterbegin', '<li class="animated bounceInUp" ><div id="'+id+'"></div><img src="'+data.img+'"/></li>');
            addShareButtons(document.getElementById(id), data.img);

            var $newImg = $photorollUl.children[0];

            if($photorollUl.children.length > 5){
                var $lastImg = $photorollUl.children[$photorollUl.children.length-1];
                $lastImg.className = "animated fadeOut";
                $lastImg.parentNode.removeChild($lastImg);
            }

            //remove animation event afterward so can scroll properly
            var events = ["webkitAnimationEnd", "mozAnimationEnd", "MSAnimationEnd", "oanimationend", "animationend"];
            events.forEach(function (event) {
                $newImg.addEventListener(event, function () {
                    if(this.className.indexOf('fadeOut') >= 0)
                        $newImg.parentNode.removeChild($newImg);
                    else
                        this.removeAttribute('class');
                }, false);

                window.setTimeout(function(){
                    $newImg.className += "animated fadeOut";
                }, shared.option.galleryRemoveTimeout);

            });
        }

    },
    addTrails: function(){

        //get current direction
        var q = shared.cameraMan.quaternion;
        var cameraDir = new THREE.Vector3(0,0,-1);
        cameraDir.applyQuaternion(q)

        //change vector to point to opposite direction and behind
        cameraDir.normalize().multiplyScalar(-290); //behind camera

        //add a new box for trail
        var geometry = new THREE.BoxGeometry(10,10,10);
        var material = new THREE.MeshLambertMaterial( {color: 0x00ff00} );
        var mesh = new THREE.Mesh(geometry,material);
        shared.scene.add(mesh);

        //move the box to a position behind the camera
        mesh.position.copy(shared.cameraMan.position);
        mesh.translateX (cameraDir.x);
        mesh.translateY (cameraDir.y);
        mesh.translateZ (cameraDir.z);
    },
    createEffect: function (){
        if(shared.effect === undefined){
            shared.effect = new THREE.StereoEffect( shared.renderer );
            shared.effect.eyeSeparation = 10;
        }
        helpers.resizeHandler(shared.camera, shared.renderer)
        shared.effect.setSize( window.innerWidth, window.innerHeight );

    },
    rotateLandscapeHint:  function(){
        if(shared.option.cardboard == true && window.orientation != 90){
            document.getElementById('hint2').style.display = 'block';
        }
        else
            document.getElementById('hint2').style.display = 'none';
    },
    cardboardToggler: function (){

        var $hint = document.getElementById('cardboard-hint');

        if(shared.option.cardboard === false){
            shared.option.cardboard = true;
            helpers.createEffect();
            if(helpers.isTouchCapable())
                helpers.enableDeviceControl();
            $hint.innerHTML = 'Disable';
        }
        else {
            shared.option.cardboard = false;
            helpers.resizeHandler(shared.camera, shared.renderer);
            document.getElementById('cardboard-hint').innerHTML = 'Enable';
        }

        helpers.rotateLandscapeHint();
    },
    requestMotionPermission: function (done){
        //iOS 13+ only sends deviceorientation events after the page asks, from inside a tap.
        //Other browsers may have the same API but deliver events anyway (and answer "denied"
        //outside a tap), so judge by whether real readings arrive rather than by the answer.
        if (helpers.motionSeen || !(window.DeviceOrientationEvent && typeof DeviceOrientationEvent.requestPermission === 'function'))
            return done(true);

        var finish = function (state) {
            setTimeout(function () {
                if (state !== 'granted' && !helpers.motionSeen)
                    alert('Motion access was not allowed, so tilting the phone will not move the view. Reload the page to be asked again.');
                done(helpers.motionSeen);
            }, 1000);
        };
        DeviceOrientationEvent.requestPermission().then(finish, function () { finish('error'); });
    },
    enableDeviceControl: function (){
        //ask during this tap, but don't wait for the answer: fullscreen below must also run inside the tap,
        //and orientation events simply start arriving once allowed
        if (!helpers.motionPermissionAsked) {
            helpers.motionPermissionAsked = true;
            helpers.requestMotionPermission(function () {});
        }

        var $container = document.getElementById('container');

        if(shared.gyro.status()){
            shared.gyro.connect();
            if(helpers.isTouchCapable())
                helpers.requestFullscreen($container);
        }
        else{
            if(helpers.isTouchCapable())
                helpers.cancelFullscreen();
            shared.gyro.disconnect();
        }

        helpers.instructionToggle(shared.gyro.status());

    }
};
//note when real motion readings arrive (desktops fire one event with null values)
window.addEventListener('deviceorientation', function (event) {
    if (event.alpha !== null || event.beta !== null)
        helpers.motionSeen = true;
});
