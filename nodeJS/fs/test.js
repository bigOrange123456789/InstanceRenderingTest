var fs = require('fs');

fs.readFile('test.glb', 'utf8' , function (err , data) {
    fs.writeFile('test2.glb' , data , function(){});
});