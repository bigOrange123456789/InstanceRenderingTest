//obj
const obj2gltf = require('obj2gltf');
const fs = require('fs');
//g
const gltfPipeline = require('gltf-pipeline');
const fsExtra = require('fs-extra');
const glbToGltf = gltfPipeline.glbToGltf;
//draco
var cmd=require('node-cmd');

const processGltf = gltfPipeline.processGltf;
function Format() {
    this.path_FBX2glTF="./"
    this.fbx2glb=function (name) {
        cmd.run('FBX2glTF.exe -i '+name+'.fbx -o '+name+'.glb ');
        cmd.get(
            'run run_exe',
            function(data){
                console.log("finish!");//console.log('the current dir contains these files :\n\n',data)
            }
        );
    }
    this.obj2gltf=function(name) {
        obj2gltf(name+'.obj')
            .then(function(gltf) {
                const data = Buffer.from(JSON.stringify(gltf));
                fs.writeFileSync(name+'.gltf', data);
            });
    }
    this.obj2gltf0=function(name) {
        obj2gltf(name+'.obj')
            .then(function(gltf) {
                console.log(gltf.scenes[0])
                console.log(gltf.scenes[0].nodes)
                console.log(gltf.scenes[0].nodes[0])
                const data = Buffer.from(JSON.stringify(gltf));
                fs.writeFileSync(name+'.gltf', data);
            });
    }
    this.obj2glb=function (name) {
        const options = {
            binary : true
        }
        obj2gltf(name+'.obj', options)
            .then(function(glb) {
                fs.writeFileSync(name+'.glb', glb);
            });
    }

    this.glb2gltf=function (name) {
        const glb = fsExtra.readFileSync(name+'.glb');
        glbToGltf(glb)
            .then(function(results) {
                fsExtra.writeJsonSync(name+'.gltf', results.gltf);
            });
    }
    this.gltf2glb=function (name) {
        const gltfPipeline = require('gltf-pipeline');
        const fsExtra = require('fs-extra');
        const gltfToGlb = gltfPipeline.gltfToGlb;
        const gltf = fsExtra.readJsonSync(name+'.gltf');
        gltfToGlb(gltf)
            .then(function(results) {
                fsExtra.writeFileSync(name+'.glb', results.glb);
            });
    }

    this.draco=function (name) {

        const gltf = fsExtra.readJsonSync(name+'.gltf');
        const options = {
            dracoOptions: {
                compressionLevel: 10
            }
        };
        processGltf(gltf, options)
            .then(function(results) {
                fsExtra.writeJsonSync(name+'-draco.gltf', results.gltf);
            });
    }
    this.test=function () {
        this.obj2gltf(1)
        this.obj2glb(2)
        this.glb2gltf(3)
        this.gltf2glb(4)
        this.draco(5)
    }
    this.test2=function () {
        this.obj2gltf0(1)
    }
}
new Format().test2()
