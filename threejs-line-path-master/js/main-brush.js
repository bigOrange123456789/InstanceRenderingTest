'use strict'
var data = data;
console.log(data)

var container = document.getElementById('container');

var scene = new THREE.Scene();
var camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, .1, 1000);
camera.position.set(-200, 0, -220);

var renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(window.devicePixelRatio);
container.appendChild(renderer.domElement);

var controls = new THREE.OrbitControls(camera, renderer.domElement);
controls.addEventListener('change', render)

var colors = [
	0xed6a5a,
	0xf4f1bb,
	0x9bc1bc,
	0x5ca4a9,
	0xe6ebe0,
	0xf0b67f,
	0xfe5f55,
	0xd6d1b1,
	0xc7efcf,
	0xeef5db,
	0x50514f,
	0xf25f5c,
	0xffe066,
	0x247ba0,
	0x70c1b3
];

// 执行load方法，加载纹理贴图成功后，返回一个纹理对象Texture
var loader = new THREE.TextureLoader();
var strokeTexture;
loader.load('../assets/stroke.png', function (texture) {
	strokeTexture = texture;
	strokeTexture.wrapS = strokeTexture.wrapT = THREE.RepeatWrapping;
	init();
}
);

var resolution = new THREE.Vector2(window.innerWidth, window.innerHeight);
var graph = new THREE.Object3D();
scene.add(graph);

function makeLine(geo, c) {

	var g = new MeshLine();
	g.setGeometry(geo);

	var material = new MeshLineMaterial({
		useMap: true,
		map: strokeTexture,
		color: new THREE.Color(colors[c]),
		opacity: 1,
		resolution: resolution,
		sizeAttenuation: true,
		lineWidth: 5,
		depthTest: false,
		blending: THREE.NormalBlending,
		transparent: true,
		repeat: new THREE.Vector2( 1,2 )
	});
	var mesh = new THREE.Mesh(g.geometry, material);
	graph.add(mesh);

}

function init() {

	createLines();
	createLines2()
	render()
}

function createLines2() {

	var group = new THREE.Group();
	for (let i = 0; i < data.lines.length; i++) {
		var geometry = new THREE.Geometry(); // 声明一个几何体对象Geometry
		for (let j = 0; j < data.lines[i].positions.length; j++) {
			geometry.vertices.push(new THREE.Vector3(data.lines[i].positions[j].x * 100, data.lines[i].positions[j].y * 100, data.lines[i].positions[j].z * 100))

		}

		if (data.lines[i].positions.length > 1) {

			var g = new MeshLine();
			g.setGeometry(geometry);

			var material = new MeshLineMaterial({
				useMap: true,
				map: strokeTexture,
				color: `rgb(${Math.floor(data.lines[i].color.r * 255)}, ${Math.floor(data.lines[i].color.g * 255)}, ${Math.floor(data.lines[i].color.b * 255)})`,
				opacity: data.lines[i].color.a.toFixed(2),
				// lineWidth: Math.floor(data.lines[i].width * 1000),
				// opacity: 1,
				resolution: resolution,
				sizeAttenuation: true,
				depthTest: false,
				blending: THREE.NormalBlending,
				transparent: true,
				// repeat: new THREE.Vector2( 1,2 ) // 两条线
			});
			var mesh = new THREE.Mesh(g.geometry, material);
			graph.add(mesh);
		}
	}
	scene.add(group)
}

function createLines() {

	var line = new Float32Array(600);
	for (var j = 0; j < 200 * 3; j += 3) {
		line[j] = -30 + .1 * j;
		line[j + 1] = 5 * Math.sin(.01 * j);
		line[j + 2] = -20;
	}
	makeLine(line, 0);

}

onWindowResize();

function onWindowResize() {

	var w = container.clientWidth;
	var h = container.clientHeight;

	camera.aspect = w / h;
	camera.updateProjectionMatrix();

	renderer.setSize(w, h);

	resolution.set(w, h);

}

window.addEventListener('resize', onWindowResize);

// 辅助三维坐标系AxesHelper  参数250表示坐标系大小，可以根据场景大小去设置
var axesHelper = new THREE.AxesHelper(250);
scene.add(axesHelper);

function render() {

	renderer.render(scene, camera);

}

