function Main(){
    //console.log(2);
    var scope=this;
    this.VR=false;
    this.scene=new THREE.Scene();
    window.scene=this.scene;

    this.camera=
        //new THREE.OrthographicCamera( width / - 2, width / 2, height / 2, height / - 2, 0.001, 100 );
        //new THREE.PerspectiveCamera( 70,window.innerWidth /window.innerHeight, 0.1, 1000 );;
        new THREE.PerspectiveCamera(70, window.innerWidth / window.innerHeight, 0.3, 1000);
    this.render;
    this.effect;
    //this.camera = new THREE.OrthographicCamera(window.innerWidth/ - 1,window.innerWidth,window.innerHeight,window.innerHeight/ - 1, 0, 100000 );
    //this.divInfo = document.getElementById('pminfo');//用于呈现文字
    this.start=function () {
        this.initRenderer();
        this.initLight();
        this.animate();
        this.computeFrameNumber();
        console.log(
            this.renderer.info.render
        )
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
    this.initRenderer=function()
    {
        this.renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true});
        this.renderer.autoClear = false;
        this.renderer.setPixelRatio( window.devicePixelRatio );
        this.renderer.setSize(window.innerWidth, window.innerHeight);

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
            var elem=document.getElementById("frameNumber");
            if(elem) {
                elem.innerText = scope.renderer.info.render.frame-frame_pre;
                frame_pre=scope.renderer.info.render.frame;
            }
        },1000)
    }
    this.animate=function()
    {
        if(scope.VR)scope.effect.render(scope.scene, scope.camera);
        else scope.renderer.render(scope.scene,scope.camera);
        scope.updateLight()
        //scope.divInfo.textContent='场景中三角面个数:' + renderer.info.render.triangles;


        var elem=document.getElementById("triNum");
        if(elem)elem.innerText = scope.renderer.info.render.triangles;

        requestAnimationFrame(scope.animate);
    }
}
