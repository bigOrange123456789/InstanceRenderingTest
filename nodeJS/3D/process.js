var fs = require('fs');
var names;
fs.readFile('names.json', 'utf8' , function (err , data) {
    console.log(data);
});
