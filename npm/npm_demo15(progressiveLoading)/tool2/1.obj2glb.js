
const path1="F:/gitHubRepositories/vk-precompute-main/model6/obj/"
const path2="F:/gitHubRepositories/temp4/VisibleEntropy/dist/assets/space6GLB/"
// const FileProcessor = require('./FileProcessor');
// const fp=FileProcessor()
const obj2gltf = require('obj2gltf');
const fs = require('fs');

function process(index){
    const inputFile  = path1+index+'.obj';
    const outputFile = path2+index+'.glb';
    obj2gltf(inputFile)
    .then(function(gltf) {// 将转换后的 gltf 数据写入文件中
        const data = Buffer.from(JSON.stringify(gltf));
        fs.writeFile(outputFile, data, function(err) {
            if (err) throw err;
        });
    })
    .catch(function(err) {
        console.error('Error:', err);
    });
}
let index=0
const number=1278
const interval=setInterval(()=>{
    process(index)
    console.log(index)
    index++
    if(index==number)clearInterval(interval)
},100)



