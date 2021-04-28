let sceneName = "newModel";
let firstLoadPack = "";
let totalNum = 250;
let packPerNum = 30;
let componentIndex = 1;
let packIndex = 1;
let storeFlag = false;
let componentDataArr = [];

let scene, camera, renderer, controls, sceneRoot;
let stats;
let light, lightObj;
let container;
let vertShaderText, fragShaderText;
let startTime;
let bufferArr = [];
let ws;
// const host = '106.15.190.126';
// const host = '192.168.1.108';
const host = '127.0.0.1';
const port = 8081;
const webService = "Lcrs";
const mWebClientExchangeCode = 4000;
let current_visible_list = [], total_visible_list = [];
let initDoneFlag = false;
let parseDataWorker = new Worker('src/parseDataWorker.js');

let radianceWidth = Math.floor(window.innerWidth/2), radianceHeight = Math.floor(window.innerHeight/2);
let cameraForward = new THREE.Vector3();

let gltfLoader = new THREE.GLTFLoader();
THREE.DRACOLoader.setDecoderPath('./lib/draco/');
THREE.DRACOLoader.setDecoderConfig({type: 'js'});
gltfLoader.setDRACOLoader(new THREE.DRACOLoader());

zip.workerScriptsPath = "./lib/zip/";
startTime = performance.now();
let objLoader = new THREE.OBJLoader();

let jsonLoader = new THREE.ObjectLoader();

init();
// initMesh();
animate();


function init() {
    scene = new THREE.Scene();
    scene.background = new THREE.Color(0xaaaaaa);
    camera = new THREE.PerspectiveCamera(
        70, window.innerWidth / window.innerHeight, 0.3, 1000
    );
    //camera.position.set(13, 12, 101);//newModel
    //camera.position.set(-2, 38, -70);//hyModel
    //camera.position.set(-112, 59, 140);//cgm
	//camera.position.set(61, 36, 98);//szt
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
    //controls.target.set(-3, 40, 2);//hyModel
    //controls.target.set(11, -61, 3);//cgm
	//controls.target.set(-28, 24, 10);//szt
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
        setInterval(syncClientDataToServer,1500);
    };
    ws.onmessage = function (msg) {
        var headerReader = new FileReader();
        headerReader.onload = function (e) {
            console.log(e.target.result);
            //get the buffer
            let arr = new Uint8Array(e.target.result);
            sendData("hhhhhhhhhhhhhhhhh");
            sendData(arr);

            //glb file length info
            let glbLengthData = ab2str(arr.slice(0, 300));
            //glb file
            let glbData = arr.slice(300);
            //console.log(glbData);

            let glbLengthArr = glbLengthData.split('/');
            let totalLength = 0;
            for (let i = 0; i < glbLengthArr.length - 3; i++) {
                if (!glbLengthArr[i])
                    continue;
                reuseDataParser(glbData.slice(totalLength, totalLength + 1.0 * glbLengthArr[i]));
                totalLength += 1.0 * glbLengthArr[i];
            }
            initDoneFlag = true;
        };
        headerReader.readAsArrayBuffer(msg.data);


        // /**
        //  *  load component by package
        //  **/
        // var headerReader = new FileReader();
        // headerReader.onload = function (e) {
        //     //get the buffer
        //     let arr = new Uint8Array(e.target.result);
        //
        //     //glb file length info
        //     let glbLengthData = ab2str(arr.slice(0, 50));
        //     //glb file
        //     let glbData = arr.slice(50);
        //     console.log(glbData);
        //
        //     let glbLengthArr = glbLengthData.split('/');
        //     let totalLength = 0;
        //     for (let i = 0; i < glbLengthArr.length - 3; i++) {
        //         if (!glbLengthArr[i])
        //             continue;
        //         unReuseDataParser(glbData.slice(totalLength, totalLength + 1.0 * glbLengthArr[i]));
        //         totalLength += 1.0 * glbLengthArr[i];
        //     }
        //     initDoneFlag = true;
        // };
        // headerReader.readAsArrayBuffer(msg.data);

        /**
         *  load component one by one
         **/
        // var headerReader = new FileReader();
        // headerReader.onload = function (e) {
        //     console.log(e.target.result);
        //     getSceneData(e.target.result);
        // };
        // headerReader.readAsText(msg.data);
    };
    ws.onclose = function (msg) {
        console.log(msg);
        console.log("close,try reconnect");
        // initWebsocketNetwork();
    };
    ws.onerror = function (msg) {
        console.log("error!");
        console.log(msg);
    };
}


function reuseDataParser(data) {
    gltfLoader.parse(data.buffer, './', (gltf) => {
        console.log(gltf);
        let name = gltf.parser.json.nodes[0].name;
        if (sceneRoot.getObjectByName(name))
            return;
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
        $("#loadTime")[0].innerText = ((performance.now() - startTime) / 1000).toFixed(2) + "秒";
    });
}


function unReuseDataParser(data) {
    gltfLoader.parse(data.buffer, './', (gltf) => {
        let mesh = gltf.scene.children[0];
        mesh.material.side = THREE.DoubleSide;
        // mesh.scale.set(0.001, 0.001, 0.001);
        sceneRoot.add(mesh);
        $("#loadTime")[0].innerText = ((performance.now() - startTime) / 1000).toFixed(2) + "秒";
    });
}


function getSceneData(string) {
    // string = string.replace(/\n\u0000/, '');
    let componentNames = string.split('/');
    console.log("构件数：" + componentNames.length);
    for (let i = 0; i < componentNames.length - 1; i++) {
        if (!componentNames[i])
            continue;
        if (scene.getObjectByName(componentNames[i]))
            continue;
        gltfLoader.load(`./glb/${componentNames[i]}.glb`, function (gltf) {
            let mesh = gltf.scene.children[0];
            mesh.scale.set(0.001, 0.001, 0.001);
            sceneRoot.add(mesh);
        });
        // objLoader.load(`./obj/${componentNames[i]}.obj`, function (obj) {
        //     obj.name = componentNames[i];
        //     obj.scale.set(0.001, 0.001, 0.001);
        //     scene.add(obj);
        // });
    }
    initDoneFlag = true;
}


function sliceBlob(blob, start, end, type) {
    type = type || blob.type;

    if (end !== undefined) {
        return blob.slice(start, end, type);
    }
    else {
        return blob.slice(start);
    }
}


function packHeader() {
    return radianceWidth * mWebClientExchangeCode + radianceHeight;
}

function syncClientDataToServer() {
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


function synViewport() {
    if (initDoneFlag) {
        if (camera.position.clone().sub(controls.position0).length() > 15 ||
            controls.target.clone().sub(controls.target0).length() > 15) {
            console.log("send data");
            //initDoneFlag = false;
            syncClientDataToServer();
            controls.saveState();
        }
    }
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


// loadData();
function loadData() {
    var zipFs = new zip.fs.FS();

    function onerror(message) {
        console.error(message);
    }

    zipFs.importHttpContent('./asset/pack.zip', false, function () {
        console.log('unzip finish');
        let entries = zipFs.root.children;
        entries.forEach(function (item) {
            new Promise(function (resolve, reject) {
                resolve(item);
            }).then((entry) => {
                entry.getText(function (data) {
                    console.log(str2ab(data));
                });
            });
            // new Promise(function (resolve,reject) {
            //     item.getText(function (data) {
            //         console.log(data);
            //     });
            //     resolve();
            // });
        });

        // entries.forEach(function (item) {
        //     // console.log(item.name);
        //     item.getText(function (data) {
        //         console.log(data);
        //     });
        //     // new Promise(function (resolve,reject) {
        //     //     resolve(item);
        //     // }).then(function (entry) {
        //     //     entry.getBlob('application/octet-stream', function (data) {
        //     //         let arrayBuffer;
        //     //         let name = entry.name;
        //     //         let fileReader = new FileReader();
        //     //         fileReader.onload = function (event) {
        //     //             arrayBuffer = event.target.result;
        //     //         };
        //     //         fileReader.onloadend = function (event) {
        //     //             console.log(name,arrayBuffer);
        //     //             // loader.parse(arrayBuffer, './', (gltf) => {
        //     //             //     let mesh = gltf.scene.children[0];
        //     //             //     mesh.scale.set(0.1, 0.1, 0.1);
        //     //             //     scene.add(mesh);
        //     //             // });
        //     //         };
        //     //         fileReader.readAsArrayBuffer(data);
        //     //     });
        //     // });
        // });

        // var firstEntry = zipFs.root.children[0];
        // console.log(firstEntry);
        // console.log(zipFs.root.children.length);
        // firstEntry.getBlob('application/octet-stream', function (data) {
        //
        // });
    }, onerror);
}


/**
 * function arraybuffer to string
 * @param arraybuffer
 **/
function ab2str(buf) {
    return String.fromCharCode.apply(null, new Uint8Array(buf));
}

/**
 * function string to arraybuffer
 * @param string
 **/
function str2ab(str) {
    var buf = new ArrayBuffer(str.length * 2); // 2 bytes for each char
    var bufView = new Uint8Array(buf);
    for (var i = 0, strLen = str.length; i < strLen; i++) {
        bufView[i] = str.charCodeAt(i);
    }
    return buf;
}

function blob2ab(data) {
    //     var arrayBuffer;
    //     var fileReader = new FileReader();
    //     fileReader.onload = function (event) {
    //         arrayBuffer = event.target.result;
    //     };
    //     fileReader.onloadend = function (event) {
    //         return arrayBuffer;
    //     };
    //     fileReader.readAsArrayBuffer(data);
}

function testLocalStorage() {
    if (!window.localStorage) {
        console.log('当前浏览器不支持localStorage!')
    }
    var test = '0123456789';
    var add = function (num) {
        num += num;
        if (num.length == 10240) {
            test = num;
            return;
        }
        add(num);
    };
    add(test);
    var sum = test;
    var show = setInterval(function () {
        sum += test;
        try {
            window.localStorage.removeItem('test');
            window.localStorage.setItem('test', sum);
            console.log(sum.length / 1024 + 'KB');
        } catch (e) {
            console.log(sum.length / 1024 + 'KB超出最大限制');
            clearInterval(show);
        }
    }, 0.1);
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

function assignUVs2(geometry, scale = 1.0) {
    geometry.faceVertexUvs[0] = [];

    geometry.faces.forEach(function (face) {
        var uvs = [];
        var ids = ['a', 'b', 'c'];
        for (var i = 0; i < ids.length; i++) {
            var vertex = geometry.vertices[face[ids[i]]].clone();

            var n = vertex.normalize();
            var yaw = .5 - Math.atan(n.z, -n.x) / (2.0 * Math.PI);
            var pitch = .5 - Math.asin(n.y) / Math.PI;

            var u = yaw,
                v = pitch;
            uvs.push(new THREE.Vector2(u, v).multiplyScalar(scale));
        }
        geometry.faceVertexUvs[0].push(uvs);
    });
    geometry.uvsNeedUpdate = true;
}

/****************************************************************************
 * Initial setup
 ****************************************************************************/

// var configuration = {
//   'iceServers': [{
//     'urls': 'stun:stun.l.google.com:19302'
//   }]
// };

var configuration = null;

// Create a random room if not already present in the URL.
var isInitiator;
var room = window.location.hash.substring(1);
if (!room) {
    room = window.location.hash = randomToken();
}


/****************************************************************************
 * Signaling server
 ****************************************************************************/

var connectionFlag = false;//是否存在可传输的peer
// Connect to the signaling server
var socket = io.connect();

socket.on('ipaddr', function(ipaddr) {
    console.log('Server IP address is: ' + ipaddr);
    // updateRoomURL(ipaddr);
});

socket.on('created', function(room, clientId) {
    console.log('Created room', room, '- my client ID is', clientId);
    isInitiator = true;
    // grabWebCamVideo();
});

socket.on('joined', function(room, clientId) {
    console.log('This peer has joined room', room, 'with client ID', clientId);
    isInitiator = false;
    createPeerConnection(isInitiator, configuration);
});

socket.on('full', function(room) {
    alert('Room ' + room + ' is full. We will create a new room for you.');
    window.location.hash = '';
    window.location.reload();
});

socket.on('ready', function() {
    console.log('Socket is ready');
    createPeerConnection(isInitiator, configuration);
});

socket.on('log', function(array) {
    console.log.apply(console, array);
});

socket.on('message', function(message) {
    console.log('Client received message:', message);
    signalingMessageCallback(message);
});

// Joining a room.
socket.emit('create or join', room);

if (location.hostname.match(/localhost|127\.0\.0/)) {
    socket.emit('ipaddr');
}

// Leaving rooms and disconnecting from peers.
socket.on('disconnect', function(reason) {
    console.log(`Disconnected: ${reason}.`);
    connectionFlag = false;
    // sendBtn.disabled = true;
    // snapAndSendBtn.disabled = true;
});


socket.on('bye', function(room) {
    console.log(`Peer leaving room ${room}.`);
    connectionFlag = false;
    // sendBtn.disabled = true;
    // snapAndSendBtn.disabled = true;
    // If peer did not create the room, re-enter to be creator.
    if (!isInitiator) {
        window.location.reload();
    }
});

window.addEventListener('unload', function() {
    console.log(`Unloading window. Notifying peers in ${room}.`);
    socket.emit('bye', room);
});


/**
 * Send message to signaling server
 */
function sendMessage(message) {
    console.log('Client sending message: ', message);
    socket.emit('message', message);
}


/**
 * Updates URL on the page so that users can copy&paste it to their peers.
 */
// function updateRoomURL(ipaddr) {
//   var url;
//   if (!ipaddr) {
//     url = location.href;
//   } else {
//     url = location.protocol + '//' + ipaddr + ':2013/#' + room;
//   }
//   roomURL.innerHTML = url;
// }


/****************************************************************************
 * WebRTC peer connection and data channel
 ****************************************************************************/

var peerConn;
var dataChannel;

function signalingMessageCallback(message) {
    if (message.type === 'offer') {
        console.log('Got offer. Sending answer to peer.');
        peerConn.setRemoteDescription(new RTCSessionDescription(message), function() {},
            logError);
        peerConn.createAnswer(onLocalSessionCreated, logError);

    } else if (message.type === 'answer') {
        console.log('Got answer.');
        peerConn.setRemoteDescription(new RTCSessionDescription(message), function() {},
            logError);

    } else if (message.type === 'candidate') {
        peerConn.addIceCandidate(new RTCIceCandidate({
            candidate: message.candidate
        }));
    }
}


function createPeerConnection(isInitiator, config) {
    console.log('Creating Peer connection as initiator?', isInitiator, 'config:',
        config);
    peerConn = new RTCPeerConnection(config);

// send any ice candidates to the other peer
    peerConn.onicecandidate = function(event) {
        console.log('icecandidate event:', event);
        if (event.candidate) {
            sendMessage({
                type: 'candidate',
                label: event.candidate.sdpMLineIndex,
                id: event.candidate.sdpMid,
                candidate: event.candidate.candidate
            });
        } else {
            console.log('End of candidates.');
        }
    };

    if (isInitiator) {
        console.log('Creating Data Channel');
        dataChannel = peerConn.createDataChannel('photos');
        onDataChannelCreated(dataChannel);

        console.log('Creating an offer');
        peerConn.createOffer(onLocalSessionCreated, logError);
    } else {
        peerConn.ondatachannel = function(event) {
            console.log('ondatachannel:', event.channel);
            dataChannel = event.channel;
            onDataChannelCreated(dataChannel);
        };
    }
}

function onLocalSessionCreated(desc) {
    console.log('local session created:', desc);
    peerConn.setLocalDescription(desc, function() {
        console.log('sending local desc:', peerConn.localDescription);
        sendMessage(peerConn.localDescription);
    }, logError);
}

function onDataChannelCreated(channel) {
    console.log('onDataChannelCreated:', channel);

    channel.onopen = function() {
        console.log('CHANNEL opened!!!');
        connectionFlag = true;
        // sendBtn.disabled = false;
        // snapAndSendBtn.disabled = false;
    };

    channel.onclose = function () {
        console.log('Channel closed.');
        connectionFlag = false;
        // sendBtn.disabled = true;
        // snapAndSendBtn.disabled = true;
    };

    channel.onmessage = function (event) {
        console.log("receive data:" + event.data);
    }

    // channel.onmessage = (adapter.browserDetails.browser === 'firefox') ?
    //     receiveDataFirefoxFactory() : receiveDataChromeFactory();
}

function receiveDataChromeFactory() {
    var buf, count;

    return function onmessage(event) {
        if (typeof event.data === 'string') {
            buf = window.buf = new Uint8ClampedArray(parseInt(event.data));
            count = 0;
            console.log('Expecting a total of ' + buf.byteLength + ' bytes');
            return;
        }

        var data = new Uint8ClampedArray(event.data);
        buf.set(data, count);

        count += data.byteLength;
        console.log('count: ' + count);

        if (count === buf.byteLength) {
// we're done: all data chunks have been received
            console.log('Done. Rendering photo.');
            renderPhoto(buf);
        }
    };
}

function receiveDataFirefoxFactory() {
    var count, total, parts;

    return function onmessage(event) {
        if (typeof event.data === 'string') {
            total = parseInt(event.data);
            parts = [];
            count = 0;
            console.log('Expecting a total of ' + total + ' bytes');
            return;
        }

        parts.push(event.data);
        count += event.data.size;
        console.log('Got ' + event.data.size + ' byte(s), ' + (total - count) +
            ' to go.');

        if (count === total) {
            console.log('Assembling payload');
            var buf = new Uint8ClampedArray(total);
            var compose = function(i, pos) {
                var reader = new FileReader();
                reader.onload = function() {
                    buf.set(new Uint8ClampedArray(this.result), pos);
                    if (i + 1 === parts.length) {
                        console.log('Done. Rendering photo.');
                        renderPhoto(buf);
                    } else {
                        compose(i + 1, pos + this.result.byteLength);
                    }
                };
                reader.readAsArrayBuffer(parts[i]);
            };
            compose(0, 0);
        }
    };
}


function sendData(data) {
    if(connectionFlag)
        dataChannel.send(data);
}

function show() {
    Array.prototype.forEach.call(arguments, function(elem) {
        elem.style.display = null;
    });
}

function hide() {
    Array.prototype.forEach.call(arguments, function(elem) {
        elem.style.display = 'none';
    });
}

function randomToken() {
    return Math.floor((1 + Math.random()) * 1e16).toString(16).substring(1);
}

function logError(err) {
    if (!err) return;
    if (typeof err === 'string') {
        console.warn(err);
    } else {
        console.warn(err.toString(), err);
    }
}
