    var
        SCENE,
        RENDERER,
        CAMERA,
        GEO,
        MAT,
        OBJ,
        TEX,
        UNIFS,
        VS,
        FS;

    SCENE = new THREE.Scene();
    RENDERER = new THREE.WebGLRenderer();
    RENDERER.setPixelRatio(window.devicePixelRatio);
    RENDERER.setSize(window.innerWidth, window.innerHeight);
    RENDERER.setClearColor(0xffffff);

    CAMERA = new THREE.PerspectiveCamera(56, 1, 0.1, 1000);

    SCENE.add(CAMERA);
    CAMERA.position.z = 5;

    TEX = THREE.ImageUtils.loadTexture('1.png',{},function () {
        RENDERER.render(SCENE, CAMERA);
    });
    TEX.wrapS = TEX.wrapT = THREE.RepeatWrapping;

    UNIFS = {
        editImg: { type: 't', value: TEX}
    };
    VS = document.getElementById('vertexShader').textContent;
    FS = document.getElementById('fragmentShader_0').textContent;

    GEO = new THREE.PlaneBufferGeometry(3, 3, 1, 1);
    MAT = new THREE.ShaderMaterial({
        uniforms: UNIFS,
        vertexShader: VS,
        fragmentShader: FS
    });
    OBJ = new THREE.Mesh(GEO, MAT);
    SCENE.add(OBJ);

    document.body.appendChild(RENDERER.domElement);

    RENDERER.render(SCENE, CAMERA);
