var handleKeyPresses = function (event){
    var key = String.fromCharCode(event.keyCode);

    switch (key) {
        case ' ':
            //stop camera from moving
            pause = !pause;
            break;
    }

}
