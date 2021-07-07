var fs = require('fs');

function createDir() {
    var path="./test"
    fs.readdirSync(path).forEach(function (s) {
        var name=s.split('.');
        fs.mkdir(path+"/"+name[0], { recursive: true }, (err) => {});
    });
}
