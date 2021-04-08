import { ResourceLoader } from '../ResourceLoader.js';
class RoomManager{
    loader;
    room;
    //this.room.visible=false;
    myVideoManager;
    mid;
    url;
    camera;

    resourceManager;

    myResourceLoader;

    constructor(myVideoManager0,camera){
        var scope=this;
        scope.loader= new THREE.GLTFLoader();
        scope.room=new THREE.Object3D();
        //this.room.visible=false;
        scope.myVideoManager=myVideoManager0;
        scope.mid=20;
        scope.url="./myModel/room10/";
        scope.camera=camera;
        scope.init();
    }
}
RoomManager.prototype.init=function(){
    var scope=this;
    this.myResourceLoader=new ResourceLoader(
        this.url,
        this.camera,
        function (gltf) {

        });
    this.room.add(this.myResourceLoader.object);
    //this.room.scale.set(10,10,10);//这里在预处理计算包围球时，可以通过设置scene来处理
}
export {RoomManager};