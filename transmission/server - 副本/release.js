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
