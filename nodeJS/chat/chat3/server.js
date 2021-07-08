var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);

app.get('/', function(req, res){
  res.sendFile(__dirname + '/myindex.html');
});

io.on('connection',function(socket){
  console.log('用户连接上了')
  socket.on('chatMessage',function(msg){
    console.log('mess' + msg);
    io.emit('chatMessage',msg);
    console.log('fasong')
  });

})

http.listen(5000,function(){
  console.log("链接上了服务器5000")
})
