//"100.68.44.135"  0
//"100.68.177.45"  1台式机
//"100.68.8.126"   2
var ip="100.68.44.135"
var path="./path/"

var request = require('request');
var fs = require('fs');
var join = require('path').join;
find(path);
function find(path0){
    let files = fs.readdirSync(path0);
    files.forEach(function (item) {
        let fPath = join(path0,item);
        let stat = fs.statSync(fPath);
        if(stat.isDirectory()) find(fPath);
        else if (stat.isFile()) send(fPath);
    });
}

function send(file_url){
    var formData = {
        file: fs.createReadStream(file_url)
    };
    var arr=file_url.split('\\')
    var file_name=arr[arr.length-1];
    //console.log(file_name)
    file_url=file_url.split(file_name)[0];
    file_url=file_url.replace(/\\/g,"/");
    //var url='http://100.68.44.135:3000/upload?fpath='+encodeURIComponent(file_url);
    var url='http://202.120.167.152:3000/upload?newIP='+ip+';fpath='+encodeURIComponent(file_url);
    request.post({url:url, formData: formData}, function optionalCallback(err, httpResponse, body) {
        if (err) console.error('upload failed:', err);
        else console.log(url,httpResponse.url);
    });
}
