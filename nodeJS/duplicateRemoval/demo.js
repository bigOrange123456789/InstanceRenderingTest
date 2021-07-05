
var utils = require('./utils');
var async = require('async');
 
var encodeUtil = new utils.EncodeUtil();
 
 
zipEncode();
 
 
function zipEncode() {
    var fileList = utils.FileUtil.getDirFiles(__dirname + "/zipin");
    async.each(fileList, function (item, callback) {
        var filepath = item.path;
        var filename = utils.FileUtil.getFileName(filepath);
        utils.FileUtil.getFileContent(filepath, function (err, buf) {
            if (!err) {
                var bpstr = new Buffer(buf);
                utils.ZipUtil.gZip(bpstr, function (err, bufData) {
                    var encodeBuffer = encodeUtil.encode(bufData);//fs.readFileSync(curPath)
                    var resultPath = __dirname + "/zipout/" + filename;
 
                    utils.FileUtil.writeFileSync(resultPath, encodeBuffer);
                    callback(err);
                });
            } else {
                callback(err);
            }
        });
    }, function (err, resp) {
        if (err) {
            console.log("err :", err);
        } else {
            console.log("success");
            decodeUnzip();
        }
    });
}
 
function decodeUnzip() {
    var fileList = utils.FileUtil.getDirFiles(__dirname + "/zipout");
    async.each(fileList, function (item, callback) {
        var filepath = item.path;
        utils.FileUtil.getFileContent(filepath, function (err, buf) {
            if (!err) {
                var bpstr = new Buffer(buf);
                var decodeBuffer = encodeUtil.decode(bpstr);
                utils.ZipUtil.unZip(decodeBuffer, function (err, buf) {
                    console.log(JSON.parse(buf.toString()));
                    callback(err);
                });
            } else {
                callback(err);
            }
        });
    }, function (err, resp) {
        if (err) {
            console.log("err :", err);
        } else {
            console.log("success");
        }
    });
}

