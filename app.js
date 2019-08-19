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

//loadProfiles();

var profiles = [];

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

    //Message Received from Client
    client.on('messages', function(data) {
        var filteredData = filterMessage(data);
        if(filteredData[1] == null && filteredData[3] == null && filteredData[4] != "") { //Broadcast
            client.emit('broad', data);
            client.broadcast.emit('broad',data);   
        } else if(filteredData[1] != null) { //Commands
            if(filteredData[2] != null) {
                client.emit('cmd', filteredData[1], filteredData[2]);
            } else {
                client.emit('cmd', filteredData[1]);
            }
        } else if(filteredData[3] != null) { //Private Message
            
        }
    });

    //Write Profile
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

    //Read Profile
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
    var author = message.match(/[\w]+/)[0];
    var t0 = message.split("[" + author + "]: ")[1];
    var special;
    if(t0 === undefined) {
        special = null;
    } else {
        special = t0.substring(0, 1);
    }
    var command = null;
    var param = null;
    var target = null;
    var text = null;
    if(special != "/" && special != "@") {
        special = null;
        text = message.split("[" + author + "]: ")[1];
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