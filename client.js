var socket = io.connect();

//User Data
var user_data = [];

//Check local storage
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

//On Home Click
$('#homebtn').on('click', function(data) {
    $("#header").html("Chat");
    $("#future").css("display", "block");
    $("#form").css("display", "inline");
    $('#profileform').css("display", "none");
    $('#themeform').css("display", "none");
});

//On Profile Click
$('#profilebtn').on('click', function(data) {
    $("#header").html("Profile");
    $("#future").css("display", "none");
    $("#form").css("display", "none");
    $("#profileform").css("display", "inline");
    $("#themeform").css("display", "none");
});

//On Theme Click
$('#themebtn').on('click', function(data) {
    $("#header").html("Theme");
    $("#future").css("display", "none");
    $("#form").css("display", "none");
    $("#profileform").css("display", "none");
    $("#themeform").css("display", "inline");
});

//Onload Function
function init() {
    $('#homebtn').click();
}

//Send Message
$('#profileform').submit(function (e) {
    var username = $('#in_user').val();
    var name = $('#in_name').val();
});

$('#themeform').submit(function(e) {

});

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

    selectTheme();
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