//将glb分解为多个小文件，同时将纹理贴图单独存放为jpg格式
function GlbSplit2(){
    this.fileName;
    this.index;
    this.mapsIndex;
    this.names;
    this.download;
}
GlbSplit2.prototype={
    init:function(fileName,myDownload){
        this.index=0;
        this.fileName=fileName;
        this.download=myDownload;
        this.mapsIndex=[];
        this.names=getNames();
        function getNames(){
            var names=[
                '室内-会议横幅（非）',
                '室内-舞台灯架（非）',
                '上层外墙',
                '窗体',
                '外部台阶与屋顶墙体',
                '网格103','网格.103_1','网格.103_2'
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
                scope.download.canvasDownload(
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
                    scope.download.meshDownload(arr[scope.index],name);
                    //scope.meshDownLoad(arr[scope.index],name);
                    scope.index++;
                    if(scope.index===arr.length)clearInterval(myInterval2);
                },1000);
            }
        },10);
    }
}