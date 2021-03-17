var name=
    prompt(
        "Please enter a file name to process:",
        "ExhibitionHall"//"ConferenceRoom"//
    );
new THREE.GLTFLoader().load('./'+name+'.glb', (glb) => {
    new GlbHandle().process(name,glb);
});