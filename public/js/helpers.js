var helpers = {
    generateRandom: function (min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    },
    generateRandomFloat: function (min, max) {
        return Math.random() * (max - min ) + min;
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
            helpers.instructionToggle(false)
            $hint.className = 'animated fadeIn';
        }
        else{
            shared.controls.mouse = false;
            helpers.instructionToggle(true)
            $hint.className = 'animated fadeOut';
        }

    },
    instructionToggle: function (on){


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
            shared.scene.fog.far = shared.scene.fog.far == WIDTH * 5 ? 9999999 : WIDTH * 5;
        } else if (data.takePicture) {
            var img = shared.renderer.domElement.toDataURL("image/png");
            var filename = helpers.uploadDataUrl(img);

            filename.onreadystatechange = function() {
                if (filename.readyState == 4) {
                    console.log(filename.responseText)
                    if(conn)
                        conn.send({img: filename.responseText});
                }
            };

        }

    }

};