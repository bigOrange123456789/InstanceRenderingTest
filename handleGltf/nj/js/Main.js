function Main(){
    var scope=this;
    this.VR=false;
    this.scene=new THREE.Scene();
    window.scene=this.scene;
    this.camera=new THREE.PerspectiveCamera( 70,window.innerWidth /window.innerHeight, 0.1, 2000 );;
    this.render;
    this.effect;
    this.winWidth = window.innerWidth;
    this.winHeight = window.innerHeight;
    this.start=function () {
        this.init();
        this.animate();
    }
    this.init=function()
    {
        this.renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true});
        this.renderer.autoClear = false;
        this.renderer.setPixelRatio( window.devicePixelRatio );

        this.renderer.gammaInput = true;
        this.renderer.gammaOutput = true;

        winWidth = window.innerWidth;
        winHeight = window.innerHeight;

        this.renderer.setSize(winWidth, winHeight);
        if(scope.VR)this.effect = new THREE.StereoEffect(this.renderer)
        document.body.appendChild( this.renderer.domElement );

        // CAMERAS
        this.camera.position.set(-22.7,  31.9,  6.7);
        this.camera.rotation.set(-1.50,  -0.9,  -1.48);

        window.c=this.camera;
        var ambient = new THREE.AmbientLight(0xffffff , 1 );
        this.scene.add( ambient );

    }
    this._onResize=function()
    {
        this.winWidth = window.innerWidth;
        this.winHeight = window.innerHeight;

        this.camera.aspect = winWidth / winHeight;
        this.camera.updateProjectionMatrix();

        this.renderer.setSize(winWidth, winHeight);
    }
    this.animate=function()
    {
        scope.renderer.render(scope.scene,scope.camera);
        //if (window.innerWidth !== scope.winWidth || window.innerHeight !== scope.winHeight) scope._onResize();
        requestAnimationFrame(scope.animate);
    }
}
