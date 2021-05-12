// (function() {
//
// })();
let scene, camera, renderer, controls;
let container;
let vertShaderText, fragShaderText;
let matrixMap = new Map();

let parseDataWorker = new Worker('src/parseDataWorker.js');

let loader = new THREE.GLTFLoader();
THREE.DRACOLoader.setDecoderPath('./lib/draco/');
THREE.DRACOLoader.setDecoderConfig({type: 'js'});
loader.setDRACOLoader(new THREE.DRACOLoader());
// let loader = new THREE.OBJLoader();

zip.workerScriptsPath = "./lib/zip/";

init();
// initMesh();
animate();

function init() {
    scene = new THREE.Scene();
    scene.background = new THREE.Color(0xaaaaaa);
    camera = new THREE.PerspectiveCamera(
        70, window.innerWidth / window.innerHeight, 0.001, 1000000
    );
    camera.position.set(0, 0, 60);
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
    scene.add(new THREE.AmbientLight(0xffffff, 0.8));
}


function initMesh() {
    // $.get('src/vertInstanced.glsl', (data) => {
    //     vertShaderText = data
    // });
    // $.get('src/fragInstanced.glsl', (data) => {
    //     fragShaderText = data
    // });
    loader.load('asset/174=IfcSlab.glb', (gltf) => {
        console.log(gltf);
        // let mesh = gltf.scene.children[0];
        // console.log(gltf.scene.children);
        // mesh.scale.set(0.001,0.001,0.001);
        // scene.add(mesh);

        // let geometry = gltf.scene.children[0].geometry;
        // geometry = geometry.toNonIndexed();
        // geometry.computeBoundingBox();
        // makeInstanced(geometry);
    });
}


function makeInstanced(geo, mtxArr) {
    let instanceCount = mtxArr.length+1;
    // material
    var vert = document.getElementById('vertInstanced').textContent;
    var frag = document.getElementById('fragInstanced').textContent;
    var material = new THREE.RawShaderMaterial({
        vertexShader: vert,
        fragmentShader: frag,
    });
    material.side = THREE.DoubleSide;
    // geometry
    var igeo = new THREE.InstancedBufferGeometry();

    var vertices = geo.attributes.position.clone();
    igeo.addAttribute('position', vertices);
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

    //setXYZ(i,x,y,z)
    mcol0.setXYZ(0, 1, 0, 0);
    mcol1.setXYZ(0, 0, 1, 0);
    mcol2.setXYZ(0, 0, 0, 1);
    mcol3.setXYZ(0, 0, 0, 0);
    for (let i = 1, ul = instanceCount; i < ul; i++) {
        let mtxElements = mtxArr[i-1];
        // var object = new THREE.Object3D();
        // objectCount++;
        // object.applyMatrix(matrix);
        // pickingData[i + 1] = object;
        mcol0.setXYZ(i, mtxElements[0], mtxElements[1], mtxElements[2]);
        mcol1.setXYZ(i, mtxElements[4], mtxElements[5], mtxElements[6]);
        mcol2.setXYZ(i, mtxElements[8], mtxElements[9], mtxElements[10]);
        mcol3.setXYZ(i, mtxElements[12], mtxElements[13], mtxElements[14]);
    }
    igeo.addAttribute('mcol0', mcol0);
    igeo.addAttribute('mcol1', mcol1);
    igeo.addAttribute('mcol2', mcol2);
    igeo.addAttribute('mcol3', mcol3);
    var randCol = function () {
        return Math.random();
    };
    var colors = new THREE.InstancedBufferAttribute(
        new Float32Array(instanceCount * 3), 3
    );
    for (var i = 0, ul = colors.count; i < ul; i++) {
        colors.setXYZ(i, randCol(), randCol(), randCol());
    }
    igeo.addAttribute('color', colors);
    // var col = new THREE.Color();
    // var pickingColors = new THREE.InstancedBufferAttribute(
    //     new Float32Array(instanceCount * 3), 3
    // );
    // for (var i = 0, ul = pickingColors.count; i < ul; i++) {
    //     col.setHex(i + 1);
    //     pickingColors.setXYZ(i, col.r, col.g, col.b);
    // }
    // igeo.addAttribute('pickingColor', pickingColors);
    // mesh
    var mesh = new THREE.Mesh(igeo, material);
    mesh.scale.set(0.001, 0.001, 0.001);
    scene.add(mesh);
}

var randomizeMatrix = function () {
    var position = new THREE.Vector3();
    var rotation = new THREE.Euler();
    var quaternion = new THREE.Quaternion();
    var scale = new THREE.Vector3();
    return function (matrix) {
        position.x = Math.random() * 1 - 0.5;
        position.y = Math.random() * 1 - 0.5;
        position.z = Math.random() * 1 - 0.5;
        rotation.x = Math.random() * 2 * Math.PI;
        rotation.y = Math.random() * 2 * Math.PI;
        rotation.z = Math.random() * 2 * Math.PI;
        quaternion.setFromEuler(rotation, false);
        scale.x = scale.y = scale.z = Math.random() * 1;
        matrix.compose(position, quaternion, scale);
    };
}();


function animate() {
    requestAnimationFrame(animate);
    renderer.render(scene, camera);
    controls.update();
}


loadMatrix();
function loadMatrix() {
    $.get('./asset/out.mtx', function (string) {
        let matrixArr = string.split(/\n/);
        for (let i = 0; i < matrixArr.length - 1; i += 2) {
            let name = matrixArr[i].split(/\s+/)[2];
            let matrix = matrixArr[i + 1].split(/\s+/);
            if (matrixMap.get(name) == undefined) {
                matrixMap.set(name, []);
            }
            matrixMap.get(name).push(matrix);
        }
        console.log(matrixMap);
    });
}


parseDataWorker.postMessage(1);
parseDataWorker.onmessage = function (event) {
    loader.parse(event.data.buffer, './', (gltf) => {
        let name = gltf.parser.json.nodes[0].name;
        // let matrixArr = JSON.parse(gltf.parser.json.nodes[0].matrixArr);
        let type = name.slice(name.indexOf('=')+1);
        let geo = gltf.scene.children[0].geometry;
        if(!matrixMap.get(name)){
            let mesh = gltf.scene.children[0];
            mesh.scale.set(0.001,0.001,0.001);
            scene.add(mesh);
        }else{
            makeInstanced(geo.toNonIndexed(), matrixMap.get(name));
        }
    });
};


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
    return String.fromCharCode.apply(null, new Uint16Array(buf));
}

/**
 * function string to arraybuffer
 * @param string
 **/
function str2ab(str) {
    var buf = new ArrayBuffer(str.length * 2); // 2 bytes for each char
    var bufView = new Uint16Array(buf);
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