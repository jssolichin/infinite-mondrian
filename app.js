/**
 * Created by Jonathan on 12/3/2014.
 */
process.env.PWD = process.cwd();
var imgPath = 'public/img/shots/';

var crypto = require('crypto');
var fs = require('fs');
var express = require('express');
var app = express();
var ExpressPeerServer = require('peer').ExpressPeerServer;

var server = app.listen(3000, function () {
    console.log(':3000');
});
var options = {
    debug: true
};

app.use("/public", express.static(process.env.PWD + '/public'));
app.use("/bower_components", express.static(process.env.PWD + '/bower_components'));
app.use("/node_modules", express.static(process.env.PWD + '/node_modules'));
app.use('/peerjs', ExpressPeerServer(server, options));

app.get('/', function(req, res){
    res.sendFile(process.env.PWD + '/views/index.html');
});
app.get('/cardboard', function(req, res){
    res.sendFile(process.env.PWD + '/views/index.html');
});
app.get('/:id', function(req, res){
    res.sendFile(process.env.PWD + '/views/controller.html');
});

//http://blog.tompawlak.org/how-to-generate-random-values-nodejs-javascript
var randomValueBase64 = function (len) {
    return crypto.randomBytes(Math.ceil(len * 3 / 4))
        .toString('base64')   // convert to base64 format
        .slice(0, len)        // return required number of characters
        .replace(/\+/g, '0')  // replace '+' with '0'
        .replace(/\//g, '0'); // replace '/' with '0'
};

app.post('/saveimage', function(request, response){
    var imgUri = '';
    request.on('data', function (data){
        imgUri +=data.toString().replace(/^data:image\/(png|gif|jpeg);base64,/,'');
    });
    request.on('end',function(d){
        var img = new Buffer(imgUri, 'base64');
        var filename = imgPath+randomValueBase64(7)+'.png';
        console.log(filename)
        fs.writeFile(filename, img, 'base64', function(err) {
            response.send(filename);
            if(err)
                console.log(err);
        });
    })
});

server.on('connection', function(id) {
    //console.log(id)
});
