var username = "Anonymous";

var socket = io.connect();
socket.on('connect', function (data) {
    console.log(data);
    socket.emit('join', 'Connection to Client established!');
});

socket.on('broad', function (data) {
    $('#future').append(data + "<br/>");
});

$('form').submit(function (e) {
    e.preventDefault();
    var message = $('#chat_input').val();
    socket.emit('messages', "[" + username + "]: " + message);
});

function navigate(loc) {
    switch(loc) {
        case undefined:
            document.getElementById("header").innerHTML = "Chat";
            document.getElementById("future").style.display = "block";
            document.getElementById("form").style.display = "inline";
            document.getElementById("theme_select").style.display = "none";
            break;
        case 1:
            document.getElementById("header").innerHTML = "Profile";
            document.getElementById("future").style.display = "none";
            document.getElementById("form").style.display = "none";
            document.getElementById("theme_select").style.display = "none";
            break;
        case 2:
            document.getElementById("header").innerHTML = "Theme";
            document.getElementById("future").style.display = "none";
            document.getElementById("form").style.display = "none";
            document.getElementById("theme_select").style.display = "inline";
            break;
    }
}

function selectTheme() {
    var body = document.getElementById("body").style;
    var dark = document.getElementById("dark_elem").style;
    var light = document.getElementById("light_elem").style;

    var font = document.getElementById("font_box").value;
    var bg = document.getElementById("bg_box").value;
    var nav_D = document.getElementById("navd_box").value;
    var nav_L = document.getElementById("navl_box").value;

    if(bg != "") {
        body.backgroundImage = "linear-gradient(to right, rgba(" + bg + "), rgba(" + bg + "))";
    }

    if(font != "") {
        body.color = font;
    }

    if(nav_D != "") {
        dark.background = nav_D;
    }

    if (nav_L != "" && nav_D != "") {
        var css = "#lightelem { background-color:" + nav_D + " } #lightelem:hover{ background-color: " + nav_L + " }";
        var style = document.createElement('style');

        if (style.styleSheet) {
            style.styleSheet.cssText = css;
        } else {
            style.appendChild(document.createTextNode(css));
        }
    }
}