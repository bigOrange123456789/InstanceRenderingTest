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
        this.button_flag=true;
        this.button=new Button("保存数据","green",25);



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
            //var mesh=glb.scene.children[0].children[0].children[1];//"myModel/avatar/Female.glb"
            glb.scene.traverse(node=>{
                if(node instanceof THREE.SkinnedMesh){
                    launch(node);
                }
            });
            function launch(mesh) {
                var controller=new SkinnedMeshController();
                controller.init(mesh,glb.animations[0]);
                controller.mesh.rotation.set(Math.PI / 2, 0, 0);
                controller.mesh.scale.set(0.5,0.5,0.5);
                controller.mesh.position.set(0,-25,-100);
                scope.scene.add(controller.mesh);
                //controller.mesh.material=new THREE.MeshBasicMaterial({color:0xffffff, transparent: true,opacity: 0.5 });
                //scope.scene.visible=false;

                var helper = new THREE.SkeletonHelper( controller.mesh );
                helper.material= new THREE.LineBasicMaterial({
                    opacity: 1.0,
                    linewidth: 10,
                    vertexColors: THREE.VertexColors
                });//new THREE.MeshPhongMaterial({color:0x0000dd});//new THREE.BASI
                helper.rotation.set(Math.PI / 2, 0, 0);
                helper.scale.set(0.5,0.5,0.5);
                helper.position.set(0,-25,-100);
                //helper.material.linewidth = 10;
                scope.scene.add( helper );



                var material1=controller.mesh.material;
                var material2=helper.material;
                console.log(material2);
                var material0=new THREE.MeshBasicMaterial({color:0xffffff, transparent: true,opacity: 0.5 });
                helper.material=material0;

                var button_material=new Button("网格模式","red",10,100,40);
                button_material.rePos(450,-1);
                button_material.addEvent(function () {
                    if(button_material.element.innerHTML==="网格模式"){
                        button_material.element.innerHTML="骨骼模式";
                        controller.mesh.material=material0;
                        helper.material=material2;
                    }else{
                        button_material.element.innerHTML="网格模式";
                        controller.mesh.material=material1;
                        helper.material=material0;
                    }
                });

                var measure=new ParamMeasure(glb.animations[0],2);
                measure.boneIndex=8;
                scope.tag.reStr("骨骼序号："+measure.boneIndex);

                var button_material2=new Button("起始帧","red",10,100,40);
                button_material2.rePos(555,-1);
                button_material2.addEvent(function () {//动画共有36帧
                    if(button_material2.element.innerHTML==="起始帧"){
                        button_material2.element.innerHTML="结束帧";
                        //measure.frameIndex=35;//0//3*9
                        measure.frameIndex=measure.frameIndex+8<36?measure.frameIndex+8:0;
                    }else{
                        button_material2.element.innerHTML="起始帧";
                        //measure.frameIndex=0;
                        measure.frameIndex=measure.frameIndex+8<36?measure.frameIndex+8:0;
                    }
                    if(measure.frameIndex===32)measure.frameIndex=35;
                    console.log("帧序号:"+measure.frameIndex);
                });

                var button1=new Button("上一个","red",25);
                button1.rePos(170,-1);
                button1.addEvent(function () {
                    measure.boneIndex--;
                    if(measure.boneIndex<=-1)measure.boneIndex=24;
                });
                var button2=new Button("下一个","red",25);
                button2.rePos(290,-1);
                button2.addEvent(function () {
                    measure.boneIndex++;
                    if(measure.boneIndex>=25)measure.boneIndex=0;
                });

                var tagPosition=0;
                var tagHeight=60;
                var tag1=new Text("position_x","green",15);
                tag1.rePos(5,80+30*tagPosition);tagPosition++;
                var button10=new Button("+","red",29,35,35);
                button10.rePos(5+140,10+tagHeight*tagPosition);
                button10.addEvent(function () {
                    measure.obj0.position.x+=measure.stepPosition;
                    measure.update();
                });
                var button11=new Button("-","red",29,35,35);
                button11.rePos(5+200,10+tagHeight*tagPosition);
                button11.addEvent(function () {
                    measure.obj0.position.x-=measure.stepPosition;
                    measure.update();
                });


                var tag2=new Text("position_y","green",15);
                tag2.rePos(5,80+tagHeight*tagPosition);tagPosition++;
                var button20=new Button("+","red",29,35,35);
                button20.rePos(5+140,10+tagHeight*tagPosition);
                button20.addEvent(function () {
                    measure.obj0.position.y+=measure.stepPosition;
                    measure.update();
                });
                var button21=new Button("-","red",29,35,35);
                button21.rePos(5+200,10+tagHeight*tagPosition);
                button21.addEvent(function () {
                    measure.obj0.position.y-=measure.stepPosition;
                    measure.update();
                });

                var tag3=new Text("position_z","green",15);
                tag3.rePos(5,80+tagHeight*tagPosition);tagPosition++;
                var button30=new Button("+","red",29,35,35);
                button30.rePos(5+140,10+tagHeight*tagPosition);
                button30.addEvent(function () {
                    measure.obj0.position.z+=measure.stepPosition;
                    measure.update();
                });
                var button31=new Button("-","red",29,35,35);
                button31.rePos(5+200,10+tagHeight*tagPosition);
                button31.addEvent(function () {
                    measure.obj0.position.z-=measure.stepPosition;
                    measure.update();
                });

                var tag4=new Text("rotation_x","green",15);
                tag4.rePos(5,80+tagHeight*tagPosition);tagPosition++;
                var button40=new Button("+","red",29,35,35);
                button40.rePos(5+140,10+tagHeight*tagPosition);
                button40.addEvent(function () {
                    measure.obj0.rotation.x+=measure.stepRotation;
                    measure.update();
                });
                var button41=new Button("-","red",29,35,35);
                button41.rePos(5+200,10+tagHeight*tagPosition);
                button41.addEvent(function () {
                    measure.obj0.rotation.x-=measure.stepRotation;
                    measure.update();
                });

                var tag5=new Text("rotation_y","green",15);
                tag5.rePos(5,80+tagHeight*tagPosition);tagPosition++;
                var button50=new Button("+","red",29,35,35);
                button50.rePos(5+140,10+tagHeight*tagPosition);
                button50.addEvent(function () {
                    measure.obj0.rotation.y+=measure.stepRotation;
                    measure.update();
                });
                var button51=new Button("-","red",29,35,35);
                button51.rePos(5+200,10+tagHeight*tagPosition);
                button51.addEvent(function () {
                    measure.obj0.rotation.y-=measure.stepRotation;
                    measure.update();
                });

                var tag6=new Text("rotation_z","green",15);
                tag6.rePos(5,80+tagHeight*tagPosition);tagPosition++;
                var button60=new Button("+","red",29,35,35);
                button60.rePos(5+140,10+tagHeight*tagPosition);
                button60.addEvent(function () {
                    measure.obj0.rotation.z+=measure.stepRotation;
                    measure.update();
                });
                var button61=new Button("-","red",29,35,35);
                button61.rePos(5+200,10+tagHeight*tagPosition);
                button61.addEvent(function () {
                    measure.obj0.rotation.z-=measure.stepRotation;
                    measure.update();
                });

                var button3=new Button("positon step","red",10,150,40);
                button3.rePos(10,470);
                button3.addEvent(function () {
                    measure.stepPosition=parseFloat(
                        prompt("pos步长 "+measure.stepPosition+" 更新为:")
                    );
                });
                var button4=new Button("rotation step","red",10,150,40);
                button4.rePos(10,520);
                button4.addEvent(function () {
                    measure.stepRotation=parseFloat(
                        prompt("rot步长 "+measure.stepRotation+" 更新为:")
                    );
                });

                var button5=new Button("起始帧复制到结束帧","red",10,150,35);
                button5.rePos(10,600);//将起始帧的动作赋给结束帧
                button5.addEvent(function () {
                    measure.frameCopy(0,35);
                });
                var button6=new Button("结束帧复制到起始帧","red",10,150,35);
                button6.rePos(10,650);//将起始帧的动作赋给结束帧
                button6.addEvent(function () {
                    measure.frameCopy(35,0);
                });

                //初始计算一次
                glb.animations[0]=
                    controller.computeIntermediateFrame(glb.animations[0]);
                scope.button.addEvent(function () {//下载按钮的设置
                    glb.animations[0]=
                        controller.computeIntermediateFrame(glb.animations[0]);
                    var gltfExporter = new THREE.GLTFExporter();
                    gltfExporter.parse(glb.scene, function (result) {
                        var name="test.gltf";
                        let link = document.createElement('a');
                        link.style.display = 'none';
                        document.body.appendChild(link);
                        link.href = URL.createObjectURL(new Blob([JSON.stringify(result)], { type: 'text/plain' }));
                        link.download = name;
                        link.click();
                    },{animations: glb.animations});
                });

                updateAnimation();//
                function updateAnimation() {//每帧更新一次动画
                    controller.setTime(measure.frameIndex);
                    scope.tag.reStr("骨骼序号："+measure.boneIndex);
                    tag1.reStr("position_x:   "+(Math.floor(measure.obj0.position.x*1000)/1000));
                    tag2.reStr("position_y:   "+(Math.floor(measure.obj0.position.y*1000)/1000));
                    tag3.reStr("position_z:   "+(Math.floor(measure.obj0.position.z*1000)/1000));
                    tag4.reStr("rotation_x:   "+(Math.floor(measure.obj0.rotation.x*1000)/1000));
                    tag5.reStr("rotation_y:   "+(Math.floor(measure.obj0.rotation.y*1000)/1000));
                    tag6.reStr("rotation_z:   "+(Math.floor(measure.obj0.rotation.z*1000)/1000));

                    button3.reStr("pos步长:"+measure.stepPosition);
                    button4.reStr("rot步长:"+measure.stepRotation);

                    requestAnimationFrame(updateAnimation);
                }
            }//launch结束


        });
        //完成测试
    }
}
var myDescribe=new Describe();
myDescribe.test2();