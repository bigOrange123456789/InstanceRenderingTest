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
    static test(){
        //修改静态变量
        var fp=new FileProcessor();
        fp.writeJson("test.txt",{a:123})
        console.log(fp.getAllName("./"))
        fp.clear("./test/")
    }
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
    static test2(){
        //修改静态变量
        var fp=new FileProcessor()
        var path0="./san/"
        var names=fp.getAllName(path0)
        for (var i=0;i<names.length;i++){
            var url1=path0+names[i]
            console.log(url1)
            var url2=path0+"san"+i+fp.getSize(path0+names[i])
            console.log(fp.getSize(path0+names[i]))
            fp.rename(url1,url2)
        }
    }
    static test3(){
        //修改静态变量
        var fp=new FileProcessor()
        var path0="./zip/"
        var names=fp.getAllName(path0)
        var urls=[]
        var sizes=[]
        for (var i=0;i<names.length;i++){
			console.log(i)
            urls.push( path0+names[i] )
            sizes.push( fp.getSize(path0+names[i]) )
        }
        fp.writeJson("result.json",{
            urls:urls,
            sizes:sizes
        })
    }
}
// FileProcessor.test3()

module.exports = { FileProcessor };