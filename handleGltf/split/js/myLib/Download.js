//在浏览器，下载3D模型数据、2D贴图数据
function Download(){//无后缀名的时候，图片会自动填补出正确的后缀名，但模型填补出的是txt后缀名
}
Download.prototype={
    //3D模型数据
    meshDownload:function (mesh,name){
        if(name.charAt(name.length-1)!=='f')name+='.gltf';
        var scene=new THREE.Scene();
        scene.add(mesh);
        this.sceneDownload(scene,name);
    },
    sceneDownload:function (scene,name){
        if(name.charAt(name.length-1)!=='f')name+='.gltf';
        var scope=this;
        var gltfExporter = new THREE.GLTFExporter();
        gltfExporter.parse(scene, function (result) {
            scope.jsonDownload(result,name);
        });
    },
    //2D贴图数据
    canvasDownload:function(canvas,name){
        var isPNG=true;
        let url;
        if(isPNG)url = canvas.toDataURL("image/png");//得到图片的base64编码数据
        else url = canvas.toDataURL("image/jpeg");
        let a = document.createElement("a"); // 生成一个a元素
        let event = new MouseEvent("click"); // 创建一个单击事件
        a.download = name;//name || "photo"; // 设置图片名称
        a.href = url; // 将生成的URL设置为a.href属性
        a.dispatchEvent(event); // 触发a的单击事件
    },
    //1D文本数据
    jsonDownload:function (json,name) {
        this.strDownload(
            JSON.stringify(json),
            name
        );
    },
    strDownload:function (str,name) {//无后缀名
        let link = document.createElement('a');
        //link.style.display = 'none';
        //document.body.appendChild(link);
        link.href = URL.createObjectURL(new Blob([str], { type: 'text/plain' }));
        link.download = name;
        link.click();
    },
}