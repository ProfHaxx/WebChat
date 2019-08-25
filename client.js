var socket = io.connect();

var mobile;

if(document.documentElement.clientWidth > document.documentElement.clientHeight) {
    mobile = false;
    $('.footer').html("v1.6.7 [Desktop]");
} else {
    mobile = true;
    $('.footer').html("v1.6.7 [Mobile]");
}

//Mobile Navigation Functions
function nav(str) {
    console.log("Navigates to " + str);
    $("#" + str + "btn").click();
    if(str != 'home') {
        dropMenu();
    }
}

var menuToggle = false;
function dropMenu() {
    console.log("Menu Toggle activated");
    if(menuToggle) {
        $("#myLinks").css("display", "none");
    } else {
        $("#myLinks").css("display", "block");
    }
    menuToggle = !menuToggle;
}

//User Data
var user_data = [];

//Check local storage
if(getCookie("username") == "") {
    checkCookies();
}
if(getCookie("name") != "") {
    writeSave(getCookie("username"), getCookie("name"), getCookie("background"), 
    getCookie("navdark"), getCookie("navlight"), getCookie("fontcolor"));
    socket.emit('read', getCookie("name"));
}

//Receive User Data from Server
socket.on('senddata', function(profile) {
    console.log(profile);
    user_data = profile;
});

//Receive Command Data from Server
socket.on('cmd', function(command) {
    if(command == "clear") {
        $('#future').html("");
    }
});

socket.on('debug', function(dat) {
    console.log(dat);
});

//On Connect
socket.on('connect', function (data) {
    socket.emit('join', 'Connection to Client established!');
});

//On Broadcast
socket.on('broad', function (data) {
    $('#future').append(data + "<br/>");
});

//On Message
socket.emit('messages', getCookie("username") + " " + "joined the chat!");

//Send Message
$('#chatform').submit(function (e) {
    var username = getCookie("username");
    e.preventDefault();
    var message = $("#chatinput").val();
    socket.emit('messages', "[" + username + "]: " + message);
    clearBoxes();
});

var preftoggle = false;
//On Pref Click
$('#prefbtn').on('click', function(data) {

    if(!preftoggle) { //closed
        $(".dropdown-content").css("display", "block");
    } else {
        $(".dropdown-content").css("display", "none");
    }
    preftoggle = !preftoggle;
});

//On Home Click
$('#homebtn').on('click', function(data) {
    $("#header").html("Chat");
    $("#future").css("display", "block");
    $("#chatform").css("display", "inline");
    $('#profileform').css("display", "none");
    $('#themeform').css("display", "none");
});

//On Profile Click
$('#profilebtn').on('click', function(data) {
    $("#header").html("Profile");
    $("#future").css("display", "none");
    $("#chatform").css("display", "none");
    $("#profileform").css("display", "inline");
    $("#themeform").css("display", "none");
});

//On Theme Click
$('#themebtn').on('click', function(data) {
    $("#header").html("Theme");
    $("#future").css("display", "none");
    $("#chatform").css("display", "none");
    $("#profileform").css("display", "none");
    $("#themeform").css("display", "inline");
});

//Onload Function
function init() {
    $('#homebtn').click();
}

//Submit Profile
$('#profileform').submit(function (e) {
    rebakeCookies(["username", "name"], [$('#in_user').val(), $('#in_name').val()]);
});

//Submit Theme
$('#themeform').submit(function(e) {
    rebakeCookies(
        ["background", "navdark", "navlight", "fontcolor"], 
        [$('#in_background').val(), $('#in_dark').val(), $('#in_light').val(), $('#in_font').val()]
    );
});

function rebakeCookies(cnames, cvalues) { //Let's hope that cnames and cvalues are Arrays
    if(cnames.includes("username")) {
        setCookie("username", cvalues[cnames.indexOf("username")], 365);
    }
    if(cnames.includes("name")) {
        setCookie("name", cvalues[cnames.indexOf("name")], 365);
    }
    if(cnames.includes("background")) {
        setCookie("background", cvalues[cnames.indexOf("background")], 365);
    }
    if(cnames.includes("navdark")) {
        setCookie("navdark", cvalues[cnames.indexOf("navdark")], 365);
    }
    if(cnames.includes("navlight")) {
        setCookie("navlight", cvalues[cnames.indexOf("navlight")], 365);
    }
    if(cnames.includes("fontcolor")) {
        setCookie("fontcolor", cvalues[cnames.indexOf("fontcolor")], 365);
    }

    writeSave(getCookie("username"), getCookie("name"), getCookie("background"), 
    getCookie("navdark"), getCookie("navlight"), getCookie("fontcolor"));
}

function setCookie(cname, cvalue, exdays) {
    var d = new Date();
    d.setTime(d.getTime() + (exdays*24*60*60*1000));
    var expires = "expires="+ d.toUTCString();
    document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
}

function getCookie(cname) {
    var name = cname + "=";
    var decodedCookie = decodeURIComponent(document.cookie);
    var ca = decodedCookie.split(';');
    for(var i = 0; i <ca.length; i++) {
      var c = ca[i];
      while (c.charAt(0) == ' ') {
        c = c.substring(1);
      }
      if (c.indexOf(name) == 0) {
        return c.substring(name.length, c.length);
      }
    }
    return "";
}

function deleteCookie(cname) {
    document.cookie = cname + "=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
}

function clearBoxes() {
    var inputs = document.getElementsByTagName("input");
    for (let item of inputs) {
        if(item.value != "Send") {
            item.value = "";
        }
    }
}

function checkCookies() {
    var username = getCookie("username");
    if (username == "") {
        //Default Values
        setCookie("username", "Anonymous", 365);
        setCookie("name", "Unknown", 365);
        setCookie("background", "20, 20, 160", 365);
        setCookie("navdark", "#5a5a5a", 365);
        setCookie("navlight", "#787878", 365);
        setCookie("fontcolor", "#ffffff", 365);
    }
}

function clearCookies() {
    deleteCookie("username");
    deleteCookie("name");
    deleteCookie("background");
    deleteCookie("navdark");
    deleteCookie("navlight");
    deleteCookie("fontcolor");
}

function printData() {
    console.log("Username: " + getCookie("username"));
    console.log("Name: " + getCookie("name"));
    console.log("Background: " + getCookie("background"));
    console.log("Dark Nav: " + getCookie("navdark"));
    console.log("Light Nav: " + getCookie("navlight"));
    console.log("Font Color: " + getCookie("fontcolor"));
}

/*
    Create Profiles and allow switching between them.
*/

function writeSave(uname, name, bg, dn, ln, fc) {
    socket.emit('write', [uname, name, bg, dn, ln, fc]);
}

function downloadProfile() {
    let tdata = JSON.stringify(user_data);
    let bl = new Blob([tdata], {
        type: "text/html"
    });
    let a = document.createElement("a");
    a.href = URL.createObjectURL(bl);
    a.download = "data.json";
    a.hidden = true;
    document.getElementsByTagName("body")[0].append(a);
    a.innerHTML = "someinnerhtml";
    a.click();
}