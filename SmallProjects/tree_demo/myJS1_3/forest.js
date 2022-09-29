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

}