function RoomManager(myVideoManager0,camera){//myVideoManager_
    this.loader= new THREE.GLTFLoader();
    this.room=new THREE.Object3D();
    //this.room.visible=false;
    this.myVideoManager=myVideoManager0;
    this.mid=20;
    this.url="./myModel/room10/";
    this.camera=camera;

    this.resourceManager;

    this.myResourceLoader;

    this.init();
}
RoomManager.prototype={
    init:function(){
        var scope=this;
        this.myResourceLoader=new ResourceLoader(
            this.url,
            this.camera,
            function (gltf) {

            });
        this.room.add(this.myResourceLoader.object);
        //this.room.scale.set(10,10,10);//这里在预处理计算包围球时，可以通过设置scene来处理

    },
}