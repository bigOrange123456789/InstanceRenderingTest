class FileProcessor{
    //构造函数
    constructor() {
        this.fs=require('fs')
    }
    //类中函数
    read(url){
        this.fs.readFile(url, 'utf8' , function (err , data) {
            console.log(err , data)
        });
    }
    writeJson(name,data){
        this.fs.writeFile(name, JSON.stringify(data , null, "\t") , function(){});
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
    //静态函数
    static test(){
        //修改静态变量
        var fp=new FileProcessor();
        fp.writeJson("test.txt",{a:123})
        console.log(fp.getAllName("./"))
        fp.clear("./test/")
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
            //fp.rename(url1,url2)
        }
    }
}
FileProcessor.test2()

