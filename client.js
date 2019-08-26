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

//On User Amount Change (User Online Display)
socket.on('useramountchange', function (number) {
    if(mobile) {
        $('.active').html("Web Chat (" + number + ")");
    } else {
        $('#homebtn').html("Home (" + number + ")");
    }
});

function scrolldown() {
    document.getElementById("future").scrollTop += 10000;
}

//On Message
socket.emit('messages', "Somebody joined the chat!");

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
    $('#signup').css("display", "none");
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
    socket.emit('storage-request');
    if (user_data.length < 5) {
        $("#header").html("Sign Up");
        $("#future").css("display", "none");
        $("#chatform").css("display", "none");
        $("#profileform").css("display", "none");
        $("#themeform").css("display", "none");
        $("#signup").css("display", "block");
        $(".signupcfm").attr("value", "OK");
    } else {
        $('#homebtn').click();
    }
}

//Submit Profile
$('#profileform').submit(function (e) {
    socket.emit('read', $('#in_name').val());
});

//Submit Theme
$('#themeform').submit(function(e) {
    
});

//Submit Signup
$('#signup').submit(function(e) {
    writeSave(
        $('#first_username').val(),
        $('#first_name').val(),
        [$('#first_color').val(), $('#second_color').val(), $('#third_color').val()],
        1,
        []
    );
    updateFrontEnd();
    $('#homebtn').click();
});

function clearBoxes() {
    var inputs = document.getElementsByTagName("input");
    for (let item of inputs) {
        if(item.value != "OK" && item.value != "Apply" && item.value != "Send") {
            item.value = "";
        }
    }
}


function updateFrontEnd() {
    if(!mobile) {
        $("body").css("background-image", "url(./img/bg/Back_" + user_data[3] + ".jpg)");
    }

}
/*
    Create Profiles and allow switching between them.
*/

socket.on('debug-response', function(data) {
    console.log(data);
});

socket.on('storage-response', function(data) {
    user_data = data;
});

function writeSave(username, name, colorset, backgroundID, settings) {
    socket.emit('write', username, name, colorset, backgroundID, settings);
    socket.emit('storage-refresh', [username, name, colorset, backgroundID, settings]);
    socket.emit('storage-request');
}