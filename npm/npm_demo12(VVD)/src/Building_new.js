import * as THREE from "three";
import {GLTFLoader} from "three/examples/jsm/loaders/GLTFLoader"
import {OBJExporter} from "three/examples/jsm/exporters/OBJExporter"
import { saveAs } from 'file-saver';
import config from '../config/config.json'
import { Array3D } from './Array3D.js'
import { SamplePointList } from './SamplePointList.js'
export class Building{
    constructor(scene){
        this.scene=scene
        
        this.config=config.src.Building_new
        this.parentGroup = new THREE.Group()
        this.parentGroup.scale.set(
            this.config.parentGroup.scale.x,
            this.config.parentGroup.scale.y,
            this.config.parentGroup.scale.z
        )
        scene.add(this.parentGroup)
        this.meshes=[]
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

        new SamplePointList(this.config.createSphere,this.parentGroup,this.meshes)
        
        // this.createCube2(this.config.createSphere)
        // this.createKernel(this.config.block2Kernel)

        // this.createSphere1(this.config.createSphere)
        // this.createSphere2(this.config.createSphere)//展示凸局域分布情况 //不显示核视点 每一块视点使用不同颜色
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
            let matrices_all=""
            gltf.scene.traverse(o=>{
                if(o instanceof THREE.Mesh){                    
                    const mesh=o
                    // console.log()
                    let t=self.meshes.length*256*256*256/2665
                    mesh.material.color.r=0.5*((t&0xff)    )/255
                    mesh.material.color.g=0.5*((t&0xff00)>>8 )/255
                    mesh.material.color.b=0.5*((t&0xff0000)>>16)/255
                    mesh.material.color.r=mesh.material.color.g=mesh.material.color.b=0.8
                    mesh.material.opacity=1
                    mesh.material.transparent=true
                    // console.log(mesh.material.color)
                    self.meshes.push(mesh)
                    const id=mesh.name.split("_")[1]
                    matrices_all=matrices_all+"[], "
                }
            })
            // console.log("matrices_all",matrices_all)
            self.parentGroup.add(gltf.scene)
            window.meshes=self.meshes
            window.getOneStorey=(a,b)=>{
                if (!window.downBox){
                    window.downBox= new THREE.Mesh( 
                        new THREE.BoxGeometry( 1000000, 0.001, 100000 ), 
                        new THREE.MeshBasicMaterial( {color: 0x00ff00,opacity: 0.3, transparent: true} ) );
                    self.scene.add(window.downBox)
                    window.upBox= new THREE.Mesh( 
                        new THREE.BoxGeometry( 1000000, 0.001, 100000 ), 
                        new THREE.MeshBasicMaterial( {color: 0x00ff00,opacity: 0.3, transparent: true} ) );
                    self.scene.add(window.upBox)
                }
                window.downBox.position.y=a
                window.upBox.position.y=b

                for(let i=0;i<meshes.length;i++){
                    meshes[i].visible = self.InY(meshes[i],a,b)
                }
            }
            //test(450,3400);//test(50,3400);// test(50,3400);

            const save = function(index){
                console.log(index,index+".obj")
                self.saveMesh(meshes[index],index+".obj")
                if(index+1>=meshes.length) {
                    console.log("finish!")
                }else{
                    setTimeout(()=>{
                        save(index+1)
                    },100)
                }
            }
            window.save=()=>{
                save(0)
            }
            window.downloadAll=()=>{
                const scene=new THREE.Scene()
                for(let i=0;i<meshes.length;i++){
                    const o=meshes[i]
                    if(o instanceof THREE.Mesh&&o.visible){
                        // o.geometry.attributes={position:o.geometry.attributes.position}
                        scene.add(o)
                    }
                }
                const objData = new OBJExporter().parse(scene);
                const blob = new Blob([objData], { type: 'textain' });
                saveAs(blob, "all.obj");
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
    InY(mesh,ymin,ymax){
        var box = new THREE.Box3().setFromObject(mesh)
        // return box.max.y<ymax && box.min.y>ymin
        return box.min.y<ymax && box.max.y>ymin //&&box.max.z>-7766
    }
}
