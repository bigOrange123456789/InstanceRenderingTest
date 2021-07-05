var request = require('request');
var fs = require('fs');
var formData = {
    file: fs.createReadStream('./path/file.zip'),
};
request.post({url:'http://127.0.0.1:3000/upload', formData: formData}, function optionalCallback(err, httpResponse, body) {
    if (err) {
        return console.error('upload failed:', err);
    }
    console.log('Upload successful!  Server responded with:', body);
});
