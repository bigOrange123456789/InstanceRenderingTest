let sceneName = "newModel";
let scene, camera, renderer, controls, sceneRoot;
let container,stats,light, lightObj;
let startTime = performance.now();
let ws,interval;
// const host = '106.15.190.126';
// const host = '192.168.1.108';
const host = '127.0.0.1',port = 8081;
// const host = '123.57.159.148',port = 8081;
const webService = "Lcrs";
const mWebClientExchangeCode = 4000;
const sliceLength = 300,synFreq = 1500;
let websocketReady = false;
let scenetLoadDone = false, firstComponent = false;

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
connection.onmessage = function (event) {
    console.log("hhhhhhh\n");
    let arr = new Uint8Array(JSON.parse(event.data));
    console.log(arr);
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
    }
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
    scene.background = new THREE.Color(0xffffff);
    camera = new THREE.PerspectiveCamera(
        70, window.innerWidth / window.innerHeight, 0.3, 1000
    );
    //camera.position.set(13, 12, 101);//newModel
    // camera.position.set(-2, 38, -70);//hyModel
    // camera.position.set(-112, 59, 140);//cgm
    // camera.position.set(61, 36, 98);//szt
    camera.position.set(0, 0, 30);

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
    //controls.target.set(16, 6, -61);//newModel
    // controls.target.set(-3, 40, 2);//hyModel
    // controls.target.set(11, -61, 3);//cgm
    // controls.target.set(-28, 24, 10);//szt
    controls.saveState();

    initStats();

    scene.add(new THREE.AmbientLight(0xffffff, 0.6));

    light = new THREE.SpotLight(0xffffff);
    light.position.set(camera.position.x, camera.position.y, camera.position.z);
    light.distance = 800;
    light.intensity = 0.8;
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

    initWebsocketNetwork();
    window.addEventListener('resize', synWindowSize, false);

    connection.openOrJoin(sceneName);
}

function initStats(){
    stats = new Stats();
    stats.setMode(0);
    document.body.appendChild(stats.domElement);
}


function makeInstanced(geo, mtxObj, oriName, type) {
    let mtxKeys = Object.keys(mtxObj);
    let instanceCount = mtxKeys.length + 1;

    // material
    var vert = document.getElementById('vertInstanced').textContent;
    var frag = document.getElementById('fragInstanced').textContent;

    let color = selectMaterialByType(type);
    let myTexture = selectTextureByType(type,0.001);

    var uniforms = {
        texture: {type: 't', value: myTexture}
    };
    var material = new THREE.RawShaderMaterial({
        uniforms: uniforms,
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
    controls.update();
    stats.update();
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
        console.log(performance.now());
        var headerReader = new FileReader();
        headerReader.onload = function (e) {
            console.log(e.target.result);
            //get the buffer
            let arr = new Uint8Array(e.target.result);

            if(connectionReady)
                connection.send(JSON.stringify(Array.from(arr)));

            // glb file length info
            let glbLengthData = ab2str(arr.slice(0, sliceLength));
            //glb file
            let glbData = arr.slice(sliceLength);
            //console.log(glbData);

            let glbLengthArr = glbLengthData.split('/');
            let totalLength = 0;

            let flag = false;
            for (let i = 0; i < glbLengthArr.length - 3; i++) {
                if (!glbLengthArr[i])
                    continue;
                if(!scenetLoadDone && glbLengthArr[glbLengthArr.length - 3]=='1' && i == glbLengthArr.length - 4)
                {
                    scenetLoadDone = true;
                    flag = true;
                }
                reuseDataParser(glbData.slice(totalLength, totalLength + 1.0 * glbLengthArr[i]), flag);
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


function reuseDataParser(data,flag) {
    gltfLoader.parse(data.buffer, './', (gltf) => {
        console.log(gltf);
        let name = gltf.parser.json.nodes[0].name;
        if (sceneRoot.getObjectByName(name))
            return;
        console.log(`scene add new model: ${name}`);
        let geo = gltf.scene.children[0].geometry;
        //assignBufferUVs(geo);
        let matrixObj = gltf.parser.json.nodes[0].matrixArrs;
        let type = name.slice(name.indexOf('=') + 1);
        if (matrixObj == undefined) {
            let mesh = gltf.scene.children[0];
            mesh.scale.set(0.001, 0.001, 0.001);
            mesh.name = name;
            let color = selectMaterialByType(type);
            //let texture = selectTextureByType(type,0.001);
            //mesh.material = new THREE.MeshPhongMaterial({color: color, side: THREE.DoubleSide, map: texture});
            mesh.material.color = color;
            mesh.material.side = THREE.DoubleSide;
            sceneRoot.add(mesh);
        } else {
            makeInstanced(geo, JSON.parse(matrixObj), name, type);
        }
        //first model
        if(!firstComponent){
            firstComponent = true;
            $("#firstModelLoadTime")[0].innerText = ((performance.now() - startTime) / 1000).toFixed(2) + "秒";
            console.log("结束!!"+performance.now());
        }
        //scene load done
        if(flag){
            $("#sceneLoadTime")[0].innerText = ((performance.now() - startTime) / 1000).toFixed(2) + "秒";
        }
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

    console.log(msg);
    ws.send(msg);
}


function synWindowSize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    radianceWidth = Math.floor(window.innerWidth/2);
    radianceHeight = Math.floor(window.innerHeight/2);
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
}

function selectMaterialByType(type) {
    let color = new THREE.Color(0xff0000);
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
            // color = new THREE.Color( 0xe9f5f8 );
            color = new THREE.Color(0xd5d5d5);
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
