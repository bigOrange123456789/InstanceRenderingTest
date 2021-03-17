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
        var myMaterialHandle=new MaterialHandle();
        myMaterialHandle.init(arr,this.fileName);
        myMaterialHandle.process();

        var myInterval=setInterval(function () {
            //下载图片
            scope.download.canvasDownload(
                myMaterialHandle.canvass[scope.index],
                myMaterialHandle.names[scope.index]
            );
            scope.index++;
            if(scope.index===myMaterialHandle.names.length){
                scope.index=0;
                clearInterval(myInterval);
                console.log(scope.mapsIndex.toString());
                var myInterval2=setInterval(function () {//下载模型
                    var name=scope.fileName+scope.index+'.gltf';
                    scope.download.meshDownload(arr[scope.index],name);
                    scope.index++;
                    if(scope.index===arr.length)clearInterval(myInterval2);
                },1000);
            }
        },1000);//有时不需要下载也要等待，这需要优化
    },
}