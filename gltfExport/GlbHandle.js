function GlbHandle(){
    this.counter=0;//计数器，记录处理文件的个数，初始值为0
}
GlbHandle.prototype={

    meshDownLoad:function (mesh,name){
        var scene=new THREE.Scene();
        scene.add(mesh);
        this.sceneDownLoad(scene,name);
    },
    sceneDownLoad:function (scene,name){
        var scope=this;
        var gltfExporter = new THREE.GLTFExporter();
        gltfExporter.parse(scene, function (result) {
            scope.resultDownLoad(result,name);
        });
    },
    resultDownLoad:function (result,name){
        let link = document.createElement('a');
        link.style.display = 'none';
        document.body.appendChild(link);
        link.href = URL.createObjectURL(new Blob([JSON.stringify(result)], { type: 'text/plain' }));
        link.download = name;
        link.click();
        document.body.removeChild(link);
    },
}