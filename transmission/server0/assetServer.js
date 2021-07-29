var http = require('http');
var fs = require('fs');
var path = require('path');
var db = require('./mysql');

const modelPath = "../../../_DATA_/glbModels/";
const fileSuffix = ".glb";
var cgmFirstPacket;
allScene=[
    //'szt',
    'cgm',
    //'demo3'
]


var allFileNames= {};
var allFile={};
for(var i=0;i<allScene.length;i++){//读取第i个场景的所有文件名
    allFile[allScene[i]]={};
    allFileNames[allScene[i]]=[];
    fs.readdirSync(modelPath+allScene[i]).forEach(function (s) {
        allFileNames[allScene[i]].push(s)
    });
}



getFile(0,0);
function getFile(i,index_sceneName){
    var sceneName=allScene[index_sceneName];
    var name=allFileNames[sceneName][i];
    console.log(sceneName+':'+i+"/"+allFileNames[sceneName].length+":"+name)
    //文件读取
    let filePath = path.resolve( __dirname,modelPath,sceneName, name);
    fs.exists(filePath, (exists) => {
        if(exists){
            fs.readFile(filePath, function (err, buffer) {//读取文件//将模型数据读取到buffer中，buffer应该是字符串类型的数据
                //buffer应该是一个缓存区，似乎是一个Buffer类型的数据，是一个对象
                allFile[sceneName][name]=buffer;
                if(i+1<allFileNames[sceneName].length)getFile(i+1,index_sceneName);//加载下一个文件
                else{
                    if(index_sceneName+1<allScene.length){//加载下一个场景
                        //allFile[allScene[index_sceneName+1]]={};
                        getFile(0,index_sceneName+1);//加载下一个场景的第一个文件
                    }else {
                        console.log("正在生成第一数据包...")
                        getFirstList();
                        console.log("加载完成，准备就绪！")//加载完成
                    }
                }
            });
        }else{
            console.log(filePath+"文件不存在！");
        }
    });
}

//读取初始文件列表
function getFirstList(){
    var url="../client2/json/cgmFirstList.json";
    fs.exists(url, (exists) => {
        if(exists){
            fs.readFile(url,'utf8',  function (err, buffer) {//读取文件//将模型数据读取到buffer中，buffer应该是字符串类型的数据
                //buffer应该是一个缓存区，似乎是一个Buffer类型的数据，是一个对象
                //allFile[sceneName][name]=buffer;
                //console.log(buffer)
                var arr=JSON.parse(buffer);
                cgmFirstPacket=getPacket("cgm",arr);
            });
        }else{
            console.log(url+"文件不存在！");
        }
    });
}

var myServer = http.createServer(function (request, response) {
    let postData = "";
    response.setHeader("Access-Control-Allow-Origin", "*");
    request.on('data', function (data) {//接受数据
        postData += data;//转换为字符串格式
        //不清楚data的具体内容
    });
    // 在end事件触发后，通过querystring.parse将post解析为真正的POST请求格式，然后向客户端返回。
    request.on('end', function () {//返回数据
        let json = JSON.parse(postData);
        //数据包是一个json格式的
        //请求数据包由三部分构成：type、scene、data
        //data中记录了文件名、文件名之间由’/‘隔开
        if (json.type === 'requestdata') {
            let sceneName = json.scene;
            let visibleList = json.data;
            response.writeHead(200, { 'Content-Type': 'application/octet-stream' });
            ProcessData(sceneName, visibleList, response);//response对象用于存放返回的数据
        } else {
            let addSql = 'INSERT INTO testdata(userID,sceneName,initialTime,averageDelayTime,responseTimes,rpstFromServer,rpstFromPeer,haveP2P) VALUES(?,?,?,?,?,?,?,?)';
            let { userID, sceneName, initialTime, averageDelayTime, responseTimes, rpstFromServer, rpstFromPeer,haveP2P } = json;
            let addSqlParams = [userID, sceneName, initialTime, averageDelayTime, responseTimes, rpstFromServer, rpstFromPeer,haveP2P];
            db.query(addSql, addSqlParams);
        }
    });
});

myServer.listen(9091, '0.0.0.0', function () {
    console.log("listening to client");
});

function ProcessData(scene, list, response) {//文件数据的读取似乎不是异步进行的
    var packet;
    if(list==="first"){
        console.log("first!")
        packet=cgmFirstPacket;
        response.write(packet);
        response.write(packet);
        response.end();
    }else{
        let models = list.split('/');//用字符将文件名称分开
        models=models.splice(0,models.length-1)
        packet=getPacket(scene,models)
        console.log("资源列表长度："+models.length);
        response.write(packet);
        response.end();
    }
}

function getPacket(scene,models) {
    const Header_Length = 10*models.length;
    let byteNeedToSend;//准备被发送的二进制数据
    let modelDataByte = Buffer.alloc(0);//分配一个大小为 size 字节的新 Buffer。 如果 fill 为 undefined，则用零填充 Buffer。
    let modelLengthHeader = "";
    let modelLengthHeaderBytePre;
    let modelLengthHeaderByte;

    for (let i = 0; i < models.length; i++) {
        //文件读取
        var fileName=models[i] + fileSuffix;//文件名称

        var buffer=allFile[scene][fileName];//二进制数据
        if(buffer){
            modelLengthHeader += buffer.length + "/";
            modelDataByte = Buffer.concat([modelDataByte, buffer]);
        }else{
            console.log("请求的文件不存在！");
        }
    }

    //pack the models//设置文件包文件包
    byteNeedToSend = Buffer.alloc(10+Header_Length + modelDataByte.length);//生成缓冲区
    //pack header
    modelLengthHeaderBytePre=Buffer.from(""+Header_Length)
    modelLengthHeaderByte = Buffer.from(modelLengthHeader)

    if (modelLengthHeaderByte.length < Header_Length) {
        modelLengthHeaderBytePre.copy(byteNeedToSend, 0, 0)
        modelLengthHeaderByte.copy(byteNeedToSend, 10, 0);// 拷贝 `buf1` 中第 16 至 19 字节偏移量的数据到 `buf2` 第 8 字节偏移量开始。
        modelDataByte.copy(byteNeedToSend, 10+Header_Length, 0);
    } else {
        console.error("headerBytes is too short!!!");
    }

    return byteNeedToSend;//Buffer数据包
}
