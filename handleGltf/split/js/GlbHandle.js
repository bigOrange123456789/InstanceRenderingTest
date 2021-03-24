//将glb分解为多个小文件
function GlbHandle(){
    this.index=0;
    this.fileName=name;
    this.download=new Download();
    this.myGlbSplit=new GlbSplit();
    this.myInDe=new InDe();
    this.resourceInfo={}
    this.resourceManager=new ResourceManager();
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
        this.resourceManager.name=name;
        this.myGlbSplit.getArray(glb,this.resourceManager);//拆分、去除某些部件
        this.myInDe.process(this.resourceManager);//使用兴趣度进行排序
        console.log(this.resourceManager);

        var myMaterialHandle=new MaterialHandle();
        myMaterialHandle.init(this.resourceManager.meshs,this.fileName);
        myMaterialHandle.process();

        var scope=this;
        this.downloadMap(myMaterialHandle,function () {//下载贴图
                scope.downloadModel(scope.resourceManager.meshs)//下载网格
            });//纹理和网格分开下载
    },
    downloadMap:function (myMaterialHandle,finishFunction) {
        var scope=this;
        
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
                if(finishFunction)finishFunction();
            }
        },1000);//有时不需要下载也要等待，这需要优化
    },
    downloadModel:function (arr) {
        var scope=this;
        var myInterval2=setInterval(function () {//下载模型
            var name=scope.fileName+scope.index+'.gltf';
            scope.download.meshDownload(arr[scope.index],name);
            scope.index++;
            if(scope.index===arr.length)clearInterval(myInterval2);
        },1000);
    },
}