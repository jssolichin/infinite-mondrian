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
    uploadDataUrl: function (blob, filename) {
        //http://blog.teamtreehouse.com/uploading-files-ajax

        var xhr = new XMLHttpRequest();

        // Open the connection.
        xhr.open('POST', 'saveimage', true);

        xhr.onload = function () {
            if (xhr.status === 200) {
                // File(s) uploaded.
                console.log('Upload Ready')
            } else {
                alert('An error occurred!');
            }
        };

        xhr.send(blob);

        return xhr;

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
            el.requestFullscreen();
        } else if (el.webkitRequestFullscreen) {
            el.webkitRequestFullscreen();
        } else if (el.mozRequestFullScreen) {
            el.mozRequestFullScreen();
        } else if (el.msRequestFullscreen) {
            el.msRequestFullscreen();
        }

        //good fullscreen on cardboard requires landscape if possible
        if(shared.option.cardboard == true && screen.orientation !== undefined )
            screen.orientation.lock('landscape-primary');
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
            var img = shared.renderer.domElement.toDataURL("image/png");
            var filename = helpers.uploadDataUrl(img);

            filename.onreadystatechange = function() {
                if (filename.readyState == 4) {
                    if(conn)
                        conn.send({img: filename.responseText});
                }
            };


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
            var shareOption = shareSettings(data);
            var share = new Share('#'+id, shareOption);

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
    enableDeviceControl: function (){
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