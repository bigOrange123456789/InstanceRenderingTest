function Describe(){
    this.scene;
    this.camera;

    this.tag;
    this.button_flag;
    this.referee;
}
Describe.prototype={
    setContext:function () {
        var nameContext="";
        console.log('set context:'+nameContext);

        var scope=this;
        this.referee=new Referee();
        this.tag=new Text("","green",25);
        this.button_flag=true;
        var button=new Button("test","green",25);
        button.addEvent(function () {
            scope.button_flag=!scope.button_flag;
        });

        var camera, scene, renderer;
        var light;
        init();
        render();
        function init() {
            camera = new THREE.PerspectiveCamera(50, window.innerWidth / window.innerHeight, 0.01, 10000);
            camera.position.z = 20;

            scene = new THREE.Scene();

            renderer = new THREE.WebGLRenderer();
            renderer.setPixelRatio(window.devicePixelRatio);
            renderer.setSize(window.innerWidth, window.innerHeight);
            renderer.setClearColor(0xffffff);
            document.body.appendChild( renderer.domElement );
            //container.appendChild(renderer.domElement);

            if (renderer.capabilities.isWebGL2 === false && renderer.extensions.has('ANGLE_instanced_arrays') === false) {
                document.getElementById('notSupported').style.display = '';
                return;
            }
            light = new THREE.AmbientLight(0xffffff,1.0)
            scene.add(light);
            new OrbitControls(camera);
            //new PlayerControl(camera);
        }
        function render(){
            renderer.render( scene, camera );
            requestAnimationFrame(render);
        }
        this.scene=scene;
        this.camera=camera;
    },//console.log('finish context:'+nameContext);
    test1:function (contextType){
        this.setContext();
        //开始测试
        var scope=this;
        var loader= new THREE.GLTFLoader();
        loader.load("female_run.glb", (glb1) => {
            loader.load("female_bend.glb", (glb2) => {
                var myGlb=glb1;
                createObj2(myGlb);
                function createObj2(G) {
                    var meshMixer2 = new THREE.AnimationMixer(G.scene);
                    meshMixer2.clipAction(glb1.animations[0]).play();
                    setInterval(function () {
                        meshMixer2.update(0.01);
                    },100)
                    console.log(scope.scene,G.scene);
                    scope.scene.add(G.scene);
                }
            });
        });
        //完成测试
    },//console.log('complete test:'+nameTest);
}
var myDescribe=new Describe();
myDescribe.test1();