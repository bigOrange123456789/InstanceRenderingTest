import * as THREE from "three";
import {GLTFLoader} from "three/examples/jsm/loaders/GLTFLoader"
import {OBJExporter} from "three/examples/jsm/exporters/OBJExporter"
import { saveAs } from 'file-saver';
import config from '../../config/config.json'

export class Building{
    constructor(scene){
        this.config=config.src.Building_new
        this.parentGroup = new THREE.Group()
        scene.add(this.parentGroup)
        this.load0(this.config.path)
    }
    load0(path){
        var self=this
        const loader = new GLTFLoader();
        loader.load(path, function (gltf) {
            gltf.scene.traverse(o=>{
                if(o instanceof THREE.Mesh){
                    const mesh=o
                    var name=mesh.name
                    var id=parseInt(name.split("_")[1])//parseInt(name)//
                    mesh.id0=id
                    
                    var material2=new THREE.MeshBasicMaterial({color:id})
                    material2.color.convertSRGBToLinear();
                    var mesh2=new THREE.Mesh(mesh.geometry,material2)
                    mesh2.position.set(o.position.x,o.position.y,o.position.z)
                    mesh2.rotation.set(o.rotation.x,o.rotation.y,o.rotation.z)
                    mesh2.scale.set(o.scale.x,o.scale.y,o.scale.z)
                    self.parentGroup.add(mesh2)
                    mesh.visible=false
                }
            })
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
