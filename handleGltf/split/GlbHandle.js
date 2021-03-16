function GlbHandle(){
    this.counter=0;//计数器，记录处理文件的个数，初始值为0
    this.dataArray=[];
    this.arrayI=0;
    this.arrayJ=0;
}
GlbHandle.prototype={
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
function GlbHandle2(){
    this.fileName;
    this.index;
    this.mapsIndex;
    this.names;
}
GlbHandle2.prototype={
    init:function(fileName){
        this.index=0;
        this.fileName=fileName;
        this.mapsIndex=[];
        this.names=getNames();
        function getNames(){
            var names=[
                '室内-会议横幅（非）',
                '室内-舞台灯架（非）',
                '上层外墙',
                '窗体',
                '外部台阶与屋顶墙体',
                '网格103','网格.103_1','网格.103_2',
            ];
            arr=[22,23,25,26,27,28,29,30,31,32,33,34,35,38,39];
            for(i=0;i<arr.length;i++){
                names.push('网格0'+arr[i]);
                names.push('网格.0'+arr[i]+'_1');
                names.push('网格.0'+arr[i]+'_2');
            }
            return names;
        }
    },
    glbDownload:function(glb,isPNG){
        if(typeof(isPNG)==="undefined")isPNG=false;
        var scope=this;
        var arr=[];
        glb.scene.traverse(node => {
            if (node instanceof THREE.Mesh) {//instanceof THREE.SkinnedMesh
                //createObj(node);
                arr.push(node);
            }
        });

        function processImage( image,  flipY ) {//图片处理//canvas是画布
                var canvas =  document.createElement( 'canvas' );
                //计算画布的宽、高
                canvas.width = Math.min( image.width);
                canvas.height = Math.min( image.height);

                var ctx = canvas.getContext( '2d' );

                if ( flipY === true ) {
                    ctx.translate( 0, canvas.height );
                    ctx.scale( 1, - 1 );
                }
                //将image画到画布上
                ctx.drawImage( image, 0, 0, canvas.width, canvas.height );

                return canvas;
        }
        function downLoadImg(canvas,name) {//将画布的内容保存为图片
            let url;
            if(isPNG)url = canvas.toDataURL("image/png");//得到图片的base64编码数据
            else url = canvas.toDataURL("image/jpeg");
            let a = document.createElement("a"); // 生成一个a元素
            let event = new MouseEvent("click"); // 创建一个单击事件
            a.download = name || "photo"; // 设置图片名称
            a.href = url; // 将生成的URL设置为a.href属性
            a.dispatchEvent(event); // 触发a的单击事件
        }
        function correct(mesh){
            if(mesh.parent instanceof THREE.Group){
                mesh.position.set(
                    mesh.parent.position.x,
                    mesh.parent.position.y,
                    mesh.parent.position.z
                );
                mesh.rotation.set(
                    mesh.parent.rotation.x,
                    mesh.parent.rotation.y,
                    mesh.parent.rotation.z
                );
            }
        }
        function needDelete(mesh){
            for(i=0;i<scope.names.length;i++){
                if(scope.names[i]===mesh.name)return true;
            }
            return false;
        }

        for(i0=arr.length-1;i0>0;i0--){
            if(needDelete(arr[i0])){
                arr.splice(i0,1);
            }
        }

        var myInterval=setInterval(function () {
            //下载图片
            var map=arr[scope.index].material.emissiveMap;
            if(map){//有纹理贴图
                scope.mapsIndex.push(1);
                downLoadImg(
                    processImage( map.image,true )
                    ,scope.fileName+scope.index+(isPNG?'.png':'.jpg')
                );
                //arr[scope.index].material=new THREE.MeshPhongMaterial({color:0xffffff});//不反光
                arr[scope.index].material=new THREE.MeshBasicMaterial({color:0xf0f0c8});//反光材质
            }else scope.mapsIndex.push(0);
            scope.index++;
            if(scope.index===arr.length){
                scope.index=0;
                clearInterval(myInterval);
                console.log(scope.mapsIndex.toString());
                var myInterval2=setInterval(function () {//下载模型
                    var name=scope.fileName+scope.index+'.gltf';
                    scope.meshDownLoad(arr[scope.index],name);
                    scope.index++;
                    if(scope.index===arr.length)clearInterval(myInterval2);
                },1000);
            }
        },1000);

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
    },
}