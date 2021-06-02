//值得学习的内容：
//创建json文件
//删除文件


///process.argv存储输入的命令
///node server.js ***
///path1/node.exe
///path2/server.js
///***输入的第三个参数

//可供处理的数据有三部分：基网格、PM过程、骨骼
//输出的数据：处理基网格、分解PM信息、复制骨骼（提供索引）
var fs = require('fs');

fs.readFile('result.json', 'utf8' , function (err , data) {
    var json=JSON.parse(data)
    console.log("去重的文件个数为："+Object.keys(json).length)
    for (var i in json) {
        var url="dat/" +i+".dat";
        process(url)
    }
});

function process(url) {
    if(fs.existsSync(url)){
        fs.unlinkSync(url);
    } else{
        console.log("文件不存在："+url)
    }
}
