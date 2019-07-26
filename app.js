var express = require("express");
var app = express();
var server = require('http').createServer(app);
var io = require('socket.io')(server);

//Initialzing used directories
app.use(express.static(__dirname + '/node_modules'));
app.use("/", express.static(__dirname + '/'));

//Fetching HTML
app.get('/', function(req, res,next) {
    res.sendFile(__dirname + '/index.html');
});

//Fetching Stylesheet
app.get('/', function(req, res,next) {
    res.sendFile(__dirname + '/style.css');
});

io.on('connection', function(client) {
    console.log('Client connected...');

    client.on('join', function(data) {
        console.log(data);
    });

    client.on('messages', function(data) {
           client.emit('broad', data);
           client.broadcast.emit('broad',data);
    });

});

server.listen(4200);

//NAT