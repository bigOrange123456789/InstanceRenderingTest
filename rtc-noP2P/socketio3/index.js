var nodeStatic = require('node-static');
var http = require('http');

var fileServer = new(nodeStatic.Server)();
var app = http.createServer(function(req, res) {
  fileServer.serve(req, res);
}).listen(8080);

var arr=[]
var io = require('socket.io').listen(app);
io.sockets.on('connection', function(socket) {
  arr.push(socket)
  socket.on('send', message=>{
    for(var i=0;i<arr.length;i++){
      arr[i].emit('receive',i)
    }
    //socket.broadcast.emit('receive', message)
  } )
});

