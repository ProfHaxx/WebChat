var express = require("express");
var app = express();
var server = require('http').createServer(app);
var io = require('socket.io')(server);

//Initialzing used directories
app.use(express.static(__dirname + '/node_modules'));
app.use("/", express.static(__dirname + '/'));
app.use("/img/", express.static(__dirname + '/img'));

//Fetching HTML
app.get('/', function(req, res,next) {
    res.sendFile(__dirname + '/index.html');
});

//Fetching Stylesheets
app.get('/', function(req, res,next) {
    res.sendFile(__dirname + '/style.css');
});

//Fetching Icon
app.get('/', function(req, res,next) {
    res.sendFile(__dirname + '/img/chat.ico');
});

//Event Handling
io.on('connection', function(client) {
    console.log('Client connected...');

    //On Join Event
    client.on('join', function(data) {
        console.log(data);
    });

    //Message Recieved from Client
    client.on('messages', function(data) {
           client.emit('broad', data);
           client.broadcast.emit('broad',data);
    });

});

server.listen(4200);

function filterMessage(message) {
    var author = message.match(/[\w]+/)[0];
    var special = message.split("[" + author + "]: ")[1].substring(0, 1);
    var command = null;
    var param = null;
    var target = null;
    var text = null;
    if(special != "/" && special != "@") {
        special = null;
    } else {
        try { command = message.match(/[/][\w]+/)[0].substring(1); } catch (error) {}
        try { target = message.match(/[@][\w]+/)[0].substring(1); } catch (error) {}

        if(command != null) {
            param = message.split("[" + author + "]: /" + command + " ")[1];
        }

        if(target != null) {
            text = message.split("[" + author + "]: @" + target + " ")[1];
        }
    }
    return [author, command, param, target, text];
}