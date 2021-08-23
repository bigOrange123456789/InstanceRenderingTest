var exec = require('child_process').exec;
var request = require('request');
var fs = require('fs');
var join = require('path').join;
var transferStation;
var url0;
fs.readFile("config.json", 'utf8' , function (err , data) {
    var json=JSON.parse(data)
    var ip=json["ip_list"][process.argv[2]];
    url0=process.argv[3];
    ping(ip,(direct)=>{
        if(direct){
            console.log("可以直接发送...")
            console.log(url0)
            if(fs.statSync(url0).isDirectory())find1(ip,url0)
            else send1(ip,url0)
        }else{
            console.log("正在准备转发...")
            transferStation=json["transferStation"];
            if(fs.statSync(url0).isDirectory())find2(ip,url0)
            else send2(ip,url0)
        }
    })
});
function ping(ip,cb){
    exec(
        'ping '+ip+' -n 1 -l 1',
        (error, stdout, stderr)=>cb(stdout.split("ms").length>0)//如果可以到达会输出通信时间
    )
}
function find1(ip,path0){
    let files = fs.readdirSync(path0);
    files.forEach(function (item) {
        let fPath = join(path0,item);
        let stat = fs.statSync(fPath);
        if(stat.isDirectory()) find1(ip,fPath);
        else if (stat.isFile()) send1(ip,fPath);
    });
}
function find2(ip,path0){
    let files = fs.readdirSync(path0);
    files.forEach(function (item) {
        let fPath = join(path0,item);
        let stat = fs.statSync(fPath);
        if(stat.isDirectory()) find2(ip,fPath);
        else if (stat.isFile()) send2(ip,fPath);
    });
}
function send1(ip,file_url){//直接发送文件
    var formData = {
        file: fs.createReadStream(file_url)
    };

    console.log("url0:",url0)
    //将绝对路径变成相对路径
    var arr=file_url.split(process.argv[4])
    file_url=arr[arr.length-1]
    //去除路径中的文件名
    arr=file_url.split("\\");
    var fileName=arr[arr.length-1]
    file_url=file_url.split(fileName)[0]
    console.log("file_url:"+file_url)

    var url='http://'+ip+':3000/upload?fpath='+encodeURIComponent(file_url);
    request.post({url:url, formData: formData}, function optionalCallback(err, httpResponse, body) {
        if (err) console.error('upload failed:', err);
        else console.log(url,httpResponse.url);
    });
}
function send2(ip,file_url){//间接发送文件
    var formData = {
        file: fs.createReadStream(file_url)
    };
    var arr=file_url.split(url0)
    if(arr.length>1)file_url=arr[1];
    var url='http://'+transferStation+':3000/upload?newIP='+ip+';fpath='+encodeURIComponent(file_url);
    request.post({url:url, formData: formData}, function optionalCallback(err, httpResponse, body) {
        if (err) console.error('upload failed:', err);
        else console.log(url,httpResponse.url);
    });
}
