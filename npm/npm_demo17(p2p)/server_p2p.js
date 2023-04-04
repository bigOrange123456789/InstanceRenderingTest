var nodeStatic = require('node-static');
var http = require('http');

var fileServer = new(nodeStatic.Server)();
var app = http.createServer(function(req, res) {
  fileServer.serve(req, res);
}).listen(8011);

var io = require('socket.io').listen(app);
io.sockets.on('connection', function(socket) {
  socket.on('send', message=> socket.broadcast.emit('receive', message))
});

