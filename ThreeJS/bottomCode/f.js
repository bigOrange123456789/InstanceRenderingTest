var path="./"
var fs = require('fs');
var join = require('path').join;
find(path);
function find(path0){
    let files = fs.readdirSync(path0);
    files.forEach(function (item) {
        let fPath = join(path0,item);
        let stat = fs.statSync(fPath);
        if(stat.isDirectory()) find(fPath);
        else if (stat.isFile()) process(fPath);
    });
}
function process(fpath){
    arr=fpath.split(".")
    type=arr[arr.length-1];
    if(type==="ts")
        fs.unlinkSync(fpath)
}


