'use strict'
var data = data;
console.log(data)

var container = document.getElementById('container');

var scene = new THREE.Scene();
var camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, .1, 1000);
// var camera = new THREE.OrthographicCamera( -1, 1, 1, -1, 1, 1000 );
// camera.position.set( 50, 10, 0 );
camera.position.set(-200, 0, -220);
// var frustumSize = 1000;

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

var resolution = new THREE.Vector2(window.innerWidth, window.innerHeight);
var graph = new THREE.Object3D();
scene.add(graph);

init()
// render();

function makeLine(geo, c) {

	var g = new MeshLine();
	g.setGeometry(geo);

	var material = new MeshLineMaterial({
		useMap: false,
		color: new THREE.Color(colors[c]),
		opacity: 1,
		resolution: resolution,
		sizeAttenuation: false,
		lineWidth: 10,
	});
	var mesh = new THREE.Mesh(g.geometry, material);
	graph.add(mesh);

}

function init() {

	// createLines();
	createLines2()

}

function createLines2() {
	var group = new THREE.Group();
	// type: 0 画线
	for (let i = 0; i < data.lines.length; i++) {
		var geometry = new THREE.Geometry(); // 声明一个几何体对象Geometry
		// var p = [];
		for (let j = 0; j < data.lines[i].positions.length; j++) {
			// p.push(new THREE.Vector3(data.lines[i].positions[j].x * 100, data.lines[i].positions[j].y * 100, data.lines[i].positions[j].z * 100))
			geometry.vertices.push(new THREE.Vector3(data.lines[i].positions[j].x * 100, data.lines[i].positions[j].y * 100, data.lines[i].positions[j].z * 100))
		}

		if (data.lines[i].positions.length > 1) {

			var g = new MeshLine();
			g.setGeometry(geometry);

			var material = new MeshLineMaterial({
				useMap: false,
				color: `rgb(${Math.floor(data.lines[i].color.r * 255)}, ${Math.floor(data.lines[i].color.g * 255)}, ${Math.floor(data.lines[i].color.b * 255)})`,
				opacity: data.lines[i].color.a.toFixed(2),
				resolution: resolution,
				sizeAttenuation: false,
				lineWidth: Math.floor(data.lines[i].width * 1000),
				// repeat: new THREE.Vector2( 1,2 )
			});
			var mesh = new THREE.Mesh(g.geometry, material);
			graph.add(mesh);
		}
	}
	// group.scale.set(1.2, 1.2, 1.2);
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

	// var line = new Float32Array( 600 );
	// for( var j = 0; j < 200 * 3; j += 3 ) {
	// 	line[ j ] = -30 + .1 * j;
	// 	line[ j + 1 ] = 5 * Math.cos( .02 *  j );
	// 	line[ j + 2 ] = -10;
	// }
	// makeLine( line, 1 );

	// var line = new Float32Array( 600 );
	// for( var j = 0; j < 200 * 3; j += 3 ) {
	// 	line[ j ] = -30 + .1 * j;
	// 	line[ j + 1 ] = 5 * Math.sin( .01 *  j ) * Math.cos( .005 * j );
	// 	line[ j + 2 ] = 0;
	// }
	// makeLine( line, 2 );

	// var line = new Float32Array( 600 );
	// for( var j = 0; j < 200 * 3; j += 3 ) {
	// 	line[ j ] = -30 + .1 * j;
	// 	line[ j + 1 ] = .02 * j + 5 * Math.sin( .01 *  j ) * Math.cos( .005 * j );
	// 	line[ j + 2 ] = 10;
	// }
	// makeLine( line, 4 );

	// var line = new Float32Array( 600 );
	// for( var j = 0; j < 200 * 3; j += 3 ) {
	// 	line[ j ] = -30 + .1 * j;
	// 	line[ j + 1 ] = Math.exp( .005 * j );
	// 	line[ j + 2 ] = 20;
	// }
	// makeLine( line, 5 );

	// var line = new THREE.Geometry();
	// line.vertices.push( new THREE.Vector3( -30, -30, -30 ) );
	// line.vertices.push( new THREE.Vector3( 30, -30, -30 ) );
	// makeLine( line, 3 );

	// var line = new THREE.Geometry();
	// line.vertices.push( new THREE.Vector3( -30, -30, -30 ) );
	// line.vertices.push( new THREE.Vector3( -30, 30, -30 ) );
	// makeLine( line, 3 );

	// var line = new THREE.Geometry();
	// line.vertices.push( new THREE.Vector3( -30, -30, -30 ) );
	// line.vertices.push( new THREE.Vector3( -30, -30, 30 ) );
	// makeLine( line, 3 );

}

onWindowResize();

function onWindowResize() {

	// var w = container.clientWidth;
	// var h = container.clientHeight;

	// var aspect = w / h;

	// camera.left   = - frustumSize * aspect / 2;
	// camera.right  =   frustumSize * aspect / 2;
	// camera.top    =   frustumSize / 2;
	// camera.bottom = - frustumSize / 2;

	// camera.updateProjectionMatrix();

	// renderer.setSize( w, h );

	// resolution.set( w, h );
	var w = container.clientWidth;
	var h = container.clientHeight;

	camera.aspect = w / h;
	camera.updateProjectionMatrix();

	renderer.setSize(w, h);

	resolution.set(w, h);

}

window.addEventListener('resize', onWindowResize);

function render() {

	// requestAnimationFrame( render );
	// controls.update();

	renderer.render(scene, camera);

}
// 辅助三维坐标系AxesHelper  参数250表示坐标系大小，可以根据场景大小去设置
var axesHelper = new THREE.AxesHelper(250);
scene.add(axesHelper);

render()

