let sceneName = "newModel";
let firstLoadPack = "";
let totalNum = 250;
let packPerNum = 30;
let componentIndex = 1;
let packIndex = 1;
let storeFlag = false;
let componentDataArr = [];

let scene, camera, renderer, controls, sceneRoot;
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
let current_visible_list = [], total_visible_list = [];
let initDoneFlag = false;
let parseDataWorker = new Worker('src/parseDataWorker.js');

let radianceWidth = 512, radianceHeight = 512;
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
    //camera.position.set(-56, 96, -62);
    // camera.position.set(39, 14, 102);
    camera.position.set(-27, 42, 60);
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
     controls.target.set(42, 8, -61);
    //controls.target.set(5, 37, -15);
    controls.saveState();

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

    initWebsocketNetwork();
    window.addEventListener('resize', synWindowSize, false);
}


function initMesh() {
    // $.get('src/vertInstanced.glsl', (data) => {
    //     vertShaderText = data
    // });
    // $.get('src/fragInstanced.glsl', (data) => {
    //     fragShaderText = data
    // });
    gltfLoader.load('./test/2-processed.glb', (gltf) => {
        // let mesh = gltf.scene.children[0];
        console.log(gltf);
        // mesh.scale.set(0.001, 0.001, 0.001);
        // scene.add(mesh);
        // let geometry = gltf.scene.children[0].geometry;
        // geometry = geometry.toNonIndexed();
        // geometry.computeBoundingBox();
        // makeInstanced(geometry);
    });
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
    //     new Float32Array(geo.attributes.uv.length * instanceCount), 2
    // );
    // for (let i = 0, ul = instanceCount; i < ul; i++) {
    //     uvs.set(geo.attributes.uv.array, geo.attributes.uv.length * i);
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
    // $("#triNum")[0].innerText = renderer.info.render.triangles;
    synViewport();
    renderer.render(scene, camera);
    updateLight();
    controls.update();
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


// parseDataWorker.postMessage(1);
// parseDataWorker.onmessage = function (event) {
//     gltfLoader.parse(event.data.buffer, './', (gltf) => {
//         let name = gltf.parser.json.nodes[0].name;
//         let geo = gltf.scene.children[0].geometry;
//         let matrixObj = gltf.parser.json.nodes[0].matrixArrs;
//         let color = selectMaterialByType(name.slice(name.indexOf('=') + 1));
//         if (matrixObj == undefined) {
//             let mesh = gltf.scene.children[0];
//             mesh.scale.set(0.001, 0.001, 0.001);
//             mesh.name = name + '.obj';
//             mesh.visible = false;
//             mesh.material.color = color;
//             scene.add(mesh);
//         } else {
//             makeInstanced(geo.toNonIndexed(), JSON.parse(matrixObj), name, color);
//         }
//         console.log("sss");
//     });
// };


function firstLoad() {
    if (localStorage.getItem(sceneName + packIndex)) {
        while (localStorage.getItem(sceneName + packIndex) != undefined) {
            let gltf = JSON.parse(localStorage.getItem(sceneName + packIndex));
            // console.log(gltf);

            let geo = new THREE.BufferGeometry();
            geo.addAttribute("position", new THREE.Float32BufferAttribute(new Float32Array(gltf.scene.geometries[0].data.attributes.position.array), 3));
            geo.index = new THREE.BufferAttribute(new Uint16Array(gltf.scene.geometries[0].data.index.array), 1);
            let matrixObj = gltf.parser.json.nodes[0].matrixArrs;
            let color = selectMaterialByType(name.slice(name.indexOf('=') + 1));
            geo.computeVertexNormals();

            if (matrixObj == undefined) {
                let mesh = new THREE.Mesh(geo, new THREE.MeshPhongMaterial({color: color, shininess: 64}));
                mesh.scale.set(0.001, 0.001, 0.001);
                mesh.name = name;
                mesh.material.side = THREE.DoubleSide;
                sceneRoot.add(mesh);
            } else {
                makeInstanced(geo.toNonIndexed(), JSON.parse(matrixObj), name, color);
            }
            packIndex++;
        }
    } else {
        localStorage.clear();
        syncClientDataToServer();
    }
}


function initWebsocketNetwork() {
    ws = new WebSocket("ws://" + host + ":" + port + "/" + webService);
    ws.onopen = function (event) {
        console.log("connect successfully");
        syncClientDataToServer();
    };
    ws.onmessage = function (msg) {
        var headerReader = new FileReader();
        headerReader.onload = function (e) {
            reuseDataParser(new Uint8Array(e.target.result));
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


function storeComponent() {
    console.log(componentDataArr);
    while (componentDataArr.length > 0) {
        localStorage.setItem(sceneName + packIndex, componentDataArr.pop());
        packIndex++;
    }
}


function reuseDataParser(data) {
    gltfLoader.parse(data.buffer, './', (gltf) => {
        console.log(gltf);
        let name = gltf.parser.json.nodes[0].name;
        if (sceneRoot.getObjectByName(name))
            return;
        let geo = gltf.scene.children[0].geometry;
        // assignBufferUVs(geo);
        let matrixObj = gltf.parser.json.nodes[0].matrixArrs;
        let type = name.slice(name.indexOf('=') + 1);
        if (matrixObj == undefined) {
            let mesh = gltf.scene.children[0];
            mesh.scale.set(0.001, 0.001, 0.001);
            mesh.name = name;
            let color = selectMaterialByType(type);
            // let texture = selectTextureByType(type,0.001);
            // mesh.material = new THREE.MeshPhongMaterial({color: color, side: THREE.DoubleSide, map: texture});
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
    return radianceWidth * 2000 + radianceHeight;
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
        if (camera.position.clone().sub(controls.position0).length() > 20 ||
            controls.target.clone().sub(controls.target0).length() > 10) {
            console.log("send data");
            initDoneFlag = false;
            syncClientDataToServer();
            controls.saveState();
        }
    }
}


function synWindowSize() {
    camera.aspect = window.innerWidth / window.innerHeight;
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

        // uvs.push(v1[components[0]] * scale, v1[components[1]] * scale);
        // uvs.push(v2[components[0]] * scale, v2[components[1]] * scale);
        // uvs.push(v3[components[0]] * scale, v3[components[1]] * scale);
        uvs.push(v1[components[0]], v1[components[1]]);
        uvs.push(v2[components[0]], v2[components[1]]);
        uvs.push(v3[components[0]], v3[components[1]]);
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