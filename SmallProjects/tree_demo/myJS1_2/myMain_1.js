function addLight(group){
   let initPos=new THREE.Vector3(-200,1000,200);
   let  light = new THREE.DirectionalLight( 0xffffff, 0.5 );
   light.position.x =initPos.x;
   light.position.y =initPos.y;
   light.position.z =initPos.z;
   light.name="directionalShadowLight_position"
   
   light.castShadow = true;

   light.shadow.mapSize.width = 8192;
   light.shadow.mapSize.height = 8192;

   let d = 4096;
   light.intensity=0.8;
   light.shadow.camera.left = - d;
   light.shadow.camera.right = d;
   light.shadow.camera.top = d;
   light.shadow.camera.bottom = - d;

   light.shadow.camera.far = 8192;
   
   light.shadow.camera.near = 1;
   light.target=new THREE.Object3D();
   light.target.name="shadow_light_target"
   light.target.position.x=0;
   light.target.position.y=0;
   light.target.position.z=0;

   //main light 
   let  light_0 = new THREE.DirectionalLight( 0xffffff, 0.8 );
   light_0.position.x =initPos.x;
   light_0.position.y =initPos.y;
   light_0.position.z =initPos.z;
   light_0.name="main_light"
   light_0.intensity=0.1;

    //ground plane
    let hemi_light = new THREE.HemisphereLight( 0x00AAFF, 0xFFAA00,0.1 );
    hemi_light.name="hemi_light"
    if(!group){
        window.editor.scene.add( light );
        window.editor.scene.add( light.target );
        window.editor.scene.add( light_0 );
        window.editor.scene.add( hemi_light );
    }else{//执行的是2
        group.add( light );
        group.add( light.target );
        group.add( hemi_light );
    }
    setInterval(()=>{   
        let camera_pos=window.editor.camera.position;
        light.position.x=initPos.x+camera_pos.x;
        light.position.z=initPos.z+camera_pos.z;
        light.target.position.x=0+camera_pos.x;
        light.target.position.z=0+camera_pos.z;
        forceRender();
    },300);
}
function addSceneSetupObject(){
    let sceneSetupGroup=new THREE.Group();
    sceneSetupGroup.name="sceneSetup"
    for(let obj of window.editor.scene.children){
        if(obj.name=="sceneSetup")return;
    }
    addLight(sceneSetupGroup);
    window.editor.scene.add(sceneSetupGroup);//这个是光线，没有光照自然是黑色的
}
function buildCameraControl(camera){
      let minHeight=1000;
      let maxHeight=2000;
      let minR=400;
      let maxR=5000;

      let heightStep=1;
      let rStep=1.5;
      let angle_step=0.01;

      let currentAngle=0;
      let currentR=(minR+maxR)/2;
      let currentHeight=(minHeight+maxHeight)/2;
      let currentHeight_dir=1;
      let currentR_dir=1;
      let minDistanceToTerrain=150;
      let setCamera=function(){
                if(currentR_dir==1){
                           if(currentR+rStep<maxR){
                            currentR+=rStep
                           }else{
                            currentR_dir=-1;
                            currentR-=rStep
                           }
                }
                else if(currentR_dir==-1){
                    if(currentR-rStep>minR){
                        currentR-=rStep
                       }else{
                        currentR_dir=1;
                        currentR+=rStep
                       }
                }
                rStep=3+Math.abs((currentR-minR)/200);
      
         currentAngle+=angle_step;
         let x=Math.cos(currentAngle)*currentR;
         let z=Math.sin(currentAngle)*currentR;
         camera.position.x=x;
         camera.position.z=z;
         if(currentHeight_dir==1){
            heightStep=1+Math.abs((currentHeight-minHeight)/100);
            if(currentHeight+heightStep<maxHeight){
                currentHeight+=heightStep;
            }else{
                currentHeight_dir=-1;
                currentHeight-=heightStep;
            }
 }
 else if(currentHeight_dir==-1){
     let terrain_y=samplingPositionYOnTerrain(x,z);
     if(currentHeight-heightStep>minR&&currentHeight-heightStep-terrain_y>minDistanceToTerrain){
        currentHeight-=heightStep;
        }else{
            currentHeight_dir=1;
            currentHeight+=heightStep;
        }
 }              
         camera.position.y=currentHeight;
         camera.lookAt(0,1000,0);
       
      }
      return setCamera;
}
window.addEventListener("load",()=>{
    window.editor.history.historyDisabled=true;
    window.addEventListener('beforeunload',evt=>{                
        window.editor.storage.clear();
        console.log("clear storage");
    });
	window.myObject={};
	console.log("myMain_1.js");
    window["myObject"]["cameraMode"]="auto";
    addSceneSetupObject();
    let beginMovingCamera=function (){
    function re_Render(){
        forceRender();
        requestAnimationFrame(re_Render);
    }
    requestAnimationFrame(re_Render);
}
        let afterLoadingForest=function(speciesLib){
        let forestLODAndFustumCulling=buildUpdateLODAndFustumCulliingFunc(speciesLib);
        function updateLOD(){
                 forestLODAndFustumCulling();
                 requestAnimationFrame(updateLOD);
        }
        requestAnimationFrame(updateLOD);
    }
     ////////////////////////////////////////////////////////////////////////   
        forceRender()
        if(window["myObject"].terrainScene){
            if( window["myObject"].terrainScene.children[0].name="terrain_mesh"){
               window["myObject"].terrainScene.children[0].receiveShadow=true
            }
        }
        let speciesLib=null;
        loadGLTFloader().then(function(loader){
            loader.load("../models/tree_plane.glb",function(gltf){
                console.info("tree_plane loading ok");
                window["myObject"]["tree_plane"]=gltf.scene;//这个是低模 //平面树木的加载
        })
     ////////////////////////////////////////////////////////////////////////
     if( checkPlatform()=="PC"){
            speciesLib=loadForestWithMultiSpeciesProgressively(30,30,//100,100,//模型的行数和列数
                [
                   {name:"Black_Gum",count:1,barkMaterialID:"1",scaleBase:2,planarTreeScale:15}
                ]);
    }else{
        speciesLib= loadForestWithMultiSpeciesProgressively(30,30,
            [
               ,{name:"Black_Gum",count:9,barkMaterialID:"1",scaleBase:3,planarTreeScale:15}
            ]);
    } 
   let waitBuildingForest=setInterval(function(){
         forceRender();
         if( window["loadingStatus"]["geometry"]&&Object.values(window["loadingStatus"]["geometry"])!=0){
            clearInterval(waitBuildingForest);
             setTimeout(function(){
                 beginMovingCamera();
            },1500);
         }     
   },100)
    if(speciesLib)afterLoadingForest(speciesLib);
} 
     )
window.editor.camera.position.x=709.6266043031542;
window.editor.camera.position.y=1905.3241000156258;
window.editor.camera.position.z=783.159907378131;

window.editor.camera.setRotationFromQuaternion(
    new THREE.Quaternion(
        -0.38351006334920307,
        0.2847692725217518,
        0.12560137835747007,
        0.8695118092884226
    ));
  forceRender();
},false);

