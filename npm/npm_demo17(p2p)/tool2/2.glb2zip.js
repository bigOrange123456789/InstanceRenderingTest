// const obj2gltf = require('obj2gltf');
// const fs = require('fs');
// function process(index){
//     const inputFile  = path1+index+'.obj';
//     const outputFile = path2+index+'.glb';
//     obj2gltf(inputFile)
//     .then(function(gltf) {// 将转换后的 gltf 数据写入文件中
//         const data = Buffer.from(JSON.stringify(gltf));
//         fs.writeFile(outputFile, data, function(err) {
//             if (err) throw err;
//         });
//     })
//     .catch(function(err) {
//         console.error('Error:', err);
//     });
// }
// let index=0
// const number=1278
// const interval=setInterval(()=>{
//     process(index)
//     console.log(index)
//     index++
//     if(index==number)clearInterval(interval)
// },100)

class FileProcessor{
    //构造函数
    constructor() {
        this.fs=require('fs')
        this.archiver  = require('archiver');//用于文件压缩
        this.path=require('path')//用于文件压缩
    }
    //类中函数
    read(url){
        this.fs.readFile(url, 'utf8' , function (err , data) {
            console.log(err , data)
        });
    }
    writeJson(name,data){
        this.fs.writeFile(name, JSON.stringify(data) , function(){});
        //this.fs.writeFile(name, JSON.stringify(data , null, "\t") , function(){});
    }
    clear(path) {
        var scope=this;
        if(this.fs.existsSync(path)) {
            this.fs.readdirSync(path).forEach(function (file) {
                let curPath = path + "/" + file;
                if(scope.fs.statSync(curPath).isDirectory()) scope.clear(curPath)
                else scope.fs.unlinkSync(curPath)//stat.isFile()
            })
            this.fs.rmdirSync(path)
        }
    }
    //文件夹处理
    createFolder(folder){
        try{this.fs.accessSync(folder)}//检测文件是否存在
        catch(e){this.fs.mkdirSync(folder)}// 文件夹不存在，创建文件夹
    }
    //文件名处理
    rename(url1,url2){
        this.fs.renameSync(url1,url2)
    }
    getSize(url){
        var stats=this.fs.statSync(url)
        return stats.size;
    }
    getAllName(path){
        var names=[]
        this.fs.readdirSync(path).forEach(function (name) {
            names.push(name)
        });
        return names
    }
    zip(url, name, cb){
        // init
        var output = this.fs.createWriteStream(name);//创建数据流
        output.on('close',()=> cb('finish'));//创建完成
        // zip
        var archive = this.archiver('zip', {zlib: { level: 9 }});//设置压缩格式和等级
        archive.on('error', err=> cb(err));
        archive.pipe(output);
        if(this.fs.statSync(url).isFile()) archive.file(url, {name : this.path.basename(url)});
        else archive.directory(url, url);//archive.directory(url, false);
        archive.finalize();
    }
    //静态函数
    static test_compress(){
        var fp=new FileProcessor()
        var rootPath="./zip"
        var all=fp.fs.readdirSync(rootPath)
        var i=0;
        var si=setInterval(()=>{
            var s=all[i];
            console.log("s",s)
            //var arr=s.split(".gltf");
            //if(arr.length>1)
                fp.zip(
                    rootPath+"/"+s, 
                    rootPath+"/"+s+".zip", (s)=> {})
            i++;
            process.stdout.write(i+"/"+all.length+"\r")
            if(i===all.length)clearInterval(si)
        },1)
    }
}

const path1="F:/gitHubRepositories/temp4/VisibleEntropy/dist/assets/space6GLB/"
const path2="F:/gitHubRepositories/temp4/VisibleEntropy/dist/assets/space6Zip/"
var fp=new FileProcessor()
var all=fp.fs.readdirSync(path1)
var i=0;
var si=setInterval(()=>{
    var s=all[i];
    console.log("s",s)
    //var arr=s.split(".gltf");
    //if(arr.length>1)
    fp.zip(
        path1+"/"+s, 
        path2+"/"+s.split(".")[0]+".zip", 
        (s)=> {}
    )
    i++;
    process.stdout.write(i+"/"+all.length+"\r")
    if(i===all.length)clearInterval(si)
},100)
// const FileProcessor = require('FileProcessor.js');
// const FileProcessor = require('tool2/FileProcessor.js');
// const fp=new FileProcessor()
// fp.zip("./", "test.txt", cb)
// FileProcessor.test_compress()


