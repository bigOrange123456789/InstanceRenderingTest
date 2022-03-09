var sceneName="cgm";
var fileName=sceneName+"Roam.json";
var fs = require('fs');


class Tool{
    result;
    read(){
        var scope=this;
        fs.readFile(fileName, 'utf8' , function (err , data) {
            data=JSON.parse(data);
            for(var i=1;i<data.length;i++){
                var s=data[i-1];
                var e=data[i];
                var len=Math.pow(
                    Math.pow(e[0]-s[0],2)
                    +Math.pow(e[1]-s[1],2)
                    +Math.pow(e[2]-s[2],2)
                    ,0.5);
                var rot=Math.abs(e[3]-s[3])
                    +Math.abs(e[4]-s[5])
                    +Math.abs(e[4]-s[5])
                e[6]=Math.round((len+10*rot));
            }
            //console.log(data);
            scope.result=data;
            scope.load();
        });
    }
    load(){
        fs.writeFile(
            fileName ,
            JSON.stringify(this.result , null, "\t") , function(){});
    }
}
new Tool().read();
