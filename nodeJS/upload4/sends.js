var request = require('request');
var fs = require('fs');

var path="./path/"
fs.readdirSync(path).forEach(function (name) {
    send(path+name);
});

function send(url){
    var formData = {
        file: fs.createReadStream(url),
        test:123
    };
    formData.file.test=111;
    console.log(formData.file)
    request.post({url:'http://localhost:3000/upload?newIP=202.120.167.152', formData: formData,test:123}, function optionalCallback(err, httpResponse, body) {
        if (err) {
            return console.error('upload failed:', err);
        }
        console.log('Upload successful!  Server responded with:', body);
    });
}
