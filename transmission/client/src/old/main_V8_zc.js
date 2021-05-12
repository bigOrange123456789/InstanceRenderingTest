//orange：设置资源列表对象
function ListStorage(){
    this.cameraStatus=[];//orange：成员为字符串//每个字符串分为7段
    this.list=[];//orange：成员为字符串数组//每个成员由多个字符串构成

    this.cameraStatusCache1=[];//orange：1号缓存区存放服务器发送的数据，
    this.listCache1=[];//orange：1号缓存区存放服务器发送的数据，2号缓存区存放其他客户端发送的数据
    this.preCameraStatus=null;//orange：对应cameraStatusCache1[0]中的数据，存放前一个发送给服务器视点信息，用于判断现在的视点是否和上一个视点重复
    this.p2PData="";//临时存储需要向其他用户通过P2P发送的信息

    this.cameraStatusCache2=[];//orange：2号缓存区存放其他客户端发送的数据。取出缓存区中某个数据后，可以使用splice(0,1)删除这个数据
    this.listCache2=[];
}
ListStorage.prototype={//外界只需要调用4个函数就可以实现所有工作：getList、saveServerData_send、saveServerData_accept、saveP2PData
    getList:function (str,b,c,d,e,f,g){//通过视点信息来获取对应的资源列表调用方法为：getList(),getList(str),getList(a,b,c,d,e,f,g)
        if(str===undefined)return [this.cameraStatus,this.list];//getList()//如果没有输入参数，返回整个资源列表//用于测试时，查看对象的内容
        else if(b!==undefined)str=str+b+c+d+e+f+g;//getList(a,b,c,d,e,f,g)
        for(var i=0;i<this.cameraStatus.length;i++)
            if(this.cameraStatus[i]===str)return this.list[i];
        return [];
    },

    //cache1
    //以下函数用于保存向服务器发送的数据
    cameraStatusPushCache1:function (a,b,c,d,e,f,g){//将视点信息存入cache1//视点信息是一个字符串
        if(this.isPreCameraStatus(a,b,c,d,e,f,g))return;//如果和上一个视点信息相同就不进行入栈
        this.preCameraStatus=[a,b,c,d,e,f,g];
        this.cameraStatusCache1.push(a+","+b+","+c+","+d+","+e+","+f+","+g);
    },
    isPreCameraStatus:function (a,b,c,d,e,f,g){
        return this.preCameraStatus//preCameraStatus不能为空，为空说明这是第一个
            &&a===this.preCameraStatus[0]
            &&b===this.preCameraStatus[1]
            &&c===this.preCameraStatus[2]
            &&d===this.preCameraStatus[3]
            &&e===this.preCameraStatus[4]
            &&f===this.preCameraStatus[5]
            &&g===this.preCameraStatus[6];
    },
    saveServerData_send:function (a,b,c,d,e,f,g){
        this.cameraStatusPushCache1(a,b,c,d,e,f,g);
    },
    //以下函数用于处理服务器发来的数据
    listPushCache1:function (str){//向cache1存储资源名称数据
        this.listCache1.push(str);//str是资源名称
    },
    submitCache1:function (){//将cache1中的资源列表数据提交到list和cameraStatus中，并将这些数据拼接成字符串用于接下来发送给其他用户//完成了当前的资源列表,开始设置下一个资源列表
        if(this.getList(this.cameraStatusCache1[0]).length!==0){//如果这个视点在资料列表中已经存在了，就不需要再次将缓存中的信息加入列表了
            this.listCache1=[];//清空这个缓存区
            this.cameraStatusCache1.splice(0,1);//删除这个视点信息
        }else{//如果这个视点在资料列表中不存在
            this.list.push(this.listCache1);
            this.listCache1=[];
            this.cameraStatus.push(this.cameraStatusCache1[0]);
            this.cameraStatusCache1.splice(0,1);//将这个缓冲区看做一个队列

            //以下将这些数据拼接成字符串，用于接下来通过P2P发送给其他用户
            var index=this.list.length-1;
            var mySendP2PData="";
            mySendP2PData=mySendP2PData+this.cameraStatus[index]+"/";//cameraStatus
            for(var i=0;i<this.list[index].length;i++)
                mySendP2PData=mySendP2PData+this.list[index][i]+"/";
            this.p2PData=mySendP2PData;
        }
    },
    getP2PData:function (){//获取上一次submitCache1的处理结果
        return this.p2PData;
    },
    saveServerData_accept:function (BLGName,isLastGLB,p2pConnection){
        this.listPushCache1(BLGName);//将文件名称存放到列表缓存区中
        if(isLastGLB){//isLastGLB为true表示当前视点的数据流结束
            this.submitCache1();//orange:将cache中的数据存放到真正的资源列表中
            p2pConnection.send(this.getP2PData());//如果this.listCache2没有内容，即为[]这里会报错
        }
    },

    //cache2
    //以下函数用于处理其他用户通过P2P发来的数据
    cameraStatusPushCache2:function (a){//将视点信息存入cache2//视点信息是一个字符串
        this.cameraStatusCache2.push(a);
    },
    listPushCache2:function (str){//向当前资源列表存储数据
        this.listCache2.push(str);
    },
    submitCache2:function (){//将cache2中的资源列表数据提交到list和cameraStatus中//下一个资源列表
        if(this.getList(this.cameraStatusCache2[0]).length!==0){//如果这个视点在资料列表中存在
            this.listCache2=[];
            this.cameraStatusCache2.splice(0,1);//将这个缓冲区看做一个队列
        }else{//如果这个视点在资料列表中不存在
            this.list.push(this.listCache2);
            this.listCache2=[];
            this.cameraStatus.push(this.cameraStatusCache2[0]);
            this.cameraStatusCache2.splice(0,1);//将这个缓冲区看做一个队列
        }
    },
    saveP2PData:function (event){
        var str=event.data;
        if(str!="init_test"){//orange:刚建立连接时对方会发送一个用于连接测试的字符串，内容是"init_test"
            var dataArr = str.split('/');

            //orange:第一段数据是视点信息
            this.cameraStatusPushCache2(dataArr[0]);//将视点信息，存入2号缓存区（1号缓存区存放服务器发送的数据，2号缓存区存放其他客户端发送的数据）
            //orange:其余各段为资源名称
            for(var k=1;k<dataArr.length-1;k++)//orange:最后一段信息为空
                this.listPushCache2(dataArr[k]);
            this.submitCache2();
        }
    },
}
//orange：设置封装管理资源列表对象的对象
function ListStorageManage(){//对ListStorage对象进行了封装，屏蔽了内部私有参数和方法
    var listStorage=new ListStorage();

    this.getList=function(str,b,c,d,e,f,g){
        //alert(str);
        return listStorage.getList(str,b,c,d,e,f,g);
    }
    this.saveServerData_send=function (a,b,c,d,e,f,g){
        listStorage.saveServerData_send(a,b,c,d,e,f,g);
    }
    this.saveServerData_accept=function (BLGName,isLastGLB,p2pConnection){
        listStorage.saveServerData_accept(BLGName,isLastGLB,p2pConnection);
    }
    this.saveP2PData=function (a,b,c,d,e,f,g){
        listStorage.saveP2PData(a,b,c,d,e,f,g);
    }
}
//orange：创建资源列表管理对象
var myListStorage=new ListStorageManage();

let sceneName = "hy";
let scene, camera, renderer, controls, sceneRoot;
let container,light, lightObj;
let startTime = performance.now();
let ws,interval;
let host='100.64.211.63',port = 8081;
//let host='172.26.144.1',port = 8081;
//let host='139.224.29.175',port = 8081;
const webService = "Lcrs";
const mWebClientExchangeCode = 4000;
const sliceLength = 500,synFreq = 1500;
let websocketReady = false;
let scenetLoadDone = false, firstComponent = true;
let packageIndex = 0;
// $.get('http://47.102.121.80:3030',function(data){
//     console.log(data);
//     host = "" + data;
//     initWebsocketNetwork();
// });

let radianceWidth = Math.floor(window.innerWidth/2), radianceHeight = Math.floor(window.innerHeight/2);
let cameraForward = new THREE.Vector3();

let gltfLoader = new THREE.GLTFLoader();
THREE.DRACOLoader.setDecoderPath('./lib/draco/');
THREE.DRACOLoader.setDecoderConfig({type: 'js'});
gltfLoader.setDRACOLoader(new THREE.DRACOLoader());

// /****************************************************************************
//  * RTC
//  ****************************************************************************/
let connectionReady = false;
var connection = new RTCMultiConnection();
connection.socketURL = 'https://rtcmulticonnection.herokuapp.com:443/';
connection.enableFileSharing = true; // by default, it is "false".
connection.session = {
    data : true
};
connection.onmessage = function (event) {//P2P接受他人发送的数据
    console.log("hhhhhhh\n");
    //console.log(event.data);

    myListStorage.saveP2PData(event);

    //orange：下面这部分代码似乎没用，所以我就注释掉了
    /*let arr = new Uint8Array(JSON.parse(event.data));
    //console.log(arr);
    //glb file length info
    let glbLengthData = ab2str(arr.slice(0, sliceLength));
    //glb file
    let glbData = arr.slice(sliceLength);
    //console.log(glbData);

    let glbLengthArr = glbLengthData.split('/');
    let totalLength = 0;
    for (let i = 0; i < glbLengthArr.length - 3; i++) {
        if (!glbLengthArr[i])
            continue;
        reuseDataParser(glbData.slice(totalLength, totalLength + 1.0 * glbLengthArr[i]));
        totalLength += 1.0 * glbLengthArr[i];
    }*/
};
connection.onopen = function() {
    console.log("Open the connection");
    connectionReady = true;
};

connection.onerror = function(){
    console.log("error, try rejoin the connection");
    connection.join(sceneName);
};

connection.onclose = function() {
    console.log("Close the connection");
    connectionReady = false;
};

init();
animate();

function init() {
    scene = new THREE.Scene();
    scene.background = new THREE.Color(0xaaaaaa);
    camera = new THREE.PerspectiveCamera(
        70, window.innerWidth / window.innerHeight, 0.3, 1000
    );
    // camera.position.set(13, 12, 101);//newModel
    // camera.position.set(-18.70847426521349, 77.60635231819737, -58.25531390414911);//hyModel
    camera.position.set(-112, 59, 140);//cgm
    // camera.position.set(61, 36, 98);//szt
    // camera.position.set(0, 0, 30);

    // renderer
    container = document.getElementById("container");
    renderer = new THREE.WebGLRenderer({
        antialias: true,
        alpha: true
    });
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(window.innerWidth, window.innerHeight);
    container.appendChild(renderer.domElement);

    // controls
    controls = new THREE.OrbitControls(
        camera, renderer.domElement
    );
    // controls.target.set(16, 6, -61);//newModel
    // controls.target.set(-2.3836122820563954, 46.38853167595469, 4.577373095370858);//hyModel
    controls.target.set(11, -61, 3);//cgm
    // controls.target.set(-28, 24, 10);//szt
    controls.saveState();

    scene.add(new THREE.AmbientLight(0xffffff, 0.6));

    light = new THREE.SpotLight(0xffffff);
    light.position.set(camera.position.x, camera.position.y, camera.position.z);
    light.distance = 1000;
    light.intensity = 1.0;
    lightObj = new THREE.Object3D();
    lightObj.position.set(0, 0, 5);
    scene.add(lightObj);
    light.target = lightObj;
    scene.add(light);

    sceneRoot = new THREE.Object3D();
    sceneRoot.applyMatrix(new THREE.Matrix4().set(
        -1, 0, 0, 0,
        0, 0, 1, 0,
        0, 1, 0, 0,
        0, 0, 0, 1
    ));
    scene.add(sceneRoot);

    scene.add(new THREE.AxesHelper(5));

    //scene.add(new THREE.Mesh(new THREE.BoxGeometry(10,10,10),new THREE.MeshPhongMaterial({color:0xffff00})));

    window.addEventListener('resize', synWindowSize, false);

    initWebsocketNetwork();
}


function makeInstanced(geo, mtxObj, oriName, type) {
    let mtxKeys = Object.keys(mtxObj);
    let instanceCount = mtxKeys.length + 1;

    // material
    var vert = document.getElementById('vertInstanced').textContent;
    var frag = document.getElementById('fragInstanced').textContent;

    let color = selectMaterialByType(type,name);
    let myTexture = selectTextureByType(type,0.001);

    // var uniforms = {
    //     texture: {type: 't', value: myTexture}
    // };
    var material = new THREE.RawShaderMaterial({
        // uniforms: uniforms,
        vertexShader: vert,
        fragmentShader: frag
    });
    // geometry
    var igeo = new THREE.InstancedBufferGeometry();

    var vertices = geo.attributes.position.clone();
    igeo.addAttribute('position', vertices);
    igeo.setIndex(geo.index);
    var mcol0 = new THREE.InstancedBufferAttribute(
        new Float32Array(instanceCount * 3), 3
    );
    var mcol1 = new THREE.InstancedBufferAttribute(
        new Float32Array(instanceCount * 3), 3
    );
    var mcol2 = new THREE.InstancedBufferAttribute(
        new Float32Array(instanceCount * 3), 3
    );
    var mcol3 = new THREE.InstancedBufferAttribute(
        new Float32Array(instanceCount * 3), 3
    );

    //设置原始mesh的变换矩阵与名称
    //setXYZ(i,x,y,z)
    mcol0.setXYZ(0, 1, 0, 0);
    mcol1.setXYZ(0, 0, 1, 0);
    mcol2.setXYZ(0, 0, 0, 1);
    mcol3.setXYZ(0, 0, 0, 0);
    let instancedMeshName = oriName;
    for (let i = 1, ul = instanceCount; i < ul; i++) {
        let currentName = mtxKeys[i - 1];
        let mtxElements = mtxObj[currentName];
        mcol0.setXYZ(i, mtxElements[0], mtxElements[1], mtxElements[2]);
        mcol1.setXYZ(i, mtxElements[4], mtxElements[5], mtxElements[6]);
        mcol2.setXYZ(i, mtxElements[8], mtxElements[9], mtxElements[10]);
        mcol3.setXYZ(i, mtxElements[12], mtxElements[13], mtxElements[14]);
        instancedMeshName += ('_' + currentName);
    }
    igeo.addAttribute('mcol0', mcol0);
    igeo.addAttribute('mcol1', mcol1);
    igeo.addAttribute('mcol2', mcol2);
    igeo.addAttribute('mcol3', mcol3);

    var colors = new THREE.InstancedBufferAttribute(
        new Float32Array(instanceCount * 3), 3
    );
    for (let i = 0, ul = colors.count; i < ul; i++) {
        colors.setXYZ(i, color.r, color.g, color.b);
        // colors.setXYZ(i, 0.33, 0.33, 0.33);
    }
    igeo.addAttribute('color', colors);

    // var uvs = new THREE.InstancedBufferAttribute(
    // new Float32Array(geo.attributes.uv.length * instanceCount), 2
    // );
    // for (let i = 0, ul = instanceCount; i < ul; i++) {
    // uvs.set(geo.attributes.uv.array, geo.attributes.uv.length * i);
    // }
    // igeo.addAttribute('uv', geo.attributes.uv.clone());

    // mesh
    var mesh = new THREE.Mesh(igeo, material);
    mesh.scale.set(0.001, 0.001, 0.001);
    mesh.material.side = THREE.DoubleSide;
    mesh.frustumCulled = false;
    mesh.name = oriName;
    sceneRoot.add(mesh);
}


function animate() {
    requestAnimationFrame(animate);
    $("#triNum")[0].innerText = renderer.info.render.triangles;
    renderer.render(scene, camera);
    updateLight();
}


function updateLight() {
    light.position.set(camera.position.x, camera.position.y, camera.position.z);
    let ps = new THREE.Vector3();
    camera.getWorldDirection(ps);
    lightObj.position.set(
        camera.position.x + ps.x * 10,
        camera.position.y + ps.y * 10,
        camera.position.z + ps.z * 10
    );
    light.target = lightObj;
}


function initWebsocketNetwork() {
    ws = new WebSocket("ws://" + host + ":" + port + "/" + webService);
    ws.onopen = function (event) {
        console.log("connect successfully");
        websocketReady = true;
        interval = setInterval(syncClientDataToServer,synFreq);
    };
    ws.onmessage = function (msg) {
        //console.log(performance.now());
        console.log("listStorage",myListStorage.getList());//orange:输出内容结构，查看是否和预期的结果一致
        //connection.send("456");//my p2p test

        var headerReader = new FileReader();
        headerReader.onload = function (e) {
            console.log(e.target.result);
            //get the buffer
            let arr = new Uint8Array(e.target.result);

            if(connectionReady && packageIndex <= 2){//估计是刚建立P2P连接的时候执行一次
                //connection.send(JSON.stringify(Array.from(arr)));////P2P向他人发送数据
                //connection.send(JSON.stringify(["test1","test2"]));////P2P向他人发送数据
                connection.send("init_test");////P2P向他人发送数据
                packageIndex ++;
            }

            // glb file length info
            let glbLengthData = ab2str(arr.slice(0, sliceLength));
            //glb file
            let glbData = arr.slice(sliceLength);
            //console.log(glbData);

            let glbLengthArr = glbLengthData.split('/');
            let totalLength = 0;

            let flag = false;
            var myflag = false;
            for (let i = 0; i < glbLengthArr.length - 3; i++) {
                if (!glbLengthArr[i])
                    continue;
                if(!scenetLoadDone && glbLengthArr[glbLengthArr.length - 3]=='1' && i == glbLengthArr.length - 4)
                {
                    scenetLoadDone = true;
                    flag = true;
                }
                if(glbLengthArr[glbLengthArr.length - 3]=='1'&&i == glbLengthArr.length - 4)myflag=true;
                else myflag=false;//不是视点流的最后一个文件段
                reuseDataParser(glbData.slice(totalLength, totalLength + 1.0 * glbLengthArr[i]), myflag);
                flag = false;
                totalLength += 1.0 * glbLengthArr[i];
            }
        };
        headerReader.readAsArrayBuffer(msg.data);
    };
    ws.onclose = function (msg) {
        websocketReady = false;
        clearInterval(interval);
        console.log(msg);
        console.log("close,try reconnect");
    };
    ws.onerror = function (msg) {
        websocketReady = false;
        clearInterval(interval);
        console.log("Websocket connection error!"+msg);
        ws = new WebSocket("ws://" + host + ":" + port + "/" + webService);
    };
}


function reuseDataParser(data,myflag) {
    gltfLoader.parse(data.buffer, './', (gltf) => {
        console.log(gltf);
        let name = gltf.parser.json.nodes[0].name;

        myListStorage.saveServerData_accept(name,myflag,connection);

        if (sceneRoot.getObjectByName(name))
            return;
        console.log(`scene add new model: ${name}`);
        let geo = gltf.scene.children[0].geometry;
        // Add uvs
        // assignBufferUVs(geo);
        let matrixObj = gltf.parser.json.nodes[0].matrixArrs;
        let type = name.slice(name.indexOf('=') + 1);
        if (matrixObj == undefined) {
            let mesh = gltf.scene.children[0];
            mesh.scale.set(0.001, 0.001, 0.001);
            mesh.name = name;
            let color = selectMaterialByType(type,name);
            // let texture = selectTextureByType(type,0.001);
            // mesh.material = new THREE.MeshPhongMaterial({
            //     color: color, side: THREE.DoubleSide, map: texture,shininess:64});
            mesh.material.color = color;
            mesh.material.side = THREE.DoubleSide;
            sceneRoot.add(mesh);
        } else {
            makeInstanced(geo, JSON.parse(matrixObj), name, type);
        }
        //first model
        if(firstComponent){
            firstComponent = false;
            $("#firstModelLoadTime")[0].innerText = ((performance.now() - startTime) / 1000).toFixed(2) + "秒";
            connection.openOrJoin(sceneName);
        }
        // if(flag){
        //     $("#LoadTime")[0].innerText = ((performance.now() - startTime) / 1000).toFixed(2) + "秒";
        //     connection.openOrJoin(sceneName);
        // }
    });
}

function packHeader() {
    return radianceWidth * mWebClientExchangeCode + radianceHeight;
}

function syncClientDataToServer() {
    if(!websocketReady)
        return;
    var msg = new Float32Array(new ArrayBuffer(52));

    // Pack the size of radiance map at first
    msg[0] = packHeader();

    // Synchronize the position and rotation of camera
    msg[1] = -camera.position.x;
    msg[2] = camera.position.y;
    msg[3] = camera.position.z;

    camera.getWorldDirection(cameraForward);
    msg[4] = -cameraForward.x;//-camera.rotation.x * 57.29578;
    msg[5] = cameraForward.y;//camera.rotation.y * 57.29578;
    msg[6] = cameraForward.z;//camera.rotation.z * 57.29578;

    // Synchronize the position and rotation of main light
    msg[7] = 10.0; // reserveParam0
    msg[8] = 10.0; // reserveParam1
    msg[9] = 10.0; // reserveParam2


    myListStorage.saveServerData_send(msg[0],msg[1],msg[2],msg[3],msg[4],msg[5],msg[6]);


    ws.send(msg);
}


function synWindowSize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    radianceWidth = Math.floor(window.innerWidth/2);
    radianceHeight = Math.floor(window.innerHeight/2);
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
}

function selectMaterialByType(type, name) {
    let color = new THREE.Color(0xaaaaaa);
    switch (type) {
        case"IfcFooting":
            color = new THREE.Color(0xFFBFFF);
            break;
        case "IfcWallStandardCase"://ok
            color = new THREE.Color(0xaeb1b3);
            break;
        case "IfcSlab"://ok
            color = new THREE.Color(0x505050);
            break;
        case "IfcStair"://ok
            color = new THREE.Color(0xa4a592);
            break;
        case "IfcDoor"://ok
            color = new THREE.Color(0x6f6f6f);
            break;
        case "IfcWindow":
            color = new THREE.Color(0x9ea3ef);
            break;
        case "IfcBeam"://ok
            color = new THREE.Color(0x949584);
            break;
        case "IfcCovering":
            color = new THREE.Color(0x777a6f);
            break;
        case "IfcFlowSegment"://ok
            color = new THREE.Color(0x999999);
            break;
        case "IfcWall"://ok
            color = new THREE.Color(0xbb9f7c);
            break;
        case "IfcRamp":
            color = new THREE.Color(0x4d5053);
            break;
        case "IfcRailing"://ok
            color = new THREE.Color(0x4f4f4f);
            break;
        case "IfcFlowTerminal"://ok
            color = new THREE.Color( 0xe9f5f8 );
            break;
        case "IfcBuildingElementProxy"://ok
            color = new THREE.Color(0x6f6f6f);
            break;
        case "IfcColumn"://ok
            color = new THREE.Color(0x8a8f80);
            break;
        case "IfcFlowController"://ok
            color = new THREE.Color(0x2c2d2b);
            break;
        case "IfcFlowFitting"://ok
            color = new THREE.Color(0x93a5aa);
            break;
        case "IfcPlate"://ok外体窗户
            color = new THREE.Color(0x2a4260);
            break;
        case "IfcMember"://ok外体窗户
            color = new THREE.Color(0x2f2f2f);
            break;
        default:
            color = new THREE.Color(0x194354);
            break;
    }
    return color;
}


function selectTextureByType(type, repeatTimes = 1) {
    let texture;
    switch (type) {
        case"IfcFooting":
            texture = THREE.ImageUtils.loadTexture('img/default.jpg');
            break;
        case "IfcWallStandardCase"://ok
            texture = THREE.ImageUtils.loadTexture('img/wall.jpg');
            break;
        case "IfcSlab"://ok
            texture = THREE.ImageUtils.loadTexture('img/slab.jpg');
            break;
        case "IfcStair"://ok
            texture = THREE.ImageUtils.loadTexture('img/default.jpg');
            break;
        case "IfcDoor"://ok
            texture = THREE.ImageUtils.loadTexture('img/door.jpg');
            break;
        case "IfcWindow":
            texture = THREE.ImageUtils.loadTexture('img/window.jpg');
            break;
        case "IfcBeam"://ok
            texture = THREE.ImageUtils.loadTexture('img/default.jpg');
            break;
        case "IfcCovering":
            texture = THREE.ImageUtils.loadTexture('img/default.jpg');
            break;
        case "IfcFlowSegment"://ok
            texture = THREE.ImageUtils.loadTexture('img/default.jpg');
            break;
        case "IfcWall"://ok
            texture = THREE.ImageUtils.loadTexture('img/wall.jpg');
            break;
        case "IfcRamp":
            texture = THREE.ImageUtils.loadTexture('img/default.jpg');
            break;
        case "IfcRailing"://ok
            texture = THREE.ImageUtils.loadTexture('img/default.jpg');
            break;
        case "IfcFlowTerminal"://ok
            texture = THREE.ImageUtils.loadTexture('img/default.jpg');
            break;
        case "IfcBuildingElementProxy"://ok
            texture = THREE.ImageUtils.loadTexture('img/default.jpg');
            break;
        case "IfcColumn"://ok
            texture = THREE.ImageUtils.loadTexture('img/column.jpg');
            break;
        case "IfcFlowController"://ok
            texture = THREE.ImageUtils.loadTexture('img/default.jpg');
            break;
        case "IfcFlowFitting"://ok
            texture = THREE.ImageUtils.loadTexture('img/default.jpg');
            break;
        case "IfcPlate"://ok外体窗户
            texture = THREE.ImageUtils.loadTexture('img/window.jpg');
            break;
        case "IfcMember"://ok外体窗户
            texture = THREE.ImageUtils.loadTexture('img/default.jpg');
            break;
        default:
            texture = THREE.ImageUtils.loadTexture('img/default.jpg');
            break;
    }
    texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
    texture.repeat.set(repeatTimes, repeatTimes);
    return texture;
}


/**
 * function arraybuffer to string
 * @param arraybuffer
 **/
function ab2str(buf) {
    return String.fromCharCode.apply(null, new Uint8Array(buf));
}

function assignUVs(geometry, scale = 1.0) {
    geometry.faceVertexUvs[0] = [];

    geometry.computeFaceNormals();
    geometry.faces.forEach(function (face) {
        var components = ['x', 'y', 'z'].sort(function (a, b) {
            return Math.abs(face.normal[a]) > Math.abs(face.normal[b]);
        });

        var v1 = geometry.vertices[face.a];
        var v2 = geometry.vertices[face.b];
        var v3 = geometry.vertices[face.c];

        geometry.faceVertexUvs[0].push([
            new THREE.Vector2(v1[components[0]], v1[components[1]]).multiplyScalar(scale),
            new THREE.Vector2(v2[components[0]], v2[components[1]]).multiplyScalar(scale),
            new THREE.Vector2(v3[components[0]], v3[components[1]]).multiplyScalar(scale)
        ]);
    });
    geometry.uvsNeedUpdate = true;
}


function assignBufferUVs(bufferGeometry, scale = 1.0) {
    let geometry = new THREE.Geometry();
    geometry.fromBufferGeometry(bufferGeometry);

    let uvs = [];
    geometry.computeFaceNormals();
    geometry.faces.forEach(function (face) {
        var components = ['x', 'y', 'z'].sort(function (a, b) {
            return Math.abs(face.normal[a]) > Math.abs(face.normal[b]);
        });

        var v1 = geometry.vertices[face.a];
        var v2 = geometry.vertices[face.b];
        var v3 = geometry.vertices[face.c];

        uvs.push(v1[components[0]] * scale, v1[components[1]] * scale);
        uvs.push(v2[components[0]] * scale, v2[components[1]] * scale);
        uvs.push(v3[components[0]] * scale, v3[components[1]] * scale);
    });
    let uvArray = new Float32Array(uvs);
    bufferGeometry.addAttribute('uv', new THREE.BufferAttribute(uvArray, 2));
    bufferGeometry.uvsNeedUpdate = true;
}


function step(ori,dis){
    switch(ori){
        case 0://x axis
            let right = new THREE.Vector3(1,0,0).applyMatrix4(camera.matrixWorld).sub(camera.position).normalize().multiplyScalar(dis);
            camera.position.add(right);
            controls.target.add(right);
            break;
        case 1://y axis
            let up = new THREE.Vector3(0,1,0).applyMatrix4(camera.matrixWorld).sub(camera.position).normalize().multiplyScalar(dis);
            camera.position.add(up);
            controls.target.add(up);
            break;
        case 2://z axis
            let zoomIn = new THREE.Vector3(0,0,-1).applyMatrix4(camera.matrixWorld).sub(camera.position).normalize().multiplyScalar(dis);
            camera.position.add(zoomIn);
            controls.target.add(zoomIn);
            break;
        default:
            break;
    }
}