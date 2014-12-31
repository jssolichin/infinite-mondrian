/**
 * Created by Jonathan on 12/30/2014.
 */
var difference = 30;

//html elements
var $decrementFov = document.getElementById('decrement-fov');
var $incrementFov = document.getElementById('increment-fov');
var $toggleFog = document.getElementById('toggle-fog');
var $toggleCamera = document.getElementById('toggle-camera');
var $takePicture = document.getElementById('take-picture');

var transporter = function (data){
    if(device == 'controller'){
        conn.send(data);
    }
    else
        helpers.manipulateScene(data);
}

$decrementFov.addEventListener('click', function () {
    var option = {change: 'fov', increment: -difference};
    transporter(option);
});
$incrementFov.addEventListener('click', function () {
    var option = {change:'fov', increment: difference};
    transporter(option);
});
$toggleCamera.addEventListener('click', function () {
    transporter({toggleCamera: true});
});
$toggleFog.addEventListener('click', function () {
    this.children[0].classList.toggle('off');
    transporter({toggleFog: true});
});
$takePicture.addEventListener('click', function () {
    transporter({takePicture: true});
});


