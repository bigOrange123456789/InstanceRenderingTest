import * as THREE from "three";
class LightProducer{
    constructor(scene){
        this.scene=scene
        // Lights 
        const ambient = new THREE.AmbientLight( 0xffffff ,1.);//new THREE.AmbientLight( 0xffffff ,.8);
        scene.add( ambient );
        ambient.name="ambient"

        // const Light1 = new THREE.PointLight( 0xffffff, 0.7, 10000 ,1.5)//new THREE.DirectionalLight( 0xffddcc, 0.5 );
        // Light1.position.set( 0.2001199212621189,  1.8324430884592016,  -0.285745579849489)//( 10, 10, 10 );
        // scene.add( Light1 );
        // Light1.name="Light1"

        // const Light2 = new THREE.DirectionalLight( 0xcffffff,0.5 );
        // Light2.position.set( -20, 0, 0 );
        // scene.add( Light2 )
        // Light2.name="dirLight2"


        //创建区域光 
        // let rectLight = new THREE.RectAreaLight(0xffffff,1500,5,5);
        // //设置区域光位置
        // rectLight.position.set(0,50,0);
        // //设置区域光旋转角度
        // rectLight.rotation.x = 0.5*Math.PI;
        // //将区域光添加进场景
        // scene.add(rectLight);
        //创建区域光辅助器
        // let rectLightHelper = new THREE.RectAreaLightHelper(rectLight,0xff0000);
        //将区域光辅助器添加进场景
        // scene.add(rectLightHelper);

        // const light1=new THREE.Object3D()
        setTimeout(()=>{
            scene.add(this.getSpotGroup())
        },3000)
        
        // light1.

    }
    getSpotGroup(){
        const light=new THREE.Object3D()
        for(let i=0;i<3;i++){
            light.add(this.getSpotLight())
        }
        return light
    }
    getSpotLight(){
        const spotLight = new THREE.SpotLight( 
            Math.floor(0xffffff*Math.random()),//0xffffff,
            10 ,
            10000,
            Math.PI*(Math.random()*5+4.5)/60,
            0,
            0,
            );
        spotLight.position.set(0,50,0)
        // spotLight.castShadow = true
        this.scene.add(spotLight.target)
        const speed=0.003*(Math.random()+0.2)

        const tool=new THREE.Object3D();
        tool.rotation.y=Math.random()*100
        const x=80*(Math.random()+0.01);
        const y=-0.1;
        const z=80*(Math.random()+0.01);
        setInterval(()=>{
            tool.rotation.y+=speed
            tool.updateMatrix();
            const e=tool.matrix.elements
            const x2=x*e[0]+y*e[4]+z*e[8]
            const y2=x*e[1]+y*e[5]+z*e[9]
            const z2=x*e[2]+y*e[6]+z*e[10]
            // console.log()
            spotLight.target.position.set(x2,y2,z2)

        },1/60)

// color - (optional) hexadecimal color of the light. Default is 0xffffff (white).
// intensity - (optional) numeric value of the light's strength/intensity. Default is 1.
// distance - Maximum range of the light. Default is 0 (no limit).
// angle - Maximum angle of light dispersion from its direction whose upper bound is Math.PI/2.
// penumbra - Percent of the spotlight cone that is attenuated due to penumbra. Takes values between zero and 1. Default is zero.
// decay - The amount the light dims along the distance of the light.
        return spotLight
    }
}
export { LightProducer }