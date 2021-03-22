var name=
    prompt(
        "Please enter a file name to process:",
        "ExhibitionHall"//"ExhibitionHall"//
    );
new THREE.GLTFLoader().load('./'+name+'.glb', (glb) => {
    new GlbHandle().process(name,glb);
});