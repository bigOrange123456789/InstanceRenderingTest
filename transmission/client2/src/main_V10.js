var myCallback_pop,myCallback_get;

let all_material={}

if(typeof(sceneName)==="undefined")sceneName = "cgm";
let userID = Math.random().toString().substring(2, 12) + Date.now().toString().substring(1, 6);

let container, light, lightObj;
let ws, interval;

const webService = "Lcrs";
const mWebClientExchangeCode = 4000;
const sliceLength = 1000, synFreq = 500;
const NUM_PACKAGE = 500;
let websocketReady = false;
let packageIndex = 1;
let ModelHasBeenLoaded = [];
let sceneScale = 0.001;
if(sceneName==="szt")sceneScale=1;
const distanceForSimilarViewpoint = 10, angleForSimilarViewpoint = 15 * Math.PI / 180;

//计算响应延迟
let startTime, endTime;
//计算初始加载时间
let scenetLoadDone = false, firstComponent = false;
let sceneStartTime = performance.now();
let initialTime;
//响应次数和延迟
let synTotalTimes = 0, synFromServerTimes = 0, synFromPeerTimes = 0;
let synTotalDelay = 0, tempDelay;

let radianceWidth = Math.floor(window.innerWidth / 2), radianceHeight = Math.floor(window.innerHeight / 2);

let gltfLoader = new THREE.GLTFLoader();
THREE.DRACOLoader.setDecoderPath('../lib/draco/');
THREE.DRACOLoader.setDecoderConfig({ type: 'js' });
gltfLoader.setDRACOLoader(new THREE.DRACOLoader());

let cubeView;
window.package=[]
window.list=[]
var sceneRoot;
init();

function init() {
    var myMain=new Main();
    myMain.start({ambient:false})
    window.myMain=myMain;

    var scene = myMain.scene;//new THREE.Scene();
    var camera = myMain.camera;//new THREE.PerspectiveCamera(70, window.innerWidth / window.innerHeight, 0.3, 1000);
    window.camera=camera;
    //var renderer = myMain.renderer;//new THREE.WebGLRenderer({antialias: true, alpha: true});

    //container.appendChild(renderer.domElement);

    // controls
    new PlayerControl(camera);

    sceneRoot = new THREE.Object3D();

    window.root=sceneRoot;
    /*
        window.root=sceneRoot;
        window.arr=[];
        setInterval(function () {
            if(window.root.children.length>10){
                window.arr.push(window.root.children[0])
                window.root.remove(window.root.children[0])
            }
        },10)
        */

    sceneRoot.name = "sceneRoot";
    sceneRoot.applyMatrix(new THREE.Matrix4().set(
        -1, 0, 0, 0,
        0, 0, 1, 0,
        0, 1, 0, 0,
        0, 0, 0, 1
    ));
    scene.add(sceneRoot);
    scene.add(new THREE.AxesHelper(5));//用于简单模拟3个坐标轴的对象.

    if(haveP2P)initWebRTC();//p2p获取资源列表


    setTimeout(function (){
        alert("测试完成")
        sendTestResult()
    },browsingtime)
}

function sendTestResult() {
    console.log("!!!!!!!!!!!send test data!!!!!!!!!!!");
    if(typeof(userName)==="undefined")userName="testUser";
    var testData={
        'type': 'testdata',
        'userID': userID+userName,
        'sceneName': sceneName,
        'initialTime': initialTime,
        'averageDelayTime': synTotalDelay / synTotalTimes,
        'responseTimes': synTotalTimes,
        'rpstFromServer': synFromServerTimes,
        'rpstFromPeer': synFromPeerTimes,
        'haveP2P':haveP2P?1:(typeof(useClientCompute)==="undefined"?0:2),
    };
    var oReq = new XMLHttpRequest();
    oReq.open("POST", `http://${assetHost}:${assetPort}`, true);

    oReq.onload = function (oEvent) {
        alert("测试结束，您可以关闭该页面，感谢您的配合！");
    };
    oReq.send(JSON.stringify(testData));
    console.log(testData);
}

//p2p
function initWebRTC() {//p2p获取资源列表
    let rtcInterval;
    var rtConnection = new RTCMultiConnection();
    rtConnection.link=false;
    window.rtConnection=rtConnection;
    //"http://localhost:9001/
    //rtConnection.socketURL = 'https://localhost:9001/';//
    //rtConnection.socketURL = 'http://'+p2pHost+':'+p2pPort+'/';//'https://rtcmulticonnection.herokuapp.com:443/';//
    rtConnection.socketURL = "http://"+ipconfig+":9001/"//'https://rtcmulticonnection.herokuapp.com:443/';//
    rtConnection.enableFileSharing = true; // by default, it is "false".
    rtConnection.session = {
        data: true
    };

    rtConnection.onopen = function () {
        rtConnection.link=true;
        console.log("Open the connection");
        const rtcShareFreq = 1000;
        rtcInterval = setInterval(() => {
            if(window.package.length>1){
                var package00=window.package[
                    Math.floor(Math.random()*window.package.length)
                    ];
                window.mySend(package00)
            }
        }, rtcShareFreq);
        for(var m=0;m<window.list.length;m++){
            rtConnection.send(window.list[m])
        }
    };
    window.mySend=function(needSendPackage){//发送
        var send000=Array.from(needSendPackage)
        console.log("发送数据包",needSendPackage)
        send000.push("data")//表示这是数据
        rtConnection.send(send000);
    }
    rtConnection.onmessage = function (event) {
        var flag=event.data.splice(event.data.length-1,1)
        console.log(event.data[event.data.length-1])
        if(flag[0]==="data"){//收到的是数据
            var package000=new Uint8Array(event.data)
            console.log(flag,"收到P2P数据:",package000)
            reuseDataParser(package000, 0);
        } else{//收到的是资源列表
            console.log(flag,"收到资源列表：",event.data)
            if(window.myResourceLoader&&window.myResourceLoader){
                for(var m=0;m<event.data.length;m++){
                    var name=event.data[m]
                    var model=window.myResourceLoader.getModel(name);
                    if(model&&model.pack) window.mySend(model.pack);
                }
            }
        }
    };

    rtConnection.onerror = function () {
        rtConnection.link=false;
        console.log("error, disconnect to other peers");
        clearInterval(rtcInterval);
    };

    rtConnection.onclose = function () {
        rtConnection.link=false;
        console.log("Close the connection");
        clearInterval(rtcInterval);
    };
    rtConnection.openOrJoin(sceneName);
}

function requestModelPackage(visibleList, type) {//检测可视列表中哪些已经在场景中了，只加载不再场景中的//获取模型资源
    let packSize = 0;
    let postData = "";
    let tempModelArr = visibleList.split('/');
    for (let i = 0; i < tempModelArr.length - 1; i++) {
        if (ModelHasBeenLoaded.indexOf(tempModelArr[i]) === -1) {
            postData += tempModelArr[i] + '/';
            packSize++;
        }
        if (packSize >= NUM_PACKAGE || i === tempModelArr.length - 2) {
            if (postData.length !== 0) {
                requestModelPackageByHttp(postData, type);
                packSize = 0;
                postData = "";
            }
        }
    }
}

//通过http请求获取模型数据包
function requestModelPackageByHttp(visibleList, type) {
    if(window.rtConnection&&window.rtConnection.link)
        window.rtConnection.send(visibleList.split('/'))//要处理好P2P还未被建立时怎么办
    else window.list.push(visibleList.split('/'))

    if(typeof(onlyP2P)!=="undefined")return;
    var oReq = new XMLHttpRequest();
    oReq.open("POST", `http://${assetHost}:${assetPort}`, true);
    oReq.responseType = "arraybuffer";

    oReq.onload = function (oEvent) {
        //console.log(oReq.response)
        let data = new Uint8Array(oReq.response);
        var headLength= parseInt(ab2str(data.slice(0, 10)));

        //console.log(headLength)
        // glb file length info
        let glbLengthData = ab2str(data.slice(10,10+ headLength-1));//数据包头部
        function ab2str(buf) {
            return String.fromCharCode.apply(null, new Uint8Array(buf));
        }
        //glb file
        let glbData = data.slice(10+ headLength);//数据包内容

        let glbLengthArr = glbLengthData.split('/');//将头部进行划分
        //console.log(glbLengthArr)
        let totalLength = 0;

        for (let i = 0; i < glbLengthArr.length - 1; i++) {//通过头部缺点模型个数
            if (!glbLengthArr[i])continue;//文件大小

            let buffer = glbData.slice(totalLength, totalLength + 1.0 * glbLengthArr[i]);//将内容进行划分
            reuseDataParser(buffer, i === glbLengthArr.length - 2);
            totalLength += 1.0 * glbLengthArr[i];
        }
        if(myCallback_get)myCallback_get();//myCallback_pop,myCallback_get//收到一个数据包后再请求对方发一个数据包

        endTime = performance.now();
        tempDelay = (endTime - startTime) / 1000;
        synTotalDelay += tempDelay;
        //console.log("响应间隔：" + tempDelay.toFixed(2) + "S");
        startTime = endTime;
        //type用于区分可视列表的来源，1：peer 2：服务器
        if (type === 1) {
            synTotalTimes++;
            synFromPeerTimes++;
        } else {
            synTotalTimes++;
            synFromServerTimes++;
        }
    };
    oReq.send(JSON.stringify({ 'type': 'requestdata', 'scene': sceneName, 'data': visibleList }));
}

//数据解析
function reuseDataParser(data, isLastModel) {
    //window.package.push(data)

    gltfLoader.parse(data.buffer, './', (gltf) => {
        let name = gltf.parser.json.nodes[0].name;
        if (ModelHasBeenLoaded.indexOf(name) !== -1) return;
        else ModelHasBeenLoaded.push(name);

        if(typeof(window.myResourceLoader)==="undefined"){
            if(typeof (window.pack)==="undefined")window.pack=[]
            window.pack.push([name,pack])
        }else{
            window.myResourceLoader.addPack(name,data)
        }

    });
}
function reuseDataParser2(data, isLastModel) {
    //window.package.push(data)

    gltfLoader.parse(data.buffer, './', (gltf) => {
        let name = gltf.parser.json.nodes[0].name;
        if (ModelHasBeenLoaded.indexOf(name) !== -1) return;
        else ModelHasBeenLoaded.push(name);



        //if(window.hasLoad)window.hasLoad(name)//myCallback_pop,myCallback_get

        //console.log(gltf.scenes[0].uuid)
        // console.log(`scene add new model: ${name}`);
        let geo = gltf.scene.children[0].geometry;
        // Add uvs
        geo.computeVertexNormals();

        let matrixObj = gltf.parser.json.nodes[0].matrixArrs;
        let type = name.slice(name.indexOf('=') + 1);
        var color = selectMaterialByType(type, name);

        function selectMaterialByType(type) {
            var list={
                "IfcFooting":0xFFBFFF,
                "IfcWallStandardCase":0xaeb1b3,
                "IfcSlab":0x505050,
                "IfcStair":0xa4a592,
                "IfcDoor":0x6f6f6f,
                "IfcWindow":0x9ea3ef,
                "IfcBeam":0x949584,
                "IfcCovering":0x777a6f,
                "IfcFlowSegment":0x999999,
                "IfcWall":0xbb9f7c,
                "IfcRamp":0x4d5053,
                "IfcRailing":0x4f4f4f,
                "IfcFlowTerminal":0xe9f5f8,
                "IfcBuildingElementProxy":0x6f6f6f,
                "IfcColumn":0x8a8f80,
                "IfcFlowController":0x2c2d2b,
                "IfcFlowFitting":0x93a5aa,
                "IfcPlate":0x2a4260,
                "IfcMember":0x2f2f2f,
            }
            var color0=list[type]
            if(!color0)color0=0x194354;
            return new THREE.Color(color0);
        }
        let mesh;
        if (matrixObj === undefined) {//不是实例化渲染对象
            mesh = gltf.scene.children[0];
            mesh.scale.set(sceneScale, sceneScale, sceneScale);
            mesh.name = name;
            //mesh.geometry.computeVertexNormals();
            if(typeof(all_material[type])==="undefined"){
                mesh.material = new THREE.MeshPhongMaterial({
                    color: color, side: THREE.DoubleSide, shininess: 64
                });
                all_material[type]=mesh.material;
            }else{
                mesh.material=all_material[type];
            }
            // mesh.material.color = color;
            // mesh.material.side = THREE.DoubleSide;

        } else {//是实例化渲染对象
            makeInstanced(geo, JSON.parse(matrixObj), name, type);
            function makeInstanced(geo, mtxObj, oriName, type) {
                let mtxKeys = Object.keys(mtxObj);
                let instanceCount = mtxKeys.length + 1;

                // material
                //var vert = document.getElementById('vertInstanced').textContent;
                //var frag = document.getElementById('fragInstanced').textContent;
                var vert = loadShader("../shader/vertex.vert");
                var frag = loadShader("../shader/fragment.frag");
                function loadShader(name) {
                    let xhr = new XMLHttpRequest(),
                        okStatus = document.location.protocol === "file:" ? 0 : 200;
                    xhr.open('GET', name, false);
                    xhr.overrideMimeType("text/html;charset=utf-8");//默认为utf-8
                    xhr.send(null);
                    return xhr.status === okStatus ? xhr.responseText : null;
                }
                var material = new THREE.RawShaderMaterial({
                    vertexShader: vert,
                    fragmentShader: frag
                });
                // geometry
                var igeo = new THREE.InstancedBufferGeometry();
                //geo.computeVertexNormals();
                var vertices = geo.attributes.position.clone();
                //var normal=geo.attributes.normal.clone();
                igeo.addAttribute('position', vertices);
                //igeo.addAttribute('normal', normal);
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
                }
                igeo.addAttribute('color', colors);

                // mesh
                mesh = new THREE.Mesh(igeo, material);
                mesh.scale.set(sceneScale, sceneScale, sceneScale);
                mesh.material.side = THREE.DoubleSide;
                mesh.frustumCulled = false;
                mesh.name = oriName;
            }
        }
        setTimeout(function () {
            sceneRoot.add(mesh);

            if(typeof(window.myResourceLoader)==="undefined"){
                if(typeof (window.sceneMesh)==="undefined")window.sceneMesh=[]
                window.sceneMesh.push([name,mesh])
            }else{
                window.myResourceLoader.addMesh(name,mesh)
            }

        },window.getTime())

        //初始加载时间
        if (!scenetLoadDone && isLastModel) {
            initialTime = (performance.now() - sceneStartTime) / 1000;
            document.getElementById("sceneLoadTime").innerText = initialTime.toFixed(2) + "秒";
            //$("#sceneLoadTime")[0].innerText = initialTime.toFixed(2) + "秒";
            scenetLoadDone = true;
        }
    });
}
window.reuseDataParser=reuseDataParser2;
