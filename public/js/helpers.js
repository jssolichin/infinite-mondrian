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
                console.log('uploadReady')
            } else {
                alert('An error occurred!');
            }
        };

        xhr.send(blob);
    },
    resizeHandler: function(camera, renderer) {
        WIDTH = window.innerWidth;
        HEIGHT = window.innerHeight;

        camera.aspect = WIDTH / HEIGHT;
        camera.updateProjectionMatrix();
        renderer.setSize(WIDTH, HEIGHT);
    },
    onMouseMove: function (event, cameraMan) {
        //if ( scope.enabled === false ) return;

        var movementX = event.movementX || event.mozMovementX || event.webkitMovementX || 0;
        var movementY = event.movementY || event.mozMovementY || event.webkitMovementY || 0;

        cameraMan.rotation.y -= movementX * 0.006;
        cameraMan.rotation.x -= movementY * 0.006;

    }
};