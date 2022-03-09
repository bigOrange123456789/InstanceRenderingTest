//localhost:8080
var http = require('http');
http.createServer(function (request, response) {
    response.setHeader("Access-Control-Allow-Origin", "*");
    request.on('data', function (data) {//接受请求
        console.log(JSON.parse(data));
    });
    request.on('end', function () {//返回数据
        response.write("test123");
        response.end();
    });
}).listen(8080, '0.0.0.0', function () {
    console.log("listening to client");
});
