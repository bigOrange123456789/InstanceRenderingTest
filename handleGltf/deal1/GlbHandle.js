function GlbHandle(){
    this.counter=0;//计数器，记录处理文件的个数，初始值为0
    this.dataArray=[];
    this.arrayI=0;
    this.arrayJ=0;
}
GlbHandle.prototype={
    print:function(glb,name){
        var gltfExporter = new THREE.GLTFExporter();
        gltfExporter.parse(glb.scene, function (result) {
            let link = document.createElement('a');
            link.style.display = 'none';
            document.body.appendChild(link);
            link.href = URL.createObjectURL(new Blob([JSON.stringify(result)], { type: 'text/plain' }));
            link.download =name+".gltf";
            link.click();
        },glb);
    },
    init:function(array){
        this.dataArray=array;
        this.arrayI=0;
        this.arrayJ=0;
        this.arrayDownLoad();
    },
    arrayDownLoad:function(){
        var myArray=this.dataArray;
        var i=this.arrayI,j=this.arrayJ,index=this.counter;
        if(i>=myArray.length)return;//已经全部输出//进行测试
        //if(i===myArray.length)return;//已经全部输出
        console.log(myArray.length,":",i,j,index);
        var mesh,name;
        if(myArray[i].children.length!==0) {//为Group类型，有孩子
            mesh=myArray[i].children[j].clone();
            //指定下一个mesh
            if(j===myArray[i].children.length-1){
                i++;
                j=0;
            }else{
                j++;
            }
        } else {//纯mesh类型
            mesh=myArray[i].clone();
            //指定下一个mesh
            i++;//j=0;
        }

        name='new'+index+'.gltf';
        index++;

        this.meshDownLoad(mesh,name);

        this.arrayI=i;
        this.arrayJ=j;
        this.counter=index;
    },
    meshDownLoad:function (mesh,name){
        var scene=new THREE.Scene();
        scene.add(mesh);
        this.sceneDownLoad(scene,name);
    },
    sceneDownLoad:function (scene,name){
        var scope=this;
        var gltfExporter = new THREE.GLTFExporter();
        gltfExporter.parse(scene, function (result) {
            scope.resultDownLoad(result,name);
        });
    },
    resultDownLoad:function (result,name){
        let link = document.createElement('a');
        link.style.display = 'none';
        document.body.appendChild(link);
        link.href = URL.createObjectURL(new Blob([JSON.stringify(result)], { type: 'text/plain' }));
        link.download = name;
        link.click();

        var scope=this;
        //console.log(name);
        setTimeout((function (){
            scope.arrayDownLoad();
        }),1000);
    },
}