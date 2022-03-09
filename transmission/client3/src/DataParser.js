export {DataParser};
class DataParser{
    ModelHasBeenLoaded;
    scenetLoadDone;
    all_material;
    constructor() {
        this.ModelHasBeenLoaded = [];
        this.scenetLoadDone = false;
        this.all_material={}
    }
    parser(data, isLastModel) {
        let sceneScale = 0.001;
        if(sceneName==="szt")sceneScale=1;

        window.package.push(data)

        var scope=this;
        let gltfLoader = new THREE.GLTFLoader();
        THREE.DRACOLoader.setDecoderPath('../lib/draco/');
        THREE.DRACOLoader.setDecoderConfig({ type: 'js' });
        gltfLoader.setDRACOLoader(new THREE.DRACOLoader());

        gltfLoader.parse(data.buffer, './', (gltf) => {
            let name = gltf.parser.json.nodes[0].name;
            //if(window.hasLoad)window.hasLoad(name)//myCallback_pop,myCallback_get
            if (this.ModelHasBeenLoaded.indexOf(name) !== -1)
                return;
            //console.log(gltf.scenes[0].uuid)
            // console.log(`scene add new model: ${name}`);
            let geo = gltf.scene.children[0].geometry;
            // Add uvs
            assignBufferUVs(geo);
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

            if (matrixObj === undefined) {//不是实例化渲染对象
                let mesh = gltf.scene.children[0];
                mesh.scale.set(sceneScale, sceneScale, sceneScale);
                mesh.name = name;
                mesh.geometry.computeVertexNormals();
                if(typeof(scope.all_material[type])==="undefined"){
                    mesh.material = new THREE.MeshPhongMaterial({
                        color: color, side: THREE.DoubleSide, shininess: 64
                    });
                    scope.all_material[type]=mesh.material;
                }else{
                    mesh.material=scope.all_material[type];
                }
                // mesh.material.color = color;
                // mesh.material.side = THREE.DoubleSide;
                setTimeout(function () {
                    window.root.add(mesh)//sceneRoot.add(mesh);
                },window.getTime())
                this.ModelHasBeenLoaded.push(mesh.name);
            } else {//是实例化渲染对象
                setTimeout(function () {
                    //源文件，
                    //Reusability
                    var reusability=window.myResourceLoader.addInstancedObj(name);
                    //console.log(name+"reusability："+reusability)
                    if(reusability===1)//第一次需要创建
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
                        window.root.add(mesh)//sceneRoot.add(mesh);
                        scope.ModelHasBeenLoaded.push(mesh.name);
                    }
                },window.getTime())
            }

            //初始加载时间
            if (!scope.scenetLoadDone && scope.isLastModel) {
                initialTime = (performance.now() - sceneStartTime) / 1000;
                document.getElementById("sceneLoadTime").innerText = initialTime.toFixed(2) + "秒";
                //$("#sceneLoadTime")[0].innerText = initialTime.toFixed(2) + "秒";
                scope.scenetLoadDone = true;
            }
        });
    }
}
