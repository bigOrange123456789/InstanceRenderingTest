const ioServer = require('socket.io');
const RTCMultiConnectionServer = require('rtcmulticonnection-server');
const http = require('http');

var httpApp = http.createServer(function (request, response) {
    response.end();
});

ioServer(httpApp).on('connection', function (socket) {
    RTCMultiConnectionServer.addSocket(socket);
});

httpApp.listen(9092, '0.0.0.0', function () {
    console.log("listening to client");
});
