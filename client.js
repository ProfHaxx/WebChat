var socket = io.connect();
socket.on('connect', function (data) {
    console.log(data);
    socket.emit('join', 'Connection to Client established!');
});

socket.on('broad', function (data) {
    $('#future').append(data + "<br/>");
});

$('form').submit(function (e) {
    var username = getCookie("username");
    e.preventDefault();
    var message = $('#chat_input').val();
    socket.emit('messages', "[" + username + "]: " + message);
});

function navigate(loc) {
    switch(loc) {
        case undefined: //Home
            document.getElementById("header").innerHTML = "Chat";
            document.getElementById("future").style.display = "block";
            document.getElementById("form").style.display = "inline";
            document.getElementById("select_container").style.display = "none";
            break;
        case 1: //Profile
            document.getElementById("header").innerHTML = "Profile";
            document.getElementById("future").style.display = "none";
            document.getElementById("form").style.display = "none";
            document.getElementById("select_container").style.display = "block";
            document.getElementById("box_3").style.display = "none";
            document.getElementById("box_4").style.display = "none";
            document.getElementById("desc_3").style.display = "none";
            document.getElementById("desc_4").style.display = "none";

            document.getElementById("box_1").setAttribute("placeholder", "Username");
            document.getElementById("box_2").setAttribute("placeholder", "Displayname");
            break;
        case 2: //Theme
            document.getElementById("header").innerHTML = "Theme";
            document.getElementById("future").style.display = "none";
            document.getElementById("form").style.display = "none";
            document.getElementById("select_container").style.display = "block";
            document.getElementById("box_3").style.display = "block";
            document.getElementById("box_4").style.display = "block";
            document.getElementById("desc_3").style.display = "block";
            document.getElementById("desc_4").style.display = "block";

            document.getElementById("apply").setAttribute("onclick", "selectTheme()");

            document.getElementById("box_1").setAttribute("placeholder", "Background (e.g. 100, 100, 100)");
            document.getElementById("box_2").setAttribute("placeholder", "Navigation Dark (e.g. #abcdef)");
            document.getElementById("box_3").setAttribute("placeholder", "Navigation Light (e.g. #fedcba)");
            document.getElementById("box_4").setAttribute("placeholder", "Font Color (e.g. #ffffff)");
            break;
        case 3: //Save or Load
            document.getElementById("header").innerHTML = "Save and Load";
            document.getElementById("future").style.display = "none";
            document.getElementById("form").style.display = "none";
            document.getElementById("select_container").style.display = "block";
            document.getElementById("box_3").style.display = "block";
            document.getElementById("box_4").style.display = "block";
            document.getElementById("desc_3").style.display = "block";
            document.getElementById("desc_4").style.display = "block";
    }
}

function selectTheme(a1, a2, a3, a4) {
    var font;
    var bg;
    var nav_D;
    var nav_L;
    if(a1 != undefined && a2 != undefined && a3 != undefined && a4 != undefined) {
        bg = a1;
        nav_D = a2;
        nav_L = a3;
        font = a4;
    } else {
        bg = document.getElementById("box_1").value;
        nav_D = document.getElementById("box_2").value;
        nav_L = document.getElementById("box_3").value;
        font = document.getElementById("box_4").value;
    }

    var body = document.getElementById("body").style;
    var dark = document.getElementById("dark_elem").style;

    if(bg != "") {
        body.backgroundImage = "linear-gradient(to right, rgba(" + bg + ", 0), rgba(" + bg + ", 1))";
        setCookie("background", bg, 365);
    }

    if(font != "") {
        body.color = font;
        setCookie("fontcolor", font, 365);
    }

    if(nav_D != "") {
        dark.background = nav_D;
        setCookie("navdark", nav_D, 365);
    }

    if (nav_L != "" && nav_D != "") {
        var css = "#lightelem { background-color:" + nav_D + " } #lightelem:hover{ background-color: " + nav_L + " }";
        var style = document.createElement('style');
        if (style.styleSheet) {
            style.styleSheet.cssText = css;
        } else {
            style.appendChild(document.createTextNode(css));
        }
        setCookie("navlight", nav_L, 365);
    }
}

function setPrefs() {
    setCookie("name", document.getElementById("box_1"), 365);
    setCookie("username", document.getElementById("box_2"), 365);
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

function checkCookies() {
    var username = getCookie("username");
    if (username != "") {
        $('form').submit(function (e) {
            e.preventDefault();
            socket.emit('messages', username + " " + "joined the chat!");
        });
    } else {
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
