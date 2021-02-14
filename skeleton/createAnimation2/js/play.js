function Describe(){
    this.scene;
    this.camera;

    this.tag;
    this.button_flag;
    this.referee;

    this.button1;
}
Describe.prototype={
    setContext2:function () {
        this.frameIndex=this.frameIndexPre=0;
        var nameContext="";
        console.log('set context:'+nameContext);

        var scope=this;
        this.referee=new Referee();
        this.tag=new Text("","green",25);



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

            if (renderer.capabilities.isWebGL2 === false && renderer.extensions.has('ANGLE_instanced_arrays') === false) {
                document.getElementById('notSupported').style.display = '';
                return;
            }
            light = new THREE.AmbientLight(0xffffff,1.0)
            scene.add(light);
            new OrbitControls(camera,renderer.domElement,new THREE.Vector3(0,5,-100));
        }
        function render(){
            scope.frameIndex++;
            renderer.render( scene, camera );
            requestAnimationFrame(render);
        }
        this.scene=scene;
        this.camera=camera;
    },



    //动画修改测试
    test2:function (){
        this.setContext2();
        console.log(this,this.camera)
        //this.camera.position.set(0,0,-20);
        var nameTest="输出帧序号，用于验证";
        console.log('start test:'+nameTest);
        //开始测试
        var scope=this;
        var loader= new THREE.GLTFLoader();
        loader.load("test.gltf", (glb) => {
            console.log(glb);
            var mesh=glb.scene.children[0].children[0].children[1];//"myModel/avatar/Female.glb"

            var controller=new SkinnedMeshController();
            controller.init(mesh,glb.animations[0]);
            controller.mesh.rotation.set(Math.PI / 2, 0, 0);
            controller.mesh.scale.set(0.5,0.5,0.5);
            controller.mesh.position.set(0,-25,-100);
            scope.scene.add(controller.mesh);



            var frameIndex=0;

            updateAnimation();//
            function updateAnimation() {//每帧更新一次动画
                controller.setTime(frameIndex);
                frameIndex++;
                if(frameIndex===35)frameIndex=0;
                requestAnimationFrame(updateAnimation);
            }

        });
        //完成测试
    }
}
var myDescribe=new Describe();
myDescribe.test2();