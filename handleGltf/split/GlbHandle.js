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
    this.index;
}
GlbHandle2.prototype={
    init:function(){
        this.index=0;
    },
    glbDownload:function(glb){
        var scope=this;
        var arr=[];
        glb.scene.traverse(node => {
            if (typeof (node.geometry)!=="undefined") {//instanceof THREE.SkinnedMesh
                //createObj(node);
                arr.push(node);
                console.log(node.material.emissiveMap);
            }
        });
        //开始测试
        var map=arr[11].material.emissiveMap;
        //image
        downLoadImg(
            processImage( map.image,  true )
            ,"test.png"
        );
        function processImage( image,  flipY ) {//图片处理
                //canvas是画布
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
            let url = canvas.toDataURL("image/png"); //得到图片的base64编码数据
            let a = document.createElement("a"); // 生成一个a元素
            let event = new MouseEvent("click"); // 创建一个单击事件
            a.download = name || "photo"; // 设置图片名称
            a.href = url; // 将生成的URL设置为a.href属性
            a.dispatchEvent(event); // 触发a的单击事件
        }
        //完成测试

        return;
        console.log(arr);
        var myInterval=setInterval(function () {
            var name='new'+scope.index+'.gltf';
            scope.meshDownLoad(arr[scope.index],name);
            scope.index++;
            if(scope.index===arr.length)clearInterval(myInterval);
        },100);

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