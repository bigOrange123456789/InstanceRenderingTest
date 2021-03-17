//将glb分解为多个小文件
function GlbHandle(){
}
GlbHandle.prototype={
    process:function (name) {
        var loader= new THREE.GLTFLoader();
        var fileName=name;
        loader.load('./'+fileName+'.glb', (glb) => {
            console.log(glb);
            var myGlbSplit2=new GlbSplit2();
            myGlbSplit2.init(
                fileName,
                new Download()
            );
            myGlbSplit2.glbDownload(glb);
        });//读取函数结尾处
    },
}