function forceRender(isDisposeRenderer){
    window.editor.render(isDisposeRenderer);
}
function castUVtoCanvasXY(uv,_canvas){
    let _x =uv.x * _canvas.width;
    let _y =uv.y * _canvas.height;
  return [_x,_y];
}
function clearInvisableChar(list){
  for(let i=0;i<list.length;i++)list[i]=list[i].replace(/[\x00-\x1F\x7F-\x9F]/g, "");
}
function checkPlatform(){
    let  sUserAgent = navigator.userAgent.toLowerCase();
    let bIsIpad = sUserAgent.match(/ipad/i) == "ipad";
    let bIsIphoneOs = sUserAgent.match(/iphone os/i) == "iphone os";
    let bIsMidp = sUserAgent.match(/midp/i) == "midp";
    let bIsUc7 = sUserAgent.match(/rv:1.2.3.4/i) == "rv:1.2.3.4";
    let bIsUc = sUserAgent.match(/ucweb/i) == "ucweb";
    let bIsAndroid = sUserAgent.match(/android/i) == "android";
    let bIsCE = sUserAgent.match(/windows ce/i) == "windows ce";
    let bIsWM = sUserAgent.match(/windows mobile/i) == "windows mobile";
    if (bIsIpad ||bIsIphoneOs || bIsMidp || bIsUc7 || bIsUc || bIsAndroid || bIsCE || bIsWM) {
      return "Phone"
    } else {
      return "PC"
    }
}
function buildFrustumFromCamera(camera){   
  return buildFustumFromCamera(camera)
}
function buildFustumFromCamera(camera){
  let frustum=new THREE.Frustum()
  frustum.setFromProjectionMatrix( new THREE.Matrix4().multiplyMatrices( camera.projectionMatrix, camera.matrixWorldInverse ))
  return frustum
}
function samplingPositionYOnTerrain(x,z){
  return 150
	let terrainMesh=window["myObject"].terrainScene.children[0];
	let raycaster=new THREE.Raycaster();
	let AboveY=terrainMesh.geometry.boundingBox.max.z*5;
	let getY=function(x,z){
		raycaster.set(new THREE.Vector3(x,AboveY,z),new THREE.Vector3(0,-1,0));
		let intersects= raycaster.intersectObjects([ terrainMesh]); 
		if(intersects.length>0&&intersects[0].point){
		  return intersects[0].point.y;
		}else null;
	}// console.log( getY(x,z) )
	return getY(x,z);
}
function geoDataToBufferGeo(geoData){
	let  geo=new THREE.BufferGeometry()
	geo.setAttribute(
	  'position',
	  new THREE.BufferAttribute(geoData["attributes"]["position"]["array"], 3));
	  geo.setAttribute(
	      'normal',
	      new THREE.BufferAttribute(geoData["attributes"]["normal"]["array"], 3)
    )
	  geo.setAttribute(
	        'uv',
	        new THREE.BufferAttribute(geoData["attributes"]["uv"]["array"], 2)
    )
	  if(geoData["index"])geo.setIndex(new THREE.BufferAttribute(geoData["index"]["array"], 1))
	  return geo
}
function buildSendTimeToGPU(){
    let canvas=document.querySelector("canvas");
    let gl=canvas.getContext('webgl2');
    if(!gl){
      gl=canvas.getContext('webgl');
    }
    if(!gl)return null;
    let sendTimeToGPU=function(){}
    return sendTimeToGPU;
}
function loadGLTFloader(){
  let loadLoader=new Promise(function(res,rej){
		import("../examples/jsm/loaders/DRACOLoader.js").then(function(mod){
			let dracoLoader = new mod.DRACOLoader();
			dracoLoader.setDecoderPath('../examples/js/libs/draco/');
			import("../examples/jsm/loaders/GLTFLoader.js").then(function(mod){
				let loader=new mod.GLTFLoader();
        loader.setDRACOLoader( dracoLoader );
        window["myObject"]["GLTFLoader"]=loader;
        res(loader);
			})
    })
 })
 return loadLoader;
}
function  dataURLtoBlob(dataurl ) {
  let arr = dataurl.split(','), mime = arr[0].match(/:(.*?);/)[1],
    bstr = atob(arr[1]), n = bstr.length, u8arr = new Uint8Array(n);
  while(n--){
      u8arr[n] = bstr.charCodeAt(n);
  }
  return   new Blob([u8arr], {type:mime});
}
function alignAxis(source,target){
  let matR=new THREE.Matrix4();
  source.normalize();
  target.normalize();
  let axis=new THREE.Vector3();
  axis.crossVectors(source,target);
  let angle=Math.acos(target.dot(source));
  matR.makeRotationAxis(axis,angle);
  return matR;
}
function loadShader(vShaderUrl,fShaderUrl){
  let name=vShaderUrl.split('/');
  name=name[name.length-1];
  name=name.split('.');
  name=name[0];
  name=name.split('-');
  name=name[0];
  let promise=new Promise((res,rej)=>{
    fetch(vShaderUrl)
    .then(function(response) {
      return response.text();
    })
    .then(function(vs_text) {
      fetch(fShaderUrl)
    .then(function(response) {
      return response.text();
    })
    .then(function(fs_text) {
      res({_vs:vs_text,_fs:fs_text});
    })
    })
  })
    return promise
}