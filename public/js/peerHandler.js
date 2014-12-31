var peerHandler = function(conn) {
    conn.on('open', function () {
        console.log('open');
        helpers.instructionToggle(false);

        if (shared.gyro !== undefined) {
            shared.gyro.disconnect();
            shared.gyro.toggleFreeze();
        }
    });
    conn.on('close', function () {
        console.log('closed');
        helpers.instructionToggle(true);

        if (shared.gyro !== undefined) {
            shared.gyro.connect();
            shared.gyro.toggleFreeze();
        }
    });
    conn.on('data', function (data){
        helpers.manipulateScene(data,conn);
    });
};
