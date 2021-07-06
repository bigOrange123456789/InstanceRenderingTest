//"100.68.44.135"  0
//"100.68.177.45"  1台式机
//"100.68.8.126"   2
var ip="100.68.177.45"
var path="./path/"

var request = require('request');
var fs = require('fs');
fs.readdirSync(path).forEach(function (name) {
    send(path+name);
});

function send(file_url){
    var formData = {
        file: fs.createReadStream(file_url)
    };
    var url='http://202.120.167.152:3000/upload?newIP='+ip;
    request.post({url:url, formData: formData}, function optionalCallback(err, httpResponse, body) {
        if (err) {
            return console.error('upload failed:', err);
        }
        console.log('Upload successful! '+url);
    });
}
