var fs = require('fs');
var join = require('path').join;
function getPaths(url) {
    var paths = [];
    function find(path){
        let files = fs.readdirSync(path);
        files.forEach(function (item) {
            let fPath = join(path,item);
            let stat = fs.statSync(fPath);
            if(stat.isDirectory()) find(fPath);
            else if (stat.isFile()) path.push(fPath);
        });
    }
    find(url);
    return paths;
}
console.log(getPaths("test"))
