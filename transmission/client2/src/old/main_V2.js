    let scene, camera, renderer, controls, sceneRoot;
    let container;
	let light, lightObj;
    let vertShaderText, fragShaderText;
    let startTime;
    let bufferArr = [];
    const host = '127.0.0.1';

    let parseDataWorker = new Worker('src/parseDataWorker.js');

    let loader = new THREE.GLTFLoader();
    THREE.DRACOLoader.setDecoderPath('./lib/draco/');
    THREE.DRACOLoader.setDecoderConfig({type: 'js'});
    loader.setDRACOLoader(new THREE.DRACOLoader());

    zip.workerScriptsPath = "./lib/zip/";
	let mainDataPath = "./mergeGlb/newModel/"

    startTime = performance.now();

    init();
    initMesh();
    animate();


    function init() {
        scene = new THREE.Scene();
        scene.background = new THREE.Color(0xaaaaaa);
        camera = new THREE.PerspectiveCamera(
            70, window.innerWidth / window.innerHeight, 0.001, 1000000
        );
        camera.position.set(13, 12, 101);
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
		controls.target.set(16, 6, -61);
        controls.saveState();

        scene.add(new THREE.AmbientLight(0xffffff, 0.8));
		
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
            -1,0,0,0,
            0,0,1,0,
            0,1,0,0,
            0,0,0,1
        ));
        scene.add(sceneRoot);
    }

	function generatePromise(path,type){
		return new Promise(function(resolve){
			loader.load(path,(gltf)=>{
				let mesh = gltf.scene.children[0];
				mesh.geometry.computeVertexNormals();
				mesh.material.color = selectMaterialByType(type);
				console.log(gltf.scene.children);
				mesh.scale.set(0.001,0.001,0.001);
				sceneRoot.add(mesh);
				resolve();
			})
		});
	}
	

    function initMesh() {
		Promise.all([
			generatePromise(mainDataPath+"ifcBeam-processed.glb","IfcBeam"),
			generatePromise(mainDataPath+"ifcBuildingElementProxy-processed.glb","IfcBuildingElementProxy"),
			generatePromise(mainDataPath+"ifcColumn-processed.glb","IfcColumn"),
			generatePromise(mainDataPath+"ifcCovering-processed.glb","IfcCovering"),
			generatePromise(mainDataPath+"ifcDoor-processed.glb","IfcDoor"),
			generatePromise(mainDataPath+"ifcFlowFitting-processed.glb","IfcFlowFitting"),
			generatePromise(mainDataPath+"ifcFlowSegment-processed.glb","IfcFlowSegment"),
			generatePromise(mainDataPath+"ifcRailing-processed.glb","IfcRailing"),
			generatePromise(mainDataPath+"ifcSlab-processed.glb","IfcSlab"),
			generatePromise(mainDataPath+"ifcStairFlight-processed.glb","IfcStairFlight"),
			generatePromise(mainDataPath+"ifcWallStandardCase-processed.glb","IfcWallStandardCase"),
			generatePromise(mainDataPath+"ifcWindow-processed.glb","IfcWindow")
		]).then(function(){
			console.log("load model complete");	
			$("#loadTime")[0].innerText = ((performance.now() - startTime) / 1000).toFixed(2) + "秒";
		});
		       
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
	
    function animate() {
        requestAnimationFrame(animate);
		updateLight();       
        renderer.render(scene, camera);
        controls.update();
		$("#triNum")[0].innerText = renderer.info.render.triangles;
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