function RoomManager(myVideoManager0,camera){//myVideoManager_
    this.loader= new THREE.GLTFLoader();
    this.room=new THREE.Object3D();
    //this.room.visible=false;
    this.myVideoManager=myVideoManager0;
    this.mid=20;
    this.url="./myModel/room2/";
    this.camera=camera;

    this.resourceManager;

    this.init();
}
RoomManager.prototype={
    init:function(){
        var scope=this;
        var loader = new THREE.XHRLoader(THREE.DefaultLoadingManager);
        loader.load(this.url+"resourceInfo.json", function(str){//dataTexture
            var resourceInfo=JSON.parse(str);
            scope.resourceManager=new ResourceManager(resourceInfo,scope.camera);
            //scope.room.add(scope.resourceManager.testObj);
            setInterval(function () {
                //console.log(scope.resourceManager.getOneMapFileName())
            },1000)
        });
        this.room.scale.set(10,10,10);
    },
    create1:function(){
        var scope=this;
        if(!this.resourceManager){
            requestAnimationFrame(function () {scope.create1();});
            return;
        }
        this.myLoad1();
    },
    create2:function(){
        var scope=this;
        if(!this.resourceManager){
            requestAnimationFrame(function () {scope.create2();});
            return;
        }
        this.myLoad2();
    },
    myLoad1:function(){
        var scope=this;
        load(scope.resourceManager.getOneModelFileName());
        function load(fileName) {
            console.log(fileName);
            if(!fileName){
                setTimeout(function () {
                    load(scope.resourceManager.getOneModelFileName());
                },100)
            }else{
                scope.loader.load(scope.url+fileName, (gltf) => {
                    var scene=gltf.scene;
                    var mesh0=scene.children[0];
                    mesh0.nameFlag=fileName;
                    screenProcess(gltf);
                    scope.room.add(scene);
                    load(scope.resourceManager.getOneModelFileName());
                });
            }
            function screenProcess(gltf) {
                for(var i=0;i<gltf.scene.children.length;i++){
                    if( gltf.scene.children[i].name==="室内-小显示器屏幕（非）"||
                        gltf.scene.children[i].name==="室内-大显示器屏幕（非）"){//室内-大显示器屏幕（非）
                        var screen=gltf.scene.children[i];
                        if(scope.myVideoManager.video)scope.myVideoManager.init();
                        scope.myVideoManager.setMaterial(screen);
                    }
                }
            }
        }
    },
    myLoad1_:function(url,mapUrl){
        var scope=this;
        this.loader.load(url, (gltf) => {
            var scene=gltf.scene;
            var mesh0=scene.children[0];
            mesh0.mapUrl=mapUrl;
            //console.log(url+":"+gltf.scene.children[0].name);
            for(var i=0;i<gltf.scene.children.length;i++){
                if( gltf.scene.children[i].name==="室内-小显示器屏幕（非）"||
                    gltf.scene.children[i].name==="室内-大显示器屏幕（非）"){//室内-大显示器屏幕（非）
                    var screen=gltf.scene.children[i];
                    if(scope.myVideoManager.video)scope.myVideoManager.init();
                    scope.myVideoManager.setMaterial(screen);
                }
                //室内-电子显示屏（非）
            }
            scope.room.add(scene);
        })
    },
    myLoad2:function(){
        var scope=this;
        load();
        function load() {
            var fileName=scope.resourceManager.getOneMapFileName();
            if(!fileName){
                setTimeout(function () {load();},100)
            }else{
                var myMap=scope.resourceManager.getMapByName(fileName);
                var texture=THREE.ImageUtils.loadTexture( scope.url+fileName,null,function () {
                    texture.wrapS = THREE.RepeatWrapping;
                    texture.wrapT = THREE.RepeatWrapping;
                    scope.room.traverse(node => {
                        if (node.nameFlag===myMap.modelName) {
                            node.material = new THREE.MeshBasicMaterial({
                                map: texture,//设置颜色贴图属性值
                            });
                        }
                    });
                    load();
                });
            }
        }

    },
    myLoad2_:function(mapUrl,finishFunction){
        var scope=this;
        var texture=THREE.ImageUtils.loadTexture( mapUrl,null,function () {
            texture.wrapS = THREE.RepeatWrapping;
            texture.wrapT = THREE.RepeatWrapping;
            scope.room.traverse(node => {
                if (node.mapUrl===mapUrl) {
                    node.material = new THREE.MeshBasicMaterial({
                        map: texture,//设置颜色贴图属性值
                    });
                }
            });
            if(finishFunction)finishFunction();
        });
    },
}