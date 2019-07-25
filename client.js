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
    socket.emit('messages', message);
});

function navigate(loc) {
    switch(loc) {
        case undefined:
            document.getElementById("header").innerHTML = "Chat";
            document.getElementById("future").style.display = "inline";
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
    document.getElementById("body").style.color = document.getElementById("bg_box").value;
    document.getElementById("body").style.color = document.getElementById("font_box").value;
}