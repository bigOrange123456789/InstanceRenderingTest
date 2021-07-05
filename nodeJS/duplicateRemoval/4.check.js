var path1="./4.ply";
var path2="./5.txt";
var feature_vectors=[];
var tool=[];

var fs = require('fs');
function getNames() {
    var result=[]
    fs.readdirSync(path1).forEach(function (s) {
        arr=s.split('.');
        result.push(arr[0]);
    });
    return result;
}
var names=getNames();

var cmd=require('node-cmd');
function check(p1,p2,callback){
    cmd.run('ShapeDescriptor.exe --in '+p1+' --out '+p2+' ');
    cmd.get(
        'run run_exe',
        function(data){
            callback();
        }
    );
}

index=0;
deal1();
function deal1(){//生成形状描述符
    if(index>=names.length){
        console.log("处理完成！");
        index=0;
        //deal2();
        return;
    }
    console.log(index+"/"+names.length+":"+names[index])
    check(
        path1+"/"+names[index]+".ply",
        path2+"/"+names[index]+".txt",
        function () {
            index++;
            deal1();
        }
    )
}


function deal2(){//读取形状描述符
    if(index>=names.length){
        console.log("处理完成！");

        for(var i=0;i<names.length;i++){
            tool.push({
                name:(names[i].split(".")[0]),
                v:feature_vectors,
                i:i,
                repeat:1
            })
        }
        deal3();
        return;
    }

    fs.readFile(path2+"/"+names[index]+".txt", 'utf8' , function (err , str) {
        arr=(str.split("\n")[1]).split(" ");
        arr.splice(0,1);
        for(var i=0;i<arr.length;i++){
            arr[i]=parseFloat(arr[i]);
        }
        feature_vectors.push(arr);

        index++;
        deal2();

    });


}


function deal3() {//重用检测
    var similar=0;
    for(var i1=0;i1<250;i1++){
        for(var i2=0;i2<i1;i2++){
            if(tool[i2].repeat===0){
                continue;
            }

            var d=i1===i2?0:distance(tool[i1].v,tool[i2].v);

            if(d<0.01){
                tool[i1].i=i2;
                tool[i1].repeat=0;
                tool[i2].repeat++;
                similar++;
                break;
            }
        }
        console.log("重用检测"+i1+"/"+tool.length)
    }
    console.log("相同构件个数为："+similar)

    test=[];
    for(var i=0;i<250;i++){
        if(tool[i].repeat!==1)
            test.push({
                n:tool[i].name,
                r:tool[i].r,
                i:tool[tool[r].name].name
            })
    }
    saveJson("tool.json",tool.splice(0,10));
}
function distance(v1,v2){
    //console.log(v1,v2)
    var dis=0;
    for(var i=0;i<20;i++)
        dis=dis+Math.pow(v1[i]-v2[i],2)
    return dis
    //return Math.pow(dis,0.5)
}
function saveJson(name,json0) {
    fs.writeFile(name, JSON.stringify(json0 , null, "\t") , function(){});
}
