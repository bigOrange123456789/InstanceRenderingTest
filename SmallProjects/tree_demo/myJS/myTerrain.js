//CanvasTexture
import {moveObject} from "../editor/js/libs/ui.three.js";

import { RemoveObjectCommand } from '../editor/js/commands/RemoveObjectCommand.js';
export{terrainDemoMain,terrainDemoMain_fast}
//let brushSize=120;
//et editMode=null;
class CanvasTexture{
  constructor(texture){
    this._canvas = document.createElement( "canvas" );
    this._context2D = this._canvas.getContext( "2d" );
    let image=texture.image;
    this._background=image;
    this._texture=texture;
    this._texture.needsUpdate = true;
    this._texture.image=this._canvas;
    this._canvas.width = image.width;
    this._canvas.height = image.height;
    this.circle_x=0;
    this.circle_y=0;
    this.circle_size=0;
    this._draw();
  };
  _draw(){
    this._drawBackGroundImage();
 };
_drawBackGroundImage(){
  if ( ! this._context2D ) return;
  this._context2D.clearRect( 0, 0, this._canvas.width, this._canvas.height );
  this._context2D.drawImage( this._background, 0, 0 );
}
};
function addheightMapCanvasUI(canvasID){
  let viewport = document.querySelector("#viewport");
  let el_3=document.createElement("canvas");
  //el_3.setAttribute('class', "myTreeDemoUI");
  el_3.setAttribute('class', "canvas_heightmap myUI");
 
  el_3.setAttribute('id', canvasID);
  el_3.setAttribute('width', "256");
  el_3.setAttribute('height', "256");
  viewport.appendChild(el_3);
}
function clipWithRect(width,height,x,y,w,h){
        let LT_x=x;let LT_y=y;
        let RB_x=x+w;let RB_y=y+h;
        LT_x=Math.max(0,LT_x);        LT_x=Math.min(width,LT_x);
        LT_y=Math.max(0,LT_y);        LT_y=Math.min(height,LT_y);
        RB_x=Math.max(0,RB_x);        RB_x=Math.min(width,RB_x);
        RB_y=Math.max(0,RB_y);        RB_y=Math.min(height,RB_y);
        return {
            x:LT_x,
            y:LT_y,
            width:Math.floor(RB_x-LT_x),
            height:Math.floor(RB_y-LT_y)
        }
}
function addCanvasUI(canvasID,width,height){
  let viewport = document.querySelector("#viewport");
  let el_3=document.createElement("canvas");
  //el_3.setAttribute('class', "myTreeDemoUI");
  el_3.setAttribute('class', "canvas_heightmap myUI");
 
  el_3.setAttribute('id', canvasID);
  el_3.setAttribute('width', width+"");
  el_3.setAttribute('height', height+"");
  viewport.appendChild(el_3);
}
function addTerrainEditModeUI(){
  let viewport = document.querySelector("#viewport");
  let el_3=document.createElement("div");
  //el_3.setAttribute('class', "myTreeDemoUI");
  el_3.setAttribute('id', "terrainEditModePanel");
 el_3.setAttribute('class', "myUI");
 el_3.innerHTML=`
<div> <input type="checkbox" id="isEditTerrain" ><label>Edit On/Off</label></div>
<div> <input type="radio" name="mode" id="edit_mode_draw" value="draw"><label>Draw</label></div>
<div>
 <input type="radio" name="draw_direction" id="dir_up" value="up" checked><label>up</label>
 <input type="radio" name="draw_direction" id="dir_down" value="down"><label>down</label>
 </div>
<div> <input type="radio" name="mode" id="edit_mode_smooth" value="smooth"><label>Smooth</label></div>
<div> <input type="radio" name="mode" id="edit_mode_addObject" value="addObject"><label>Add Object</label></div>
<div>
<input type="radio" name="addObject_mode" id="addObject_mode_brush" value="brush" checked><label>brush</label>
<input type="radio" name="addObject_mode" id="addObject_mode_curve" value="curve"><label>curve</label>
</div>
<div><label id="sliderBar_label">Brush Size</label> <input type="range" name="brushSize" id="sliderBar_input" value="120" min="10" max="1000"></div>

 `;
  viewport.appendChild(el_3);
  document.getElementById("isEditTerrain").addEventListener("click",(evt)=>{
  
    if(window["myObject"].terrainScene.isEditHeightMap==true){
      window["myObject"].terrainScene.isEditHeightMap=false;
     }else{
      window["myObject"].terrainScene.isEditHeightMap=true;
     }
  });

  let editInfo=window["myObject"].terrainScene.editInfo;
  document.getElementById("edit_mode_draw").addEventListener("click",(evt)=>{
    editInfo.editMode="draw";

  });
  document.getElementById("edit_mode_smooth").addEventListener("click",(evt)=>{
    editInfo.editMode="smooth";
  });
  document.getElementById("edit_mode_addObject").addEventListener("click",(evt)=>{
    editInfo.editMode="addObject";
  });
  document.getElementById("addObject_mode_brush").addEventListener("click",(evt)=>{
    editInfo.addObjectMode="brush";
    editInfo.brushColor="rgb(255,255,0)";
    document.getElementById("sliderBar_label").innerHTML="Brush Size";
  });
  document.getElementById("addObject_mode_curve").addEventListener("click",(evt)=>{
    editInfo.addObjectMode="curve";
    editInfo.brushColor="rgb(0,255,255)";
    document.getElementById("sliderBar_label").innerHTML="Object Count";
  });
  document.getElementById("sliderBar_input").addEventListener("change",(evt)=>{
    window["myObject"].terrainScene.editInfo.brushSize=Math.floor(Number(evt.target.value));
    window["myObject"].terrainScene.editInfo.target=Math.floor(Number(evt.target.value))/20;
    window["myObject"].terrainScene.mainMap["colorMap"].drawWithCircle();
    //window["myObject"].terrainScene.mainMap["colorMap"]._texture.needsUpdate=true;
    //window["myObject"].terrainScene.children[0].needsUpdate = true;
    forceRender();
  });
  let changeDrawDirection=function(){
    let editInfo=window["myObject"].terrainScene.editInfo;
     if(document.getElementById("dir_up").checked){
      editInfo.drawColor="#ffffff" ;
     }
     if(document.getElementById("dir_down").checked){
      editInfo.drawColor="#000000" ;
     }
  }
  document.getElementById("dir_up").addEventListener("click",changeDrawDirection);
  document.getElementById("dir_down").addEventListener("click",changeDrawDirection);
}
function generateCurve(points){
	let curve = new THREE.CatmullRomCurve3(points );
	
	let sample_points = curve.getPoints( points.length*5 );
	let geometry = new THREE.BufferGeometry().setFromPoints( sample_points );
	
	let material = new THREE.LineBasicMaterial( { color : "blue",linewidth: 10 } );
	
	// Create the final object to add to the scene
	let line = new THREE.Line( geometry, material );
	line.name="curve_1";
  return {lineObject:line,curveObject:curve};
}
function terrainDemoMain(Terrain,canvasID){
for(let obj of window.editor.scene.children){
    if(obj.name=="terrain_1"){
      window.editor.execute( new RemoveObjectCommand(window.editor, obj ) );
    }

}


let  container = document.getElementById( "viewport" );
  if(!canvasID)return ;
    let heightMap=Terrain.DiamondSquare;
    addheightMapCanvasUI(canvasID);

    addCanvasUI("canvas_debug",256,256);
    
 
  //
  initCanvasWithImageURL(canvasID,"../myImage/heightMap_256.png").then(
    function(){
      heightMap= document.getElementById(canvasID);
      let xS = 63, yS = 63;
      window["myObject"].terrainScene = Terrain({
          easing: Terrain.Linear,
          frequency: 2.5,
          heightmap: heightMap,
          material: new THREE.MeshStandardMaterial({color: 0x5566aa}),
          maxHeight: 800,
          minHeight: -800,
          steps: 1,
          useBufferGeometry: false,
          xSegments: xS,
          xSize: 8192,
          ySegments: yS,
          ySize: 8192,
      });
      window["myObject"].terrainScene.name="terrain_1";
      window["myObject"].terrainScene.brushChildren=[];
      window["myObject"].terrainScene.curveChildren=[];
      window["myObject"].terrainScene.isEditHeightMap=false;
      window["myObject"].terrainScene.addObjectToTerrain_Brush=function(pos,r,num){
 
            let group=  window["myObject"].terrainScene.terrainObjects;
 
            let R=r*window["myObject"].terrainScene.terrainOptions.ySize;
            console.log(pos);
            let terrainMesh=window["myObject"].terrainScene.children[0];

            let raycaster=new THREE.Raycaster();
            let AboveY=terrainMesh.geometry.boundingBox.max.z*5;
            let getY=function(x,z){
                
                raycaster.set(new THREE.Vector3(x,AboveY,z),new THREE.Vector3(0,-1,0));
                let intersects= raycaster.intersectObjects([ terrainMesh]); 
                if(intersects.length>0&&intersects[0].point){
                  return intersects[0].point.y;
                }else null;

            };
           for(let i=0;i<num;i++){
          let _r=Math.random()*R;
          let _v=Math.random()*Math.PI*2;
           let _x=pos.x+_r*Math.cos(_v);
           let _z=pos.z+_r*Math.sin(_v);

            let _y=getY(_x,_z);
          let mesh=new THREE.Mesh(new THREE.BoxBufferGeometry(20,50,20),new THREE.MeshStandardMaterial({color:"grey"}));
          mesh.name="cube"; 
       
           for(let item of window.editor.scene.children){

            if(item.name=="White_Oak_Mobile.obj"){
              mesh=item.clone();
              mesh.name="White_Oak"; 
            }
           }
           mesh.position.x=_x;
            mesh.position.y=_y;
            mesh.position.z=_z;
            window["myObject"].terrainScene.brushChildren.push(mesh);
            mesh.rotateY(Math.random()*Math.PI*2);
            mesh.needsUpdate=true;
            
            window.editor.addObject(mesh);
            moveObject( mesh, group );
           }
           //mesh.parent=group;
           group.needsUpdate=true;
           
   
           forceRender();
      }

      window["myObject"].terrainScene.addObjectToTerrain_Curve=function(pos){
        let group=  window["myObject"].terrainScene.terrainObjects;

       let p=pos.clone();
       p.y+=10;               
        window["myObject"].terrainScene.editInfo.curvePoints.push(p);
        let points=window["myObject"].terrainScene.editInfo.curvePoints;
        if(points.length<2)return;
           let currentCurve=window["myObject"].terrainScene.editInfo.currentCurve;
           let currentLine=window["myObject"].terrainScene.editInfo.currentLine;
           if(currentCurve)window.editor.execute( new RemoveObjectCommand(window.editor, currentLine ) );
           let returnObj=generateCurve(window["myObject"].terrainScene.editInfo.curvePoints);
           window["myObject"].terrainScene.editInfo.currentCurve=returnObj.curveObject;
           window["myObject"].terrainScene.editInfo.currentLine=returnObj.lineObject;
             window.editor.addObject(returnObj.lineObject);
             moveObject( returnObj.lineObject, group );

             window["myObject"].terrainScene.editInfo.targetObjectCount= document.getElementById("sliderBar_input").value/20;
             let count=window["myObject"].terrainScene.editInfo.targetObjectCount;
            let offset=25;
             let mesh=new THREE.Mesh(new THREE.BoxBufferGeometry(20,50,20),new THREE.MeshStandardMaterial({color:"darkgrey"}));
             mesh.name="cube_II"; 
       
             if(window["myObject"].terrainScene.curveChildren.length<count){
               let diff=count-window["myObject"].terrainScene.curveChildren.length;
               for(let i=0;i<diff;i++){
                 let now_mesh=mesh.clone();
                window["myObject"].terrainScene.curveChildren.push(now_mesh);
                window.editor.addObject(now_mesh);
                moveObject( now_mesh, group );
               }
             }
          
             let posArray=window["myObject"].terrainScene.editInfo.currentCurve.getSpacedPoints(count-1);
             for(let i=0;i<count;i++){
                    let p=posArray[i];
                    window["myObject"].terrainScene.curveChildren[i].position.x=p.x;
                    window["myObject"].terrainScene.curveChildren[i].position.y=p.y+offset;
                    window["myObject"].terrainScene.curveChildren[i].position.z=p.z;
             } 
      }
      // Assuming you already have your global scene, add the terrain to it
      //console.log(window.editor);
      window["myObject"].terrainScene.terrainObjects=new THREE.Group();
      window["myObject"].terrainScene.terrainObjects.name="terrainObjects_group";

     
     

 
      window["myObject"].terrainScene.editInfo={
        brushSize:120,
        editMode:null,
        drawColor:"#ffffff",
        brushColor:"rgb(255,255,0)",
        addObjectMode:"brush",
        curvePoints:[],
        currentCurve:null,
        currentLine:null,
        targetObjectCount:0
      }
      addTerrainEditModeUI();
      window.editor.addObject(  window["myObject"].terrainScene.terrainObjects);
      //window["myObject"].terrainScene.terrainObjects.parent=window["myObject"].terrainScene;
      moveObject( window["myObject"].terrainScene.terrainObjects, window["myObject"].terrainScene );
      //draw on heightMap
      heightMap.drawSolidCircle=function(x,y,r,a){
        let ctx=heightMap.getContext("2d");
        //let _x = x * _canvas.width;
        //let _y = y * _canvas.height;
        if(!ctx)return;
        ctx.globalAlpha=a;
        //canvasTexure. _drawBackGroundImage();
        ctx.fillStyle=window["myObject"].terrainScene.editInfo.brushColor;
        ctx.beginPath();
        ctx.arc(x,y,r,0,Math.PI*2);
        ctx.fill();
      }
      heightMap.blurAt=function(x,y,r,itr){
     
        let rectClipped= clipWithRect(heightMap.width,heightMap.height, x-r, y-r,2*r,2*r);
        let data_o=heightMap.getContext("2d").getImageData(rectClipped.x,rectClipped.y,rectClipped.width,rectClipped.height);
        let ctx_debug= document.getElementById("canvas_debug").getContext("2d");
        document.getElementById("canvas_debug").width=rectClipped.width;
        document.getElementById("canvas_debug").height=rectClipped.height;
        ctx_debug.putImageData(data_o,0,0);
        boxBlurCanvasRGB( "canvas_debug", 0, 0,rectClipped.width, rectClipped.height, r/4, 1 );
        let data_i=ctx_debug.getImageData( 0, 0,rectClipped.width,rectClipped.height);
        heightMap.getContext("2d").putImageData(data_i,rectClipped.x,rectClipped.y);
      }
      heightMap.onMouseclick=function(evt){
        let editInfo=window["myObject"].terrainScene.editInfo;
        if(!document.getElementById("isEditTerrain").checked)return;
        if(editInfo.editMode!="draw"&&editInfo.editMode!="smooth")return;
        let pos=mouse3DcanvasPos(evt);
        let camera= window.editor.camera;
        let raycaster=new THREE.Raycaster();
        raycaster.setFromCamera( pos, camera );
       let intersects= raycaster.intersectObjects([ window["myObject"].terrainScene.children[0]]); 
       if ( intersects.length > 0 && intersects[ 0 ].uv ) {
         let uv = intersects[ 0 ].uv;
         intersects[ 0 ].object.material.map.transformUv( uv );
         //convert pixel size
         let tex_map=window["myObject"].terrainScene.children[0].material.map.image;
         let p=tex_map.height/heightMap.height;
         let pos_canvas=castUVtoCanvasXY(uv,heightMap);
         let r=editInfo.brushSize/p;
         if(editInfo.editMode=="draw")heightMap.drawSolidCircle( pos_canvas[0], pos_canvas[1],r,0.3);
         if(editInfo.editMode=="smooth")heightMap.blurAt( pos_canvas[0], pos_canvas[1],r,1);
         //
         window["myObject"].terrainScene.refreshHeightmap();

         //
        

         
       }
       //canvasTexure._texture.needsUpdate=true;
       window["myObject"].terrainScene.children[0].needsUpdate = true;
     
      }
      window["myObject"].terrainScene.mainMap={};
      window["myObject"].terrainScene.mainMap["heightMap"]=heightMap;
      container.addEventListener( 'click', heightMap.onMouseclick, false );
        //load texture async
     let promise=new Promise(function(res,rej){
      let loader = new THREE.TextureLoader();
      loader.load("../myImage/uv_checker.png",function(tex){res({t:tex,f:"flag_1"})});
     })
        return promise;
    }).then(function(obj){
      let tex=obj.t;
      tex.encoding =THREE.sRGBEncoding;
   let canvasTexure=new CanvasTexture(tex);
    window["myObject"].terrainScene.children[0].material=new THREE.MeshStandardMaterial({map: canvasTexure._texture});
   //add terrain after loading texture
    window.editor.addObject(window["myObject"].terrainScene);
    forceRender();
    window["myObject"].terrainScene.children[0].needsUpdate = true;
    canvasTexure.drawWithCircle=function(x,y){
      let editInfo=window["myObject"].terrainScene.editInfo;
      let _canvas=canvasTexure._canvas;
      let ctx=canvasTexure._context2D;
    if(x&&y){
      this.circle_x= x * _canvas.width;
      this.circle_y=y * _canvas.height;
    }
 
      if(window["myObject"].terrainScene.editInfo.addObjectMode=="brush")this.circle_size=editInfo.brushSize;
      else this.circle_size=10;
      if(!ctx)return;
      ctx.globalAlpha=1;
      canvasTexure. _drawBackGroundImage();
      ctx.fillStyle=window["myObject"].terrainScene.editInfo.brushColor;
      ctx.beginPath();
      ctx.arc(this.circle_x,this.circle_y,this.circle_size,0,Math.PI*2);
      ctx.globalAlpha=0.4;
      ctx.fill();
    };

    window["myObject"].terrainScene.mainMap["colorMap"]=canvasTexure;
    document.getElementById("isEditTerrain").addEventListener( 'click',(evt)=>{
      canvasTexure. _drawBackGroundImage();
  
      canvasTexure._texture.needsUpdate=true;
      
      window["myObject"].terrainScene.children[0].needsUpdate = true;
      forceRender();
    });
    canvasTexure.onMouseMove=function(evt){
      let inputCheckBox=document.getElementById("isEditTerrain");
      let  checked=inputCheckBox.checked;
      if(!checked)return;
      //console.log("canvasTexure.onMouseMove fire");
      //console.log("evt");
     let pos=mouse3DcanvasPos(evt);
     let camera= window.editor.camera;
     let raycaster=new THREE.Raycaster();
     raycaster.setFromCamera( pos, camera );
    let intersects= raycaster.intersectObjects([ window["myObject"].terrainScene.children[0]]); 
    if ( intersects.length > 0 && intersects[ 0 ].uv ) {
      let uv = intersects[ 0 ].uv;
      intersects[ 0 ].object.material.map.transformUv( uv );
      canvasTexure.drawWithCircle( uv.x, uv.y );
      forceRender();
    }
    canvasTexure._texture.needsUpdate=true;
    window["myObject"].terrainScene.children[0].needsUpdate = true;
   
  }
  //add Oject to terrain
  window["myObject"].terrainScene.onClick=function(evt){
    let editInfo=window["myObject"].terrainScene.editInfo;
    if(!document.getElementById("isEditTerrain").checked)return;
    if(editInfo.editMode!="addObject")return;
    let pos=mouse3DcanvasPos(evt);
    let camera= window.editor.camera;
    let raycaster=new THREE.Raycaster();
    raycaster.setFromCamera( pos, camera );
    let intersects= raycaster.intersectObjects([ window["myObject"].terrainScene.children[0]]); 
    if ( intersects.length > 0 && intersects[ 0 ].point ) {
      let pos = intersects[ 0 ].point;
      let tex_map=window["myObject"].terrainScene.children[0].material.map.image;
      let brushSize_noralized=editInfo.brushSize/tex_map.height;
      if(window["myObject"].terrainScene.editInfo.addObjectMode=="brush")window["myObject"].terrainScene.addObjectToTerrain_Brush(pos,brushSize_noralized,5);
      if(window["myObject"].terrainScene.editInfo.addObjectMode=="curve")window["myObject"].terrainScene.addObjectToTerrain_Curve(pos);
      
      forceRender();
    }

  }
    container.addEventListener( 'mousemove', canvasTexure.onMouseMove, false );
    container.addEventListener( 'click', window["myObject"].terrainScene.onClick, false );
});
}

function terrainDemoMain_fast(Terrain){
  //clear old map
  for(let obj of window.editor.scene.children){
    if(obj.name=="terrain_1"){
      window.editor.execute( new RemoveObjectCommand(window.editor, obj ) );
    }
}
 let promise=new Promise(function(res,rej){
  let heightMap= document.getElementById("terrain_heightMap");
  let xS = 63, yS = 63;
  let colorMap=document.getElementById("terrain_colorMap");
  let colorTexture = new THREE.TextureLoader().load(colorMap.currentSrc,function(texture){
    texture.encoding =THREE.sRGBEncoding;
 let terrain= Terrain({
      easing: Terrain.Linear,
      frequency: 2.5,
      heightmap: heightMap,
      material: new THREE.MeshStandardMaterial({map: texture}),
      maxHeight: 800,
      minHeight: -800,
      steps: 1,
      useBufferGeometry: false,
      xSegments: xS,
      xSize: 8192,
      ySegments: yS,
      ySize: 8192,
  });
  window["myObject"].terrainScene =terrain;
  window["myObject"].terrainScene.name="terrain_1";
  window["myObject"].terrainScene.isEditHeightMap=false;
  window.editor.addObject(window["myObject"].terrainScene);
  forceRender();
  res();
  });
 });
 return promise;
}