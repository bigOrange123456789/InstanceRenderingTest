var nodeStatic = require('node-static');
var http = require('http');

var fileServer = new(nodeStatic.Server)();
var app = http.createServer(function(req, res) {
  fileServer.serve(req, res);
}).listen(8080);

var io = require('socket.io').listen(app);
io.sockets.on('connection', function(socket) {
  console.log(socket.id)
  //for(i in socket)console.log(i)
  socket.on('send', message=> socket.broadcast.emit('receive', message))
});

//on
//emit

//socket
//  id
//  join

//  on
//  emit
//  broadcast.emit

