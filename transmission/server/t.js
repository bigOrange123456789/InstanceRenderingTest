var fs = require('fs');

//读取初始文件列表
getFirstList()
function getFirstList(){
    var url="../client2/json/cgmFirstList.json";
    fs.exists(url, (exists) => {
        if(exists){
            fs.readFile(url,'utf8',  function (err, buffer) {//读取文件//将模型数据读取到buffer中，buffer应该是字符串类型的数据
                //buffer应该是一个缓存区，似乎是一个Buffer类型的数据，是一个对象
                //allFile[sceneName][name]=buffer;
                //console.log(buffer)
                var arr=JSON.parse(buffer);

            });
        }else{
            console.log(url+"文件不存在！");
        }
    });
}
