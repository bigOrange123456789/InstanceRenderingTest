let MaxTreeCount=120000;
function settingLeavesMaterial(mesh){
    let timer=setInterval(()=>{
            if(mesh.material.alphaMap)
            {
                mesh.customDepthMaterial = new THREE.MeshDepthMaterial( {
                    depthPacking: THREE.RGBADepthPacking,
                    alphaMap: mesh.material.alphaMap,
                    alphaTest:0.46
                } );

            }
             clearInterval(timer);
    },1000);
}
function scatterer_naive(x,y,interval,forest){
    let x_begin=0-interval*(x/2);
    let y_begin=0-interval*(y/2);
       for(let i=0;i<x;i++){
        for(let j=0;j<y;j++){
            let offset_d=2*Math.PI*Math.random();
            let offset_r=interval/2*Math.random();
            let offset_x=Math.cos(offset_d)*offset_r;
            let offset_y=Math.sin(offset_d)*offset_r;
                 let x_pos=x_begin+i*interval+offset_x;
                 let y_pos=y_begin+j*interval+offset_y;
                 let mat=new THREE.Matrix4();
                 mat.makeTranslation(x_pos,0,y_pos);
                 let rotate_y=2*Math.PI*Math.random();
                 let scale=0.4*Math.random()+0.8;
                 let mat_r=new THREE.Matrix4();
                 mat_r.makeRotationY(rotate_y);
                 let mat_s=new THREE.Matrix4();
                 mat_s.makeScale(scale,scale,scale);
                 mat.multiply(mat_r);
                 mat.multiply(mat_s);
                 forest.sampleFromSpeciesLab(mat);
        }
       }
}
class Forest_generator{
     constructor(obj){
          this.treeSpeciesLab={};
          this.IndividualTreeData=[];
          for(let species of obj.species_lib){
            this.treeSpeciesLab[species.speciesName]=new TreeSpecies_verII(species);
          }
          scatterer_naive(obj.tree_count.x,obj.tree_count.y,obj.interval,this);
     }
     addToScene(obj){
         let _group=new THREE.Group();
         _group.name="forest_group";
           for(let species of Object.values(this.treeSpeciesLab)){
                species.addToScene({group:_group});
           }
     }
     updateLOD(camera){
            let fustum=buildFrustumFromCamera(camera);
            for(let tree of this.IndividualTreeData){
                let pos_t =new THREE.Vector3().setFromMatrixPosition(tree.mat);
                let pos_c=camera.position;
                let distance=pos_t.distanceTo(pos_c);
                if(distance>1000){
                    tree["LOD"]=-1;
                }
                else if(distance>500){
                    tree["LOD"]=0;
                }else if(distance>200){
                    tree["LOD"]=1;
                }else if(distance>100){
                    tree["LOD"]=2;
                }else {
                    tree["LOD"]=3;
                }
            }
            for(let species of Object.values(this.treeSpeciesLab))species.updateLOD(camera,this.IndividualTreeData,fustum);
     }
     sampleFromSpeciesLab(_mat){
             let species_count=Object.keys(this.treeSpeciesLab).length;
             let species_id=Math.floor(Math.random()*species_count);
             let _species_name=Object.keys(this.treeSpeciesLab)[species_id];
             let individual_count=this.treeSpeciesLab[_species_name].individualTreeCount;
             let _individual_id=Math.floor(Math.random()*individual_count);
             let id=this.IndividualTreeData.length;
             this.IndividualTreeData.push({
                 species_name:_species_name,
                 individual_id:_individual_id,
                 id_in_forest:id,
                 mat:_mat
                });
            this.treeSpeciesLab[_species_name].individualTreeLab[_individual_id].treeIndexes.push(id);
     }
}

class TreeSpecies_verII{
    constructor(obj){
        this.speciesName=obj.speciesName;
    
        this.individualTreeLab=[];
        this.materialLab={};
        this.individualTreeCount=obj.individualCount;
        for(let i=0;i<this.individualTreeCount;i++){
            this.individualTreeLab.push(
                new TreeIndividual_verII({
                    speciesName:"Black_Gum",
                    individualID:i,
                    fileUrl:"../Sample/Black_Gum/Black_Gum.xml",
                    maxLevel:4,
                    materialLab:this.materialLab
                })
            );
        }
     
  }  
  addToScene(obj){
    let _group=new THREE.Group();
    _group.name="species_group_"+  this.speciesName;
      for(let individual of this.individualTreeLab){
        individual.addToScene({group:_group});
      } 
     
}
updateLOD(camera,individualTreeData,frustum){
    for(let  individual of this.individualTreeLab) individual.updateLOD(camera,individualTreeData,frustum);
}
}
function addInstancedMesh(mesh,mat){
    let count=mesh.count;
    mesh.setMatrixAt( count,mat);
    mesh.count++;
}
class TreeIndividual_verII{
    constructor(obj){
          this.speciesName=obj.speciesName;
          this.individualID=obj.individualID;
          this.maxLevel=obj.maxLevel;
          this.fullMeshes=[];
          this.fullLeavesGeo={};
          this.LODMeshes=[];
           //instance mesh
          this.branchInstancedMeshes=[];
          this.branchInstancedLeavesGeo={};
          this.LODInstancedMeshes=[];
          this.fullLeavesnstancedMeshes={};
          this.treeIndexes=[];
          this.boundingBox=null;
          this.materials=null;
          for(let i=0;i<this.maxLevel;i++){
            this.fullMeshes.push(new THREE.Geometry());
            this.LODMeshes.push(new THREE.Geometry());
        }
         this.loadTree({fileUrl:obj.fileUrl,materialLab:obj.materialLab});
      
         this.planerTree=null;
         let that=this;
         if( window["myObject"]["tree_plane"]){
            that.planarTree=new PlanarTreeIMM("Black_Gum",10,MaxTreeCount);

         }else{
            loadGLTFloader().then(function(loader){
      
                loader.load("../models/tree_plane.glb",function(gltf){
                   window["myObject"]["tree_plane"]=gltf.scene;
                   that.planarTree=new PlanarTree("Black_Gum",10,MaxTreeCount);
                });
             }); 

         }
       
    }
    loadTree(obj){
        let that=this;
        fetch(obj.fileUrl,{method:"GET"})
        .then(
            function(res){    return  res.text();})
         .then(
             function(_data)
             {
                import('../public/examples/jsm/utils/BufferGeometryUtils.js').then(function(mod){
                   let BufferGeometryUtils=mod.BufferGeometryUtils;
                    let TreeData_1=new TreeData({
                        data:_data,
                        type:"xml",
                        species_name:that.speciesName.split('.')[0],
                        branchMatID:"1",
                        isLoadLODTexture:true
                    });

                    if(that.individualID==0){
                        obj.materialLab=TreeData_1.materials;
                        obj.materialLab["LOD"]=TreeData_1.lodMaterial;
                    }
                    that.materials=  obj.materialLab;

                    let treeGroup_1 =TreeData_1.produceTreeGeo({style:"tubeOnly",level:9,barkMaterialID:"1",lod:9,TreeSpeciesObj:that,BufferGeoU:BufferGeometryUtils});
                   
                    let group=new THREE.Group();
                    group.name="test_tree_1";
                    let mat_now=new THREE.Matrix4(); 
                    let boundingBox=new THREE.Box3();
                 for(let i=0;i<that.maxLevel;i++){
                       let geo=that.fullMeshes[i];
                       let bufferGeo=new THREE.BufferGeometry().fromGeometry(geo);
                       bufferGeo.computeBoundingBox();
                       boundingBox.union(bufferGeo.boundingBox);
                     let count=Math.floor(MaxTreeCount/(i+1) );
					let mesh = new THREE.InstancedMesh( bufferGeo, that.materials["1"], count);
                    mesh.instanceMatrix.setUsage( THREE.DynamicDrawUsage ); // will be updated every frame
                    mesh.name="instanced_branch_"+i;
					mesh.count=0;
                    mesh.setMatrixAt( mesh.count,mat_now );
                    mesh.count++;
                    mesh.instanceMatrix.needsUpdate = true;
                    //group.add( mesh );
                    that.branchInstancedMeshes[i]=mesh;
                   }
                   that.boundingBox=boundingBox;
       
           
                for(let i=1;i<that.maxLevel;i++){
             
                    let geo=that.LODMeshes[i];
                    let bufferGeo=new THREE.BufferGeometry().fromGeometry(geo);
                 

                    let count=Math.floor(MaxTreeCount/(i+1) );
                    let mesh = new THREE.InstancedMesh( bufferGeo, that.materials["LOD"][String(i)], count);
                    settingLeavesMaterial(mesh);
                    mesh.instanceMatrix.setUsage( THREE.DynamicDrawUsage ); // will be updated every frame
                    mesh.name="instanced_LOD_"+i;
					mesh.count=0;
                    mesh.setMatrixAt( mesh.count,mat_now );
                    mesh.count++;
                    mesh.instanceMatrix.needsUpdate = true;
                    mesh.castShadow=true;
                    //group.add( mesh );
                    that.LODInstancedMeshes[i]=mesh;
               
                }
                   for(let  key of Object.keys(that.fullLeavesGeo)){
             
                    let geo=that.fullLeavesGeo[key];
               
                    let count=Math.floor(MaxTreeCount/(that.maxLevel) );
                    let mesh = new THREE.InstancedMesh( geo, that.materials[key], count);
                    settingLeavesMaterial(mesh);
                    mesh.instanceMatrix.setUsage( THREE.DynamicDrawUsage ); // will be updated every frame
                    mesh.name="instanced_Full_leaves_"+key;
					mesh.count=0;
                    mesh.setMatrixAt( mesh.count,mat_now );
                    mesh.count++;
                    mesh.instanceMatrix.needsUpdate = true;
                    mesh.castShadow=true;
                    //group.add( mesh );
                    that.fullLeavesnstancedMeshes[key]=mesh;
                }
                //window.editor.addObject(group);
                });


                });
              
    }
    addToScene(obj){
              
        let _group=new THREE.Group();
        _group.name="individual_group_"+  this.speciesName+"_"+this.individualID;

        let waitLoading=setInterval(()=>{
          if(this.branchInstancedMeshes.length==0||this.LODInstancedMeshes.length==0||Object.values(this.fullLeavesnstancedMeshes).length==0||!this.planarTree)return;
          for(let mesh of this.branchInstancedMeshes)if(mesh)_group.add(mesh);
          for(let mesh of this.LODInstancedMeshes)if(mesh)_group.add(mesh);
          for(let mesh of Object.values(this.fullLeavesnstancedMeshes))if(mesh)_group.add(mesh);
          _group.add(this.planarTree.group);
             clearInterval(waitLoading);
             window.editor.addObject(_group);   
        },500);
    }
    updateLOD(camera,individualTreeData,frustum){
        if(this.branchInstancedMeshes.length==0||this.LODInstancedMeshes.length==0||Object.values(this.fullLeavesnstancedMeshes).length==0)return;
        for(let mesh of Object.values(this.branchInstancedMeshes))mesh.count=0;
        for(let mesh of Object.values(this.LODInstancedMeshes))mesh.count=0;
        for(let mesh of Object.values(this.fullLeavesnstancedMeshes))mesh.count=0;
        if(this.planarTree)this.planarTree.clear();
        let up=new THREE.Vector3(0,1,0);
        for(let id of this.treeIndexes){
            let treeData=individualTreeData[id];
                  let lod=treeData.LOD;
                 let mat=individualTreeData[id].mat;
                 let bb=this.boundingBox.clone();
                 bb.applyMatrix4(mat);
                 if(!frustum.intersectsBox(bb))continue;
                 if(this.planarTree&&lod==-1 ){
                     let t_pos=new THREE.Vector3().setFromMatrixPosition(mat);
                     let c_pos=camera.position.clone();
                     c_pos.addScaledVector(t_pos,-1.0);
                     let dist=c_pos.length();
                     c_pos.normalize ();
                     let dot=c_pos.dot(up); 
                    this.planarTree.addTree(mat,dot,dist);
                    continue;
                 }
                 if(lod==-1)continue;
                 if(lod==0){
                    addInstancedMesh(this.branchInstancedMeshes[0],mat);
                    addInstancedMesh(this.LODInstancedMeshes[1],mat);
                 }
                 if(lod==1){
                    addInstancedMesh(this.branchInstancedMeshes[0],mat);
                    addInstancedMesh(this.branchInstancedMeshes[1],mat);
                    addInstancedMesh(this.LODInstancedMeshes[2],mat);
                 }
                 if(lod==2){
                    addInstancedMesh(this.branchInstancedMeshes[0],mat);
                    addInstancedMesh(this.branchInstancedMeshes[1],mat);
                    addInstancedMesh(this.branchInstancedMeshes[2],mat);
                    addInstancedMesh(this.LODInstancedMeshes[3],mat);
                 }
                 if(lod==3){
                    addInstancedMesh(this.branchInstancedMeshes[0],mat);
                    addInstancedMesh(this.branchInstancedMeshes[1],mat);
                    addInstancedMesh(this.branchInstancedMeshes[2],mat);
                    addInstancedMesh(this.branchInstancedMeshes[3],mat);
                    addInstancedMesh(this.LODInstancedMeshes[3],mat);
                    for(let mesh of Object.values(this.fullLeavesnstancedMeshes)) addInstancedMesh(mesh,mat);
                 }
        }
        for(let mesh of Object.values(this.branchInstancedMeshes))mesh.instanceMatrix.needsUpdate = true; 
        for(let mesh of Object.values(this.LODInstancedMeshes))mesh.instanceMatrix.needsUpdate = true; 
        for(let mesh of Object.values(this.fullLeavesnstancedMeshes))mesh.instanceMatrix.needsUpdate = true; 
        if(this.planarTree)this.planarTree.update();
    }
}