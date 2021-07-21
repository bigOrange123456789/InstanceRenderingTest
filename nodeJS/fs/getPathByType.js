var fs = require('fs');
var join = require('path').join;
find("./29dbbfbf762ced9781db5e0ae53f2f78/");
function find(path0){
    let files = fs.readdirSync(path0);
    files.forEach(function (item) {
        let fPath = join(path0,item);
        let stat = fs.statSync(fPath);
        if(stat.isDirectory()) find(fPath);
        else if (stat.isFile()){
	var arr=fPath.split(".")
	if(arr.length>1&&arr[1]==="wxapkg")
	     console.log(fPath);
        }
    });
}


