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
    test1:function (){
        this.setContext2();
        console.log(this,this.camera)
        //this.camera.position.set(0,0,-20);
        var nameTest="输出帧序号，用于验证";
        console.log('start test:'+nameTest);
        //开始测试
        var scope=this;
        var loader= new THREE.GLTFLoader();
        loader.load("Female.glb", (glb) => {
            console.log(glb);//OnlyArm
            var mesh=glb.scene.children[0].children[1];//"myModel/avatar/Female.glb"

            var controller=new SkinnedMeshController();
            controller.init(mesh,glb.animations[0]);
            controller.mesh.rotation.set(Math.PI / 2, 0, 0);
            controller.mesh.scale.set(0.5,0.5,0.5);
            controller.mesh.position.set(0,-25,-100);
            scope.scene.add(controller.mesh);
            /*
            *       var meshMixer2 = new THREE.AnimationMixer(G.scene);
                    meshMixer2.clipAction(glb1.animations[0]).play();
                    setInterval(function () {
                        meshMixer2.update(0.01);
                    },100)
                    console.log(scope.scene,G.scene);
                    scope.scene.add(G.scene);
            * */

            var measure=new ParamMeasure(glb.animations[0],2);
            measure.boneIndex=8;
            scope.tag.reStr("骨骼序号："+measure.boneIndex);

            updateAnimation();//
            function updateAnimation() {//每帧更新一次动画
                //controller.init(mesh,glb.animations[0]);
                controller.setTime(0);
                //requestAnimationFrame(updateAnimation);
            }



        });//
        //完成测试
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
        loader.load("Female.glb", (glb) => {
            var mesh=glb.scene.children[0].children[1];//"myModel/avatar/Female.glb"

            var controller=new SkinnedMeshController();
            controller.init(mesh,glb.animations[0]);
            controller.mesh.rotation.set(Math.PI / 2, 0, 0);
            controller.mesh.scale.set(0.5,0.5,0.5);
            controller.mesh.position.set(0,-25,-100);
            scope.scene.add(controller.mesh);

            var measure=new ParamMeasure(glb.animations[0],2);
            measure.boneIndex=8;
            scope.tag.reStr("骨骼序号："+measure.boneIndex);

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

            updateAnimation();//
            function updateAnimation() {//每帧更新一次动画
                controller.setTime(0);
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
            this.button.addEvent(function () {
                var data=[];
                var time=0;
                var animation=measure.obj;
                console.log()
                for(var i=0;i<25;i++) {
                    data.push([
                        i,
                        time,
                        animation.tracks[3*i].values[3*time],
                        animation.tracks[3*i].values[3*time+1],
                        animation.tracks[3*i].values[3*time+2],

                        animation.tracks[3*i+1].values[4*time],
                        animation.tracks[3*i+1].values[4*time+1],
                        animation.tracks[3*i+1].values[4*time+2],
                        animation.tracks[3*i+1].values[4*time+3]
                    ]);
                }
                var result={data:data};
                download(result,"animation.json");
                function download(result,name) {
                    let link = document.createElement('a');
                    link.style.display = 'none';
                    document.body.appendChild(link);
                    link.href = URL.createObjectURL(new Blob([JSON.stringify(result)], { type: 'text/plain' }));
                    link.download = name;
                    link.click();
                }
            });

        });//
        //完成测试
    },

    //动画修改测试
    test3:function (){
        this.setContext2();
        console.log(this,this.camera)
        //this.camera.position.set(0,0,-20);
        var nameTest="输出帧序号，用于验证";
        console.log('start test:'+nameTest);
        //开始测试
        var scope=this;
        var loader= new THREE.GLTFLoader();
        loader.load("Female.glb", (glb) => {
            console.log(glb);//OnlyArm

            //setInterval(function () {meshMixer2.update(0.01);},100)
            //glb.scene.rotation.set(Math.PI / 2, 0, 0);
            //glb.scene.scale.set(0.5,0.5,0.5);
            //glb.scene.position.set(0,0,15);
            scope.scene.add(glb.scene);


            var measure=new ParamMeasure(glb.animations[0],2);
            measure.boneIndex=8;
            scope.tag.reStr("骨骼序号："+measure.boneIndex);
            measure.setAnimation();

            var meshMixer = new THREE.AnimationMixer(glb.scene);
            meshMixer.clipAction(glb.animations[0]).play();

            updateAnimation();//
            function updateAnimation() {//每帧更新一次动画

                //controller.init(mesh,glb.animations[0]);
                //controller.setTime(0);
                //requestAnimationFrame(updateAnimation);
            }
        });//
        //完成测试
    },
}
var myDescribe=new Describe();
myDescribe.test2();