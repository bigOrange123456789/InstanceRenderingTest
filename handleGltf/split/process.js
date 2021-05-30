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
    var haveList= {}
    fs.readdirSync(path).forEach(function (s) {haveList[s]=true;});
    console.log(haveList)
    var record0=0,record=0;
    for(var i=0;i<names.length;i++){
        if(names[i]!==inf[names[i]].url){
            record0++;

            if(haveList[names[i]]){
                fs.unlinkSync(path  + names[i]);
                record++;
            }else{
                console.log(names[i],inf[names[i]].url)
            }/**/
        }
    }
    console.log("删除个数："+record0)
    console.log("删除个数："+record)
    console.log("finish!")
}
