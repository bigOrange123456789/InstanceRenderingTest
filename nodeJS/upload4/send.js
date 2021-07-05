var fs = require('fs');
var request = require('request');

var formData = {
    file: fs.createReadStream('./path/file.zip'),
};
//console.log(formData.file.originalname)
//console.log(formData)
console.log(typeof (formData))

send(formData,'http://127.0.0.1:3000/upload');

function send(data,url){
    request.post({url:url, formData: data}, function optionalCallback(err, httpResponse, body) {
        if (err) {
            return console.error('upload failed:', err);
        }
        console.log('Upload successful!  Server responded with:', body);
    });
}
