var handleKeyPresses = function (event){
    var key = String.fromCharCode(event.keyCode);

    switch (key) {
        //case ' ':
            //stop camera from moving
        //    shared.controls.move = !shared.controls.move;
        //    break;
        case 'A':
            var option = {change: 'fov', increment: -difference};
            helpers.manipulateScene(option);
            break;
        case 'S':
            var option = {change:'fov', increment: difference};
            helpers.manipulateScene(option);
            break;
        case 'C':
            helpers.manipulateScene({toggleCamera: true});
            break;
        case 'F':
            this.children[0].classList.toggle('off');
            helpers.manipulateScene({toggleFog: true});
            break;
        case 'T':
            helpers.manipulateScene({takePicture: true}, helpers);
            break;
    }

}
