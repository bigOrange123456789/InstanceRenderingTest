import * as THREE from "three";
import JSZip from 'jszip';
import {GLTFLoader} from "three/examples/jsm/loaders/GLTFLoader"

export class Building{
    constructor(scene){
        this.path="assets/113"
        this.number=9
        this.parentGroup = new THREE.Group()
        scene.add(this.parentGroup)
        this.load()
    }
    load(){
        var self = this
        new THREE.FileLoader().load(self.path+"/structdesc.json",json=>{
            var structList = JSON.parse(json)
            new THREE.FileLoader().load(self.path+"/smatrix.json",json=>{
                var matrixList = JSON.parse(json)
                var i = 0
                var loading = setInterval(function(){
                    self.loadSubGLTF(i,structList,matrixList)
                    if(++i===self.number) clearInterval(loading)
                },10)
            })
        })
    }
    loadSubGLTF (meshIndex,structdesc0,matrixConfig){
	    const self=this;
        var url=self.path+"/output"+meshIndex+".gltf"
        console.log(url)
	    var loader=new THREE.LoadingManager()
	    new Promise(function( resolve, reject) {
		    var myGLTFLoaderEx=new GLTFLoader(loader)
		    myGLTFLoaderEx.load(url, (gltf)=>{
			    resolve(gltf)
		    },()=>{},()=>{
			    console.log("加载失败："+meshIndex)
			    setTimeout(()=>{
				    self.loadSubGLTF(meshIndex,structdesc0,matrixConfig)
			    },1000*(0.5*Math.random()+1))
		    })
	    } ).then( function ( gltf ) {
		    var meshNodeList = gltf.scene.children[0].children
            self.processMesh(meshNodeList,structdesc0,matrixConfig)
	    } )
    }
    processMesh(meshNodeList,structList,matrixList){
        for(let i=0; i<meshNodeList.length; i++){
            var node = meshNodeList[i].clone()
            var group = structList[Number(node.name)][0]
            var matrices = matrixList[group.n].it
            matrices.push([1,0,0,0,0,1,0,0,0,0,1,0])
            var instanceMesh = new THREE.InstancedMesh(node.geometry,node.material,matrices.length)
            for(let j=0; j<matrices.length; j++){
                var mat = matrices[j]
                var instanceMatrix = new THREE.Matrix4().set(
                    mat[0], mat[1], mat[2], mat[3],
                    mat[4], mat[5], mat[6], mat[7],
                    mat[8], mat[9], mat[10], mat[11],
                    0, 0, 0, 1)
                instanceMesh.setMatrixAt(j,instanceMatrix)
            }
            this.parentGroup.add(instanceMesh )
        }
    }
}
