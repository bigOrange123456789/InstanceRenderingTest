import config from '../config/config.json'
import * as THREE from "three";
import * as dat from "dat.gui";
export class SamplePointList{
    constructor(createSphere,parentGroup,meshes){
        this.config=config.src.SamplePointList
        this.parentGroup=parentGroup
        this.meshes=meshes
        this.polarAngle  =Math.PI/2
        this.azimuthAngle=0
        this.list=this.createSphere0(createSphere)
        this.arrow=this.createArrow()
        this.eventListening()
    }
    getDirection(){
        let polarAngle=this.polarAngle 
        let azimuthAngle=this.azimuthAngle
        let position=this.sphere.position
        var d={
            "x":Math.sin(polarAngle) * Math.cos(azimuthAngle),
            "y":position.y+Math.cos(polarAngle),
            "z":position.z+Math.sin(polarAngle) * Math.sin(azimuthAngle)
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
            // m=(m+1)/2
            // m-=0.4
            if(m<0)m=0

            // console.log(m)
            // if(m<0||m>1)console.log(m)
            // console.log(m)

            return m
        }
        // console.log("*")
        return [
            getMul(d,d1),getMul(d,d2),getMul(d,d3),getMul(d,d4),getMul(d,d5),getMul(d,d6)
        ]
    }
    showVDbyColor(){
        const self=this
        const d=this.getDirection()
        for(let i=0;i<self.meshes.length;i++){
            const mesh=self.meshes[i]
            mesh.vvd=mesh.vvd1*d[0]+
                     mesh.vvd2*d[1]+
                     mesh.vvd3*d[2]+
                     mesh.vvd4*d[3]+
                     mesh.vvd5*d[4]+
                     mesh.vvd6*d[5]
            if(mesh.vvd>0)
            console.log([
                    mesh.vvd1+","+d[0],
                     mesh.vvd2+","+d[1],
                     mesh.vvd3+","+d[2],
                     mesh.vvd4+","+d[3],
                     mesh.vvd5+","+d[4],
                     mesh.vvd6+","+d[5]
            ])
            const color=mesh.material.color
            if(mesh.vvd==0){
                color.r=0.5
                color.g=color.b=1
                mesh.material.opacity=0.1
            }else{
                color.r=1-mesh.vvd*1000000
                if(color.r<0.3)color.r=0.3
                color.g=color.b=0
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
        arrowHelper.scale.set(200,200,400)
        arrowHelper.position.set(-999999999,-9999999,99999)
        // const obj=new THREE.Object3D()
        obj.rotation.y//=Math.PI/2
        arrowHelper.add(obj)
        this.parentGroup.add(arrowHelper)

        // 创建一个 dat.GUI 控制器
        const gui = new dat.GUI();
        // 创建一个包含 Vector3 的对象，并设置默认值
        const params = {
            rotation: {
                "polarAngle": Math.PI/2,    // 俯仰角
                "azimuthAngle":0     // 偏航角
            }
        };
        let polarAngle=self.polarAngle  =Math.PI/2
        let azimuthAngle=self.azimuthAngle=0

        const currentDirection = new THREE.Vector3();
        arrowHelper.getWorldDirection(currentDirection);// 计算物体当前朝向向量
        const quaternion = new THREE.Quaternion().setFromUnitVectors(currentDirection, new THREE.Vector3(
            arrowHelper.position.x+Math.sin(polarAngle) * Math.cos(azimuthAngle),
            arrowHelper.position.y+Math.cos(polarAngle),
            arrowHelper.position.z+Math.sin(polarAngle) * Math.sin(azimuthAngle)
        ));// 使用 setFromUnitVectors() 方法计算旋转四元数
        arrowHelper.setRotationFromQuaternion(quaternion);// 将四元数应用到物体的旋转中

        // 添加控制面板
        gui.add(params.rotation, "azimuthAngle", 0, 2*Math.PI).onChange((value) => {
            var polarAngle  =params.rotation.polarAngle
            var azimuthAngle=params.rotation.azimuthAngle
            self.polarAngle  =params.rotation.polarAngle
            self.azimuthAngle=params.rotation.azimuthAngle
            arrowHelper.lookAt(
                arrowHelper.position.x+Math.sin(polarAngle) * Math.cos(azimuthAngle),
                arrowHelper.position.y+Math.cos(polarAngle),
                arrowHelper.position.z+Math.sin(polarAngle) * Math.sin(azimuthAngle)
            )
            self.showVDbyColor()
        });

        return arrowHelper
    }
    createSphere0(c){
        let self=this
        const list=[]
        for(let x=c.x[0];x<=c.x[1];x=x+c.x[2])
            for(let y=c.y[0];y<=c.y[1];y=y+c.y[2])
                for(let z=c.z[0];z<=c.z[1];z=z+c.z[2]){
                    let geometry,material
                    {
                        geometry = new THREE.SphereGeometry( 
                            c.r,//c.r*(-0.4+1.4*self.config.entropy[name]/entropyMax), 
                            32, 16 );
                        material = new THREE.MeshBasicMaterial( {color:0x008f8f} );
                    }
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
                    if(i in sphere.vvd["6"])mesh.vvd5=sphere.vvd["6"][i];else mesh.vvd6=0                    
                }
                self.showVDbyColor()
                for(let i=0;i<self.list.length;i++){
                    const s=self.list[i]
                    const color=s.material.color
                    color.g=color.b=1
                }
                sphere.material.color.g=sphere.material.color.b=0
                console.log(sphere,sphere.vvd)              
                
            }
        }
        window.addEventListener("mousedown", onMouseDown, false);

    }


}