var express = require('express');
var router = express.Router();
var forward=true;

var fs = require('fs');
var multer  = require('multer');

// 使用硬盘存储模式设置存放接收到的文件的路径以及文件名
var storage = multer.diskStorage({
    destination: function (req, file, cb) {
        // 接收到文件后输出的保存路径（若不存在则需要创建）
        cb(null, 'receive/');
    },
    filename: function (req, file, cb) {
        // 将保存文件名设置为 时间戳 + 文件原始名，比如 151342376785-123.jpg
        cb(null, Date.now() + "-" + file.originalname);
    }
});

// 创建文件夹
var createFolder = function(folder){
    try{
        // 测试 path 指定的文件或目录的用户权限,我们用来检测文件是否存在
        // 如果文件路径不存在将会抛出错误"no such file or directory"
        fs.accessSync(folder);
    }catch(e){
        // 文件夹不存在，以同步的方式创建文件目录。
        fs.mkdirSync(folder);
    }
};

var uploadFolder = './receive/';
createFolder(uploadFolder);

// 创建 multer 对象
var upload = multer({ storage: storage });

/* POST upload listing. */
router.post('/', upload.single('file'), function(req, res) {
    //console.log(req.test)
    //console.log(req.file)
    fs.renameSync(
        uploadFolder+req.file.filename,//现在的文件名
        uploadFolder +req.file.originalname);//原始文件名
    console.log(req.file.originalname)
    if(req.url.indexOf('?')!==-1){//地址栏有参数
        var params = req.url.split("?")[1];
        console.log("params:",params)
        var newIP=getValue("newIP");
        var fpath=getValue("fpath");
        function getValue(lable){
            var param=params.split(lable+"=");
            if(param.length===1)return null;
            var arr = param[1].split(";");
            return arr[0];
        }
        ///////////////////////////////
        if(newIP){//需要进行转发
            var request = require('request');
            var path="./receive/"
            send(path+req.file.originalname);
            fs.unlinkSync(path+req.file.originalname);
            function send(file_url){
                var net_url='http://'+newIP+':3000/upload';
                if(fpath)
                    net_url=net_url+'?fpath='+fpath;
                request.post({url:net_url, formData: {
                        file: fs.createReadStream(file_url),
                    }}, function optionalCallback(err) {
                        if (err) console.error('upload failed:', err);
                        else console.log("forward:",url);
                });
            }
        }else if(fpath){//需要修改路径
            createFolder(uploadFolder +decodeURIComponent(fpath))
            fs.renameSync(//修改路径
                uploadFolder+req.file.originalname,
                uploadFolder +decodeURIComponent(fpath)+req.file.originalname);
        }

    }
    res.json({res_code: 'successful!'});// 接收文件成功后返回数据给前端
});

// 导出模块（在 app.js 中引入）
module.exports = router;
