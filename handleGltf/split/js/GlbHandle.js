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
        console.log(glb);
        this.resourceManager.name=name;
        this.myGlbSplit.getArray(glb,this.resourceManager);//拆分、去除某些部件
        this.myInDe.process(this.resourceManager);//使用兴趣度进行排序

        var myMaterialHandle=new MaterialHandle();
        myMaterialHandle.init(this.resourceManager,this.fileName);
        myMaterialHandle.process();

        console.log(this.resourceManager);

        /**/this.download.jsonDownload(//下载说明信息
            this.resourceManager.resourceInfoGet(),"resourceInfo.json"
        );

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
                //scope.download.jsonDownload(scope.resourceInfo,"resourceInfo.json");
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
    getGrid:function (glb) {
        var myGrid=[];
        this.resourceManager.name=name;
        this.myGlbSplit.getArray(glb,this.resourceManager);//拆分、去除某些部件

        for(var k=0;k<this.resourceManager.meshs.length;k++){
            var node=this.resourceManager.meshs[k];
            var geometry=node.geometry;
            var position=geometry.attributes.position;
            var arr=position.array;
            //console.log(node.name+"--"+position.count);
            var matrix=node.matrix;
            console.log(matrix);
            var e=matrix.elements;
            for(var i=0;i<position.count;i++){
                var x=arr[3*i];
                var y=arr[3*i+1];
                var z=arr[3*i+2];

                arr[3*i]  =x*e[0]+y*e[4]+z*e[8]+e[12];
                arr[3*i+1]=x*e[1]+y*e[5]+z*e[9]+e[13];
                arr[3*i+2]=x*e[2]+y*e[6]+z*e[10]+e[14];
                /*if(Y>0.5&&Y<1.8){
                    myGrid.push([
                        Math.round(X),Math.round(Z)
                    ])
                }*/
            }

            var index=geometry.index;
            arr=index.array;
            for(i=0;i<index.count/3;i++){
                var i_p1=arr[3*i];
                var i_p2=arr[3*i+1];
                var i_p3=arr[3*i+2];
                var p1=getPosByIndex(position,i_p1);
                var p2=getPosByIndex(position,i_p2);
                var p3=getPosByIndex(position,i_p3);
                var min=[p1[0],p1[1],p1[2]];
                var max=[p1[0],p1[1],p1[2]];

                if(p2[0]<min[0])min[0]=p2[0];
                if(p2[1]<min[1])min[1]=p2[1];
                if(p2[2]<min[2])min[2]=p2[2];

                if(p2[0]>max[0])max[0]=p2[0];
                if(p2[1]>max[1])max[1]=p2[1];
                if(p2[2]>max[2])max[2]=p2[2];

                if(p3[0]<min[0])min[0]=p3[0];
                if(p3[1]<min[1])min[1]=p3[1];
                if(p3[2]<min[2])min[2]=p3[2];

                if(p3[0]>max[0])max[0]=p3[0];
                if(p3[1]>max[1])max[1]=p3[1];
                if(p3[2]>max[2])max[2]=p3[2];

                if(min[1]>1.8||max[1]<0.5) {
                } else {
                    for(var k1=Math.round(min[0]);k1<=Math.round(max[0]);k1++)
                        for(var k2=Math.round(min[2]);k2<=Math.round(max[2]);k2++){
                            myGrid.push([k1,k2]);
                        }
                }
                function getPosByIndex(position,i0){
                    return [
                        position.array[3*i0],
                        position.array[3*i0+1],
                        position.array[3*i0+2]
                    ];
                }
            }
        }
        this.download.jsonDownload(//下载说明信息
            {grid:myGrid},"grid.json"
        );
    }
}
