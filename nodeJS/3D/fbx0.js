const convert = require('fbx2gltf');
convert('./some.fbx', './target.glb', ['--khr-materials-unlit']).then(
    destPath => {
        // yay, do what we will with our shiny new GLB file!
        //耶，做什么，我们将与我们闪亮的新GLB文件！
        console.log(destPath)
    },
    error => {
        console.log(error)
        // ack, conversion failed: inspect 'error' for details
        //确认，转换失败：有关详细信息，请检查“错误”
    }
);
