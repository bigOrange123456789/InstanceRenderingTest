var nodeStatic = require('node-static')
var http = require('http')
var socketIO = require('socket.io')

var fileServer = new (nodeStatic.Server)()
var app = http.createServer(function (req, res) {
    fileServer.serve(req, res)
}).listen(8080)

var io = socketIO.listen(app);
var socketAll=[]
io.sockets.on('connection', function (socket) {
    socketAll.push(socket)

    socket.on('message', function (message) {//用于收发SDP和candidate
        socket.broadcast.emit('message', message)//接收到消息后向所有对象广播
    })
    socket.on('create or join', function (room) {
        var clientsInRoom = io.sockets.adapter.rooms[room]
        var numClients = clientsInRoom ? Object.keys(clientsInRoom.sockets).length : 0
        socket.join(room)
        console.log('id:',socket.id)
        if (numClients > 0) {
            for(var i=0;i<socketAll.length;i++)
                socketAll[i].emit('ready')
        }
    })
})
