var nodeStatic = require('node-static')
var http = require('http')

var fileServer = new (nodeStatic.Server)()
var app = http.createServer(function (req, res) {
    fileServer.serve(req, res)
}).listen(8080)

var socketIO = require('socket.io')
//var io = socketIO.listen(app)
var io = socketIO.listen(app, { cors: true })
var socketAll= {}
var id_list=[]
io.sockets.on('connection', function (socket) {
    if(id_list<0){
        for(i in socketAll){
            //socketAll[i].emit('addUser',socket.id)//通知旧用户来来了新用户
            socket.emit('addUser',i)//通知新用户已有的旧用户
        }
    }else{
        var branch=2
        function makeConn(index0) {//如果为空就前移
            for(;
                !socketAll[id_list[index0]]&&index0>=0;
                index0--) {}
            if(index0>=0){
                socket.emit('addUser',id_list[index0])//通知新用户向它的父节点建立连接
            }
        }
        var parent_i=Math.floor((id_list.length-1)/branch);//id_list.length是当前的序号
        makeConn(parent_i)
        var brother_i=id_list.length-1
        makeConn(brother_i)
    }

    socketAll[socket.id]=socket
    id_list.push(socket.id)

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
        socketAll[socket.id].close=true
        delete socketAll[socket.id]
        console.log(socket.id+' is disconnect')
    })
})
