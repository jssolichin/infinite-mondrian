/**
 * Created by Jonathan on 12/3/2014.
 */
process.env.PWD = process.cwd();

var express = require('express');
var app = express();
var http = require('http').Server(app);

app.use("/public", express.static(process.env.PWD + '/public'));
app.use("/bower_components", express.static(process.env.PWD + '/bower_components'));
app.use("/node_modules", express.static(process.env.PWD + '/node_modules'));

app.get('/', function(req, res){
    res.sendFile(process.env.PWD + '\\views\\index.html');
});

http.listen(3000, function(){
    console.log('listening on *:3000');
});