var socket = io.connect();

var mobile = !(document.documentElement.clientWidth > document.documentElement.clientHeight);

if(mobile) {
    $('.footer').html("v1.6.7 [Mobile]");
} else {
    $('.footer').html("v1.6.7 [Desktop]");
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
        $(".icon").css("bottom", "0%");
    } else {
        $("#myLinks").css("display", "block");
        $(".icon").css("bottom", "55%");
    }
    menuToggle = !menuToggle;
}

//User Data
var user_data = [];

//Receive User Data from Server
socket.on('senddata', function(username, name, colorset, backgroundID, settings) {
    user_data = [username, name, colorset, backgroundID, settings];
});

//Receive Command Data from Server
socket.on('cmd', function(command) {
    if(command == "clear") {
        $('#future').html("");
    }
});

//On Connect
socket.on('connect', function (data) {
    socket.emit('join', 'Connection to Client established!');
});

//On Broadcast
socket.on('broad', function (data, scroll) {
    $('#future').append(data + "<br/>");
    if(scroll) {
        scrolldown();
    }
});

function scrolldown() {
    document.getElementById("future").scrollTop += 10000;
}

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
    $(".profilecfm").attr("value", "OK");
});

//On Theme Click
$('#themebtn').on('click', function(data) {
    $("#header").html("Theme");
    $("#future").css("display", "none");
    $("#chatform").css("display", "none");
    $("#profileform").css("display", "none");
    $("#themeform").css("display", "inline");
    $(".themecfm").attr("value", "OK");
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

function clearBoxes() {
    var inputs = document.getElementsByTagName("input");
    for (let item of inputs) {
        if(item.value != "OK" && item.value != "Apply" && item.value != "Send") {
            item.value = "";
        }
    }
}

/*
    Create Profiles and allow switching between them.
*/

function writeSave(username, name, colorset, backgroundID, settings) {
    socket.emit('write', username, name, colorset, backgroundID, settings);
}