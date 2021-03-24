function ResourceManager() {
    //maps
    // url
    // interest
    // modelUrl
    //models
    // url
    // interest
    // boundingSphere
    //    x,y,z,r
    this.name;
    this.maps;//说明信息
    this.models;//说明信息
    this.meshs;//真正的资源
    this.mapsIndex;
    this.init();
}
ResourceManager.prototype={
    init:function () {
        this.maps=[];
        this.models=[];
    },
    modelsInit:function(IDs,SVs){
        for(i=0;i<this.meshs.length;i++){
            var modelManager=new ModelManager();
            modelManager.fileName=this.name+""+i+".gltf";
            modelManager.interest=IDs[i];
            modelManager.spaceVolume=SVs[i];
            modelManager.boundingSphereSet(this.meshs[i]);
            this.models.push(
                modelManager
            );
        }
    },
    mapsInit:function(mapsIndex){
        this.mapsIndex=mapsIndex;
        for(i=0;i<mapsIndex.length;i++){
            var modelName=this.name+""+i+".gltf";
            var mapName=this.name+""+i+".jpg";
            var model=this.getModeByName(modelName);
            if(mapsIndex[i]===1){
                var mapManager=new MapManager();
                mapManager.fileName=mapName;
                mapManager.modelName=modelName;
                this.maps.push(mapManager);
                model.MapName=mapName;
            }else{
                model.MapName="";
            }
        }
    },
    resourceInfoGet:function () {
        var result={};
        result.maps=this.maps;
        result.models=this.models;
        result.mapsIndex=this.mapsIndex;
        return result;
    },
    getMapByName:function (name) {
        for(i=0;i<this.maps.length;i++){
            if(this.maps[i].fileName===name)
                return this.maps[i];
        }
    },
    getModeByName:function (name) {
        for(i=0;i<this.models.length;i++){
            if(this.models[i].fileName===name)
                return this.models[i];
        }
    },
}
function MapManager() {
    this.fileName;
    //this.interest;
    this.modelName;
}
MapManager.prototype={
}
function ModelManager() {
    this.fileName;
    this.interest;
    this.boundingSphere;//x,y,z,r
    this.MapName;//没有纹理贴图时为空
    this.spaceVolume;
}
ModelManager.prototype={
    boundingSphereSet:function (mesh) {
        mesh.geometry.computeBoundingBox();
        mesh.geometry.computeBoundingSphere();

        var x=mesh.geometry.boundingSphere.center.x +mesh.matrixWorld.elements[12];
        var y=mesh.geometry.boundingSphere.center.y +mesh.matrixWorld.elements[13];
        var z=mesh.geometry.boundingSphere.center.z +mesh.matrixWorld.elements[14];

        var box=mesh.geometry.boundingBox;
        var sx=mesh.scale.x;
        var sy=mesh.scale.y;
        var sz=mesh.scale.z;

        var r=Math.pow(
            Math.abs(Math.pow(sx*(box.max.x-box.min.x),2))+
            Math.abs(Math.pow(sy*(box.max.y-box.min.y),2))+
            Math.abs(Math.pow(sz*(box.max.z-box.min.z),2)),
            0.5
        )/2;
        console.log(
            sx*Math.pow(box.max.x-box.min.x,2)
            ,box.max.x,r);

        this.boundingSphere={
            x:x*sx,
            y:y*sy,
            z:z*sz,
            r:r
        };
    },
}