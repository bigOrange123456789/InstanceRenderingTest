var http = require('http');
var fs = require('fs');
var path = require('path');

var myServer = http.createServer(function (request, response) {
    let postData = "";
    response.setHeader("Access-Control-Allow-Origin", "*");
    request.on('data', function (data) {//接受数据
        postData += data;//转换为字符串格式
        //不清楚data的具体内容
    });
    // 在end事件触发后，通过querystring.parse将post解析为真正的POST请求格式，然后向客户端返回。
    request.on('end', function () {//返回数据
        var testResult = {
            "type": "requestdata",
            "scene": "cgm",
            "data": "2047351=IfcBuildingElementProxy/1793562=IfcSlab/2047397=IfcBuildingElementProxy/8071808=IfcBeam/8071911=IfcBeam/8041534=IfcColumn/8072285=IfcBeam/8072368=IfcBeam/8044329=IfcColumn/8039909=IfcColumn/5624981=IfcWallStandardCase/8116428=IfcSlab/1498226=IfcDoor/3039389=IfcFlowSegment/7740136=IfcWallStandardCase/8117015=IfcDoor/7695816=IfcSlab/5627049=IfcSlab/5608688=IfcWallStandardCase/57548=IfcWallStandardCase/3132599=IfcFlowFitting/6225094=IfcWallStandardCase/7325383=IfcWallStandardCase/7325318=IfcWallStandardCase/7325708=IfcWallStandardCase/7325578=IfcWallStandardCase/3268256=IfcFlowFitting/7325934=IfcWallStandardCase/7325860=IfcWallStandardCase/7326203=IfcWallStandardCase/"
        }
        let json = JSON.parse(postData);
        //数据包是一个json格式的
        //请求数据包由三部分构成：type、scene、data
        //data中记录了文件名、文件名之间由’/‘隔开
        if (json.type == 'requestdata') {
            let sceneName = json.scene;
            let visibleList = json.data;
            response.writeHead(200, { 'Content-Type': 'application/octet-stream' });
            ProcessData(sceneName, visibleList, response);//response对象用于存放返回的数据
        }


    });
});

myServer.listen(6969, '0.0.0.0', function () {
    console.log("listening to client");
});

/*
    pack the models and reponse with the packages
*/
function ProcessData(scene, list, response) {
    const Header_Length = 1000;
    let models = list.split('/');//用字符将文件名称分开
    let byteNeedToSend;//准备被发送的二进制数据
    let modelDataByte = Buffer.alloc(0);
    let modelLengthHeader = "";
    let modelLengthHeaderByte;

    //文件读取
    let filePath = path.resolve( __dirname, 'test.glb');//设置路径
    fs.readFile(filePath, function (err, buffer) {//读取文件//将模型数据读取到buffer中，buffer应该是字符串类型的数据
        //buffer应该是一个缓存区，似乎是一个Buffer类型的数据，是一个对象
        modelLengthHeader += buffer.length + "/";//用于数据包头部的字符串
        modelDataByte = Buffer.concat([modelDataByte, buffer]);//将两个缓存区合并为一个

        //pack the models
        byteNeedToSend = Buffer.alloc(Header_Length + modelDataByte.length);//生成一块新的缓存区
        //pack header
        modelLengthHeaderByte = Buffer.from(modelLengthHeader);

        modelLengthHeaderByte.copy(byteNeedToSend, 0, 0);
        //pack model data
        modelDataByte.copy(byteNeedToSend, Header_Length, 0);
        //send the pack
        response.write(byteNeedToSend);
        //console.log(byteNeedToSend);
        response.end();

    });

}