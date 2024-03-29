import * as THREE from "three";
import {GLTFLoader} from "three/examples/jsm/loaders/GLTFLoader"
import {OBJExporter} from "three/examples/jsm/exporters/OBJExporter"
// import {GLTFExporter} from "three/examples/jsm/exporters/GLTFExporter.js"
import { saveAs } from 'file-saver';
import config from '../config/config.json'
import { Array3D } from './Array3D.js'
export class Building{
    constructor(scene){
        
        this.config=config.src.Building_new
        this.parentGroup = new THREE.Group()
        scene.add(this.parentGroup)
        this.load0(this.config.path)
        
        var a=new Array3D({
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
            z:{
                start:this.config.createSphere.z[0],
                end  :this.config.createSphere.z[1],
                step :this.config.createSphere.z[2]
            },
            entropy:this.config.entropy
        })
        this.colorList=a.colorList
        a.detect()
        this.kernelPosition=a.convexDot
        this.color_convexDot=a.color_convexDot
        this.convexArea=a.convexArea
        window.a=a
        
        // this.createCube2(this.config.createSphere)
        this.createKernel(this.config.block2Kernel)

        // this.createSphere0(this.config.createSphere)//每个小球的颜色都一样
        // this.createSphere1(this.config.createSphere)
        // this.createSphere2(this.config.createSphere)//展示凸局域分布情况 //不显示核视点 每一块视点使用不同颜色
    }
    createSphere0(c){
        let self=this
        
        let test=[]
        for(let x=c.x[0];x<=c.x[1];x=x+c.x[2])
            for(let y=c.y[0];y<=c.y[1];y=y+c.y[2])
                for(let z=c.z[0];z<=c.z[1];z=z+c.z[2]){
                    test.push([x,y,z])
                    let geometry,material
                    let name=(x+","+y+","+z)
                    {
                        geometry = new THREE.SphereGeometry( 
                            c.r,//c.r*(-0.4+1.4*self.config.entropy[name]/entropyMax), 
                            32, 16 );
                        material = new THREE.MeshBasicMaterial( {color:0x00ffff} );
                    }
                    const sphere = new THREE.Mesh( geometry, material );
                    sphere.position.set(x,y,z)
                    self.parentGroup.add( sphere )
                    if( name==self.config["kernelPosition"] )window.sphere=sphere
                }
    }
    createKernel(kernel){
        for(let blockId in kernel){
            let k=kernel[blockId]
            let a=k.split(",")
            let geometry = new THREE.SphereGeometry( 
                    this.config.createSphere.r,//c.r*(-0.4+1.4*self.config.entropy[name]/entropyMax), 
                    32, 16 );
            let material = new THREE.MeshBasicMaterial( {color:0xff0000} );
                
            const sphere = new THREE.Mesh( geometry, material );
            if(a[0]+","+a[1]+","+a[2]!=="190,85,20")sphere.visible=false
            sphere.position.set(a[0],a[1],a[2])
            this.parentGroup.add( sphere )
        }
    }
    createCube0(c){
        let self=this
        
        let size=c.x[2]
        for(let x=c.x[0];x<=c.x[1];x=x+c.x[2])
            for(let y=c.y[0];y<=c.y[1];y=y+c.y[2])
                for(let z=c.z[0];z<=c.z[1];z=z+c.z[2]){
                    var geometry,material
                    {
                        geometry = new THREE.BoxGeometry(size, size, size);
                        material = new THREE.MeshBasicMaterial( {
                            color:0x00ffff, 
                            opacity: 0.3, 
                            transparent: true
                        } );
                    }
                    const cube = new THREE.Mesh( geometry, material );
                    cube.position.set(x,y,z)
                    self.parentGroup.add( cube )

                    // 创建EdgesGeometry对象
                    var edges = new THREE.EdgesGeometry(new THREE.BoxGeometry(size, size, size));
                    var material = new THREE.LineBasicMaterial({
                        color: 0x000000,
                        opacity: 0.3, 
                        transparent: true
                    });
                    var line=new THREE.LineSegments(edges, material)
                    line.position.set(x,y,z)
                    self.parentGroup.add(
                        line
                    );

                }
    }
    createSphere1(c){
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
                    if(flag){//
                    // if(name==self.config["kernelPosition"]){
                        geometry = new THREE.SphereGeometry( c.r, 32, 16 );
                        material = new THREE.MeshBasicMaterial( {color:0xff0000} );
                    }else{
                        geometry = new THREE.SphereGeometry( 
                            c.r,//c.r*(-0.4+1.4*self.config.entropy[name]/entropyMax), 
                            32, 16 );
                        material = new THREE.MeshBasicMaterial( );
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
    createSphere2(c){//展示凸区域
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
                    const color=this.color_convexDot[
                        this.convexArea[x][y][z]
                    ]
                    geometry = new THREE.SphereGeometry(c.r,32, 16 )
                    material = new THREE.MeshBasicMaterial()
                    material.color.r=color[0]
                    material.color.g=color[1]
                    material.color.b=color[2]
                    
                    const sphere = new THREE.Mesh( geometry, material );
                    sphere.position.set(x,y,z)
                    self.parentGroup.add( sphere )
                }
    }
    createCube2(c){//展示凸区域
        let self=this
        let entropyMax=0.001
        for(let name in self.config.entropy){
            if(self.config.entropy[name]>entropyMax)entropyMax=self.config.entropy[name]
        }
        let size=c.x[2]
        for(let x=c.x[0];x<=c.x[1];x=x+c.x[2])
            for(let y=c.y[0];y<=c.y[1];y=y+c.y[2])
                for(let z=c.z[0];z<=c.z[1];z=z+c.z[2]){
                    // const color=this.color_convexDot[
                    //     this.convexArea[x][y][z]
                    // ]
                    // console.log("this.color_convexDot",this.color_convexDot)
                    // console.log("this.convexArea[x][y][z]",this.convexArea[x][y][z])
                    // console.log("color",color)
                    const color=this.colorList[
                        self.config.blocking[x+','+y+","+z]
                    ]
                    
                    var geometry,material
                    geometry = new THREE.BoxGeometry(size, size, size);
                    material = new THREE.MeshBasicMaterial( {
                            opacity: 0.3, 
                            transparent: true
                    } );
                    material.color.r=color[0]
                    material.color.g=color[1]
                    material.color.b=color[2]
                    
                    const cube = new THREE.Mesh( geometry, material );
                    cube.position.set(x,y,z)
                    self.parentGroup.add( cube )
                    // 创建EdgesGeometry对象
                    var edges = new THREE.EdgesGeometry(new THREE.BoxGeometry(size, size, size));
                    var material = new THREE.LineBasicMaterial({
                        color: 0x000000,
                        opacity: 0.1,//0.3, 
                        transparent: true
                    });
                    var line=new THREE.LineSegments(edges, material)
                    line.position.set(x,y,z)
                    // self.parentGroup.add(line);

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
                    const mesh=o
                    // if(meshes.length!=91)mesh.visible=false
                    meshes.push(mesh)
                    const id=mesh.name.split("_")[1]
                    // mesh.visible=self.config.iswall[parseInt(id)]
                    matrices_all=matrices_all+"[], "
                }
            })
            // console.log(meshes)
            self.parentGroup.add(gltf.scene)
            // console.log("matrices_all",matrices_all)

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
