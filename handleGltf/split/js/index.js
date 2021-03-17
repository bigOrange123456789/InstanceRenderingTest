var name=
    prompt(
        "Please enter a file name to process:",
        "ConferenceRoom"//"ExhibitionHall"
    );
new THREE.GLTFLoader().load('./'+name+'.glb', (glb) => {
    new GlbHandle().process(name,glb);
});