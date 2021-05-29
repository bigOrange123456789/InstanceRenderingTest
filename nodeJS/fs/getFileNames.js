//f3();
function f1() {
    var fs = require('fs');
    var files = fs.readdirSync('./test');
    files.forEach(function (item, index) {
        console.log(item,index);
        if (fs.lstatSync("./test/" + item).isDirectory()) console.log(item);//判断是否为文件夹
    });
}
function f2() {
    var result="";
    require('fs').readdirSync('./').forEach(function (item) {result+=item+",";});
    console.log(result);
}
function f3() {
    require('fs').readdirSync('./ttt').forEach(function (s) {console.log("'"+s+"',")});
}
function f4() {
    var fs = require('fs');
    var result=[]
    fs.readdirSync('./test').forEach(function (s) {
        result.push(s)
    });
    fs.writeFile('name.json' , JSON.stringify(result , null, "\t") , function(){});
}

function f5() {
    var fs = require('fs');
    var result=[]
    fs.readdirSync(process.argv[2]).forEach(function (s) {
        result.push(s)
    });
    fs.writeFile('name.json' , JSON.stringify(result , null, "\t") , function(){});
}
function rename() {
    var fs = require('fs');
    var result=[]
    var path=process.argv[2]
    fs.readdirSync(path).forEach(function (s) {
        result.push(s)
    });
    for(var i=0;i<result.length;i++){
        fs.rename(path+"/"+result[i],path+"/"+i+".glb",function (err) {
                if (err) throw err;
                console.log('Successful modification,');
            })
    }
}
rename();
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
