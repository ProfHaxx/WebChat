var express = require("express");
var app = express();
var server = require('http').createServer(app);
var io = require('socket.io')(server);

class Chat {
    //TODO: Participants Array, Messages Array
}

class Profile {
    constructor(uname, name, colorset, backgroundID, settings) {
        this.user = uname;
        this.name = name;
        this.colorset = colorset;
        this.backgroundID = backgroundID;
        this.settings = settings;
    }

    searchSetting(key) {
        this.settings.forEach(setting => {
            if(setting.key = key) {
                return setting.value;
            }
        });
        return null;
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

class Setting {
    constructor(key, value) {
        this.key = key;
        this.value = value;
    }
}

class Storage {
    constructor(ip) {
        this.ip = ip;
        this.store = [];
    }

    addToStore(element) {
        this.store.push(element);
    }

    removeFromStore(element) {
        this.store = removeFromArray(this.store, element);
    }
    
    removeAll() {
        this.store = [];
    }
}

var storages = [];
var chats = [];
var profiles = [];
//TO REMOVE
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

//Fetching Favicon
app.get('/', function(req, res,next) {
    res.sendFile(__dirname + '/img/favicon.ico');
});

app.use(express.static(__dirname + '/img/bg/'));

//TODO: List of all connected people
var connected = [];

//Event Handling
io.on('connection', function(client) {
    console.log('Client connected...');

    //On Join Event
    client.on('join', function(data) {
        console.log(getClientIP(client) + " just joined");
        if(!hasStorage(getClientIP(client))) {
            storages.push(new Storage(getClientIP(client)));
        }
        connected.push(getClientIP(client));
        client.emit('useramountchange', connected.length);
    });

    //On Disconnect
    client.on('disconnect', function() {
        console.log(getClientIP(client) + " just disconnected");
        connected = removeFromArray(connected, getClientIP(client));
        client.emit('useramountchange', connected.length);
    });

    //Message Received from Client
    client.on('messages', function(data) {
        var msg = filterMessage(data);
        console.log(msg.type);
        if(msg.command == null && msg.target == null && msg.text != "") { //Broadcast
            client.emit('broad', data, false); //Change false to autoscroll property
            client.broadcast.emit('broad', data, false); //Change false to autoscroll property
        } else if(msg.command != null) { //Commands
            switch(msg.command) {
                case "autoscroll":
                    autoscroll = !autoscroll; //Change false to autoscroll property
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

    //Write Profile
    client.on('write', function(username, name, colorset, backgroundID, settings) {
        addProfile(username, name, colorset, backgroundID, settings);
        client.emit('senddata', username, name, colorset, backgroundID, settings);
    });

    //Read Profile
    client.on('read', function(name) {
        var profile = getProfile(name);
        client.emit('senddata', profile.username, profile.name, profile.colorset, profile.backgroundID, profile.settings);
    });

    //Access Storage
    client.on('storage-request', function(){
        client.emit('storage-response', getStorage(getClientIP(client)).store);
    });

    //Update Storage
    client.on('storage-refresh', function(elements){
        getStorage(getClientIP(client)).store = elements;
    });

    client.on('debug-request', function() {
        client.emit('debug-response', [getClientIP(client), storages, client]);
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

function getProfile(name) {
    profiles.forEach(profile => {
        if(profile.name == name) {
            return profile;
        }
    });
}

function getProfileID(name) {
    var id = 0;
    profiles.forEach(profile => {
        if(profile.name == name) {
            return id;
        }
        id += 1;
    });
}

function addProfile(username, name, colorset, backgroundID, settings) {
    //DEFAULT VALUES
    if(name == "" || name == null) {
        console.error("Adding of Profile failed due to empty name!");  
    }
    if(username == "") {username = "Anonymous";}
    if(colorset == null) {colorset = ["#35a0c6", "#3557c6", "#5c35c6"]}
    if(backgroundID == null || backgroundID == 0) {backgroundID = 1;}
    //HANDLING STARTS HERE
    if(getProfile(name) == null) {
        profiles.push(new Profile(username, name, colorset, backgroundID, settings));
    } else {
        modifyProfile(getProfileID(name), new Profile(username, name, colorset, backgroundID, settings));
    }
}

function modifyProfile(profileID, newProfile) {
    profiles[profileID] = newProfile;
}

function getClientIP(client) {
    return (client.handshake.address).substring(7);
}

function removeFromArray(array, item) {
    var i = 0;
    var arr = [];
    array.forEach(element => {
        if(element != item) {
            arr[i] = element;
            i++;
        }
    });
    return arr;
}

function hasStorage(ip) {
    var out;
    storages.forEach(storage => {
        if(storage.ip == ip) {
            out = storage;
        }
    });
    return (out != null && out != undefined);
}

function getStorage(ip) {
    var out;
    console.log(storages.length);
    storages.forEach(storage => {
        if(storage.ip == ip) {
            out = storage;
        }
    });
    return out;
}