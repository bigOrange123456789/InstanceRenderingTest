//将glb分解为多个小文件
function GlbHandle(){
    this.index=0;
    this.fileName=name;
    this.download=new Download();
    this.myGlbSplit=new GlbSplit();
    this.myInDe=new InDe();
    this.resourceInfo={}
    //maps
    // url
    // interest
    // modelURL
    //models
    // url
    // interest
    // boundingSphere
    //    x,y,z,r

}
GlbHandle.prototype={
    process:function (name,glb) {
        var arr=this.myGlbSplit.getArray(glb);//拆分、去除某些部件
        this.myInDe.process(arr);
        this.downloadArray(arr);//纹理和网格分开下载
    },
    downloadArray:function (arr) {
        var scope=this;

        var myMaterialHandle=new MaterialHandle();
        myMaterialHandle.init(arr,this.fileName);
        myMaterialHandle.process();

        var myInterval=setInterval(function () {
            //下载图片

            if(myMaterialHandle.names.length===0)console.log("没有找到纹理贴图");
            else
            scope.download.canvasDownload(
                myMaterialHandle.canvass[scope.index],
                myMaterialHandle.names[scope.index]
            );
            scope.index++;
            if(scope.index>=myMaterialHandle.names.length){
                scope.index=0;
                clearInterval(myInterval);
                scope.resourceInfo.mapsIndex=myMaterialHandle.mapsIndex;
                scope.download.jsonDownload(
                    scope.resourceInfo,"resourceInfo.json"
                );
                //console.log(myMaterialHandle.mapsIndex.toString());
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