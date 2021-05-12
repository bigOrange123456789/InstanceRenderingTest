var http = require('http');
var math = require('math');
var serverList = [];
serverList[0] = {
    "query": "47.102.121.80",
    "status": "success",
    "country": "China",
    "countryCode": "CN",
    "region": "ZJ",
    "regionName": "Zhejiang",
    "city": "Hangzhou",
    "zip": "",
    "lat": 30.2813,
    "lon": 120.12,
    "timezone": "Asia/Shanghai",
    "isp": "Addresses CNNIC",
    "org": "Aliyun Computing Co., LTD",
    "as": "AS37963 Hangzhou Alibaba Advertising Co.,Ltd."
};

var myServer = http.createServer(function (request, response) {
    response.setHeader("Access-Control-Allow-Origin", "*");
    let clientIp = getClientIp(request);
    console.log(clientIp);
    http.get(`http://ip-api.com/json/${clientIp}`, function (json) {
        response.writeHead(200, { 'Content-Type': 'text/javascript' });
        response.write(returnServerIP(json));
        response.end();
    });
});

myServer.listen(3030, '0.0.0.0');
console.log('监听3030');

//获取客户端ip地址
function getClientIp(req) {
    let ip = req.headers['x-forwarded-for'] ||
        req.ip ||
        req.connection.remoteAddress ||
        req.socket.remoteAddress ||
        req.connection.socket.remoteAddress || '';
    if (ip.split(',').length > 0) {
        ip = ip.split(',')[0]
    }
    ip = ip.substr(ip.lastIndexOf(':') + 1, ip.length);
    console.log("ip:" + ip);
    return ip;
};

function returnServerIP(json) {
    if (serverList.length <= 1) {
        return serverList[0].query;
    }
    let key = 0, temp = 999;
    for (let i = 0; i < serverList.length; i++) {
        let val = math.sqrt(math.pow(json.lat - serverList[i].lat, 2) + math.pow(json.lon - serverList[i].lon, 2));
        if (val < temp) {
            temp = val;
            key = i;
        }
    }
    return serverList[key].query;
}