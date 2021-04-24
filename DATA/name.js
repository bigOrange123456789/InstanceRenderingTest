    var fs = require('fs');
    var result=[]
    fs.readdirSync(process.argv[2]).forEach(function (s) {
        result.push(s);
    });
    fs.writeFile('name.json' , JSON.stringify(result , null, "\t") , function(){});