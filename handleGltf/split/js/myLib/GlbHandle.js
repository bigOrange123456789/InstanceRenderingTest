//将glb分解为多个小文件
function GlbHandle(){
    this.index=0;
    this.fileName=name;
    this.download=new Download();
    this.mapsIndex=[];
}
GlbHandle.prototype={
    process:function (name,glb) {
        var arr=new GlbSplit().getArray(glb);//拆分、去除某些部件
        new InDe().process(arr);
        this.downloadArray(arr);//纹理和网格分开下载
    },
    downloadArray:function (arr) {
        var scope=this;
        var myInterval=setInterval(function () {
            //下载图片
            var map=arr[scope.index].material.emissiveMap;
            if(map){//有纹理贴图
                scope.mapsIndex.push(1);
                scope.download.canvasDownload(
                    processImage( map.image,true )
                    ,scope.fileName+scope.index+'.jpg'
                );
                //arr[scope.index].material=new THREE.MeshPhongMaterial({color:0xffffff});//不反光
                arr[scope.index].material=new THREE.MeshBasicMaterial({color:0xf0f0c8});//反光材质
            }else scope.mapsIndex.push(0);
            console.log(scope.index,arr[scope.index].name);
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
        },1000);//有时不需要下载也要等待，这需要优化
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
    },
}