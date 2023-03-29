import * as THREE from "three";
import {GLTFLoader} from "three/examples/jsm/loaders/GLTFLoader"
import {OBJExporter} from "three/examples/jsm/exporters/OBJExporter"
// import {GLTFExporter} from "three/examples/jsm/exporters/GLTFExporter.js"
import { saveAs } from 'file-saver';
import config from '../config/config.json'
import { Array2D } from './Array2D.js'
export class Building{
    constructor(scene){
        this.config=config.src.Building_new
        this.parentGroup = new THREE.Group()
        scene.add(this.parentGroup)
        this.load0(this.config.path)
        
        var a=new Array2D({
            x:{
                start:this.config.createSphere.x[0],
                end  :this.config.createSphere.x[1],
                step :this.config.createSphere.x[2]
            },
            y:{
                start:this.config.createSphere.y[0],
                end  :this.config.createSphere.y[1],
                step :this.config.createSphere.y[2]
            },
            entropy:this.config.entropy
        })
        a.detect()
        this.kernelPosition=a.kernelPosition
        console.log("a.kernelPosition",a.kernelPosition)
        window.a=a
        
        this.createSphere(this.config.createSphere)
    }
    createSphere(c){
        let self=this
        let entropyMax=0.001
        for(let name in self.config.entropy){
            if(self.config.entropy[name]>entropyMax)entropyMax=self.config.entropy[name]
        }
        let test=[]
        for(let x=c.x[0];x<=c.x[1];x=x+c.x[2])
            for(let y=c.y[0];y<=c.y[1];y=y+c.y[2])
                for(let z=c.z[0];z<=c.z[1];z=z+c.z[2]){
                    test.push([x,y,z])
                    let geometry,material
                    let name=(x+","+y+","+z)
                    let flag=false
                    for(let i=0;i<self.kernelPosition.length;i++){
                        const p=self.kernelPosition[i]
                        if( (p[0]+","+p[1]+",-10")==name)flag=true
                    }
                    // if(flag){//
                    if(name==self.config["kernelPosition"]){
                        geometry = new THREE.SphereGeometry( c.r, 32, 16 );
                        material = new THREE.MeshBasicMaterial( {color:0xff0000} );
                    }else{
                        geometry = new THREE.SphereGeometry( 
                            c.r,//c.r*(-0.4+1.4*self.config.entropy[name]/entropyMax), 
                            32, 16 );
                        material = new THREE.MeshBasicMaterial( {color:0x00ffff} );
                        material.color.r=material.color.g=material.color.b=
                            (-0.1+1.1*self.config.entropy[name]/entropyMax)
                        material.color.g-=0.2
                        material.color.b-=0.2
                    }
                    const sphere = new THREE.Mesh( geometry, material );
                    sphere.position.set(x,y,z)
                    self.parentGroup.add( sphere )
                    if( name==self.config["kernelPosition"] )window.sphere=sphere
                }
    }
    load0(path){
        var self=this
        const loader = new GLTFLoader();
        loader.load(path, function (gltf) {
            const meshes=[]
            let matrices_all=""
            gltf.scene.traverse(o=>{
                if(o instanceof THREE.Mesh){                    
                    const mesh=new THREE.Mesh(
                        o.geometry,
                        new THREE.MeshBasicMaterial({color:1000000*meshes.length})
                    )

                    mesh.position.set(o.position.x,o.position.y,o.position.z)
                    mesh.rotation.set(o.rotation.x,o.rotation.y,o.rotation.z)
                    mesh.scale.set(o.scale.x,o.scale.y,o.scale.z)
                    mesh.name=o.name
                    meshes.push(mesh)
                    o.parent.add(mesh)
                    o.visible=false
                    matrices_all=matrices_all+"[], "
                }
            })
            console.log(meshes)
            self.parentGroup.add(gltf.scene)
            console.log("matrices_all",matrices_all)

            const loading = function(index){
                console.log(index,index+".obj")
                self.saveMesh(meshes[index],index+".obj")
                if(index+1>=meshes.length) {
                    console.log("finish!")
                }else{
                    setTimeout(()=>{
                        loading(index+1)
                    },100)
                }
            }
            window.download=()=>{
                loading(0)
            }
            window.downloadAll=()=>{
                self.saveMesh(self.parentGroup,"all.obj")
            }
        }, undefined, function (error) {
            console.error(error);
        });

    }
    saveMesh(mesh,name){
        const scene=new THREE.Scene()
        // mesh.geometry.attributes.normal=null
        // mesh.geometry.attributes={
        //     position:mesh.geometry.attributes.position
        // }
        scene.add(mesh)
        scene.traverse(o=>{
            if(o instanceof THREE.Mesh)
                o.geometry.attributes={position:o.geometry.attributes.position}
        })
        const objData = new OBJExporter().parse(scene, { includeNormals: false });

        // 将数据保存为OBJ文件
        const blob = new Blob([objData], { type: 'textain' });
        saveAs(blob, name);
    }
    saveMeshGltf(mesh,name){
        // const scene=new THREE.Scene()
        // mesh.geometry.attributes.normal=null
        // mesh.geometry.attributes={
        //     position:mesh.geometry.attributes.position
        // }
        // scene.add(mesh)
        // const gltf=new GLTFExporter().parse( scene);

        // // 将数据保存为OBJ文件
        // const blob =  new Blob( [ JSON.stringify( gltf ) ], { type: 'application/octet-stream' } );
        // saveAs(blob, name);
    }
}
