/**
 * Created by Jonathan on 12/3/2014.
 */
process.env.PWD = process.cwd();

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
    res.sendFile(process.env.PWD + '\\views\\index.html');
});
app.get('/controller', function(req, res){
    res.sendFile(process.env.PWD + '\\views\\controller.html');
});

server.on('connection', function(id) { console.log(id) });
