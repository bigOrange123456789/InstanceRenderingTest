var fs = require('fs');
const files = fs.readdirSync('./test');
files.forEach(function (item, index) {
    console.log(item,index);
    if (fs.lstatSync("./test/" + item).isDirectory()) console.log(item);//判断是否为文件夹
})