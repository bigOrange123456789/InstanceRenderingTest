var json0={}
readJson("data.json",json=>{
    json0=json
    console.log(json)
    release()
    setInterval(function () {
        saveJson("data.json",json0)
    },60000)
})
function release() {
    const express = require('express')
    const app = express()
    var router1 = express.Router();
    router1.post(
        '/save', // 监听POST请求
        require('multer')({}).single('file'),// 储存接收到的文件
        function (req, res) {
            var ip=req.body.ip;
            var name=req.body.name;
            json0[name]=ip;
            res.json("successful!");// 接收文件成功后返回数据给前端
        });
    app.use(router1)
    var router2 = express.Router();
    router2.post(
        '/find', // 监听POST请求
        require('multer')({}).single('file'),// 储存接收到的文件
        function (req, res) {
            res.json(json0);// 接收文件成功后返回数据给前端
        });
    app.use(router2)
    app.listen(8888, ()=> console.log(''+require('ip').address()))
}
function readJson(url,callback){
    require('fs').readFile(url, 'utf8' , function (err , data) {
        var json=JSON.parse(data)
        callback(json);
    });
}
function saveJson(name,data) {
    require('fs').writeFile(name, JSON.stringify(data , null, "\t") , function(){});
}
