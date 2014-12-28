var peerHandler = function(conn) {
    conn.on('open', function () {
        console.log('open');

        if (shared.gyro !== undefined) {
            shared.gyro.disconnect();
            shared.gyro.toggleFreeze();
        }
    });
    conn.on('close', function () {
        console.log('closed');

        if (shared.gyro !== undefined) {
            shared.gyro.connect();
            shared.gyro.toggleFreeze();
        }
    });
    conn.on('data', function (data) {

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
            helpers.uploadDataUrl(img);
            conn.send({img: img});
        }

    });
};