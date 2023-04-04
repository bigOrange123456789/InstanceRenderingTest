import * as THREE from "three";
import {GLTFLoader} from "three/examples/jsm/loaders/GLTFLoader"
import {OBJExporter} from "three/examples/jsm/exporters/OBJExporter"
import { saveAs } from 'file-saver';
import config from '../../config/configOP.json'
import { Visibility } from './Visibility.js'
export class Building{
    constructor(scene,camera){
        document.getElementById("LoadProgress").innerHTML=""
        let self=this
        this.scene=scene
        
        this.config=config.src.Building_new
        this.NumberOfComponents=this.config.NumberOfComponents

        window.config0=this.config
        this.parentGroup = new THREE.Group()
        this.parentGroup.scale.set(
            this.config.parentGroup.scale.x,
            this.config.parentGroup.scale.y,
            this.config.parentGroup.scale.z
        )
        scene.add(this.parentGroup)
        this.meshes={}
        this.meshes_request={}
        // this.load0()
        let c=this.config.createSphere
        c={
            "x": [
                -121000,
                117000,
                2000
            ],
            "y": [
                2286.5,
                2286.5,
                2000
            ],
            "z": [
                -4000,
                16000,
                2000
            ],
            "r": 250
        }
        new Visibility(
            {
                "min": [c.x[0],c.y[0],c.z[0]],
                "max": [c.x[1],c.y[1],c.z[1]],
                "step": [
                    (c.x[1]-c.x[0])/c.x[2],
                    (c.y[1]-c.y[0])/c.y[2],
                    (c.z[1]-c.z[0])/c.z[2]
                ]
            },
            camera,
            list=>{
                self.loading(list)
            }
        )
        this.doorTwinkle()
        this.createFloor()
    }
    createFloor(){
        const geometry = new THREE.BoxGeometry( 1000000, 1000, 50000 );
        const material = new THREE.MeshBasicMaterial( {color: 0x654321} );
        const floor = new THREE.Mesh( geometry, material );
        window.floor=floor
        this.parentGroup.add( floor );
    }
    doorTwinkle(){
        const self=this
        setInterval(()=>{
            for(let id in self.meshes){
                if(self.config.isdoor[""+id]==1)
                    self.meshes[id].visible=!self.meshes[id].visible
            }

        },500)
    }
    addMesh(id,mesh){
        // console.log(id,mesh.name)
        // mesh=new THREE.Mesh(
        //     mesh.geometry,
        //     new THREE.MeshBasicMaterial( {
        //         color:0x0ff0f0,
        //         transparent:true,
        //         opacity:1
        //     } )
        // )
        // console.log(mesh)
        // mesh.visible=false
        mesh.myId=id

        let t=mesh.myId*256*256*256/2665
        mesh.material.color.r=0.5*((t&0xff)    )/255
        mesh.material.color.g=0.5*((t&0xff00)>>8 )/255
        mesh.material.color.b=0.5*((t&0xff0000)>>16)/255
        mesh.material.transparent=true
        mesh.material.opacity    =1

        // mesh.material.color.r=mesh.material.color.g=mesh.material.color.b=0.8

        this.meshes[id]=mesh
        this.parentGroup.add(mesh)
    }
    loadGLB(id,cb){
        if(this.meshes_request[id])return
        this.meshes_request[id]=true
        var self=this
        const loader = new GLTFLoader();
        loader.load(self.config.path+id+".glb", gltf=>{
            // console.log(id)
            gltf.scene.traverse(o=>{
                if(o instanceof THREE.Mesh){                    
                    self.addMesh(id,o)
                }
            })
            if(cb)cb()
        }, undefined, function (error) {
            console.error(error);
        });
    }
    load0(){
        const self=this
        loadAll(0)
        function loadAll(index){
            self.loadGLB(index,()=>{
                setTimeout(()=>{
                    if(index+1<self.NumberOfComponents)
                        loadAll(index+1)
                },100)
            })
        }
    }
    loading(list){
        console.log("list",list)
        for(let i=0;i<50&&i<list.length;i++){
            this.loadGLB(list[i])
        }
        setTimeout(()=>{
            for(let i=50;i<list.length;i++){
                this.loadGLB(list[i])
            }
        },100)
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
    InY(mesh,ymin,ymax){
        var box = new THREE.Box3().setFromObject(mesh)
        // return box.max.y<ymax && box.min.y>ymin
        return box.min.y<ymax && box.max.y>ymin //&&box.max.z>-7766
    }
}
