import * as THREE from 'https://cdn.skypack.dev/three@0.134.0/src/Three.js';
import { OrbitControls } from 'https://cdn.skypack.dev/three@0.134.0/examples/jsm/controls/OrbitControls.js';
import { FBXLoader } from 'https://cdn.skypack.dev/three@0.134.0/examples/jsm/loaders/FBXLoader.js';
import { TGALoader } from 'https://cdn.skypack.dev/three@0.134.0/examples/jsm/loaders/TGALoader.js';
import Stats from 'https://cdn.skypack.dev/three@0.134.0/examples/jsm/libs/stats.module.js';

import { EffectComposer } from 'https://cdn.skypack.dev/three@0.134.0/examples/jsm/postprocessing/EffectComposer.js';
import { RenderPass } from 'https://cdn.skypack.dev/three@0.134.0/examples/jsm/postprocessing/RenderPass.js';
import { UnrealBloomPass } from 'https://cdn.skypack.dev/three@0.134.0/examples/jsm/postprocessing/UnrealBloomPass.js';

import { MeshSSSMaterial } from './src/MeshSSSMaterial.js'

import { GUI } from 'https://cdn.skypack.dev/three@0.134.0/examples/jsm/libs/dat.gui.module.js';


let renderer,scene,camera,controls,stats;
let composer;
let gui;
let head_sss,head_standard;

init();
loadModelStandard();
loadModelSSS()
animate();

function init(){
    renderer = new THREE.WebGLRenderer();
    renderer.setSize( window.innerWidth, window.innerHeight );
    document.body.appendChild( renderer.domElement );
    
    camera = new THREE.PerspectiveCamera( 45, window.innerWidth / window.innerHeight, 0.001, 1000 );
    camera.position.z = 50;
    
    scene = new THREE.Scene();

    // Lights 
    const ambient = new THREE.AmbientLight( 0x443333 );
    scene.add( ambient );

    const dirLight1 = new THREE.DirectionalLight( 0xffddcc, 0.5 );
    dirLight1.position.set( 10, 10, 10 );
    scene.add( dirLight1 );
    const helper1 = new THREE.DirectionalLightHelper( dirLight1, 10 ) ;
    scene.add( helper1);

    const dirLight2 = new THREE.DirectionalLight( 0xccccff, 0.5 );
    dirLight2.position.set( -20, 0, 0 );
    scene.add( dirLight2 );
    const helper2 = new THREE.DirectionalLightHelper( dirLight2, 10 ) ;
    scene.add( helper2);


    window.addEventListener( 'resize', onWindowResize );
    controls = new OrbitControls(camera,renderer.domElement);

    stats = new Stats();
    document.body.appendChild( stats.dom );

    //GUI Light Settings
    gui = new GUI();
    gui.width = 300;
    gui.domElement.style.userSelect = 'none';
    // gui.closed = true;

    const config_dir1 = {
        intensity: 1.0,
        posX:10,
        posY:10,
        posZ:10,
        color:'#ffddcc',
    };
    const fDir1 = gui.addFolder( 'DirLight1' );
    fDir1.add( config_dir1, 'intensity', 0, 2, 0.02 )
        .name( 'Intensity' )
        .onChange( function () {
            dirLight1.intensity = config_dir1.intensity;
        } );
    fDir1.add( config_dir1, 'posX', -50, 50, 1 )
        .name( 'Pos X' )
        .onChange( function () {
            dirLight1.position.x = config_dir1.posX;
            dirLight1.updateMatrix();
            helper1.update();

        } );
    fDir1.add( config_dir1, 'posY', -50, 50, 1 )
        .name( 'Pos Y' )
        .onChange( function () {
            dirLight1.position.y = config_dir1.posY;
            dirLight1.updateMatrix();
            helper1.update();
        } );
    fDir1.add( config_dir1, 'posZ', -50, 50, 1 )
        .name( 'Pos Z' )
        .onChange( function () {
            dirLight1.position.z = config_dir1.posZ;
            dirLight1.updateMatrix();
            helper1.update();
        } );
    fDir1.addColor(config_dir1,'color')
        .name('Color')
        .onChange( function () {
            dirLight1.color.set(config_dir1.color);
            
        } );
    fDir1.open();
    

    const config_dir2 = {
        intensity: 1.0,
        posX:-20,
        posY:0,
        posZ:0,
        color:'#ccccff',
    };
    const fDir2 = gui.addFolder( 'DirLight2' );
    fDir2.add( config_dir2, 'intensity', 0, 2, 0.02 )
        .name( 'Intensity' )
        .onChange( function () {
            dirLight2.intensity = config_dir2.intensity;
        } );
    fDir2.add( config_dir2, 'posX', -50, 50, 1 )
        .name( 'Pos X' )
        .onChange( function () {
            dirLight2.position.x = config_dir2.posX;
            dirLight2.updateMatrix();
            helper2.update();
        } );
    fDir2.add( config_dir2, 'posY', -50, 50, 1 )
        .name( 'Pos Y' )
        .onChange( function () {
            dirLight2.position.y = config_dir2.posY;
            dirLight2.updateMatrix();
            helper2.update();
        } );
    fDir2.add( config_dir2, 'posZ', -50, 50, 1 )
        .name( 'Pos Z' )
        .onChange( function () {
            dirLight2.position.z = config_dir2.posZ;
            dirLight2.updateMatrix();
            helper2.update();
        } );
    fDir2.addColor(config_dir2,'color')
        .name('Color')
        .onChange( function () {
            dirLight2.color.set(config_dir2.color);
            
        } );
    fDir2.open();


    const fAmbiemt = gui.addFolder( 'Ambiemt Light' );
    const config_ambient = {
        intensity: 1.0,
        color: '#443333',
    };
    fAmbiemt.add( config_ambient, 'intensity', 0, 2, 0.02 )
    .name( 'Intensity' )
    .onChange( function () {
        ambient.intensity = config_ambient.intensity;
    } );
    fAmbiemt.addColor(config_ambient,'color')
    .name('Color')
    .onChange( function () {
        ambient.color.set(config_ambient.color);
        
    } );
    fAmbiemt.open();

    // Post Processing
    const renderPass = new RenderPass( scene, camera );
    const bloomPass = new UnrealBloomPass( new THREE.Vector2( window.innerWidth, window.innerHeight ), 1.5, 0.4, 0.85 );
    bloomPass.threshold = 1.0;
    bloomPass.strength = 0.0;
    bloomPass.radius = 0;

    composer = new EffectComposer( renderer );
    composer.addPass( renderPass );
    composer.addPass( bloomPass );


}

function onWindowResize() {

    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();

    renderer.setSize( window.innerWidth, window.innerHeight );
    composer.setSize( window.innerWidth, window.innerHeight );
}

function loadModelStandard(){
    const loader = new FBXLoader();

    const modelPath = './assets/models/woman/';
    loader.setPath(modelPath)
    var textureLoader = new THREE.TextureLoader().setPath( './assets/models/woman/textures/' );


    const scale = 50;
    const scaleVector = new THREE.Vector3(scale,scale,scale);

    const woman = new THREE.Group();

    loader.load( 'Head.fbx', function( model ){
        const mesh = model.children[0];
        const material = new THREE.MeshStandardMaterial({
            map: textureLoader.load( 'Head.png' )  ,
            roughness: 0.5,
        });
        mesh.material = material;
        mesh.scale.copy(scaleVector);
        woman.add( mesh );
        
        const fStandard = gui.addFolder( 'Material Srandard' );
        const config_standard = {
            roughness: 0.5,
        };
        fStandard.add(config_standard,'roughness',0,1.0,0.02)
            .name('Roughness')
            .onChange( function (value) {
                material.roughness = value;
        } );
        fStandard.open();

        head_standard = mesh;
    });
    woman.position.set(10,-75,0);
    woman.updateMatrix();
    scene.add(woman);

}

function loadModelSSS(){
    const vert = $.ajax({ url:'./assets/shader/preIntegrated_simple/vert.glsl',async:false }).responseText;
    const frag = $.ajax({ url:'./assets/shader/preIntegrated_simple/frag.glsl',async:false }).responseText;
   
    const loader = new FBXLoader();
    loader.setPath('./assets/models/woman/')
    var textureLoader = new THREE.TextureLoader().setPath( './assets/models/woman/textures/' );

    const scale = 50;
    const scaleVector = new THREE.Vector3(scale,scale,scale);

    const woman = new THREE.Group();

    loader.load( 'Head.fbx', function( model ){
        const mesh = model.children[0];
        const material = new MeshSSSMaterial( {
            uniforms: {
                brightness_specular: { value: 1.0  },
                sssIntensity: { value: 0.35 },
                CurveFactor: { value:1.0 },
                sssLUT: { value: new TGALoader().load( './assets/textures/PreIntergated.TGA' ) },
            },
            vertexShader: vert,
            fragmentShader: frag,
            map:  textureLoader.load( 'Head.png' ),
            normalMap: new THREE.TextureLoader().load( './assets/textures/Normal.png' ) ,
            roughness: 0.3,
            metalness: 0.0,
            envMapIntensity: 1.0,
        });
        var head = new THREE.Mesh(mesh.geometry,material);
        head.applyMatrix4(mesh.matrix);
        head.scale.copy(scaleVector);

        woman.add( head );

        const fSSS = gui.addFolder( 'Material SSS' );
        const config_sss = {
            brightness_specular:1.0,
            sssIntensity:0.35,
            sssCurveFactor:1.0,
            roughness: 0.3,
        };
        fSSS.add(config_sss,'sssIntensity',0,2.0,0.01)
            .name('SSS Intensity')
            .onChange( function () {
                material.uniforms.sssIntensity.value = config_sss.sssIntensity;
        } );
        fSSS.add(config_sss,'sssCurveFactor',0,2.0,0.01)
            .name('SSS CurveFactor')
            .onChange( function () {
                material.uniforms.CurveFactor.value = config_sss.sssCurveFactor;
        } );
        fSSS.add(config_sss,'brightness_specular',0,2.0,0.01)
            .name('Specular Intensity')
            .onChange( function () {
                material.uniforms.brightness_specular.value = config_sss.brightness_specular;
        } );
        fSSS.add(config_sss,'roughness',0,1.0,0.02)
            .name('Roughness')
            .onChange( function (value) {
                material.roughness = (value<0.01)?0.01:value;
        } );
        fSSS.open();

        head_sss = head;

    });

    woman.position.set(-10,-75,0);
    woman.updateMatrix();
    scene.add(woman);


}


function animate() {
    requestAnimationFrame( animate );

    render();

    stats.update();
}

function render(){
    // renderer.render( scene, camera );
    composer.render();

}





