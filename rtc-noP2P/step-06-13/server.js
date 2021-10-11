var nodeStatic = require('node-static')
var http = require('http')
var socketIO = require('socket.io')

var fileServer = new (nodeStatic.Server)()
var app = http.createServer(function (req, res) {
    fileServer.serve(req, res)
}).listen(8080)

var io = socketIO.listen(app)
var socketAll= {}
io.sockets.on('connection', function (socket) {
    socketAll[socket.id]=socket
    socket.emit('id',socket.id)
    socket.on('message', function (data) {//用于收发SDP和candidate
        socketAll[data.targetId0].emit('message', data)
    })
    socket.on('connect0',function (data){
        socketAll[data.answerId].emit('connect0',data.offerId)
    })
})
