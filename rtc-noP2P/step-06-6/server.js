var nodeStatic = require('node-static')
var http = require('http')
var socketIO = require('socket.io')

var fileServer = new (nodeStatic.Server)()
var app = http.createServer(function (req, res) {
    fileServer.serve(req, res)
}).listen(8080)

var io = socketIO.listen(app);
io.sockets.on('connection', function (socket) {
    socket.on('message', function (message) {//用于收发SDP和candidate
        socket.broadcast.emit('message', message)//接收到消息后向所有对象广播
    })
    socket.on('create or join', function (room) {
        var clientsInRoom = io.sockets.adapter.rooms[room]
        var numClients = clientsInRoom ? Object.keys(clientsInRoom.sockets).length : 0
        console.log('Room now has ' + numClients + ' client(s)')
        socket.join(room)
        if (numClients > 0) {
            io.sockets.in(room).emit('ready', room)//两个用户都创建peer对象
            socket.emit('joined', room, socket.id)//send
        }
    })
})
