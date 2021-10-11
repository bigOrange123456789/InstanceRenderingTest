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
        console.log({
            'socket.id':socket.id,
            'target':data.targetId0
        })
        //for(var i=0;i<socketAll.length;i++)
        //socketAll[i].emit('message', message)
        //socket.broadcast.emit('message', data.message)//接收到消息后向所有对象广播
        //console.log("message.targetId0",message.targetId0)
        // if(message.targetId0&&socketAll[message.targetId0])
        socketAll[data.targetId0].emit('message', data.message)
    })
    socket.on('connect0',function (data){
        socketAll[data.offerId].emit('ready',data.answerId)
        socketAll[data.answerId].emit('ready',data.offerId)
    })
})
