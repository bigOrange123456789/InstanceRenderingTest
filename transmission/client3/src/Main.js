function Main(){
    var scope=this;
    this.VR=false;
    this.scene;
    this.camera;
    this.render;
    this.effect;
    this.frameNumber;
    this.d_time;
    this.pre_time;

    this.start=function () {
        this.d_time=16.6;//60帧
        this.pre_time;

        this.scene=new THREE.Scene();
        this.camera=new THREE.PerspectiveCamera(70, window.innerWidth / window.innerHeight, 0.3, 1000);
        window.scene=this.scene;
        window.camera=this.camera;
        this.initRenderer();
        this.initLight();
        this.animate();
        this.computeFrameNumber();
    }
    this.initLight=function () {
        this.scene.background = new THREE.Color(0xffffff);
        var ambient = new THREE.AmbientLight(0xffffff , 0.8 );
        this.scene.add( ambient );

        var camera=this.camera;
        var light = new THREE.SpotLight(0xffffff);
        light.position.set(camera.position.x, camera.position.y, camera.position.z);
        light.distance = 400;
        light.intensity = 0.5;
        var lightObj = new THREE.Object3D();
        lightObj.position.set(0, 0, 5);
        this.scene.add(lightObj);
        light.target = lightObj;
        this.scene.add(light);
        this.lightObj=lightObj;
        this.light=light;
    }
    this.updateLight=function() {//让光线随着相机移动
        var camera=this.camera;
        var light=this.light;
        var lightObj=this.lightObj;
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
    this.initRenderer=function() {
        this.renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true});
        window.renderer=this.renderer;
        this.renderer.autoClear = false;
        this.renderer.setPixelRatio( window.devicePixelRatio );
        this.renderer.setSize(window.innerWidth, window.innerHeight);

        console.log(this.renderer)
        this.renderer.gammaInput = true;
        this.renderer.gammaOutput = true;

        this.renderer.setSize(window.innerWidth, window.innerHeight);
        if(scope.VR)this.effect = new THREE.StereoEffect(this.renderer)
        document.body.appendChild( this.renderer.domElement );

        var camera=this.camera;
        var renderer=this.renderer;
        window.addEventListener('resize', function () {
            camera.aspect = window.innerWidth / window.innerHeight;
            camera.updateProjectionMatrix();
            renderer.setSize(window.innerWidth, window.innerHeight);
        }, false);
    }
    this.computeFrameNumber0=function () {
        var frameNumber=0;
        computeFrameNumber();
        function computeFrameNumber(){
            frameNumber++;
            requestAnimationFrame(computeFrameNumber);
        }
        setInterval(function () {
            var elem=document.getElementById("frameNumber");
            if(elem)elem.innerText=frameNumber;
            frameNumber=0;
        },1000)
    }
    this.computeFrameNumber=function () {
        var frame_pre=scope.renderer.info.render.frame
        setInterval(function () {
            scope.frameNumber=scope.renderer.info.render.frame-frame_pre;
            frame_pre=scope.renderer.info.render.frame;
            var elem=document.getElementById("frameNumber");
            if(elem) elem.innerText = scope.frameNumber;
        },1000)
    }
    this.animate=function() {
        if(scope.VR)scope.effect.render(scope.scene, scope.camera);
        else scope.renderer.render(scope.scene,scope.camera);
        scope.updateLight()
        //scope.divInfo.textContent='场景中三角面个数:' + renderer.info.render.triangles;


        var elem=document.getElementById("triNum");
        if(elem)elem.innerText = scope.renderer.info.render.triangles;

        requestAnimationFrame(scope.animate);
    }
    this.test=function () {//用于查看移动端输出
        window.record={log:[],warn:[],error:[]}
        console.log_old = console.log;
        console.log = function(str) {
            console.log_old(str);
            window.record.log.push(str);
        }

        console.warn_old = console.warn;
        console.warn = function(str) {
            console.warn_old(str);
            window.record.warn.push(str);
        }

        console.error_old = console.error;
        console.error = function(str) {
            console.error_old(str);
            window.record.error.push(str);
        }
        //error
        console.log(window.record)
    }
}
