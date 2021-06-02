const fs = require('fs');

//obj
const obj2gltf = require('obj2gltf');
//g
const gltfPipeline = require('gltf-pipeline');
const fsExtra = require('fs-extra');
const glbToGltf = gltfPipeline.glbToGltf;
//draco
const processGltf = gltfPipeline.processGltf;


fs.readdirSync("./").forEach(function (s) {
  var stat = fs.statSync(s);
  if(stat.isDirectory()){//isFile
    console.log(fs.readdirSync("./test").length)
  }
});
