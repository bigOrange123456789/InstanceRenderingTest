import config from '../config/config.json'
import * as THREE from "three";
import * as dat from "dat.gui";
import {OBJExporter} from "three/examples/jsm/exporters/OBJExporter"
export class SamplePointList{
    constructor(createSphere,parentGroup,meshes,entropy){
        window.showVDbyColor="evd"
        const self=this
        this.loadConfig(
            // "configVVD.json",
            "assets/configVVD.json",
            c=>{
                document.getElementById("LoadProgress").innerHTML=""
                config.src.SamplePointList["vvd"]=c
                self.init(createSphere,parentGroup,meshes,entropy)
            }
        )
    }
    loadConfig(path,cb){
        const self=this
        // 创建 XMLHttpRequest 对象
        var xhr = new XMLHttpRequest();
        // 指定请求的方法和 URL
        xhr.open('GET', path, true);
        // 发送请求
        xhr.send();
        // 监听请求状态和响应内容
        xhr.onreadystatechange = function() {
            if (this.readyState == 4 && this.status == 200) {
                var json_data = JSON.parse(xhr.responseText);
                cb(json_data)
            }
        };
    }
    init(createSphere,parentGroup,meshes,entropy){
        this.config=config.src.SamplePointList
        this.parentGroup=parentGroup
        this.meshes=meshes
        this.azimuthAngle=0//偏航角
        window.samplePointList=this
        this.radius=createSphere.r
        this.list=this.createList(createSphere)
        this.arrow=this.createArrow()
        this.eventListening()
    }
    getDirection(){
        let azimuthAngle=this.azimuthAngle
        var d={
            "x": Math.cos(azimuthAngle),
            "y": 0,
            "z": Math.sin(azimuthAngle)
        }
        var d1={x: 1, y: 0, z: 0}   //  //[0,-Math.PI/2,0]
        var d2={x: -1, y: 0, z: 0}  //  //[0,Math.PI/2,0]
        var d3={x: 0, y: 1, z: 0}   //上//[Math.PI/2,0,0]
        var d4={x: 0, y: -1, z: 0}  //下//[Math.PI*1.5,0,0]
        var d5={x: 0, y: 0, z: 1}   //  //[Math.PI,0,0]
        var d6={x: 0, y: 0, z: -1}  //  //[0,0,0]
        
        var getMul=(a,b)=>{
            let m=a.x*b.x+a.y*b.y+a.z*b.z
            let l=Math.pow((
                Math.pow(a.x,2)+
                Math.pow(a.y,2)+
                Math.pow(a.z,2)
            ),0.5)
            // console.log(l)
            m=m/l
            m=(m+1)/2
            m-=0.25
            if(m<0)m=0

            return m
        }
        return [
            getMul(d,d1),getMul(d,d2),getMul(d,d3),getMul(d,d4),getMul(d,d5),getMul(d,d6)
        ]
    }
    showVDbyColor(){
        const self=this
        const d=this.getDirection()
        for(let i=0;i<self.meshes.length;i++){
            const mesh=self.meshes[i]
            const evd=mesh.vvd1*d[0]+
                     mesh.vvd2*d[1]+
                     mesh.vvd3*d[2]+
                     mesh.vvd4*d[3]+
                     mesh.vvd5*d[4]+
                     mesh.vvd6*d[5]
            const pvd=mesh.pvd
            const vd=showVDbyColor=="pvd"?pvd:evd
            const color=mesh.material.color
            if(vd==0){
                color.r=0.5
                color.g=color.b=1
                mesh.material.opacity=0.1
            }else if(showVDbyColor=="evd"){
                color.r=1-vd*50
                if(color.r<0.3)color.r=0.3
                color.g=color.b=0
                mesh.material.opacity=1
            }else{
                color.g=1-vd*50
                if(color.g<0.3)color.g=0.3
                color.r=color.b=0
                mesh.material.opacity=1
            }
        }
    }
    createArrow(){
        const self=this
        const origin = new THREE.Vector3(0, 0, 0); // 箭头起点
        const direction = new THREE.Vector3(1, 0, 0); // 箭头方向
        const length = 5; // 箭头长度
        const color = 0xff0000; // 箭头颜色

        const arrowHelper = new THREE.Object3D()
        const obj= new THREE.ArrowHelper(direction, origin, length, color);
        arrowHelper.scale.set(200,200,200)
        arrowHelper.position.set(-999999999,-9999999,99999)
        obj.rotation.y=-Math.PI/2
        arrowHelper.add(obj)
        this.parentGroup.add(arrowHelper)

        
        const gui = new dat.GUI();// 创建一个 dat.GUI 控制器
        const params = {// 创建一个包含 Vector3 的对象，并设置默认值
            rotation: {
                "polarAngle": Math.PI/2,    // 俯仰角
                "azimuthAngle":0     // 偏航角
            }
        };
        let azimuthAngle=self.azimuthAngle
        arrowHelper.lookAt(
            arrowHelper.position.x+Math.cos(azimuthAngle),
            arrowHelper.position.y,
            arrowHelper.position.z+Math.sin(azimuthAngle)
        )
        // 添加控制面板
        gui.add(params.rotation, "azimuthAngle", 0, 2*Math.PI).onChange((value) => {
            var azimuthAngle=params.rotation.azimuthAngle
            self.azimuthAngle=params.rotation.azimuthAngle
            arrowHelper.lookAt(
                arrowHelper.position.x+Math.cos(azimuthAngle),
                arrowHelper.position.y,
                arrowHelper.position.z+Math.sin(azimuthAngle)
            )
            self.showVDbyColor()
        });

        return arrowHelper
    }
    createList(c){
        let self=this
        const list=[]
        for(let x=c.x[0];x<=c.x[1];x=x+c.x[2])
            for(let y=c.y[0];y<=c.y[1];y=y+c.y[2])
                for(let z=c.z[0];z<=c.z[1];z=z+c.z[2]){
                    let geometry = new THREE.SphereGeometry( 
                            c.r,//c.r*(-0.4+1.4*self.config.entropy[name]/entropyMax), 
                            32, 16 );
                    let material = new THREE.MeshBasicMaterial( {color:0x008f8f} );
                    material.color.r=0.5
                    material.color.g=material.color.b=1
                    const sphere = new THREE.Mesh( geometry, material );
                    sphere.position.set(x,y,z)
                    sphere.name=x+","+y+","+z
                    sphere.vvd=self.config.vvd[sphere.name]
                    list.push(sphere)
                    self.parentGroup.add( sphere )
                }
        return list
    }
    eventListening(){
        const self=this
        const mouse = new THREE.Vector2();
        function onMouseDown(event) {
            // 计算鼠标点击位置
            mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
            mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
            // 进行射线检测
            checkIntersection();
        }
        const raycaster = new THREE.Raycaster();
        function checkIntersection() {
            raycaster.setFromCamera(mouse, camera);
            // 检测交叉物体
            // console.log(self.list)
            const intersects = raycaster.intersectObjects(self.list);
            // console.log("intersects",intersects)
            if (intersects.length > 0) {// 有交叉物体                
                const sphere=intersects[0].object
                self.sphere=sphere
                self.arrow.position.set(
                    sphere.position.x,
                    sphere.position.y,
                    sphere.position.z
                )
                for(let i=0;i<self.meshes.length;i++){
                    const mesh=self.meshes[i]
                    if(i in sphere.vvd["1"])mesh.vvd1=sphere.vvd["1"][i];else mesh.vvd1=0
                    if(i in sphere.vvd["2"])mesh.vvd2=sphere.vvd["2"][i];else mesh.vvd2=0
                    if(i in sphere.vvd["3"])mesh.vvd3=sphere.vvd["3"][i];else mesh.vvd3=0
                    if(i in sphere.vvd["4"])mesh.vvd4=sphere.vvd["4"][i];else mesh.vvd4=0
                    if(i in sphere.vvd["5"])mesh.vvd5=sphere.vvd["5"][i];else mesh.vvd5=0
                    if(i in sphere.vvd["6"])mesh.vvd6=sphere.vvd["6"][i];else mesh.vvd6=0  
                    if(i in sphere.vvd["pvd"])mesh.pvd=sphere.vvd["pvd"][i];else mesh.pvd=0                    
                }
                self.showVDbyColor()
                for(let i=0;i<self.list.length;i++){
                    const s=self.list[i]
                    const color=s.material.color
                    color.g=color.b=1
                }
                sphere.material.color.g=sphere.material.color.b=0
                console.log("视点球:",sphere,sphere.vvd)              
                
            }
            raycaster.setFromCamera(mouse, camera);
            const intersects2= raycaster.intersectObjects(self.meshes);
            if(intersects2.length>0){
                let mesh=intersects2[0].object
                console.log("模型构件:",mesh)
            }
        }
        window.addEventListener("mousedown", onMouseDown, false);
    }
    download(){
        const self=this
        const startIndex=self.meshes.length
        for(let i=0;i<self.list.length;i++){
            const s=self.list[i]
            // s.scale.x/=10
            // s.scale.y/=10
            // s.scale.z/=10
            s.position.x-=this.radius*5
            s.position.z-=this.radius*5
            s.position.y-=this.radius*5
        }
        return
        function saveMesh(mesh,name){
            const scene=new THREE.Scene()
            scene.add(mesh)
            scene.traverse(o=>{
                if(o instanceof THREE.Mesh)
                    o.geometry.attributes={position:o.geometry.attributes.position}
            })
            const objData = new OBJExporter().parse(scene, { includeNormals: false });
            const blob = new Blob([objData], { type: 'textain' });// 将数据保存为OBJ文件
            saveAs(blob, name);
        }
        const save = function(index){
            saveMesh(self.list[index-startIndex],index+".obj")
            if(index+1-startIndex>=self.list.length) {
                console.log("finish!")
            }else{
                setTimeout(()=>{
                    save(index+1)
                },100)
            }
        }
        save(startIndex)
    }


}