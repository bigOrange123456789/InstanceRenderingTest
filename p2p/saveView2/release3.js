var httpServer = require('http');
const RTCMultiConnectionServer = require('rtcmulticonnection-server');
const jsonPath = {
    config: 'config.json',
    logs: 'logs.json'
}
const BASH_COLORS_HELPER = RTCMultiConnectionServer.BASH_COLORS_HELPER;
const getValuesFromConfigJson = RTCMultiConnectionServer.getValuesFromConfigJson;
const getBashParameters = RTCMultiConnectionServer.getBashParameters;
var config = getValuesFromConfigJson(jsonPath);
config = getBashParameters(config, BASH_COLORS_HELPER);
var PORT = config.port;

var httpApp = httpServer.createServer((req,res)=>console.log(req,res));
RTCMultiConnectionServer.beforeHttpListen(httpApp, config);
httpApp = httpApp.listen(process.env.PORT || PORT, process.env.IP || "0.0.0.0", function() {
    RTCMultiConnectionServer.afterHttpListen(httpApp, config);
});
// --------------------------
// socket.io codes goes below
const ioServer = require('socket.io');
ioServer(httpApp, {
    cors: {
        origin: ['http://localhost:8080','http://localhost:63342','http://localhost:8081'],
        credentials: true
    }
}).on('connection', function(socket) {
    RTCMultiConnectionServer.addSocket(socket, config);
});
