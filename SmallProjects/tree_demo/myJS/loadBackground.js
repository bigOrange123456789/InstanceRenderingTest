export{loadBackgroundHugeSphere}
function loadBackgroundHugeSphere(url){
    let loader= new THREE.TextureLoader();
    loader.load( url, function ( tex ) {
        tex.sourceFile = url;
        tex.encoding=THREE.sRGBEncoding;
        let material=new THREE.MeshBasicMaterial();
        material.side=THREE.DoubleSide;
        material.map=tex;
        let sphereGeo=new THREE.SphereBufferGeometry(32768,32,32);
        let mesh=new THREE.Mesh(sphereGeo,material);
        window.editor.addObject(mesh);
})
}