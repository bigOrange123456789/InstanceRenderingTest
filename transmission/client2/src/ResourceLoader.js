export {ResourceLoader,ResourceLoader_Multiple};
class ResourceLoader_Multiple{//多个文件打包加载，需要建立后台
    url;
    camera;
    firstList;
    time1;fileNumber;
    time2;dTime;ratio;

    jsonLoader;//json加载工具
    constructor(opt){
        var scope=this;
        scope.url=opt.url;
        scope.camera=opt.camera;

        scope.time1=500;
        scope.fileNumber=50;
        scope.time2=10;
        scope.dTime=scope.time1/scope.fileNumber;
        scope.ratio=scope.time2/scope.time1;
        scope.jsonLoader=new THREE.XHRLoader(THREE.DefaultLoadingManager);
    }
    start(){
        var scope=this;
        window.getTime=function () {//距离下次发送的时间
            var time_delay=window.time1*window.n/window.fileNumber0;
            window.n++;
            return time_delay;
        }
        window.time1=scope.time1;

        scope.jsonLoader.load('../json/cgmFirstList.json', function(data){//dataTexture
            var arr=JSON.parse(data);
            scope.firstList=arr;
            var str="";
            for(var i=0;i<arr.length;i++)
                str+=(arr[i]+"/");
            window.fileNumber0=arr.length;
            requestModelPackage(str, 0);
        });
        scope.jsonLoader.load(scope.url, function(str){//dataTexture
            var resourceInfo=JSON.parse(str);
            var resourceList=new ResourceList(
                {resourceInfo:resourceInfo,camera:scope.camera,test:false}
            );
            for(var jj=0;jj<scope.firstList.length;jj++){
                ResourceList.remove(
                    resourceList.models,
                    scope.firstList[jj]+".glb"
                )
            }
            resourceList.update(1);
            var myCallback_get0=function (n){//加载成功了一个后立即加载另一个
                var names=resourceList.getModelFileInf({n:n,update:false});
                window.fileNumber0=names.length;
                window.n=0;//第几个文件
                if(names){
                    var visibleList0=getVisibleList(names);
                    requestModelPackage(visibleList0, 0);
                }
                function getVisibleList(names){
                    var visibleList="";
                    for(var i=0;i<names.length;i++){
                        var name=names[i].fileName;
                        name=name.substr(0,name.length-4);
                        visibleList=visibleList+name+"/";
                    }
                    return visibleList;
                }
            }

            setInterval(function (){//加载资源
                //window.time=0;//上次加载资源到现在过来多长时间
                myCallback_get0(scope.fileNumber);
            },scope.time1)
            setInterval(function () {//分散计算
                //window.time+=scope.dTime;
                resourceList.update(scope.ratio);
            },scope.time2)
        });
    }
    computeFirstList(){
        var scope=this;
        scope.jsonLoader.load(scope.url, function(str){//dataTexture
            var resourceInfo=JSON.parse(str);
            var resourceList=new ResourceList(
                {resourceInfo:resourceInfo,camera:scope.camera,test:false}
            );
            resourceList.update(1);
            var list=resourceList.getModelFileInf({n:1000,update:false});

            for(var i=0;i<list.length;i++){
                var name=list[i].fileName;
                list[i]=name.substr(0,name.length-4)
            }
            console.log(list);
            download(list,"firstList.json")
            function download(json,name) {
                let link = document.createElement('a');
                link.style.display = 'none';
                document.body.appendChild(link);
                link.href = URL.createObjectURL(new Blob([JSON.stringify(json)], { type: 'text/plain' }));
                link.download =name;
                link.click();
            }
        });
    }
}
class ResourceLoader{//逐个加载
    url;//资源路径
    camera;
    cameraPre;
    unitProcess;

    NumberWaitMaps;//等待加载的贴图个数

    object;
    loader;//模型加载器
    resourceList;
    test=false;//true;//
    useDraco;
    constructor(opt){
        this.useDraco=opt.useDraco===undefined?false:opt.useDraco;
        this.NumberWaitMaps=0;//等待加载的贴图个数
        this.url=opt.url;
        this.camera=opt.camera;
        this.unitProcess=opt.unitProcess;

        this.cameraPre={};
        this.object=new THREE.Object3D();
        this.loader= new THREE.GLTFLoader();
        var scope=this;
        var loader = new THREE.XHRLoader(THREE.DefaultLoadingManager);
        loader.load(this.url+"resourceInfo.json", function(str){//dataTexture
            var resourceInfo=JSON.parse(str);


            scope.resourceList=new ResourceList(
                {resourceInfo:resourceInfo,camera:scope.camera,test:scope.test}
            );
            if(scope.test)scope.object.add(scope.resourceList.testObj);

            scope.#loadGeometry();
            scope.#loadMap();
        });
    }
    #loadGeometry=function(){
        var scope=this;
        load();
        function load() {
            var fileInf=scope.resourceList.getModelFileInf();
            fileInf=fileInf[0];
            var fileName=fileInf?fileInf.fileName:null;
            var mapName=fileInf?fileInf.MapName:null;
            if(!fileName){//如果当前没有需要加载的几何文件
                updateCameraPre();
                var myInterval=setInterval(function () {
                    if(cameraHasChanged()){//如果相机位置和角度发生了变化
                        load();
                        clearInterval(myInterval);
                    }
                },100);
            }else if(!scope.useDraco){
                scope.loader.load(scope.url+fileName, (gltf) => {
                    if(mapName!=="")
                        scope.NumberWaitMaps++;//如果这个几何数据需要加载对应的贴图资源
                    var mesh0=gltf.scene.children[0];
                    mesh0.nameFlag=fileName;
                    scope.unitProcess(gltf);
                    scope.object.add(mesh0);
                    load();
                },function () {
                    load();
                });
            }else{
                loadGlb(
                    scope.url+fileName,
                    (gltf) => {
                        if(mapName!=="")
                            scope.NumberWaitMaps++;//如果这个几何数据需要加载对应的贴图资源
                        var mesh0=gltf.scene.children[0];
                        mesh0.nameFlag=fileName;
                        scope.unitProcess(gltf);
                        scope.object.add(mesh0);
                        load();
                    }
                );
                function loadGlb(url,process,finished) {
                    const loader = new THREE.GLTFLoader();// Instantiate a loader
                    THREE.DRACOLoader.setDecoderPath( './js/lib/threeJS/draco/' );// Specify path to a folder containing WASM/JS decoding libraries.
                    THREE.DRACOLoader.setDecoderConfig({ type: 'js' });
                    loader.setDRACOLoader(new THREE.DRACOLoader());
                    loader.load(url,process, function (xhr) {
                        if( finished!==undefined &&xhr.loaded === xhr.total){
                            finished();
                        }
                    });
                }
            }
            function updateCameraPre(){
                scope.cameraPre.position=scope.camera.position.clone();
                scope.cameraPre.rotation=scope.camera.rotation.clone();
            }
            function cameraHasChanged(){
                return scope.camera.position.x !== scope.cameraPre.position.x ||
                    scope.camera.position.y !== scope.cameraPre.position.y ||
                    scope.camera.position.z !== scope.cameraPre.position.z ||
                    scope.camera.rotation.x !== scope.cameraPre.rotation.x ||
                    scope.camera.rotation.y !== scope.cameraPre.rotation.y ||
                    scope.camera.rotation.z !== scope.cameraPre.rotation.z;
            }
        }
    }
    #loadMap=function(){
        var scope=this;
        load();
        function load() {
            var fileName=scope.resourceList.getOneMapFileName();
            if(!fileName){//如果当前没有需要加载的贴图文件
                var myInterval=setInterval(function () {
                    if(scope.NumberWaitMaps){//如果相机位置和角度发生了变化
                        load();
                        clearInterval(myInterval);
                    }
                },100);
            }else{
                var myMap=scope.resourceList.getMapByName(fileName);
                new THREE.TextureLoader().load(
                    scope.url+fileName,// resource URL
                    function ( texture ) {// onLoad callback
                        scope.NumberWaitMaps--;//加载了一个贴图资源
                        texture.wrapS = THREE.RepeatWrapping;
                        texture.wrapT = THREE.RepeatWrapping;
                        var myInterval2=setInterval(function () {
                            var mesh0;
                            for(var i=0;i<scope.object.children.length;i++){
                                if (scope.object.children[i].nameFlag===myMap.modelName)
                                    mesh0=scope.object.children[i];
                            }
                            if(mesh0){
                                mesh0.material = new THREE.MeshBasicMaterial({map: texture});
                                clearInterval(myInterval2);
                            }
                        },100)
                        load();
                    }
                );
            }
        }

    }
}
class ResourceList{//这个对象主要负责资源列表的生成和管理
    maps;//所有贴图的说明信息
    models;//所有模型几何的说明信息
    mapsIndex;
    camera;
    frustum;//存储相机的视锥体
    update_index;//记录物体状态更新到了第几个
    list;//按照优先级排序
    testObj;//测试对象//=new THREE.Object3D();

    //每接收一次数据进行一次计算
    static remove(arr,element){//从数组中移除元素
        for(var i=0;i<arr.length;i++)
            if(typeof(element)==="string"){
                if(arr[i].fileName===element)arr.splice(i,1);
            }else{
                if(arr[i]===element)arr.splice(i,1);
            }
    }
    modelsPop(element){
        if(element instanceof Array){
            for(var i=0;i<element.length;i++)
                this.modelsPop(element[i])
        }else{
            ResourceList.remove(this.models,element)
        }
    }
    constructor (input) {
        var scope=this;
        scope.list=[];//这里应当初始化
        scope.camera=input.camera;
        scope.frustum=new THREE.Frustum();
        scope.update_index=0;
        var resourceInfo=input.resourceInfo;
        if(input.test)scope.testObj=new THREE.Object3D();
        else scope.testObj=null;

        scope.maps=resourceInfo.maps;
        //fileName;modelName;
        for(var i=0;i<scope.maps.length;i++){
            scope.maps[i].finishLoad=false;
        }
        scope.models=resourceInfo.models;
        //fileName;interest;boundingSphere{x,y,z,r};MapName;spaceVolume;
        for(i=0;i<scope.models.length;i++){
            scope.models[i].finishLoad=false;
            scope.models[i].inView=false;
        }
        scope.mapsIndex=resourceInfo.mapsIndex;

        if(scope.testObj){//开始测试
            testObjMesh();
        }//完成测试
        function testObjMesh(){
            for(var i=0;i<scope.models.length;i++){
                var r=scope.models[i].boundingSphere.r;
                var geometry= new THREE.SphereGeometry(r, 60, 60);//(r,60,16);
                var material = new THREE.MeshNormalMaterial();
                var mesh= new THREE.Mesh(geometry, material);
                mesh.position.set(
                    scope.models[i].boundingSphere.x,
                    scope.models[i].boundingSphere.y,
                    scope.models[i].boundingSphere.z
                );
                scope.testObj.add(mesh);
            }
        }
        console.log(scope)
    }
    getModelFileInf=function(opt){
        opt=opt||{};
        var n=opt.n===undefined?1:opt.n;
        if(typeof(opt.update)==="undefined")opt.update=true;
        var scope=this;
        if(opt.update)scope.update();

        var result0=[];
        for(var k=0;k<scope.models.length;k++){
            if(scope.models[k].inView&&!scope.models[k].finishLoad){
                result0.push(scope.models[k]);
                if(scope.maps.length===0) ResourceList.remove(scope.models,scope.models[k--]);
                else scope.models[k].finishLoad=true;//有贴图的场景不能删除模型信息
            }
            if(result0.length===n)break;
        }
        console.log(result0)
        return result0;
    }
    getOneMapFileName=function(){
        var scope=this;
        var list=getMapList();
        if(list.length===0)return null;
        var _map={interest:-1};//记录兴趣度最大的资源
        for(var i=0;i<list.length;i++){
            var map=scope.getMapByName(list[i]);
            if(map.interest>_map.interest){
                _map=map;
            }
        }
        _map.finishLoad=true;
        return _map.fileName;
        function getMapList(){
            //对应模型已被加载
            // 且对应模型现在视锥内
            // 且贴图本身未被加载的贴图资源列表
            scope.update();//计算每个模型的inView
            var list=[];
            for(let i=0;i<scope.maps.length;i++){
                var model=scope.getModelByName(scope.maps[i].modelName);
                //if(model)//如果模型信息还没有被删除
                if(model.finishLoad&&model.inView){
                    if(!scope.maps[i].finishLoad)
                        list.push(scope.maps[i].fileName);
                }

            }
            return list;
        }
    }

    update=function(ratio){//判断哪些资源在视锥内
        if(typeof (ratio)==="undefined")ratio=1;
        var scope=this;
        var number=Math.floor(scope.models.length*ratio);
        if(number<1)number=1;
        scope.#updateFrustum();
        for(var i=0;i<number;i++){
            if(scope.update_index>=scope.models.length)
                scope.update_index=0;
            scope.#culling(scope.update_index++);
        }
    }
    #updateFrustum=function () {
        var scope=this;
        scope.frustum.setFromProjectionMatrix(
            new THREE.Matrix4().multiplyMatrices(
                scope.camera.projectionMatrix,
                scope.camera.matrixWorldInverse
            )
        );
    }
    #culling=function(i){
        var scope=this;
        scope.models[i].inView=intersectsSphere(
            scope.models[i].boundingSphere.x,
            scope.models[i].boundingSphere.y,
            scope.models[i].boundingSphere.z,
            scope.models[i].boundingSphere.r
        )
        function intersectsSphere(x,y,z,radius ) {
            var center=new THREE.Vector3(x,y,z)
            const planes = scope.frustum.planes;
            //const center = sphere.center;
            const negRadius = - radius;
            for ( let i = 0; i < 6; i ++ ) {
                const distance = planes[ i ].distanceToPoint( center );//平面到点的距离，
                if ( distance < negRadius ) {//内正外负
                    return false;//不相交
                }
            }
            return true;//相交
        }
    }

    getMapByName=function (name) {
        var scope=this;
        for(var i=0;i<scope.maps.length;i++){
            if(scope.maps[i].fileName===name)
                return scope.maps[i];
        }
    }
    getModelByName=function (name) {
        var scope=this;
        for(var i=0;i<scope.models.length;i++){
            if(scope.models[i].fileName===name)
                return scope.models[i];
        }
    }
}
