var cameraControl = function (camera) {

    var pitchObject = new THREE.Object3D();
    pitchObject.add(camera);

    var yawObject = new THREE.Object3D();
    yawObject.position.y = 10;
    yawObject.add(pitchObject);
    var PI_2 = Math.PI / 2;

    var onMouseMove = function (event) {

        //if ( scope.enabled === false ) return;

        var movementX = event.movementX || event.mozMovementX || event.webkitMovementX || 0;
        var movementY = event.movementY || event.mozMovementY || event.webkitMovementY || 0;

        yawObject.rotation.y -= movementX * 0.006;
        pitchObject.rotation.x -= movementY * 0.006;

        pitchObject.rotation.x = Math.max(-PI_2, Math.min(PI_2, pitchObject.rotation.x));

    };

    document.addEventListener('mousemove', onMouseMove, false);

    this.getObject = function (){
       return yawObject;
    }
}
