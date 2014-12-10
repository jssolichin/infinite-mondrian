var Box = function (shared){

    this.generateSize(shared.width, shared.height, shared.depth);
    this.color = this.generateColor(shared.multicolor);

    this.position = {x: 0, y: 0, z:0};

    var geometry = new THREE.BoxGeometry( this.width, this.height, this.depth);
    var material = new THREE.MeshLambertMaterial( {color: this.color} );
    var mesh = new THREE.Mesh(geometry,material);

    this.mesh = mesh.clone();
};
Box.prototype.generateColor = function (multicolor){
    var colors;
    if(multicolor)
        colors  = [0xff0000, 0x0000ff, 0xffff00];
    else
        colors = [0x000000];

    return colors[Math.floor(Math.random() * colors.length)];
}
Box.prototype.generatePosition = function (cameraPos) {
    var that = this;

    var components = ['x', 'y', 'z'];
    var bounds  = WIDTH*3.5;

    components.forEach(function(component){
        var min = cameraPos[component] - bounds;
        var max = cameraPos[component] + bounds;
        that.position[component] = helpers.generateRandom(min, max);
    })

};
Box.prototype.move = function () {
    this.mesh.position.x = this.position.x;
    this.mesh.position.y = this.position.y;
    this.mesh.position.z = this.position.z;
};
Box.prototype.generateSize = function (width, height, depth) {
    this.width = helpers.generateRandom(width/4, width);
    this.height = helpers.generateRandom(height/4, height);
    this.depth = helpers.generateRandom(depth/4, depth);
};


