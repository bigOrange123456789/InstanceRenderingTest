//实例化渲染对象是否重复添加了？
export {ResourceLoader,ResourceLoader_Multiple};
class ResourceLoader_Multiple{//多个文件打包加载，需要建立后台
    myResourceList;

    url;
    camera;
    firstList;
    time;fileNumber;dTime;

    partInstancedObjList;//部分实例化渲染对象的列表

    jsonLoader;//json加载工具
    constructor(opt){
        var scope=this;
        scope.url=opt.url;
        scope.camera=opt.camera;

        scope.time=30;
        scope.fileNumber=3;

        scope.partInstancedObjList=[];

        scope.dTime=scope.time/scope.fileNumber;
        scope.jsonLoader=new THREE.XHRLoader(THREE.DefaultLoadingManager);
    }
    addPack(name,pack){
        var scope=this;
        if(scope.myResourceList){
            var model=scope.myResourceList.getModelByName(name+".glb");
            model.pack=pack;
        }else{
            if(typeof (window.pack)==="undefined")window.pack=[]
            window.pack.push([name,pack])
        }
    }
    addMesh(name,mesh){
        var scope=this;
        if(scope.myResourceList){
            var model=scope.myResourceList.getModelByName(name+".glb");
            model.mesh=mesh;
        }else{
            if(typeof (window.sceneMesh)==="undefined")window.sceneMesh=[]
            window.sceneMesh.push([name,mesh])
        }
    }
    getModel(name){
        return this.myResourceList.getModelByName(name+".glb");
    }
    start(){
        var scope=this;
        window.getTime=function () {//距离下次发送的时间
            var time_delay=window.time1*window.n/window.fileNumber0;
            window.n++;
            return time_delay;
        }
        window.time1=scope.time;

        scope.jsonLoader.load('../json/cgmFirstList.json', function(data){//dataTexture
            var arr=JSON.parse(data);
            scope.firstList=arr;
            window.fileNumber0=arr.length;

            var str="";
            for(var i=0;i<arr.length;i++)
                str+=(arr[i]+"/");
            requestModelPackage(str, 0);
        });
        scope.jsonLoader.load(scope.url, function(str){//dataTexture
            var resourceInfo=JSON.parse(str);
            var resourceList=new ResourceList(
                {resourceInfo:resourceInfo,camera:scope.camera,test:false,firstList:scope.firstList}
            );

            scope.myResourceList=resourceList;

            if(typeof (window.pack)!=="undefined"){
                for(var l=0;l<window.pack.length;l++){
                    scope.addPack(window.pack[l][0],window.pack[l][1])
                }
            }
            var myCallback_get0=function (n){
                var names=resourceList.getModelFileInf({n:n,update:false});
                window.fileNumber0=names.length;
                window.n=0;//第几个文件
                //console.log(names)
                if(names){
                    var visibleList0=getVisibleList(names);
                    if(visibleList0==="")return;//当前没有需要加载的数据
                    //requestModelPackage(visibleList0, 0);
                    requestModelPackageByHttp(visibleList0, 0);
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
                resourceList.update();//更新视点
                myCallback_get0(scope.fileNumber);//向服务器请求资源
            },scope.time)
        });

    }
    computeFirstList(){
        var scope=this;
        scope.jsonLoader.load(scope.url, function(str){//dataTexture
            var resourceInfo=JSON.parse(str);
            var resourceList=new ResourceList(
                {resourceInfo:resourceInfo,camera:scope.camera,test:false,useGPU:false}
            );
            resourceList.update(1);
            var list=resourceList.getModelFileInf({n:1000,update:false});

            for(var i=0;i<list.length;i++){
                var name=list[i].fileName;
                list[i]=name.substr(0,name.length-4)
            }
            download(list,"firstList.json")
            function download(json,name) {
                let link = document.createElement('a');
                link.style.display = 'none';
                document.body.appendChild(link);
                link.href = URL.createObjectURL(new Blob([JSON.stringify(json, null, '\t')], { type: 'text/plain' }));
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

    models;//所有模型几何的说明信息//{fileName,interest,spaceVolume,boundingSphere:{x,y,z,r},MapName}

    maps;//所有贴图的说明信息//mapsIndex;
    camera;
    camera_pre;//用于视点预测

    frustum;//存储相机的视锥体
    update_index;//记录物体状态更新到了第几个
    list;//按照优先级排序
    testObj;//测试对象//=new THREE.Object3D();

    //notTransmitted;


    useGPU;
    sizeGPU;X;Y;Z;R;
    protectedDistance;//受到保护的距离，小于这个距离的构件不被剔除
    #init_GPU_culling(n){
        this.sizeGPU=Math.ceil(Math.pow(n,0.5));
        //#GPU_culling是利用GPU进行视锥遮挡计算的方法
        this.GPU_culling= new GPU().createKernel(function (p0,p1,p2,p3,p4,p5,X,Y,Z,R,sizeGPU,camera_pos,dis0,dis0_min) {
            //最好直接判断出是否应该添加到场景中

            //p0,p1,p2,p3,p4,p5 视锥体的6个平面 //每个平面包含四个参数信息
            //X,Y,Z,R 包围球
            //sizeGPU
            //camera_pos
            var k=this.thread.y*sizeGPU+this.thread.x;
            var distance=Math.pow(
                Math.pow(camera_pos[0]-X[k],2)+
                Math.pow(camera_pos[1]-Y[k],2)+
                Math.pow(camera_pos[2]-Z[k],2)
                ,0.5)-R[k]/2;
            var inView0=intersectsSphere(p0,p1,p2,p3,p4,p5,X[k],Y[k],Z[k],R[k])
            var shouldInScene=0;
            if(
                //distance<dis0_min||
                (inView0===1&&distance<dis0)
            )shouldInScene=1;
            return [
                inView0,
                distance,
                shouldInScene
            ];
            function intersectsSphere(p0,p1,p2,p3,p4,p5,x,y,z,r) {
                function distanceToPoint(plane,point) {
                    return plane[0]* point[0] + plane[1]* point[1] + plane[2]* point[2] + plane[3];
                }

                if ( distanceToPoint(p0, [x,y,z] ) < -1*r ) return 0;//不相交
                if ( distanceToPoint(p1, [x,y,z] ) < -1*r ) return 0;//不相交
                if ( distanceToPoint(p2, [x,y,z] ) < -1*r ) return 0;//不相交
                if ( distanceToPoint(p3, [x,y,z] ) < -1*r ) return 0;//不相交
                if ( distanceToPoint(p4, [x,y,z] ) < -1*r ) return 0;//不相交
                if ( distanceToPoint(p5, [x,y,z] ) < -1*r ) return 0;//不相交

                return 1;
            }
        }).setOutput([this.sizeGPU, this.sizeGPU])

        var X=[],Y=[],Z=[],R=[];
        var k=0;
        for(var i=0;i<this.sizeGPU;i++)
            for(var j=0;j<this.sizeGPU;j++){
                if(k<this.models.length){
                    X.push(this.models[k].boundingSphere.x);
                    Y.push(this.models[k].boundingSphere.y);
                    Z.push(this.models[k].boundingSphere.z);
                    R.push(this.models[k].boundingSphere.r);
                    k++;
                }else{
                    X.push(0);
                    Y.push(0);
                    Z.push(0);
                    R.push(0);
                }
            }
        this.X=X;this.Y=Y;this.Z=Z;this.R=R;
        //console.log("X",X,"Y",Y,"Z",Z,"R",R)
    }

    #initModels(resourceInfo,firstList){
        if(typeof (firstList)==="undefined")firstList=[];
        var scope=this;
        /*
        var flag_init={
            //inVisionCone:false,//不在视锥体中
            //requested:false,//还没有请求这个资源
            Obtained:false,//还没有获取这个资源
            inScene:false//不在场景中
        }
        */
        scope.models=resourceInfo.models;
        //fileName;interest;boundingSphere{x,y,z,r};MapName;spaceVolume;

        for(var i=0;i<scope.models.length;i++){
            //scope.models[i].reusability=0;//并非完全重用度
            scope.models[i].finishLoad=false;
            scope.models[i].inView=false;

            scope.models[i].mesh=null;//没有将网格添加到场景中
            scope.models[i].pack=null;//没有收到数据包
            scope.models[i].distance=0;//构件边缘到相机的距离

            //scope.models[i].protect=true;//被保护的模型，是否应该在场景中的依据

            //scope.models[i].flag=JSON.parse(JSON.stringify(flag_init));

        }

        /*for(var jj=0;jj<firstList.length;jj++){
            ResourceList.remove(
                scope.models,
                firstList[jj]+".glb"
            )
        }*/

        var j=0;
        for(i=0;i<scope.models.length;i++){
            if(scope.models[i].fileName===(firstList[j]+".glb")){
                scope.models[i].inView=true;
                scope.models[i].finishLoad=true;
                j++;
            }
        }
        /*for(i=0;i<scope.models.length;i++){
            if(scope.models.fileName===(firstList[j]+".glb")){
                console.log("!!!!!!!!!!!!!!!!")
            }
        }*/

    }

    constructor (input) {
        var scope=this;
        console.log(scope)
        scope.occlusionCulling = new OcclusionCulling();//occlusion闭合
        scope.occlusionCulling.setResolution(
            window.renderer.domElement.width,
            window.renderer.domElement.height
        );//输入渲染器的canvas大小

        scope.protectedDistance_min=50;
        scope.protectedDistance_max=1000;
        scope.protectedDistance=scope.protectedDistance_min;

        scope.list=[];//这里应当初始化
        scope.camera=input.camera;
        scope.camera_pre=scope.camera.clone();//input.camera.clone();

        scope.frustum=new THREE.Frustum();
        scope.update_index=0;
        var resourceInfo=input.resourceInfo;

        //console.log(resourceInfo)
        if(input.test)scope.testObj=new THREE.Object3D();
        else scope.testObj=null;

        scope.maps=resourceInfo.maps;
        //fileName;modelName;
        for(var i=0;i<scope.maps.length;i++){
            scope.maps[i].finishLoad=false;
        }
        scope.#initModels(resourceInfo,input.firstList)

        scope.useGPU=typeof (input.useGPU)==="undefined"?true:input.useGPU;
        if(scope.useGPU)scope.#init_GPU_culling(resourceInfo.models.length);

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

                scope.models[k].finishLoad=true;
                //if(scope.maps.length===0) ResourceList.remove(scope.models,scope.models[k--]);
                //else scope.models[k].finishLoad=true;//有贴图的场景不能删除模型信息
            }
            if(result0.length===n)break;
        }
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

    /*#eliminate() {//小于45帧就进行了淘汰
        var scope=this;
        var frameNumber;
        if(window.myMain)frameNumber=60;
        else frameNumber=window.myMain.frameNumber;

        var m=5*(45-frameNumber);
        if(frameNumber<0)return;//性能较好


        for(var l=scope.models.length-1;l>=0;l--){
            if(
                scope.models[l].mesh//放入到场景中
                &&!scope.models[l].inView//且不在视锥内
                &&scope.models[l].distance>scope.protectedDistance
            ){
                //console.log("删除的网格为:"+scope.models[i].mesh.name)
                scope.models[l].mesh.parent.remove(scope.models[l].mesh)
                scope.models[l].finishLoad=false;
                scope.models[l].mesh=null;
                m--;
                if(m===0)return;
            }
        }
    }
    #recall(){
        var frameNumber;
        if(window.myMain)frameNumber=60;
        else frameNumber=window.myMain.frameNumber;
        var m;

        if(frameNumber<45)return;//性能较差//小于45帧不召回
        else if(frameNumber<55)m=frameNumber-45;
        else m=5*(frameNumber-45);

        if(window.reuseDataParser)
        for(var l=0;l<this.models.length;l++){
            if(this.models[l].pack&&this.models[l].inView){//没有放入到场景中且在视锥内
                window.reuseDataParser(this.models[l].pack, 1)
                m--;
                if(m===0)return;
            }
        }
    }*/

    #eliminate(l) {
        var scope=this;
        if(
            scope.models[l].mesh//放入到场景中
        ){
            //console.log("删除的网格为:"+scope.models[i].mesh.name)
            //console.log(l,scope.models[l].mesh.parent)
            scope.models[l].mesh.parent.remove(scope.models[l].mesh)
            scope.models[l].finishLoad=false;
            if(window.ModelHasBeenLoaded){
                function remove(arr,value) {
                    for(var kkk=0;kkk<arr.length;kkk++)
                        if(arr[kkk]===value) arr.splice(kkk,1);
                }
                remove(
                    window.ModelHasBeenLoaded,
                    scope.models[l].mesh.name
                )
                //window.ModelHasBeenLoaded.remove(scope.models[l].mesh.name)
                /*for(var kkk=0;kkk<window.ModelHasBeenLoaded.length;kkk++)
                if(window.ModelHasBeenLoaded[kkk]===scope.models[l].mesh.name){
                    window.ModelHasBeenLoaded.splice(kkk,1);
                }*/
            }

            scope.models[l].mesh=null;

        }
    }
    #recall(l){
        if(window.reuseDataParser)//场景已创建
            if(this.models[l].pack){//资源已加载
                window.reuseDataParser(this.models[l].pack, 1)
            }
    }

    update=function(){//判断哪些资源在视锥内
        var scope=this;
        if(window.renderer&&window.renderer.info.render.frame>100)//初始加载时帧数较低，此时不易进行资源剔除
        if(window.myMain&&window.myMain.frameNumber){
            if(typeof (window.frameNumber)==="undefined"){
                window.frameNumber=window.myMain.frameNumber
            }else{
                window.frameNumber=
                    (0.6*window.frameNumber+0.4*window.myMain.frameNumber);
            }
            var d=window.myMain.frameNumber-45;
            if(d>5)d=5;
            if(d<-5)d=-5;
            d=Math.pow(d,3)/100
            scope.protectedDistance+=d;
            scope.protectedDistance=Math.min(
                scope.protectedDistance,
                scope.protectedDistance_max
            )
            scope.protectedDistance=Math.max(
                scope.protectedDistance,
                scope.protectedDistance_min
            )
            //console.log(scope.protectedDistance)
            //console.log(window.myMain.frameNumber,scope.protectedDistance)
        }

        scope.#updateFrustum(100);
        if(scope.useGPU){
            var frustum=scope.#getFrustum();
            //console.log(frustum, X,Y,Z,R, scope.sizeGPU)
            var out=scope.GPU_culling(//似乎判断都与视锥相交
                frustum[0], frustum[1], frustum[2], frustum[3], frustum[4], frustum[5],//视锥体
                scope.X,scope.Y,scope.Z,scope.R,//包围球
                scope.sizeGPU,
                [scope.camera.position.x,scope.camera.position.y,scope.camera.position.z],
                scope.protectedDistance,
                scope.protectedDistance_min
            )

            culling1();
            function culling1() {
                var kk=0;
                for(var i=0;i<scope.sizeGPU;i++)
                    for(var j=0;j<scope.sizeGPU;j++)
                        if(kk<scope.models.length){
                            scope.models[kk].inView=(out[i][j][0]===1);
                            scope.models[kk].distance=out[i][j][1];
                            if(scope.models[kk].mesh)
                                scope.models[kk].mesh.visible=(out[i][j][2]===1);
                            //if(out[i][j][2]===1) scope.#recall(kk)//添加到场景中
                            //else scope.#eliminate(kk);//从场景中移除
                            kk++;
                        }
            }
            culling2();
            function culling2() {
                var mvpMatrix = new THREE.Matrix4();
                var viewProjectionMatrix = new THREE.Matrix4();
                var tempCorners = Array.from(new Array(8), function(){ return new THREE.Vector4(); });

                var occlusionCulling=scope.occlusionCulling;

                //occlusionCulling = new OcclusionCulling();//occlusion闭合
                //occlusionCulling.setResolution(w,h);//输入渲染器的canvas大小

                scope.occlusionCulling.clear();
                cullObjects();
                function cullObjects(){
                    //计算投影视图矩阵
                    viewProjectionMatrix.multiplyMatrices( camera.projectionMatrix, camera.matrixWorldInverse );

                    for(var i=0; i<scope.models.length; i++){
                        if(scope.models[i].visible
                            &&scope.models[i].distance>100)
                            scope.models[i].visible = !objectIsOccluded(scope.models[i]);
                    }
                    function objectIsOccluded(object){//判断是否应该剔除
                        mvpMatrix.multiplyMatrices(viewProjectionMatrix, object.matrixWorld);

                        // Compute the bounding rectangle in screen space by using the bounding box.
                        //使用包围盒计算屏幕空间中的包围矩形。
                        var l = object.geometry.boundingBox.min;
                        var u = object.geometry.boundingBox.max;
                        tempCorners[0].copy(l);
                        tempCorners[1].set( u.x, l.y, l.z );
                        tempCorners[2].set( l.x, u.y, l.z );
                        tempCorners[3].set( u.x, u.y, l.z );
                        tempCorners[4].set( l.x, l.y, u.z );
                        tempCorners[5].set( u.x, l.y, u.z );
                        tempCorners[6].set( l.x, u.y, u.z );
                        tempCorners[7].copy(u);
                        for(var i=0; i<tempCorners.length; i++){//包围盒的8个边角
                            var v = tempCorners[i];
                            v.w = 1;
                            v.applyMatrix4( mvpMatrix );//乘以MVP矩阵得到在屏幕上的坐标
                            v.divideScalar(v.w);//除以w
                        }
                        //计算矩形区域
                        var ndcRectX0 = Math.min(tempCorners[0].x, tempCorners[1].x, tempCorners[2].x, tempCorners[3].x, tempCorners[4].x, tempCorners[5].x, tempCorners[6].x, tempCorners[7].x);
                        var ndcRectX1 = Math.max(tempCorners[0].x, tempCorners[1].x, tempCorners[2].x, tempCorners[3].x, tempCorners[4].x, tempCorners[5].x, tempCorners[6].x, tempCorners[7].x);
                        var ndcRectY0 = Math.min(tempCorners[0].y, tempCorners[1].y, tempCorners[2].y, tempCorners[3].y, tempCorners[4].y, tempCorners[5].y, tempCorners[6].y, tempCorners[7].y);
                        var ndcRectY1 = Math.max(tempCorners[0].y, tempCorners[1].y, tempCorners[2].y, tempCorners[3].y, tempCorners[4].y, tempCorners[5].y, tempCorners[6].y, tempCorners[7].y);

                        // Is the rect inside the unit box?  矩形在单位框内吗？
                        if(ndcRectX1 < -1 || ndcRectY1 < -1 || ndcRectX0 > 1 || ndcRectX0 > 1) return false;//认为这个构件不遮挡其它物体

                        // Find closest AABB depth value//以投影坐标中z的最小值为深度
                        var boundingRectDepth = Math.min(tempCorners[0].z, tempCorners[1].z, tempCorners[2].z, tempCorners[3].z, tempCorners[4].z, tempCorners[5].z, tempCorners[6].z, tempCorners[7].z);

                        return occlusionCulling.ndcRectIsOccluded(ndcRectX0,ndcRectX1,ndcRectY0,ndcRectY1,boundingRectDepth);
                    }
                }
            }
        }else{
            for(var i=0;i<scope.models.length;i++)
                scope.#culling(i);

        }
    }
    #updateFrustum=function (time) {//time用来描述预测的时间
        var scope=this;
        if(typeof(time)==="undefined"||time===0){//不对相机的位置进行预测
            scope.frustum.setFromProjectionMatrix(
                new THREE.Matrix4().multiplyMatrices(
                    scope.camera.projectionMatrix,
                    scope.camera.matrixWorldInverse
                )
            );
        }else{//对相机的位置进行预测
            //if(scope.camera_pre===null) scope.camera_pre=scope.camera.clone();
            var camera_next=scope.camera.clone();//临时对象
            camera_next.position.set(0,0,0)
            camera_next.rotation.set(0,0,0)

            forecast(scope.camera_pre,scope.camera,camera_next,time)
            myTestUI();
            scope.camera_pre=scope.camera.clone();

            scope.frustum.setFromProjectionMatrix(
                new THREE.Matrix4().multiplyMatrices(
                    camera_next.projectionMatrix,
                    camera_next.matrixWorldInverse
                )
            );

            function myTestUI(){
                document.getElementById("pos").innerHTML=
                    scope.camera.position.x.toFixed(3)+","
                    +scope.camera.position.y.toFixed(3)+","
                    +scope.camera.position.z.toFixed(3);
                document.getElementById("rot").innerHTML=
                    scope.camera.rotation.x.toFixed(3)+","
                    +scope.camera.rotation.y.toFixed(3)+","
                    +scope.camera.rotation.z.toFixed(3);
                document.getElementById("pos_next").innerHTML=
                    camera_next.position.x.toFixed(3)+","
                    +camera_next.position.y.toFixed(3)+","
                    +camera_next.position.z.toFixed(3);
                document.getElementById("rot_next").innerHTML=
                    camera_next.rotation.x.toFixed(3)+","
                    +camera_next.rotation.y.toFixed(3)+","
                    +camera_next.rotation.z.toFixed(3);
            }
            function forecast(c1,c2,c3,ratio) {
                if(typeof (ratio)==="undefined")ratio=1;
                ratio++;

                var q3=forecast1(
                    c1.quaternion,
                    c2.quaternion
                );
                c3.rotation.set(0,0,0)
                c3.applyQuaternion(q3)

                var p3=forecast2(
                    c1.position,
                    c2.position
                );
                c3.position.set(p3.x,p3.y,p3.z)
                function forecast1(pre_qua,qua){
                    if(pre_qua===null){
                        pre_qua=new THREE.Quaternion(qua.x,qua.y,qua.z,qua.w);
                    }
                    var next_qua=new THREE.Quaternion();
                    THREE.Quaternion.slerp( pre_qua, qua,next_qua,ratio);
                    return next_qua;
                }
                function forecast2(pre_pos,pos){
                    if(pre_pos===null){
                        pre_pos={x:pos.x,y:pos.y,z:pos.z}
                    }
                    return {
                        x:ratio*(pos.x-pre_pos.x)+pre_pos.x,
                        y:ratio*(pos.y-pre_pos.y)+pre_pos.y,
                        z:ratio*(pos.z-pre_pos.z)+pre_pos.z
                    }//next_pos
                }
            }
        }
    }
    #getFrustum=function () {
        var scope=this;
        const planes = scope.frustum.planes;
        var plane0=planes[0];
        var plane1=planes[1];
        var plane2=planes[2];
        var plane3=planes[3];
        var plane4=planes[4];
        var plane5=planes[5];

        return [
            [plane0.normal.x,plane0.normal.y,plane0.normal.z,plane0.constant],
            [plane1.normal.x,plane1.normal.y,plane1.normal.z,plane1.constant],
            [plane2.normal.x,plane2.normal.y,plane2.normal.z,plane2.constant],
            [plane3.normal.x,plane3.normal.y,plane3.normal.z,plane3.constant],
            [plane4.normal.x,plane4.normal.y,plane4.normal.z,plane4.constant],
            [plane5.normal.x,plane5.normal.y,plane5.normal.z,plane5.constant],
        ];
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
