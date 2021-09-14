require('http').http.createServer(function(request, response) {
    response.writeHead(200, { 'Content-Type': 'text/plain' });
    response.end('Hello World\n');// 发送响应数据 "Hello World"
}).listen(8888);

