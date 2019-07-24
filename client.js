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