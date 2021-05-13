if(sceneName==="szt"){
    camera.position.set(10.22,7.32,41.13);
    camera.rotation.set(-1.74024,1.32956,1.74518)
}else if(sceneName==="demo3"){
    camera.position.set(29.79,2.31,-51.49);
    camera.rotation.set(-3.01394,0.09581,3.12931)
}else if(sceneName==="cgm"){
    camera.position.set(-69.2814,  8.57,  -100.51);
    camera.rotation.set(-1.9885,  -0.033, -3.066)
}else{//scene==="demo1";
    camera.position.set(18.154,12.54236, -50.3)
    camera.rotation.set(-3.1313,0.021,3.14)
}

import {PreviewManager} from './PreviewManager.js';
var loader = new THREE.XHRLoader(THREE.DefaultLoadingManager);
loader.load("../json/"+sceneName+"Roam.json", function (data) {
    new PreviewManager(camera, JSON.parse(data));
});
