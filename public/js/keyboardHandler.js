var handleKeyPresses = function (event){
    var key = String.fromCharCode(event.keyCode);

    switch (key) {
        case ' ':
            //stop camera from moving
            shared.controls.move = !shared.controls.move;
            break;
    }

}
