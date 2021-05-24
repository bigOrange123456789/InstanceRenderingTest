const obj2gltf = require('obj2gltf');
const fs = require('fs');
obj2gltf('1.obj')
    .then(function(gltf) {
        const data = Buffer.from(JSON.stringify(gltf));
        fs.writeFileSync('1.gltf', data);
    });


const options = {
    binary : true
}
obj2gltf('1.obj', options)
    .then(function(glb) {
        fs.writeFileSync('1.glb', glb);
    });