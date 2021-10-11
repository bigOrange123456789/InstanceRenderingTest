var nodeStatic = require('node-static')
var http = require('http')
var socketIO = require('socket.io')

var fileServer = new (nodeStatic.Server)()
var app = http.createServer(function (req, res) {
    fileServer.serve(req, res)
}).listen(8080)

var io = socketIO.listen(app);
var socketAll= {}
io.sockets.on('connection', function (socket) {
    console.log('add a client')
    socketAll[socket.id]=socket
    socket.emit('id',socket.id)
    socket.on('message', function (message) {//用于收发SDP和candidate
        socket.broadcast.emit('message', message)//接收到消息后向所有对象广播
    })
    socket.on('connect0',function (data){
        console.log('connect0',data)
        for(var i in socketAll)console.log(i)
        socketAll[data.offerId].emit('ready')
        socketAll[data.answerId].emit('ready')
    })
})
