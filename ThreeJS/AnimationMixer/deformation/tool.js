clear("./")
function clear(url) {
    var fs = require('fs');
    require('fs').readdirSync(url).forEach(function (name) {
        var arr=name.split(".");
        if(arr.length===1)clear(url+name+"/")
        else if(arr[arr.length-1]==="ts")fs.unlinkSync(url+name);
    });
}