importScripts('./treeData_Ver.worker.js');
importScripts('./treeDemo_Ver.worker.js');
importScripts('../build/three.js');
function loading_recursively(speciesArray,now_id){
    console.log("loading_recursively")
    if(now_id>=speciesArray.length)return;
    let obj=speciesArray[now_id];
 
        loadingBranchAndMesh(obj).then(function(BranchAndMesh){
            self["speciesLib"][obj.name]["meshLib"]="loadingFinished";
            self["speciesLib"][obj.name]["branchLib"]="loadingFinished";
                       loadingTreeSeperated(obj).then(function(trees){
                        self["speciesLib"][obj.name]["treeLib_status"]="loadingFinished";
                        self["speciesLib"][obj.name]["treeLib"]=trees;
                        for(let _treeID of Object.keys(self["speciesLib"][obj.name]["treeLib"])){
                            let tree= self["speciesLib"][obj.name]["treeLib"][_treeID];
                           let geo= tree.generateMergedBranchesSingleLevel("1",BranchAndMesh["branchLib"]);
                           let bufferGeo=new THREE.BufferGeometry().fromGeometry(geo);
                                            self.postMessage({
                                                command:"assemble",
                                                data:{
                                                    species:obj.name,
                                                    treeID:_treeID,
                                                    type:"branches",
                                                    geo:bufferGeo,
                                                    level:"1",
                                                    maxLevel:tree.maxLevel
                                                }
                                        });
                                        tree.generateMergedLeavesWithLOD(BranchAndMesh["meshLib"]);
                                        for(let i=0;i<3;i++){
                                            for(let leave of tree.leavesMerged){
                                                self.postMessage({
                                                    command:"assemble",
                                                    data:{
                                                        species:obj.name,
                                                        treeID:_treeID,
                                                        type:"leaves",
                                                        geo:leave["LOD"][i],
                                                        material:leave.materialID,
                                                        LOD:i
                                                    }
                                            });
                                            }
                                        }
                                        for(let i=2;i<=tree.maxLevel;i++){
                                            let geo= tree.generateMergedBranchesSingleLevel(String(i),BranchAndMesh["branchLib"]);
                                            if(!geo)continue;
                                            let bufferGeo=new THREE.BufferGeometry().fromGeometry(geo);
                                            self.postMessage({
                                                command:"assemble",
                                                data:{
                                                    species:obj.name,
                                                    treeID:_treeID,
                                                    type:"branches",
                                                    geo:bufferGeo,
                                                    level:String(i),
                                                    maxLevel:tree.maxLevel
                                                }
                                        });
                                        } 
                                        self["speciesLib"][obj.name]["treeLib"][_treeID]["status"]="loadingFinished";
                                       }
                            loading_recursively(speciesArray,now_id+1);
                       }); 
        });
 
}
self.addEventListener('message', function (e) {
    console.log('In worker');
    self["InWorker"]=true;
    let message=e.data;
    if(message.command=="loading"){
        let speciesLib=message.data;
        self["speciesLib"]=speciesLib;
        loading_recursively(Object.values( self["speciesLib"]),0);
}
 
    //loadForestWithMultiSpecies(info.size[0],info.size[1],info.species,true); 
    let checkerCanClose=setInterval(function(){
        let flag=true;
/*    console.log("check can close");
   console.log( self["speciesLib"]); */
      let  speciesLib= self["speciesLib"];
      for(let sp of Object.values(speciesLib)){
        if(sp["meshLib"]!="loadingFinished"||sp["branchLib"]!="loadingFinished"){
            flag=false;break;
        }
        for(let tree of Object.values(sp.treeLib)){
            if(tree["status"]!="loadingFinished"){
                flag=false;break;
            }
        }
       if(!flag)break;
      }
        if(flag){
            clearInterval(checkerCanClose);
            let returnMsg={command:"finished",species:[]};
            for(let sp of Object.values(speciesLib))returnMsg.species.push(sp.name);
            self.postMessage(returnMsg);
            console.info("worker closing");
            self.close();
        } 
},5000);

}, false);