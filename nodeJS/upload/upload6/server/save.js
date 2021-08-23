var fs = require('fs');
var ip=require('ip').address();
readJson("../config.json",json=>{
    var name=json["localhost"]
    var url='http://localhost:8888/save'
    send(url,name,ip)
})
function readJson(url,callback){
    fs.readFile(url, 'utf8' , function (err , data) {
        var json=JSON.parse(data)
        callback(json);
    });
}
function send(url,name,ip) {
    var data={name:name,ip:ip}
    var req=require('request').post({
        url:url,
        formData:data
    }, (er,res,body)=>console.log(body));
    req.on('error:',e=>console.log(e));
}

//req.end();
