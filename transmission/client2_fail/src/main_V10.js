import {DataParser} from './DataParser.js';
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
    var userName="testUser";
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
    let rtConnectionReady = false;
    let rtcInterval;
    const rtcShareFreq = 50;
    var rtConnection = new RTCMultiConnection();
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
        DataParser.reuseDataParser(package000, 0);
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
        }, rtcShareFreq);

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
    rtConnection.openOrJoin(sceneName);
}


