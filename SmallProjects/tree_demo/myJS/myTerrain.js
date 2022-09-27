import { RemoveObjectCommand } from '../editor/js/commands/RemoveObjectCommand.js';
export{terrainDemoMain_fast}
function terrainDemoMain_fast(Terrain){
  for(let obj of window.editor.scene.children){
    if(obj.name=="terrain_1"){
      window.editor.execute( new RemoveObjectCommand(window.editor, obj ) );
    }
}
 let promise=new Promise(function(res,rej){
  let heightMap= document.getElementById("terrain_heightMap");
  let xS = 63, yS = 63;
  let colorMap=document.getElementById("terrain_colorMap");
  new THREE.TextureLoader().load(
    colorMap.currentSrc,
    function(texture){
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
    }
  )
 });
 return promise;
}