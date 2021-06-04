var fs = require('fs');
//var url1="";
//var url2="";
function move(url1,url2){
    if(fs.existsSync(url1)){
        fs.readFile(url1, function (err , data) {
            fs.writeFile(url2 , data , function(){
                //fs.unlinkSync(url1);
            });
        });
    } else{
        console.log("文件不存在："+url)
    }
}
