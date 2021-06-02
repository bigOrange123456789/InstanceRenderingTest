var fs = require('fs');
var path="./test"
fs.readdirSync(path).forEach(function (s) {
    var name=s.split('.');
    fs.mkdir(path+"/"+name[0], { recursive: true }, (err) => {});
});
