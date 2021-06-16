var cmd=require('node-cmd');

cmd.run('FBX2glTF.exe -i 1.fbx');
cmd.get(
    'run exe',
    function(data){
        console.log("finish!");//console.log('the current dir contains these files :\n\n',data)
    }
);
