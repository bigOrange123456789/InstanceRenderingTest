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

        scope.camera=camera;
        scope.init();
    }
    init2(){
        var scope=this;
        scope.material= new THREE.MeshPhongMaterial({
            color: new THREE.Color(0xa0a0a0), side: THREE.DoubleSide, shininess: 64
        });

        scope.loader= new THREE.GLTFLoader();
        scope.room=new THREE.Object3D();
        scope.room.applyMatrix(new THREE.Matrix4().set(
            -1, 0, 0, 0,
            0, 0, 1, 0,
            0, 1, 0, 0,
            0, 0, 0, 1
        ));
        scope.room.scale.set(0.001,0.001,0.001);
        //this.room.visible=false;

        scope.url="../../_DATA_/cgm/";

        this.myResourceLoader=new ResourceLoader({
            url:this.url,
            camera:this.camera,
            unitProcess:function (gltf) {
                var mesh = gltf.scene.children[0];
                mesh.geometry.computeVertexNormals();
                mesh.material=scope.material;
            },
            useDraco:true,
        })
        this.room.add(this.myResourceLoader.object);

    }
    init(){
        var scope=this;
        scope.url="../../_DATA_/room10/";
        this.myResourceLoader=new ResourceLoader({
            url:this.url,
            camera:this.camera,
            unitProcess:function (gltf) {

            }
        });
        this.room.add(this.myResourceLoader.object);
        //this.room.scale.set(10,10,10);//这里在预处理计算包围球时，可以通过设置scene来处理
    }
}
export {RoomManager};
