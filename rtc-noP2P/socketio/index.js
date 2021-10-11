var nodeStatic = require('node-static');
var http = require('http');

var fileServer = new(nodeStatic.Server)();
var app = http.createServer(function(req, res) {
  fileServer.serve(req, res);
}).listen(8080);

var io = require('socket.io').listen(app);
io.sockets.on('connection', function(socket) {
  socket.emit('receive', "origin:server")
  socket.on('listen', data=> console.log(data))
  socket.on('send', message=> socket.broadcast.emit('receive', message))
  socket.on('join', roomId=> socket.join(roomId))
  socket.on('roomSend', data=> io.sockets.in(data.room).emit('receive', data.message))
});

