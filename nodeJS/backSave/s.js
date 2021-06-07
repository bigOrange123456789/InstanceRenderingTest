var conns = new Array();

var ws = require("websocket-server");
var server = ws.createServer();

server.addListener("connection", function(connection){
  console.log("Connection request on Websocket-Server");
  conns.push(connection);
  connection.addListener('message',function(msg){
        console.log(msg);
        for(var i=0; i<conns.length; i++){
            if(conns[i]!=connection){
                conns[i].send(msg);
            }
        }
    });
});
server.listen(3001);