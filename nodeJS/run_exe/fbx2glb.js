var fs = require('fs');
function getNames() {
    var result=[]
    fs.readdirSync("./in").forEach(function (s) {
        arr=s.split('.');
        result.push(arr[0])
    });
    return result;
}
var names=getNames();

var cmd=require('node-cmd');
function fbx2glb(path1,path2,callback){
    cmd.run('FBX2glTF.exe -i '+path1+'.fbx -o '+path2+'.glb ');
    cmd.get(
        'run run_exe',
        function(data){
            callback();
        }
    );
}

index=0;
deal0();
function deal0(){
    if(index>=names.length){
        console.log("处理完成！");
        return;
    }
    console.log(index+"/"+names.length+":"+names[index])
    fbx2glb(
        "./in/"+names[index],
        "./out/"+names[index],
        function () {
            index++;
            deal0();
        }
    )
}


