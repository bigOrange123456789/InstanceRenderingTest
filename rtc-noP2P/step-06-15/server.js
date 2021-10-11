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
    for(i in socketAll){
        socketAll[i].emit('addUser',socket.id)//通知旧用户来来了新用户
        socket.emit('addUser',i)//通知新用户已有的旧用户
    }
    socketAll[socket.id]=socket
    socket.emit('id',socket.id)
    socket.on('message', data=> {//用于收发SDP和candidate
        if(socketAll[data.targetId0])socketAll[data.targetId0].emit('message', data)
        else console.log("没有发现协商对象")
    })
    socket.on('connect0',data=>{
        if(socketAll[data.answerId])socketAll[data.answerId].emit('connect0',data.offerId)
        else console.log('没有发现要连接的对象')
    })
    socket.once('disconnect', ()=> {
        delete socketAll[socket.id]
        console.log(socket.id+' is disconnect')
    })
})
