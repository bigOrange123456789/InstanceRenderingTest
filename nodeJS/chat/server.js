/**
 * @author clearlove
 * @aim 测试连接一个socket.io通信 广播
 */
//引入fs
var fs = require('fs')
//引入http 
var http = require('http')
var date = new Date()
/**
 * @FormDate 格式化时间
 * @param {*} date 当前时间
 */
function FormDate(date) {
  return `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()} ${date.getHours()}:${date.getMinutes()}`
}
/**
 * 搭建一个服务器
 */
var server = http.createServer(function (res, res) {
  if (res.url !== '/favicon.ico') {
    res.writeHead(200, { "Content-type": "text/html" })
    const myreadstream = fs.createReadStream(__dirname + '/views/http_demo.html', 'utf-8')
    myreadstream.pipe(res)
  }
})
//引入socket.io 这里是两步，第一步是io = require('socket.io') 第二步是一个新的变量.server 合成一步就是下面的代码
var io = require('socket.io')(server);
io.on("connection", function (socket) {
  //这里获取到对方的ip地址，可以展示，也可以不展示，也可以进行ip的过滤
  var clientIp = socket.request.connection.remoteAddress
  console.info("一个socket连接成功了")
  socket.on("link_to_server", function (msg, nick) {
    //这里使用io发送 
    io.emit('link_to_client', `${nick} : ${msg} ${FormDate(date)}`)
  })
})
server.listen(5000, '0.0.0.0');
console.info("server is running...")