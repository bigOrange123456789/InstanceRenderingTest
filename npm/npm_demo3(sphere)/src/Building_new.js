import * as THREE from "three";
import {GLTFLoader} from "three/examples/jsm/loaders/GLTFLoader"
import config from '../config/conifg.json'
export class Building{
    constructor(scene){
        this.config=config.src.Building_new
        this.path= this.config.path//"assets/113"
        this.number=this.config.number//9
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
                    else console.log("finish!")
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
    processMesh(meshNodeList,structList,matrixList){//这个模型已经拆分好了
        for(let i=0; i<meshNodeList.length; i++){//遍历全部mesh对象
            var node = meshNodeList[i].clone()//将第i个mesh进行实例化
            var group = structList[Number(node.name)][0]//将这个mesh的全部分组信息提取出来
            var matrices = matrixList[group.n].it//获取这个分组的全部矩阵
            matrices.push([1,0,0,0,0,1,0,0,0,0,1,0])
            var instanceMesh = new THREE.InstancedMesh(node.geometry,node.material,matrices.length)
            instanceMesh.spheres_mat=[]
            for(let j=0; j<matrices.length; j++){
                var mat = matrices[j]
                var instanceMatrix = new THREE.Matrix4().set(
                    mat[0], mat[1], mat[2], mat[3],
                    mat[4], mat[5], mat[6], mat[7],
                    mat[8], mat[9], mat[10], mat[11],
                    0, 0, 0, 1)
                instanceMesh.spheres_mat.push(instanceMatrix)
                instanceMesh.setMatrixAt(j,instanceMatrix)
            }
            this.parentGroup.add(instanceMesh )
            getBoxes(this.parentGroup,instanceMesh)
        }
        
        function show(scene,sphere){//显示包围球
            var m = new THREE.Mesh( 
                    new THREE.SphereGeometry(  1, 8, 8 ), 
                    new THREE.MeshBasicMaterial( { color: 0x0faf0f } ) 
            );
            m.position.set(sphere.center.x,sphere.center.y,sphere.center.z)
            m.scale.set(sphere.radius,sphere.radius,sphere.radius)
            scene.add(m)
        }
        function getBoxes(scene,instanceMesh){//获取实例化对象对包围球
            instanceMesh.spheres=[]
            instanceMesh.geometry.computeBoundingSphere()
            for(var j=0;j<instanceMesh.spheres_mat.length;j++){
                var sphere = instanceMesh.geometry.boundingSphere.clone()
                sphere.applyMatrix4(instanceMesh.spheres_mat[j])
                sphere.applyMatrix4(instanceMesh.matrixWorld)
                instanceMesh.spheres.push(sphere)
                show(scene,sphere)
            }
        }
    }

}
