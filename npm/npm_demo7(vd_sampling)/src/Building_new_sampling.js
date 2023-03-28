import * as THREE from "three";
import {GLTFLoader} from "three/examples/jsm/loaders/GLTFLoader"
import {OBJExporter} from "three/examples/jsm/exporters/OBJExporter"
import { saveAs } from 'file-saver';
import config from '../config/config.json'

export class Building{
    constructor(scene){
        this.config=config.src.Building_new
        this.parentGroup = new THREE.Group()
        scene.add(this.parentGroup)
        this.load0(this.config.path)
        this.createSphere(this.config.createSphere)
    }
    createSphere(c){
        let self=this
        let test=[]
        console.log(self.config["kernelPosition"])
        for(let x=c.x[0];x<=c.x[1];x=x+c.x[2])
            for(let y=c.y[0];y<=c.y[1];y=y+c.y[2])
                for(let z=c.z[0];z<=c.z[1];z=z+c.z[2]){
                    test.push([x,y,z])
                    let geometry,material
                    if((x+","+y+","+z)==self.config["kernelPosition"]){
                        geometry = new THREE.SphereGeometry( c.r, 32, 16 );
                        material = new THREE.MeshBasicMaterial( {color:0xff0000} );
                    }else{
                        geometry = new THREE.SphereGeometry( c.r, 32, 16 );
                        material = new THREE.MeshBasicMaterial( {color:0x00ffff} );
                    }
                    
                    const sphere = new THREE.Mesh( geometry, material );
                    sphere.position.set(x,y,z)
                    self.parentGroup.add( sphere )
                    if( (x+","+y+","+z)==self.config["kernelPosition"] )window.sphere=sphere

                }
        console.log("test",test)
    }
    load0(path){
        var self=this
        const loader = new GLTFLoader();
        loader.load(path, function (gltf) {
            let arr=gltf.scene.children[0].children[0].children
            const arr2=[]
            let matrices_all=""//[]
            for(let i=0;i<arr.length;i++){
                var mesh=arr[i]
                var name=mesh.name
                var id=parseInt(name.split("_")[1])
                // if(id>=2)mesh.visible=false
                mesh.id0=id
                arr2.push(mesh)
                // console.log(mesh.material)
                // var color=mesh.material.color
                // color.r=0
                // color.g=id/15
                // color.b=0

                matrices_all=matrices_all+"[], "//.push([])

                var material2=new THREE.MeshBasicMaterial({color:id})
                material2.color.convertSRGBToLinear();
                var mesh2=new THREE.Mesh(mesh.geometry,material2)
                self.parentGroup.add(mesh2)
                mesh2.matrixWorld=mesh.matrixWorld
                mesh.visible=false
            }
            console.log(arr)
            self.parentGroup.add(gltf.scene)
            console.log(matrices_all)

            arr=arr2
            const loading = function(index){
                console.log(index,arr[index].id0+".obj")
                self.saveMesh(arr[index],arr[index].id0+".obj")
                if(index+1>=arr.length) {
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
            
        }, undefined, function (error) {
            console.error(error);
        });

    }
    saveMesh(mesh,name){
        const scene=new THREE.Scene()
        mesh.geometry.attributes.normal=null
        mesh.geometry.attributes={
            position:mesh.geometry.attributes.position
        }
        scene.add(mesh)
        const objData = new OBJExporter().parse(scene, { includeNormals: false });

        // 将数据保存为OBJ文件
        const blob = new Blob([objData], { type: 'textain' });
        saveAs(blob, name);
    }
    saveJson(myObj,name){
        // 将JSON对象转换为JSON字符串
        var jsonString = JSON.stringify(myObj);

        // 创建一个Blob对象，将JSON字符串作为数据
        var blob = new Blob([jsonString], { type: "application/json" });

        // 创建一个链接，指向这个Blob对象
        var url = URL.createObjectURL(blob);

        // 创建一个a标签，设置下载链接和文件名
        var a = document.createElement("a");
        a.href = url;
        a.download = name;

        // 模拟点击a标签，触发文件下载
        a.click();
    }


}
