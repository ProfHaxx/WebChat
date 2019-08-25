var express = require("express");
var app = express();
var server = require('http').createServer(app);
var io = require('socket.io')(server);

class Profile {
    constructor(uname, name, bg, dn, ln, fc) {
        this.user = uname;
        this.name = name;
        this.background = bg;
        this.dark = dn;
        this.light = ln;
        this.color = fc;
    }
}

class Message {
    constructor(author, command, param, target, text, type) {
        this.author = author;
        this.command = command;
        this.param = param;
        this.target = target;
        this.text = text;
        this.type = type;
    }
}

var profiles = [];
var autoscroll = false;

//Initialzing used directories
app.use(express.static(__dirname + '/node_modules'));
app.use("/", express.static(__dirname + '/'));

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
    res.sendFile(__dirname + '/img/favicon.ico');
});

//Event Handling
io.on('connection', function(client) {
    console.log('Client connected...');

    //On Join Event
    client.on('join', function(data) {
        console.log(client.json);
    });

    //Message Received from Client
    client.on('messages', function(data) {
        var msg = filterMessage(data);
        console.log(msg.type);
        if(msg.command == null && msg.target == null && msg.text != "") { //Broadcast
            client.emit('broad', data, autoscroll);
            client.broadcast.emit('broad', data, autoscroll);
        } else if(msg.command != null) { //Commands
            switch(msg.command) {
                case "autoscroll":
                    autoscroll = !autoscroll;
                    break;
                case "info":
                    client.emit('debug', client);
                    break;
                default:
                    if(msg.param != null) {
                        client.emit('cmd', msg.command, msg.param);
                    } else {
                        client.emit('cmd', msg.command);
                    }
                    break;
            }
        } else if(msg.target != null) { //Private Message
            
        }
    });

    //Write Profile [Massive TODO]
    client.on('write', function(data) {
        
        var username = data[0];
        var name = data[1];
        var background = data[2];
        var darkcolor = data[3];
        var lightcolor = data[4];
        var fontcolor = data[5];

        var override = -1;
        var overnum = -1;

        profiles.forEach(profile => {
            override++;
            if(profile.name == name) {
                overnum = override;
            }
        });

        if(overnum != -1) { //Override old data
            if(username != "") { profiles[overnum].user = username; }
            if(background != "") { profiles[overnum].background = background; }
            if(darkcolor != "") { profiles[overnum].dark = username; }
            if(lightcolor != "") { profiles[overnum].light = username; }
            if(fontcolor != "") { profiles[overnum].color = fontcolor; }
            console.log("Successfully modified profile in <Profiles>");
        } else { //Write new entry
            profiles.push(new Profile(username, name, background, darkcolor, lightcolor, fontcolor));
            console.log("Successfully added new profile to <Profiles>");
        }
    });

    //Read Profile [Massive TODO]
    client.on('read', function(name) {
        var dat = [];
        profiles.forEach(profile => {
            if(profile.name = name) {
                dat.push(profile.user, profile.name, profile.background, profile.dark, profile.light, profile.color);
            }
        });
        client.emit('senddata', [dat[0], dat[1], dat[2], dat[3], dat[4], dat[5]]);
    });
});

server.listen(4200);

function filterMessage(message) {
    var author, command, param, target, text, type;
    if (message.match(/\[([\w ]+)\]: ([^/@])(.+)/) != null) {
        type = "public";
        author = message.match(/\[([\w ]+)\]: ([^/@])(.+)/)[1];
        text = message.match(/\[([\w ]+)\]: ([^/@])(.+)/)[2] +
            message.match(/\[([\w ]+)\]: ([^/@])(.+)/)[3];
    } else if (message.match(/\[([\w ]+)\]: @([\w]+)(.+)/) != null) {
        type = "private";
        author = message.match(/\[([\w ]+)\]: ([^/@]+)/)[1];
        target = message.match(/\[([\w ]+)\]: ([^/@]+)/)[2];
        text = message.match(/\[([\w ]+)\]: ([^/@]+)/)[3];
    } else if (message.match(/\[([\w ]+)\]: \/([\w]+)[ ]?(.*)/) != null) {
        type = "command";
        author = message.match(/\[([\w ]+)\]: \/([\w]+)[ ]?(.*)/)[1];
        command = message.match(/\[([\w ]+)\]: \/([\w]+)[ ]?(.*)/)[2];
        param = message.match(/\[([\w ]+)\]: \/([\w]+)[ ]?(.*)/)[3];
        if (param == "" || param == " ") {
            param = undefined;
        }
    }
    console.log(author + "/" + command + "/" + param + "/" + target + "/" + text);
    return new Message(author, command, param, target, text, type);
}