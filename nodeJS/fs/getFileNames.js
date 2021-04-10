var fs = require('fs');
const files = fs.readdirSync('./test');
files.forEach(function (item, index) {
    console.log(item,index);
    if (fs.lstatSync("./test/" + item).isDirectory()) console.log(item);//判断是否为文件夹
})
/**
 *
 *
 * fs.stat返回一个 fs.Stats 对象，该对象提供了关于文件的很多信息，
 * 例如文件大小、创建时间等。
 * 其中有两个方法 stats.isDirectory()、stats.isFile()
 * 用来判断是否是一个目录、是否是一个文件。
 *
 *fs.exists('/etc/passwd',
 * (exists) => { console.log(exists ? '存在' : '不存在');
 * });
 *
 *
 */
