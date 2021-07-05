var path1="./1.fbx";
var path2="./2.glb";

var fs = require('fs');
function getNames() {
    var result=[]
    fs.readdirSync(path1).forEach(function (s) {
        arr=s.split('.');
        result.push(arr[0])
    });
    return result;
}
var names=getNames();
/*
names=[
    "925.fbx",
    "722.fbx"
];
*/

var cmd=require('node-cmd');
function fbx2glb(p1,p2,callback){
    cmd.run('FBX2glTF.exe -i '+p1+'.fbx -o '+p2+'.glb ');
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
        path1+"/"+names[index],
        path2+"/"+names[index],
        function () {
            index++;
            deal0();
        }
    )
}


