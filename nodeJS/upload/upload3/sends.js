var request = require('request');
var fs = require('fs');

var path="./path/"
fs.readdirSync(path).forEach(function (name) {
    send(path+name);
});

function send(url){
    var formData = {
        file: fs.createReadStream(url),
    };
    request.post({url:'http://localhost:3000/upload', formData: formData}, function optionalCallback(err, httpResponse, body) {
        if (err) {
            return console.error('upload failed:', err);
        }
        console.log('Upload successful!  Server responded with:', body);
    });
}
