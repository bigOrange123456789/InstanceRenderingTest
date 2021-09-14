var result=[]
require('http').createServer(function (request, response) {
    response.setHeader("Access-Control-Allow-Origin", "*");
    request.on('data', function (data) {//接受请求
        console.log(JSON.parse(data));
        result.push(JSON.parse(data))
        if(result.length<200)setTimeout(()=>{
            myOpen()
        },5000)
        else {
            saveJson("result.json",result)
            console.log("finish")
        }
    });
    request.on('end', function () {//返回数据
        response.write("success!");//发送字符串
        response.end();
    });
}).listen(8080, '0.0.0.0', function () {
    console.log("listening to client");
    myOpen()
    setTimeout(()=>{
        myOpen()
    },5000)
});
function saveJson(name,json0) {
    require("fs").writeFile(name, JSON.stringify(json0 , null, "\t") , function(){});
}
function myOpen(){
    var open = require("open");
    open("http://localhost:9001/demos2/index.html", "chrome");
}

