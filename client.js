var socket = io.connect();
socket.on('connect', function (data) {
    socket.emit('join', 'Connection to Client established!');
});

socket.on('broad', function (data) {
    $('#future').append(data + "<br/>");
});

$('form').submit(function (e) {
    var username = getCookie("username");
    e.preventDefault();
    var message = $("#chat_input").val();
    if(!message.startsWith("/") && !(message == "")) {
        socket.emit('messages', "[" + username + "]: " + message);
    } else {
        //Commands
        if(message == "/clear") {
            $("#future").html("");
        }
    }
    clearBoxes();
});

socket.emit('messages', getCookie("username") + " " + "joined the chat!");

function navigate(loc) {
    var headerText = $("#header").html();
    switch(loc) {
        case undefined: //Home
            headerText = "Chat";
            document.getElementById("future").style.display = "block";
            document.getElementById("form").style.display = "inline";
            document.getElementById("select_container").style.display = "none";
            break;
        case 1: //Profile
            headerText = "Profile";
            document.getElementById("future").style.display = "none";
            document.getElementById("form").style.display = "none";
            document.getElementById("select_container").style.display = "block";
            document.getElementById("box_3").style.display = "none";
            document.getElementById("box_4").style.display = "none";
            document.getElementById("desc_3").style.display = "none";
            document.getElementById("desc_4").style.display = "none";

            document.getElementById("apply").setAttribute("onclick", "setPrefs()");

            document.getElementById("box_1").setAttribute("placeholder", "Username");
            document.getElementById("box_2").setAttribute("placeholder", "Displayname");
            break;
        case 2: //Theme
            headerText = "Theme";
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
    }
}

function selectTheme() {
    var font = document.getElementById("box_4").value;
    var bg = document.getElementById("box_1").value;
    var nav_D = document.getElementById("box_2").value;
    var nav_L = document.getElementById("box_3").value;

    var body = document.getElementById("body").style;
    var dark = $(".dark_elem");

    if(bg != "") {
        body.backgroundImage = "linear-gradient(to right, rgba(" + bg + ", 0), rgba(" + bg + ", 1))";
        setCookie("background", bg, 365);
    } else {
        bg = getCookie("background");
        body.backgroundImage = "linear-gradient(to right, rgba(" + bg + ", 0), rgba(" + bg + ", 1))";
    }

    if(font != "") {
        body.color = font;
        setCookie("fontcolor", font, 365);
    } else {
        font = getCookie("fontcolor");
        body.color = font;
    }

    if(nav_D != "") {
        dark.background = nav_D;
        setCookie("navdark", nav_D, 365);
    } else {
        nav_D = getCookie("navdark");
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
        setCookie("navlight", nav_L, 365);
    } else {
        if(nav_L == "") {
            nav_L = getCookie("navlight");
        }

        if(nav_D == "") {
            nav_D = getCookie("navdark");
        }
        var css = "#lightelem { background-color:" + nav_D + " } #lightelem:hover{ background-color: " + nav_L + " }";
        var style = document.createElement('style');
        if (style.styleSheet) {
            style.styleSheet.cssText = css;
        } else {
            style.appendChild(document.createTextNode(css));
        }
        setCookie("navlight", nav_L, 365);
    }

    clearBoxes();
    navigate();
}

function setPrefs() {
    setCookie("name", document.getElementById("box_1").value, 365);
    setCookie("username", document.getElementById("box_2").value, 365);
    clearBoxes();
    navigate();
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