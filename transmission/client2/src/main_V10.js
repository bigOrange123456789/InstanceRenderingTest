var myCallback_pop,myCallback_get;

let all_material={}

if(typeof(sceneName)==="undefined")sceneName = "cgm";
let userID = Math.random().toString().substring(2, 12) + Date.now().toString().substring(1, 6);

let container, light, lightObj;
let ws, interval;

const webService = "Lcrs";
const mWebClientExchangeCode = 4000;
const sliceLength = 1000, synFreq = 500;
const NUM_PACKAGE = 100;
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

let rtConnectionReady = false;
let rtConnection, rtcInterval;
const rtcShareFreq = 3000;
let cubeView;
window.package=[]
var sceneRoot;
init();

function init() {
    var myMain=new Main();
    myMain.start({ambient:false})

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
    if(haveP2P)rtConnection.openOrJoin(sceneName);

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
    rtConnection = new RTCMultiConnection();
    //"http://localhost:9001/
    //rtConnection.socketURL = 'https://localhost:9001/';//
    //rtConnection.socketURL = 'http://'+p2pHost+':'+p2pPort+'/';//'https://rtcmulticonnection.herokuapp.com:443/';//
    rtConnection.socketURL = 'https://rtcmulticonnection.herokuapp.com:443/';//
    rtConnection.enableFileSharing = true; // by default, it is "false".
    rtConnection.session = {
        data: true
    };
    rtConnection.onmessage = function (event) {
        //new Uint8Array(ary);
        var package000=new Uint8Array(event.data)
        console.log("收到P2P数据:",package000)
        reuseDataParser(package000, 0);
    };

    rtConnection.onopen = function () {//接收
        console.log("Open the connection");
        rtConnectionReady = true;
        rtcInterval = setInterval(() => {
            if(window.package.length>1){
                var package00=window.package[
                    Math.floor(Math.random()*window.package.length)
                    ];
                var send000=Array.from(package00)
                console.log("发送P2P数据",send000)
                rtConnection.send(send000);
            }
        }, 50);//rtcShareFreq);

    };

    rtConnection.onerror = function () {
        console.log("error, disconnect to other peers");
        clearInterval(rtcInterval);
    };

    rtConnection.onclose = function () {
        console.log("Close the connection");
        rtConnectionReady = false;
        clearInterval(rtcInterval);
    };
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
    window.package.push(data)
    gltfLoader.parse(data.buffer, './', (gltf) => {
        let name = gltf.parser.json.nodes[0].name;
        //if(window.hasLoad)window.hasLoad(name)//myCallback_pop,myCallback_get
        if (ModelHasBeenLoaded.indexOf(name) !== -1)
            return;
        //console.log(gltf.scenes[0].uuid)
        // console.log(`scene add new model: ${name}`);
        let geo = gltf.scene.children[0].geometry;
        // Add uvs
        assignBufferUVs(geo);
        let matrixObj = gltf.parser.json.nodes[0].matrixArrs;
        let type = name.slice(name.indexOf('=') + 1);
        if (matrixObj == undefined) {
            let mesh = gltf.scene.children[0];
            mesh.scale.set(sceneScale, sceneScale, sceneScale);
            mesh.name = name;
            mesh.geometry.computeVertexNormals();
            //let color = selectMaterialByType(type, name);
            // let texture = selectTextureByType(type,sceneScale);
            //mesh.material = new THREE.MeshPhongMaterial({color: color, side: THREE.DoubleSide, shininess: 64});
            if(typeof(all_material[type])==="undefined"){
                var color = selectMaterialByType(type, name);
                mesh.material = new THREE.MeshPhongMaterial({
                    color: color, side: THREE.DoubleSide, shininess: 64
                });
                all_material[type]=mesh.material;
            }else{
                mesh.material=all_material[type];
            }
            // mesh.material.color = color;
            // mesh.material.side = THREE.DoubleSide;
            setTimeout(function () {
                sceneRoot.add(mesh);
            },window.getTime())
            ModelHasBeenLoaded.push(mesh.name);
        } else {
            setTimeout(function () {
                //源文件，
                //Reusability
                var reusability=window.myResourceLoader.addInstancedObj(name);
                //console.log(name+"reusability："+reusability)
                if(reusability===1)//第一次需要创建
                    makeInstanced(geo, JSON.parse(matrixObj), name, type);
            },window.getTime())
        }

        //初始加载时间
        if (!scenetLoadDone && isLastModel) {
            initialTime = (performance.now() - sceneStartTime) / 1000;
            document.getElementById("sceneLoadTime").innerText = initialTime.toFixed(2) + "秒";
            //$("#sceneLoadTime")[0].innerText = initialTime.toFixed(2) + "秒";
            scenetLoadDone = true;
        }

        //first model
        // if(!firstComponent){
        //     firstComponent = true;
        //     $("#firstModelLoadTime")[0].innerText = ((performance.now() - startTime) / 1000).toFixed(2) + "秒";
        // }
    });
}

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

    let color = selectMaterialByType(type);
    var material = new THREE.RawShaderMaterial({
        vertexShader: vert,
        fragmentShader: frag
    });
    // geometry
    var igeo = new THREE.InstancedBufferGeometry();
    geo.computeVertexNormals();
    var vertices = geo.attributes.position.clone();
    var normal=geo.attributes.normal.clone();
    igeo.addAttribute('position', vertices);
    igeo.addAttribute('normal', normal);
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
    var mesh = new THREE.Mesh(igeo, material);
    mesh.scale.set(sceneScale, sceneScale, sceneScale);
    mesh.material.side = THREE.DoubleSide;
    mesh.frustumCulled = false;
    mesh.name = oriName;
    sceneRoot.add(mesh);
    ModelHasBeenLoaded.push(mesh.name);
}

function selectMaterialByType(type, name) {
    let color = new THREE.Color(0xaaaaaa);
    switch (type) {
        case "IfcFooting":
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
            color = new THREE.Color(0xe9f5f8);
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
        case "IfcFooting":
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
