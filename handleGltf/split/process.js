var fs = require('fs');
var names,inf;
fs.readFile('names.json', 'utf8' , function (err , data) {
    names=JSON.parse(data);
    console.log(names)
    getInf()
});
function getInf(){
    fs.readFile('result.json', 'utf8' , function (err , data) {
        inf=JSON.parse(data);
        console.log(inf)
        deleteFiles();
    });
}
function deleteFiles() {
    var path="../../../_DATA_/model_sim/"
    var haveList=[]
    fs.readdirSync(path).forEach(function (s) {
        haveList.push(s)
    });
    console.log(haveList)
    for(var i=0;i<names.length;i++){
        console.log(names[i],inf[names[i]].url)
        if(names[i]!==inf[names[i]].url){
            if(haveList[names[i]])
                fs.unlinkSync(path  + names[i]);
        }
    }
    console.log("finish!")
}
