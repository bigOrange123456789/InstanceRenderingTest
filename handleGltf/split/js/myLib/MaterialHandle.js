function MaterialHandle() {
    this.meshArr;
    this.canvass;
    this.names;
    this.mapsIndex;
    this.fileName;
}
MaterialHandle.prototype={
    init:function (arr,fileName) {
        this.meshArr=arr;
        this.canvass=[];
        this.names=[];
        this.mapsIndex=[];
        this.fileName=fileName;
    },
    process:function () {
        for(i=0;i<this.meshArr.length;i++){
            var map=this.meshArr[i].material.emissiveMap;
            if(map){//有纹理贴图
                this.mapsIndex.push(1);
                this.names.push(this.fileName+i+'.jpg');
                this.canvass.push(new PicHandle().getCanvas( map.image));
                this.meshArr[i].material=new THREE.MeshBasicMaterial({color:0xf0f0c8});//反光材质
            }else this.mapsIndex.push(0);
        }
    },
}