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
    resourceInfoGet:function () {

    },
}
function MapManager() {
    this.fileName;
    this.interest;
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
        var x=mesh.geometry.boundingSphere.center.x +mesh.matrixWorld.elements[12];
        var y=mesh.geometry.boundingSphere.center.y +mesh.matrixWorld.elements[13];
        var z=mesh.geometry.boundingSphere.center.z +mesh.matrixWorld.elements[14];
        var r=mesh.geometry.boundingSphere.radius;
        this.boundingSphere={
            x:x,y:y,z:z,r:r
        };
    },
}