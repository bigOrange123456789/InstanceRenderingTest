function lerp ( x, y, t ) {
    return ( 1 - t ) * x + t * y;
}
function _parseDataStr(count,str){
	let ans=[];
	let strA=str.split(' ');
	for(let i=0;i<count;i++)ans.push(Number(strA[i]));
	return ans;
}
function parseDataStrToArray(str){
	let ans=[];
	let strA=str.split(' ');
	for(let i=0;i<strA.length;i++)ans.push(Number(strA[i]));
	return ans;
}
function toVectorArray(vectors,count){
	let array=[];
	for(let i=0;i<count;i++){
		let now=new THREE.Vector3(vectors._X[i],vectors._Y[i],vectors._Z[i]);
		array.push({pos:now,R:vectors._R[i]});
	}
	return array;
}


function pointDistanceToLine(begin,end,point){
    let v1=new THREE.Vector3();
    v1.copy(end);
    let v2=new THREE.Vector3();
    v2.copy(begin);
    v1.addScaledVector(begin,-1.0);
    v2.addScaledVector(point,-1.0);
    let v3=new THREE.Vector3();
    v3.crossVectors(v1,v2);
    return v3.length()/v1.length();
};
function pointNearestPointOnLine(begin,end,point){
    let v1=new THREE.Vector3();
    v1.copy(end);
    let v2=new THREE.Vector3();
    v2.copy(begin);
    v1.addScaledVector(begin,-1.0);
    v2.addScaledVector(point,-1.0);
    let _t=-1*v2.dot(v1);
    let lineLen=v1.length();
    _t=_t/(lineLen*lineLen);
    let _p=new THREE.Vector3();
    _p.copy(begin)
    v1.multiplyScalar(_t);
    _p.add(v1);
    return {t:_t,p:_p};
}
function straightness(vectors){
    if(vectors.length<=2)return 1.0;
    let begin=vectors[0];
    let end=vectors[vectors.length-1];

 let D=0;let d=0;
 for(let i=1;i<vectors.length-2;i++){
      let v1=new THREE.Vector3();
     v1.copy(vectors[i]);
     v1.addScaledVector(begin,-1.0);
       D+=v1.length();
       d+=pointDistanceToLine(begin,end,vectors[i]);
      
 }
 return 1-d/D;
 }
class SpinePoints{
    constructor(count,obj){
        this.length=0;
        if(!isNaN(count))this.length=count;
        if(obj){
        let X=_parseDataStr(count,obj["Spine"]["X"]);
        let Y=_parseDataStr(count,obj["Spine"]["Y"]);
        let Z=_parseDataStr(count,obj["Spine"]["Z"]);
        let R=_parseDataStr(count,obj["Spine"]["Radius"]);
        this.posX=X;
        this.posY=Y;
        this.posZ=Z;
        this.R=R;
        }else{
            this.length=0;
            if(!isNaN(count))this.length=count;
            this.posX=[];
            this.posY=[];
            this.posZ=[];
            this.R=[];
        }
        for(let i=0;i<this.length;i++){
            if(Math.abs(this.R[i])<0.005)this.R[i]=0.005;
        }
    }

     pos(i,offSet){
         let pos=new THREE.Vector3(this.posX[i],this.posY[i],this.posZ[i]);
         if(offSet)pos.add(offSet);
        return pos;
    }
    radius(i){
        return this.R[i];
    }
    set(i,spinePoints,id){
        let v=spinePoints.pos(id);
        let radius=spinePoints.radius(id);
        this.posX[i]=v.x;
        this.posY[i]=v.y;
        this.posZ[i]=v.z;
        this.R[i]=radius;
    }
    push(x,y,z,r){
        this.length++;
        this.posX.push(x);
        this.posY.push(y);
        this.posZ.push(z);
        this.R.push(r);
    }
    toList(){
            let list=[];
            for(let i=0;i<this.length;i++){
                list.push(new Float32Array([this.posX[i],this.posY[i],this.posZ[i],this.R[i]]));
            } 
            return list;
    }
};

class LeafInfo{
     constructor(transform=null,materailID=-1,meshID=-1,pID=-1,groupID=-1){

       this.pID=pID;
       this.groupID=groupID;
        this.transformData=transform;
        this.materail=materailID;
        this.mesh=meshID;

     }
     toTXTFormat(){
         let ans= `${this.pID} ${this.groupID} ${this.materail} ${this.mesh} \n`;
         ans=ans+this.transformData+'\n';
         return ans;
     }
     setFromTXT(str,transform){
             let info=str.split(" ",4);
             for(let i=0;i<4;i++)info[i]=info[i].replace(/[\x00-\x1F\x7F-\x9F]/g, "");
             this.pID=info[0];
             this.groupID=info[1];
    
              this.materail=info[2];
              this.mesh=info[3];

              this.transformData=toFloat32Array(transform.split(","),8);
     }
}
function _reduceSpinePoints(vectors,threshold,maxReducedDist){
	let array=[];
	let now=0;
	while(true){
		if(now>=vectors.length)break;
		array.push(now);
		if(now+1>=vectors.length)break;
		let testSamples=[vectors.pos(now)];
		let end=now+1;
		for(let i=1;i<=maxReducedDist;i++){
			if(now+i>=vectors.length-1){
				end=vectors.length-1;
				array.push(end);
				break;
			};
			testSamples.push(vectors.pos(now+i));
			if(straightness(testSamples)<threshold){
                end=now+i-1;break;
			}
			if(i==maxReducedDist){
				end=now+i;
				break;
			}
		}
	 
		now=end+1;
	}
    let ans=new SpinePoints(array.length);let i=0;
    for(let idInVectors of array){
        ans.set(i,vectors,idInVectors);
        i++;
    } 
	return ans;
}
function readAbsPos(obj){
    return new THREE.Vector3(Number(obj["_AbsX"]),Number(obj["_AbsY"]),Number(obj["_AbsZ"]));
}
function readRelPos(obj){
    return new THREE.Vector3(Number(obj["_RelX"]),Number(obj["_RelY"]),Number(obj["_RelZ"]));
}

function buildBranch(data,level,id,input_color,hasHelper,_material,uvFactor){
    let list=data["sPoints"];
    let count=list.length;
 

    //if(count!=39)return;
    let name=level+"_"+(id+1);
    let branchGroup=new THREE.Group();
    branchGroup.name="branch_"+name;
    let branchGeo = new THREE.Geometry();

      
    
       //let material = new THREE.MeshStandardMaterial({ color: "#555555" ,side:THREE.DoubleSide} );
         let material=new THREE.MeshNormalMaterial({side:THREE.DoubleSide});
    
         let linePoint=[];



    //growing point;
    if(hasHelper==undefined||hasHelper==true){
        let now_data=list[0];
        let now_pos=new THREE.Vector3(now_data[0],now_data[1],now_data[2]); 
        linePoint.push(now_pos);
   
     let sphereGeo=  new THREE.SphereBufferGeometry(0.15,4,4);
     sphereGeo.translate(now_pos.x,now_pos.y,now_pos.z);
     let material_red = new THREE.MeshBasicMaterial({ color: "red" } );

     let mesh=new THREE.Mesh( sphereGeo, material_red );
      mesh.name="growing_point_"+name;
      if(haveHelper)branchGroup.add(mesh);

    }
         let now_segment=32/(level+1);
       //tube
            let pre_circle=null;
            let cylinderGeo = new THREE.Geometry();
       let capGeo=undefined;

//for uv
let uvInfo={};
uvInfo["uvFactor"]=0.2;
if(uvFactor)uvInfo["uvFactor"]=uvFactor;
uvInfo["vertexUv"]=[];
uvInfo["now_len"]=0;
uvInfo["uv_u_step"]=0;
let len=0;
      for(let i=0;i<count;i++){
          let now_data=list[i];

          let circleGeo = new THREE.CircleGeometry(now_data[3], now_segment );   
            let now_pos=new THREE.Vector3(now_data[0],now_data[1],now_data[2]);
          //circleGeo.translate(now_pos.x,now_pos.y,now_pos.z);
         
          linePoint.push(now_pos);
       
         
         if(i!=list.length-1){
             let next_data=list[i+1];
             let next_pos=new THREE.Vector3(next_data[0],next_data[1],next_data[2]);
           let x=next_pos.x-now_pos.x;
           let y=next_pos.y-now_pos.y;
           let z=next_pos.z-now_pos.z;
           circleGeo.lookAt(new THREE.Vector3(x,y,z));
         }else{
            let pre_data=list[i-1];
            let pre_pos=new THREE.Vector3(pre_data[0],pre_data[1],pre_data[2]);
       
              let x=now_pos.x-pre_pos.x;
              let y=now_pos.y-pre_pos.y;
              let z=now_pos.z-pre_pos.z;
                
             circleGeo.lookAt(new THREE.Vector3(x,y,z)); 
         }
         circleGeo.translate(now_pos.x,now_pos.y,now_pos.z);
           branchGeo.merge(circleGeo);
           if(i==count-1)capGeo =circleGeo;
        //tube

        if(i==0){
            pre_circle=circleGeo;

            let uv_u_step=2*Math.PI*now_data[3]/now_segment;
            let now_u=0;
            for(let i=1;i<pre_circle["vertices"].length;i++){

                cylinderGeo["vertices"].push(pre_circle["vertices"][i]);
                uvInfo["vertexUv"].push(new THREE.Vector2(now_u*uvFactor,0*uvFactor));
                now_u+=uv_u_step;
            }
            //add ending as begining
               cylinderGeo["vertices"].push(pre_circle["vertices"][1]);
                uvInfo["vertexUv"].push(new THREE.Vector2(now_u*uvFactor,0*uvFactor)); 
         }
         else{
           //let cylinder_geo=branchGeoFromTwoCircle(pre_circle,circleGeo); 
           let pre_data=list[i-1];
           let pre_pos=new THREE.Vector3(pre_data[0],pre_data[1],pre_data[2]);
           let now_pos=new THREE.Vector3(now_data[0],now_data[1],now_data[2]);
           len+=pre_pos.distanceTo(now_pos);
           uvInfo["now_len"]=len;let step=2*Math.PI*now_data[3]/now_segment;
           uvInfo["uv_u_step"]=step;
           branchGeoFromTwoCircleToGeo(pre_circle,circleGeo,cylinderGeo,'n',uvInfo);
     /*         branchGeoFromTwoCircleToGeo(pre_circle,circleGeo,cylinderGeo); */
             pre_circle=circleGeo;
           //branchGeo.merge(cylinder_geo);
         }
      }
       
       let bufferBranch=  new THREE.BufferGeometry().fromGeometry(branchGeo);
       let bufferMesh=new THREE.Mesh( bufferBranch, material );
        bufferMesh.name="circle_mesh"+name;
        if(hasHelper==true||hasHelper==undefined)branchGroup.add(bufferMesh);
        //line
        let geometry_line = new THREE.BufferGeometry().setFromPoints( linePoint );
        let material_line = new THREE.LineBasicMaterial( { color: 0x000000,linewidth:0.5 } );
        let line = new THREE.Line( geometry_line, material_line );
        line.name="line"+name;
        if(hasHelper==true||hasHelper==undefined)branchGroup.add(line);
        //tube
        let bufferTube= new THREE.BufferGeometry().fromGeometry(cylinderGeo);
        let tubeMaterial=new THREE.MeshStandardMaterial({color:"#DDDDDD"});
    /*     if(input_color){
            tubeMaterial=new THREE.MeshBasicMaterial({color:input_color});
        } */
   if(_material)tubeMaterial=_material;
        let bufferTubeMesh=new THREE.Mesh( bufferTube, tubeMaterial );
        bufferTubeMesh.name="tube"+name;
        branchGroup.add(bufferTubeMesh);
        //cap
        if(!(hasHelper==true||hasHelper==undefined)){
            if(capGeo){

                let bufferCap=  new THREE.BufferGeometry().fromGeometry(capGeo);
                let bufferCapMesh=new THREE.Mesh( bufferCap, tubeMaterial );
                bufferCapMesh.name="cap";
                branchGroup.add(bufferCapMesh);
            }
          

        }
       //child link
       if(hasHelper==undefined||hasHelper==true){
           let children=data["children"];
           for(let id of Object.keys(children)){
         let c_id=children[id];
         let now_data;
         if(level==0)now_data=list[id-1];
         else now_data=list[id];
         if(now_data==undefined){
             console.log(data);
         }else{
            let now_pos=new THREE.Vector3(now_data[0],now_data[1],now_data[2]); 
            let geometry = new THREE.CylinderBufferGeometry( 0.05,0.05, 1, 8 );
            geometry.translate(now_pos.x,now_pos.y,now_pos.z);
            let material = new THREE.MeshBasicMaterial( {color: 0xffff00} );
            let cylinder = new THREE.Mesh( geometry, material );
            cylinder.name="child_growing_point_id_"+(level+1)+"_"+c_id;
            branchGroup.add(cylinder);
         }
     

       }
    
       }


        return branchGroup;
}

 
function computeLeafTransform(data){
    let matTranslation=new THREE.Matrix4();
    matTranslation.makeTranslation(data[0],data[1],data[2]);
    let matScale=new THREE.Matrix4();
    matScale.makeScale(data[3],data[3],data[3]);
    let matRotation=new THREE.Matrix4();
    matRotation.makeRotationAxis(
            new THREE.Vector3(data[4],data[5],data[6]),
            data[7]/180.0*Math.PI
    );
    let mat=new THREE.Matrix4();
    mat.multiply(matTranslation);
    mat.multiply(matScale);
    mat.multiply(matRotation);
    return mat;
}

function branchGeoFromTwoCircle(pre_circle,now_circle,order){
	let geo=new THREE.Geometry();
	let length=pre_circle.vertices.length-1;
	for(let i=1;i<length+1;i++){
		geo["vertices"].push(pre_circle["vertices"][i]);
    }
    //TODO find min point change order
    let begin=1;let p_first=pre_circle["vertices"][1];
    let axis=new THREE.Vector3();
    axis.copy(now_circle["vertices"][0]);
    axis.addScaledVector(pre_circle["vertices"][0],-1);
    axis.normalize();
    let dot=-1;
    for(let i=1;i<length+1;i++){
        let diff=new THREE.Vector3();
        diff.copy(now_circle["vertices"][i]);
        diff.addScaledVector(p_first,-1);
        diff.normalize();
        let now_dot=diff.dot(axis);
        if(dot==-1||now_dot>dot){
            dot=now_dot;
            begin=i;
        } 
    }
    
	for(let i=0;i<length+1;i++){
        let now=(begin+i)%(length+1);
		if(now!=0)geo["vertices"].push(now_circle["vertices"][now]);
	}
	function quad(a,b,c,d){
		if(order!="r"){
			geo.faces.push( new THREE.Face3( a,d, c ) );
			geo.faces.push( new THREE.Face3( c, b, a ) );
		}else{
			geo.faces.push( new THREE.Face3( a,b, c ) );
			geo.faces.push( new THREE.Face3( c, d, a ) );
		}
	
	}
	for(let i=0;i<length-1;i++)quad(i,(i+length),(i+length+1),(i+1));
	quad(length-1,2*length-1,length,0);
	geo.computeFaceNormals();
	geo.computeVertexNormals();
	return geo;
}
function branchGeoFromTwoCircleToGeo(pre_circle,now_circle,geo,order,uvInfo){
	//let geo=new THREE.Geometry();
    let length=now_circle.vertices.length-1;
    let pre_circle_vertices=[];
    let last_pos=geo["vertices"].length-length-1;
	 for(let i=0;i<length;i++){
		pre_circle_vertices.push(geo["vertices"][last_pos+i]);
    } 
    let now_circle_vertices=[];
    for(let i=1;i<length+1;i++){
        now_circle_vertices.push(now_circle["vertices"][i]);
    }
    //TODO find min point change order
    let begin=0;let p_first=pre_circle_vertices[0];
    let axis=new THREE.Vector3();
    axis.copy(now_circle["vertices"][0]);
    axis.addScaledVector(pre_circle["vertices"][0],-1);
    axis.normalize();
    let dot=-1;
    for(let i=0;i<length;i++){
        let diff=new THREE.Vector3();
        diff.copy(now_circle_vertices[i]);
        diff.addScaledVector(p_first,-1);
        diff.normalize();
        let now_dot=diff.dot(axis);
        if(dot==-1||now_dot>dot){
            dot=now_dot;
            begin=i;
        } 
    }
    let now_u=0;
 
	for(let i=0;i<length;i++){
        let now=(begin+i)%(length);
        geo["vertices"].push(now_circle_vertices[now]);
         if(uvInfo){
            uvInfo["vertexUv"].push(new  THREE.Vector2(now_u*uvInfo["uvFactor"],uvInfo["now_len"]*uvInfo["uvFactor"]));
            now_u+=uvInfo["uv_u_step"];
         }
        }
        //add Ending as beginning
        geo["vertices"].push(now_circle_vertices[begin]);
        if(uvInfo) uvInfo["vertexUv"].push(new  THREE.Vector2(now_u*uvInfo["uvFactor"],uvInfo["now_len"]*uvInfo["uvFactor"]));
	function quad(a,b,c,d){
        let ZeroUV=new THREE.Vector2();ZeroUV.x=0;  ZeroUV.y=0;
        if(geo.faceVertexUvs.length==0)geo.faceVertexUvs.push([]);
        
		if(order!="r"){
            geo.faces.push( new THREE.Face3( a,d, c ) );
            if(!uvInfo)geo.faceVertexUvs[0].push([ZeroUV,ZeroUV,ZeroUV]);
            else geo.faceVertexUvs[0].push([uvInfo["vertexUv"][a],uvInfo["vertexUv"][d],uvInfo["vertexUv"][c]]);
            geo.faces.push( new THREE.Face3( c, b, a ) );
            if(!uvInfo)geo.faceVertexUvs[0].push([ZeroUV,ZeroUV,ZeroUV]);
            else geo.faceVertexUvs[0].push([uvInfo["vertexUv"][c],uvInfo["vertexUv"][b],uvInfo["vertexUv"][a]]);
		}else{
            geo.faces.push( new THREE.Face3( a,b, c ) );
            if(!uvInfo)geo.faceVertexUvs[0].push([ZeroUV,ZeroUV,ZeroUV]);
            else geo.faceVertexUvs[0].push([uvInfo["vertexUv"][a],uvInfo["vertexUv"][b],uvInfo["vertexUv"][c]]);
            geo.faces.push( new THREE.Face3( c, d, a ) );
            if(!uvInfo) geo.faceVertexUvs[0].push([ZeroUV,ZeroUV,ZeroUV]);
            else geo.faceVertexUvs[0].push([uvInfo["vertexUv"][c],uvInfo["vertexUv"][d],uvInfo["vertexUv"][a]]);
		}
	
    }
   
    let offset=geo["vertices"].length-2*(length+1);
	for(let i=0;i<length;i++){
        if(i==23){

            let a=666;
        }
        quad(offset+i,offset+(i+length+1),offset+(i+length+1+1),offset+(i+1));
    }
	//quad(offset+length-1,offset+2*length-1,offset+length,offset+0);
	geo.computeFaceNormals();
	geo.computeVertexNormals();
	return geo;
}
class BranchData{
    constructor(obj,treeObj){
        //this.tree=treeObj;
        this.name=obj["_Name"];
        this.id=obj["_ID"];
 
        //layer
        this.layer=-1;
        this.idInlayer=-1;
        //position
        this.posAbs=readAbsPos(obj);
        this.posRel=readAbsPos(obj);
        //parent information
        this.parentID=obj["_ParentID"];
        this.growingPos={};
        //Spine Points 
        this.spinePointCount=Number(obj["Spine"]["_Count"]);
        this.spinePoints=new SpinePoints( this.spinePointCount,obj);
        //this.spinePoints=_reduceSpinePoints(this.spinePoints,0.9,4);
        this.spinePointCount=this.spinePoints.length;
        //TODO
        //child branches 
        this.childrenBranchCount=0;
        this.childrenBranchIndices=[];
        this.childrenBranchPos={};
        //children leafs
        this.childrenleafCount=0;
   
        this.childrenLeafs=[];
    };
      addChildBranch(branchData){
        this.childrenBranchCount++;
        this.childrenBranchIndices.push(branchData.id);
    };
      addChildLeaves(obj,tree,pID){
        let id=obj["_ID"];
        let LeafReferences=obj["LeafReferences"];
        let data=[];
        if(!Array.isArray(LeafReferences))data.push(LeafReferences);
        else data=LeafReferences;

        for(let set of data){
            let count=Number(set["_Count"]);
            let materailID=Number(set["_Material"]);
            this.childrenleafCount+=count;
            for(let k of Object.keys(set)){
                set[k]=parseDataStrToArray(LeafReferences[k]);
            }
           for(let i=0;i<count;i++){
               let transform=new Float32Array(8);
               transform[0]=set["X"][i];
               transform[1]=set["Y"][i];
               transform[2]=set["Z"][i];
               transform[3]=set["Scale"][i];
               transform[4]=set["RotAxisX"][i];
               transform[5]=set["RotAxisY"][i];
               transform[6]=set["RotAxisZ"][i];
               transform[7]=set["RotAngle"][i];
               tree.leavesInfo.push(new LeafInfo(transform,materailID,set["MeshID"][i],pID,id));
               this.childrenLeafs.push(tree.leavesInfo.length-1);
           }
        }
        
    };
    findChildrenGrowingPos(mergeThreshold,tree){
        let growingPos=[];
 
        for(let id of this.childrenBranchIndices){
            let offset_c=tree.branches[id].posAbs;
            let begin_point=tree.branches[id].spinePoints.pos(0,offset_c);
            let now_info={};
            now_info["branchID"]=id;
            for(let i=0;i<this.spinePointCount-1;i++){
                let offset_p=this.posAbs;
                let now_pos=this.spinePoints.pos(i,offset_p);
                let next_pos=this.spinePoints.pos(i+1,offset_p);
                let dist=pointDistanceToLine(now_pos,next_pos,begin_point);
                let nearestPoint=pointNearestPointOnLine(now_pos,next_pos,begin_point);
                if(nearestPoint.t>=0&&nearestPoint.t<=1){
                    if(now_info["dist"]==undefined||now_info["dist"]>dist){
                        now_info["dist"]=dist;
                        now_info["t"]=nearestPoint.t;
                        //now_info["pos"]=nearestPoint.p;
                        now_info["spinePointId"]=i;
                       }
                }
               
            }
            if(now_info["dist"]==undefined){
                for(let i=0;i<this.spinePointCount;i++){
                    let offset_p=this.posAbs;
                    let now_pos=this.spinePoints.pos(i,offset_p);
                    let v= new THREE.Vector3();v.copy(begin_point);
                    v.addScaledVector(now_pos,-1);
                    let dist=v.length();
                    if(now_info["dist"]==undefined||now_info["dist"]>dist){
                        now_info["dist"]=dist;
                        now_info["t"]=0;
                        //now_info["pos"]=nearestPoint.p;
                        now_info["spinePointId"]=i;
                    }
                
                }
            }
            growingPos.push(now_info)
        }
    
        growingPos.sort(function(a,b){
          if(a["spinePointId"]< b["spinePointId"])return -1;
          if(a["spinePointId"]>b["spinePointId"])return 1;
          if(a["spinePointId"]== b["spinePointId"]){
              if(a["t"]<b["t"])return -1;
              if(a["t"]>b["t"])return 1;
              return 0;
          }
       
        });
        let now_spinePointId=0;
        let ans=new SpinePoints();
       for(let new_pos_id=0;new_pos_id < growingPos.length;new_pos_id++){
           let pos=growingPos[new_pos_id];
           let spinePointId=pos["spinePointId"];
           while(now_spinePointId<=spinePointId){
               let now_pos=this.spinePoints.pos(now_spinePointId);
               let now_r=this.spinePoints.radius(now_spinePointId);
               ans.push(now_pos.x,now_pos.y,now_pos.z,now_r);
               now_spinePointId++;

           }
           
           let t=pos.t;
           let nearestPoint=new THREE.Vector3();
           let nearest_r=0;
       
          
           let now_pos=this.spinePoints.pos(spinePointId);
           let next_pos=this.spinePoints.pos(spinePointId+1);

           let now_r=this.spinePoints.radius(spinePointId);
           let next_r=this.spinePoints.radius(spinePointId+1);
           
           if(t<mergeThreshold){
            nearestPoint.copy(now_pos);
            nearest_r=now_r;
            }else if(1-t<mergeThreshold){
                nearestPoint.copy(next_pos);
                nearest_r=next_r;
                if( now_spinePointId<=spinePointId+1){
                    ans.push(nearestPoint.x,nearestPoint.y,nearestPoint.z,nearest_r);
                    now_spinePointId=spinePointId+2;
                }
                 
            }else{
                nearestPoint.copy(now_pos);
                nearestPoint.lerp(next_pos,t);

                nearest_r=lerp(now_r,next_r,t);
                ans.push(nearestPoint.x,nearestPoint.y,nearestPoint.z,nearest_r);
            }
          
         

         
          //child branch
          let childID=pos["branchID"];
          let childBranch=tree.branches[childID];
          childBranch.growingPos["spinePointIdInParent"]=ans.length-1;
          //parent to child link;
          let id=ans.length-1;
          this.childrenBranchPos[id.toString()]=pos["branchID"];

          let growingPoint=new THREE.Vector3();
          growingPoint.copy(nearestPoint);
          let offset_p=this.posAbs;
          let offset_c=childBranch.posAbs;
          growingPoint.add(offset_p);
          growingPoint.addScaledVector(offset_c,-1);
          childBranch.growingPos["growingPoint"]=growingPoint;
       }
        for(now_spinePointId;now_spinePointId<this.spinePointCount;now_spinePointId++){
            let now_pos=this.spinePoints.pos(now_spinePointId);
            let now_r=this.spinePoints.radius(now_spinePointId);
            ans.push(now_pos.x,now_pos.y,now_pos.z,now_r);
        }
        this.spinePointCount=ans.length;
        this.spinePoints=ans;
};
     
      produceBranchGeo(treeGroup,style,level,_material,uvFactor,haveHelper=true){
        let count=this.spinePointCount;
        let X=this.spinePoints.posX;
         let Y=this.spinePoints.posY;
         let Z=this.spinePoints.posZ;
          let R=this.spinePoints.R;
          let list=toVectorArray({_X:X,_Y:Y,_Z:Z,_R:R},count);
          
          let branchGroup = new THREE.Group();
          branchGroup.name=this.name+"_"+this.id;
          let branchGeo = new THREE.Geometry();
        
           let material = new THREE.MeshStandardMaterial({ color: "#555555"} );
           if(_material)material=_material;
            //let material=new THREE.MeshNormalMaterial({side:THREE.DoubleSide});
              
             let linePoint=[];
              
                
             let now_segment=24-level*4;
                  //growing point;
        if(this.growingPos["growingPoint"]){
            let now_pos=this.growingPos["growingPoint"];
            if(style=="line"){
                linePoint.push(now_pos);
            }
       
         let sphereGeo=  new THREE.SphereBufferGeometry(0.15,4,4);
         sphereGeo.translate(now_pos.x,now_pos.y,now_pos.z);
         let material = new THREE.MeshBasicMaterial({ color: "red" } );

         let mesh=new THREE.Mesh( sphereGeo, material );
          mesh.name="growing_point";
          if(haveHelper)branchGroup.add(mesh);
        }
         let pre_circle=null;
         let len=0;
         let cylinderGeo=new THREE.Geometry();
         let uvInfo={};
         uvInfo["uvFactor"]=0.2;
         if(uvFactor)uvInfo["uvFactor"]=uvFactor;
         uvInfo["vertexUv"]=[];
         uvInfo["now_len"]=0;
         uvInfo["uv_u_step"]=0;
          for(let i=0;i<list.length;i++){
              let now_data=list[i];
  
              let circleGeo = new THREE.CircleGeometry(now_data.R, now_segment );   
                let now_pos=now_data.pos;
              //circleGeo.translate(now_pos.x,now_pos.y,now_pos.z);
             
                 if(style=="line"){
                     linePoint.push(now_pos);
                 }
             //children growing point
          if( this.childrenBranchPos[i.toString()]){
            let geometry = new THREE.CylinderBufferGeometry( 0.05,0.05, 1, 8 );
            geometry.translate(now_pos.x,now_pos.y,now_pos.z);
            let material = new THREE.MeshBasicMaterial( {color: 0xffff00} );
            let cylinder = new THREE.Mesh( geometry, material );
            cylinder.name="child_growing_point_id_"+this.childrenBranchPos[i.toString()];
            if(haveHelper)branchGroup.add(cylinder);
          }       
             
             if(i!=list.length-1){
                 let next_pos=list[i+1].pos;
               let x=next_pos.x-now_pos.x;
               let y=next_pos.y-now_pos.y;
               let z=next_pos.z-now_pos.z;
               circleGeo.lookAt(new THREE.Vector3(x,y,z));
             }else{
                 let pre_pos=list[i-1].pos;
                  let x=now_pos.x-pre_pos.x;
                  let y=now_pos.y-pre_pos.y;
                  let z=now_pos.z-pre_pos.z;
                    
                 circleGeo.lookAt(new THREE.Vector3(x,y,z)); 
             }
             circleGeo.translate(now_pos.x,now_pos.y,now_pos.z);
             if(i==0){
                pre_circle=circleGeo;

                let uv_u_step=2*Math.PI*now_data.R/now_segment;
                let now_u=0;
                for(let i=1;i<pre_circle["vertices"].length;i++){

                    cylinderGeo["vertices"].push(pre_circle["vertices"][i]);
                    uvInfo["vertexUv"].push(new THREE.Vector2(now_u*uvFactor,0*uvFactor));
                    now_u+=uv_u_step;
                }
                //add ending as begining
                   cylinderGeo["vertices"].push(pre_circle["vertices"][1]);
                    uvInfo["vertexUv"].push(new THREE.Vector2(now_u*uvFactor,0*uvFactor)); 
             }
             else{
              // let cylinder_geo=branchGeoFromTwoCircle(pre_circle,circleGeo);
                 //For UV
             let pre_data=list[i-1];
             let pre_pos=pre_data.pos;
             let now_pos=now_data.pos;
             len+=pre_pos.distanceTo(now_pos);
             uvInfo["now_len"]=len;let step=2*Math.PI*now_data.R/now_segment;
             uvInfo["uv_u_step"]=step;
             branchGeoFromTwoCircleToGeo(pre_circle,circleGeo,cylinderGeo,'n',uvInfo);
       /*         branchGeoFromTwoCircleToGeo(pre_circle,circleGeo,cylinderGeo); */
               pre_circle=circleGeo;
               //branchGeo.merge(cylinder_geo);
             }
               branchGeo.merge(circleGeo);
  
          }
          //let cylinderGeo = new buildBranchTube(this.spinePoints.toList(),this.layer,0.2,true);
          branchGeo.merge(cylinderGeo);
           let bufferBranch=  new THREE.BufferGeometry().fromGeometry(branchGeo);
           let bufferMesh=new THREE.Mesh( bufferBranch, material );
            bufferMesh.name="mesh";
            branchGroup.add(bufferMesh);
            //line
            if(style=="line"){
                let geometry = new THREE.BufferGeometry().setFromPoints( linePoint );
                let material = new THREE.LineBasicMaterial( { color: 0x000000,linewidth:0.5 } );
                let line = new THREE.Line( geometry, material );
                line.name="line";
                if(haveHelper)branchGroup.add(line);
            }

       

           branchGroup.translateX(this.posAbs.x);branchGroup.translateY(this.posAbs.y);branchGroup.translateZ(this.posAbs.z);
           branchGroup["treeLevel"]=this.layer;
           //console.log(branchGroup);
           //console.log( branchGroup["treeLevel"]);
           
          treeGroup.add(branchGroup);
      }
      produceLeavesOnBranch(tree){
          let leaves=tree.leaves;
        for(let id of this.childrenLeafs){
            let data=tree.leavesInfo[id];
            if(!leaves[data.mesh]){
                leaves[data.mesh]={};
            }
            if(!leaves[data.mesh][data.materail]){
                leaves[data.mesh][data.materail]=[];
            }
            leaves[data.mesh][data.materail].push(computeLeafTransform(data["transformData"]));
        }
      }
      toTXTFormat(tree,isMore=false){
          let txt="";
          let parentID=-1;
          if(tree.branches[this.parentID]){
            parentID=tree.branches[this.parentID].idInlayer+1
          }
          
          let growingPos=-1;
          if(this.growingPos["spinePointIdInParent"]!=undefined&&this.growingPos["spinePointIdInParent"]!=null){
            growingPos=this.growingPos["spinePointIdInParent"]+1;
          }
     
       
          txt+=parentID+" "+growingPos+"\n";
         
          let offset=this.posAbs;
          let spinePointCount=this.spinePointCount;
          if(this.growingPos["growingPoint"]){
            spinePointCount++;
          }
         if(!isMore) txt+=spinePointCount+"\n";
         else txt+=`${spinePointCount}:${this.id}:${this.parentID}\n`;
        if(this.growingPos["growingPoint"]!=undefined&&this.growingPos["growingPoint"]!=null){
            let pos=this.growingPos["growingPoint"];
            pos.add(offset);
            let r=this.spinePoints.radius(0);
            txt+=pos.x+" "+pos.y+" "+pos.z+" "+r+"\n";
            spinePointCount++;
        }
      
          for(let i=0;i<this.spinePointCount;i++){
              let pos=this.spinePoints.pos(i,offset);
              let r=this.spinePoints.radius(i);
              txt+=pos.x+" "+pos.y+" "+pos.z+" "+r+"\n";
          }
          return txt;
      }
}  
function meshToTXT(mesh,id){
    
     let geo=mesh.geo;
     let ans=id+"|"+mesh.filename+"|"+geo["attributes"]["position"].count+"\n";
     ans+=geo["attributes"]["position"]["array"]+"|";
     ans+=geo["attributes"]["normal"]["array"]+"|";
     ans+=geo["attributes"]["uv"]["array"]+"|";
     ans+=geo["index"]["array"]+"\n";
     return ans;
    }
function generateMesh(RawData){
    let vCount=Number(RawData["LOD"][0]["Vertices"]["_Count"]);
    let vData=RawData["LOD"][0]["Vertices"];

    let _filename=RawData["LOD"][0]["_Filename"];

    let geometry = new THREE.BufferGeometry();
    let positionNumComponents = 3;
    let normalNumComponents = 3;
    let uvNumComponents = 2;
    

    let positions=new Float32Array(vCount*positionNumComponents);
    let normals=new Float32Array(vCount*normalNumComponents);
    let uvs=new Float32Array(vCount*uvNumComponents);

    for(let k of Object.keys(vData)){
        vData[k]=parseDataStrToArray(vData[k]);
    }
    for(let i=0;i<vCount;i++){
        positions[i*positionNumComponents]=vData["X"][i];
        positions[i*positionNumComponents+1]=vData["Y"][i];
        positions[i*positionNumComponents+2]=vData["Z"][i];
        normals[i*normalNumComponents]=vData["NormalX"][i];
        normals[i*normalNumComponents+1]=vData["NormalY"][i];
        normals[i*normalNumComponents+2]=vData["NormalZ"][i];
        uvs[i*uvNumComponents]=vData["TexcoordU"][i];
        uvs[i*uvNumComponents+1]=vData["TexcoordV"][i];
    }
    geometry.setAttribute(
        'position',
        new THREE.BufferAttribute(positions, positionNumComponents));
    geometry.setAttribute(
        'normal',
        new THREE.BufferAttribute(normals, normalNumComponents));
    geometry.setAttribute(
        'uv',
        new THREE.BufferAttribute(uvs, uvNumComponents));
        let idData= RawData["LOD"][0]["TriangleIndices"];
        
        geometry.setIndex(parseDataStrToArray(idData));

        //let mat=new THREE.MeshBasicMaterial({"color":"green"});

        //let mesh=new THREE.Mesh(geometry,mat);
        //window.editor.addObject(mesh);
        let mesh={
                filename:_filename,
                   geo:geometry
        };
        return mesh;
}
class MeshReferred{
constructor(_idInXML,_filename,_maxCountPreUnit,geometry,_geometry_unbuffered){
    this.geo=geometry;
  this.idInXML=_idInXML;
  this.filename=_filename;
  this.maxCountPreUnit=_maxCountPreUnit;
  this.geometry_unbuffered=_geometry_unbuffered;
}


}
function generateMeshFromTXT(meta,geo){

    let metaData=meta.split("|");
    let _idInXML=metaData[0];
   
    let vCount=metaData[2];
    let vData=geo.split("|");

    let _filename=metaData[1];
   let _maxCountPreUnit=0;
   if(metaData.length>3){
    _maxCountPreUnit=Number(metaData[3]);
   }
    let geometry = new THREE.BufferGeometry();
    let positionNumComponents = 3;
    let normalNumComponents = 3;
    let uvNumComponents = 2;
    

    let positions=toFloat32Array(vData[0].split(","));
    let normals=toFloat32Array(vData[1].split(","));
    let uvs=  toFloat32Array(vData[2].split(","));

    
 
/*     for(let i=0;i<vCount;i++){
        positions[i*positionNumComponents]=vData[0][i];
        positions[i*positionNumComponents+1]=vData[1][i];
        positions[i*positionNumComponents+2]=vData[2][i];
        normals[i*normalNumComponents]=vData["NormalX"][i];
        normals[i*normalNumComponents+1]=vData["NormalY"][i];
        normals[i*normalNumComponents+2]=vData["NormalZ"][i];
        uvs[i*uvNumComponents]=vData["TexcoordU"][i];
        uvs[i*uvNumComponents+1]=vData["TexcoordV"][i];
    } */
    geometry.setAttribute(
        'position',
        new THREE.BufferAttribute(positions, positionNumComponents));
    geometry.setAttribute(
        'normal',
        new THREE.BufferAttribute(normals, normalNumComponents));
    geometry.setAttribute(
        'uv',
        new THREE.BufferAttribute(uvs, uvNumComponents));
  
        let id=[];
        for(let i of vData[3].split(","))id.push(Number(i));
        geometry.setIndex(id);

/*         let mat=new THREE.MeshBasicMaterial({"color":"green"});

        let _mesh=new THREE.Mesh(geometry,mat);
        window.editor.addObject(_mesh); */
        let geometry_unbuffered=new THREE.Geometry();
        let vertex=[];
        let vertexUV=[];
        for(let i=0;i<Number(vCount);i++){
            vertex.push(new THREE.Vector3(positions[i*3],positions[i*3+1],positions[i*3+2]));
            vertexUV.push(new THREE.Vector2(uvs[i*2],uvs[i*2+1]));
        }
        geometry_unbuffered.vertices=vertex;
        if(geometry_unbuffered.faceVertexUvs.length==0)geometry_unbuffered.faceVertexUvs.push([]);
  
        let faceCount=id.length/3;
        for(let i=0;i<faceCount;i++){
            let a=id[i*3];let b=id[i*3+1];let c=id[i*3+2];
            geometry_unbuffered.faces.push( new THREE.Face3(a,b,c ) );
            geometry_unbuffered.faceVertexUvs[0].push( [vertexUV[a],vertexUV[b],vertexUV[c] ]);
        }
        geometry_unbuffered.computeFaceNormals();
        geometry_unbuffered.computeVertexNormals(true);
/*         let mat=new THREE.MeshBasicMaterial({"color":"green"});

        let _mesh=new THREE.Mesh(geometry_unbuffered,mat);
        _mesh.name="mesh_test";
        window.editor.addObject(_mesh); */
        let mesh=new MeshReferred(_idInXML,_filename,_maxCountPreUnit,geometry,geometry_unbuffered);
      
        return mesh;
}
function generateMaterialFromJSON(json,material){
    material.name=json["name"];
    for(let key of Object.keys(json)){
        if(key=="Color"||key=="Opacity"||key=="Normal"){
            loadTextureOnMaterial(key,json[key],material);
        }
    }
}
function loadTextureOnMaterial(type,name,material){
     if(type=="Color"||type=="Opacity"||type=="Normal"){
        let colorMapLoader=new THREE.TextureLoader();
        colorMapLoader.load(`../myImage/${name}`,
        function(tex)
        {  
           let targetMap="map";
           if(type=="Color"){
               targetMap="map";
           }else if(type=="Opacity"){
                targetMap="alphaMap";

           }else if(type=="Normal"){
            targetMap="normalMap";
           }else return;
            tex.encoding=THREE.sRGBEncoding;
            material[targetMap]=tex;
            material[targetMap].wrapS = THREE.RepeatWrapping;
            material[targetMap].wrapT = THREE.RepeatWrapping;
            let ratio=material[targetMap].image.height/material[targetMap].image.width;
            material[targetMap].repeat.set(ratio,1);
            material[targetMap].updateMatrix ();
            material.needsUpdate=true;
        });
        

     }
         
     
}
function generateMaterial(data,tree){
let material=new THREE.MeshStandardMaterial();
let _id=Number(data["_ID"]);let _name=data["_Name"];
let _isTwoSided=Number(data["_TwoSided"]);

material.name=_name;
let materialInfo={
    id:_id,
    name:_name,
    isTwoSided:_isTwoSided
};
if(_isTwoSided==1)material.side=THREE.DoubleSide;
for(let info of data["Map"]){
      if(info["_File"]){
        loadTextureOnMaterial(info["_Name"],info["_File"],material);
        materialInfo[info["_Name"]]=info["_File"];
      }
}
tree.materialsInfo.push(materialInfo);
return material;
}
class TreeData{
    constructor(data,type){
     if(type=="xml"){
        let x2js = new X2JS();
        let json= x2js.xml_str2json( data );
        //console.log(JSON.stringify(json));
        let speedTreeJSON=json["SpeedTreeRaw"];
        //meshes
        this.meshes={};
        this.materials={};
        this.materialsInfo=[];
        if(speedTreeJSON[ "Meshes"]){
            if(speedTreeJSON[ "Meshes"]["Mesh"]){
                let meshArray=speedTreeJSON[ "Meshes"]["Mesh"];
                this.meshCount=Number(speedTreeJSON[ "Meshes"]["_Count"]);

                if(!Array.isArray(meshArray)){
                    let mesh=meshArray;
                    meshArray=[];
                    meshArray.push(mesh);
                }
                for(let mesh of meshArray.values()){
                    let id=mesh["_ID"];
                    this.meshes[id]=generateMesh(mesh);
                }
            }
           
        }
        //TODO materials
        if(speedTreeJSON[ "Materials"]){
            if(speedTreeJSON[ "Materials"]["Material"]){
                let materialArray=speedTreeJSON[ "Materials"]["Material"];
                this.materialCount=Number(speedTreeJSON[ "Materials"]["_Count"]);

                if(!Array.isArray(materialArray)){
                    let material=materialArray;
                    materialArray=[];
                    materialArray.push(material);
                }
                for(let material of materialArray.values()){
                    let id=material["_ID"];
                    this.materials[id]=generateMaterial(material,this);
                }
            }
           
        }
        this.rootIndices=[];
        this.localPos={};
        this.branches={};
        this.leaves={};
        this.leavesInfo=[];
        //object,include branch and leaf
        if(speedTreeJSON["Objects"]){
            if(speedTreeJSON["Objects"]["Object"]){
               
                let objects=speedTreeJSON["Objects"]["Object"];
                if(!Array.isArray(objects)){
                    let object=objects;
                    objects=[];
                    objects.push(object);
                }
                for(let obj of objects){
                    if(obj[ "_ParentID"]=="0") this.rootIndices.push(obj[ "_ID"]);
                    if(!obj[ "_ParentID"]){
                        this.localPos["posAbs"]=readAbsPos(obj);
                        this.localPos["posRel"]=readRelPos(obj);
                    }
                    else if(obj["Spine"]!=null){
                        let id=obj["_ID"];
                        let pid=obj[ "_ParentID"];
                        this.branches[id]=new BranchData(obj,this);
                        if(pid!="0")this.branches[pid].addChildBranch(this.branches[id]);
                    }else if(obj["LeafReferences"]!=null){
                        let pid=obj[ "_ParentID"];
                        this.branches[pid].addChildLeaves(obj,this,pid);
                    }
                }
            }
         
        }
        //find level structure
        let now=this.rootIndices;let now_layer=0;
        while(now.length!=0){
            let next=[];
            let now_id=0;
            for(let id of now){
                this.branches[id].layer=now_layer;
                this.branches[id].idInlayer=now_id;now_id++;
                for(let n of  this.branches[id].childrenBranchIndices){
                    next.push(n);
                }
            }
            now=next;
            now_layer++;
        }
       
        this.maxLevel=now_layer-1;

         //weld point
        let values=Object.values(this.branches);
        for(let branch of values){
            branch.findChildrenGrowingPos(0.05,this);
        }
     }
      if(type=="txt"){}
    }
    
    toTXTFormat(isMore=false){
        let maxL=this.maxLevel+1;
        let txt=maxL.toString()+"\n";
        console.log(this);
        let now=this.rootIndices;let now_layer=0;
        while(now.length!=0){
            txt+="Layer "+now_layer+"\n";
            txt+=now.length.toString()+"\n";
            let next=[];
            for(let id of now){
                txt+=this.branches[id].toTXTFormat(this,isMore);
                for(let n of  this.branches[id].childrenBranchIndices){
                    next.push(n);
                }
               
            }
            now=next;
            now_layer++;
        }
        txt+="BranchesEnd\n";
       if(isMore){
          txt+="LeavesBegin\n";
          for(let info of this.leavesInfo){
              txt+=info.toTXTFormat();
          }
          txt+="LeavesEnd\n";
          txt+="MeshesBegin\n";
         for(let key of Object.keys(this.meshes)){
             txt+=meshToTXT(this.meshes[key],key);
         }
         txt+="MeshesEnd\n";
          txt+="MaterialsInfo\n";
          txt+=JSON.stringify(this.materialsInfo)+'\n';
       }
        return txt;
    }
}
function toFloat32Array(list,count){
    if(!count)count=list.length;
    let ans=new Float32Array(count);
 
    for(let i=0;i<count;i++)ans[i]=Number(list[i]);
    return ans;
}
function buildBranchTransformMat(data){
   let mat=new THREE.Matrix4();
   let t=new THREE.Matrix4();
   t.makeTranslation(-1*data[0],-1*data[1],-1*data[2]);
   let r=new THREE.Matrix4();
   r.makeRotationAxis(new THREE.Vector3(data[3],data[4],data[5]),-1*data[6]);

   let s=new THREE.Matrix4();
   let sf=1/data[7];
   s.makeScale(sf,sf,sf);
   mat.multiply(t);
   mat.multiply(r);
   mat.multiply(s);
   return mat;
}
function buildTreeTransformMat(data){
    let mat=new THREE.Matrix4();
    let t=new THREE.Matrix4();
    t.makeTranslation(data[0],data[1],data[2]);
    let r=new THREE.Matrix4();
    r.makeRotationY(data[3]);
 
    let s=new THREE.Matrix4();
    let sf=data[4];
    s.makeScale(sf,sf,sf);
    mat.multiply(t);
    mat.multiply(r);
    mat.multiply(s);
    return mat;
}
function buildBranchTube(list,level,uvFactor,isUnBuffer){
 
    let count=list.length;
    
    let branchGeo = new THREE.Geometry();
 
    let now_segment=24-level*4;
       //tube
            let pre_circle=null;
            let cylinderGeo = new THREE.Geometry();
       let capGeo=undefined;
       let len=0;
       let uvInfo={};
       uvInfo["uvFactor"]=0.2;
       if(uvFactor)uvInfo["uvFactor"]=uvFactor;
       uvInfo["vertexUv"]=[];
       uvInfo["now_len"]=0;
      for(let i=0;i<count;i++){
          let now_data=list[i];

          let circleGeo = new THREE.CircleGeometry(now_data[3], now_segment );   
        let now_pos=new THREE.Vector3(now_data[0],now_data[1],now_data[2]);
       
         
         if(i!=list.length-1){
             let next_data=list[i+1];
             let next_pos=new THREE.Vector3(next_data[0],next_data[1],next_data[2]);
           let x=next_pos.x-now_pos.x;
           let y=next_pos.y-now_pos.y;
           let z=next_pos.z-now_pos.z;
           circleGeo.lookAt(new THREE.Vector3(x,y,z));
         }else{
            let pre_data=list[i-1];
            let pre_pos=new THREE.Vector3(pre_data[0],pre_data[1],pre_data[2]);
       
              let x=now_pos.x-pre_pos.x;
              let y=now_pos.y-pre_pos.y;
              let z=now_pos.z-pre_pos.z;
                
             circleGeo.lookAt(new THREE.Vector3(x,y,z)); 
         }
         circleGeo.translate(now_pos.x,now_pos.y,now_pos.z);
           //branchGeo.merge(circleGeo);
           if(i==count-1)capGeo =circleGeo;
        //tube

        if(i==0){
            pre_circle=circleGeo;
            let uv_u_step=2*Math.PI*now_data[3]/now_segment;
            let now_u=0;
            for(let i=1;i<pre_circle["vertices"].length;i++){

                cylinderGeo["vertices"].push(pre_circle["vertices"][i]);
                uvInfo["vertexUv"].push(new THREE.Vector2(now_u*uvFactor,0*uvFactor));
                now_u+=uv_u_step;
            }
            //add ending as begining
               cylinderGeo["vertices"].push(pre_circle["vertices"][1]);
                uvInfo["vertexUv"].push(new THREE.Vector2(now_u*uvFactor,0*uvFactor)); 
         }
         else{
             //For UV
             let pre_data=list[i-1];
             let pre_pos=new THREE.Vector3(pre_data[0],pre_data[1],pre_data[2]);
             let now_pos=new THREE.Vector3(now_data[0],now_data[1],now_data[2]);
             len+=pre_pos.distanceTo(now_pos);
             uvInfo["now_len"]=len;uvInfo["uv_u_step"]=2*Math.PI*now_data[3]/now_segment;
           //let cylinder_geo=branchGeoFromTwoCircle(pre_circle,circleGeo); 
           branchGeoFromTwoCircleToGeo(pre_circle,circleGeo,cylinderGeo,'n',uvInfo);
           pre_circle=circleGeo;
           //
         }
      }
       branchGeo.merge(cylinderGeo);
       branchGeo.merge(capGeo);
       branchGeo.mergeVertices(); 
       if(isUnBuffer)return branchGeo;
       let bufferBranch=  new THREE.BufferGeometry().fromGeometry(branchGeo);
      

        return bufferBranch;

}
class BranchReferred{//每一根树枝？
   constructor(data,max,maxCountPerTree,level,id){
           this.unbuffered_geometry=buildBranchTube(data,level,0.2,true);
           this.geo=new THREE.BufferGeometry().fromGeometry(this.unbuffered_geometry);
           this.InstancedMesh={
            "geometry":this.geo,
           }

        

   }

}
class TreeReferring{
   constructor(data){
       this.branches=[];
       this.branchesLevelSeperated={};
       this.leaves=[];
       this.InstanceID=[];
       this.leavesLib={};
       this.leavesMerged={};
       this.branchesMerged=null;
       this.branchesMergedLOD={};
       this.branchesMergedLODBuffered={};
       this.boundingSphere=null;
       this.boundingBox=null;
       this.branchesLib=null;
       this.branchesLibLOD={};
       this.leavesLibLOD={};
       this.maxLevel=0;
     let list=data.split('\n');
     for(let i=0;i<list.length;i++)list[i]=list[i].replace(/[\x00-\x1F\x7F-\x9F]/g, "");
     let now=0;let now_level=0;
     while(now<list.length)
     {
         if(list[now].length==0)break;
         if(list[now]=="BranchesEnd")break;
         if(list[now][0]=='L'){
            now_level++;this.maxLevel=now_level;
            this.branchesLevelSeperated[String(now_level)]=[];

         }
       let info=list[now].split('_');
       if(info.length==3){
            let branch={};
            branch["id"]=list[now];
            branch["level"]=now_level;
            now++;
            branch["matrix"]=toFloat32Array(list[now].split(' '),8);
            this.branches.push(branch);
            this.branchesLevelSeperated[String(now_level)].push(branch);
       }
       now++;
     }

     if(list[now]=="BranchesEnd"){
              now++;
     if(list[now]=="LeavesBegin"){
           now++;
           while(now<list.length){
            if(list[now]=="LeavesEnd")break;
           let leaf=new LeafInfo();
           leaf.setFromTXT(list[now],list[now+1]);
            this.leaves.push(leaf);
            now+=2;
           }
     }
     }
     let a=666;
   }
   generateTree(branchLib){
         let tree_group=new THREE.Group();
         tree_group.name="tree_group";
         let material=new THREE.MeshStandardMaterial({color:"rgb(100,100,100)"});
       for(let b of this.branches){
            let geo=branchLib[b.id].geo.clone();
            let mesh=new THREE.Mesh(geo,material);
            mesh.applyMatrix4(buildBranchTransformMat(b.matrix));
            tree_group.add(mesh);
       }
     return tree_group;
   }
   generateInstancedTree(transform,branchLib,id,level){
 
    for(let b of this.branches){
 
       let branchReferred=branchLib[b.id]; 
       let now_pos=branchReferred.InstancedMesh.count;
       if(now_pos>branchReferred.maxCount){
           console.log(b.id+ " excess max count");
           return;
       }
       b["instancedID"]=now_pos;
       let mat=new THREE.Matrix4();
       mat.multiply(transform);
       mat.multiply(buildBranchTransformMat(b.matrix));
       branchReferred.InstancedMesh.setMatrixAt(now_pos,mat);
       branchReferred.parentTreeID.push([id,b.level]);
       branchReferred.matrix.push(mat);
       branchReferred.InstancedMesh.count++;
   }
   this.InstanceID.push(id);
   }
   generateMergedLeaves(meshes){
             this.leavesMerged=mergeLeaves(this.leaves,meshes);

   }
   generateMergedLeavesWithLOD(meshes){
    this.leavesMerged=mergeLeaves_includeID(this.leaves,meshes);
    mergedLeavesSeperateingOnLOD(this.leaves,meshes,this.leavesMerged);
}
   generateMergedBranches(branchLib){
 
    let result=new THREE.Geometry();
 
     for(let b of this.branches){
        
     
        let geo=branchLib[b.id].unbuffered_geometry;
        let sf=1/b.matrix[7];
        if(sf<0.2)continue;
        let matrix=buildBranchTransformMat(b.matrix);
        result.merge(geo,matrix);
        let level=b.level;
        if(!this.branchesMergedLOD[level]){
            this.branchesMergedLOD[level]=new THREE.Geometry();
            this.branchesMergedLOD[level].merge(geo,matrix);
         }else  this.branchesMergedLOD[level].merge(geo,matrix);
     }
     this.branchesMerged=result;
     //result.computeBoundingSphere();
     result.computeBoundingBox();
     //this.boundingSphere=result.boundingSphere;
     this.boundingBox=result.boundingBox;
    }
    generateMergedBranchesSingleLevel(level,branchLib){
    for(let b of this.branchesLevelSeperated[String(level)]){
       let geo=branchLib[b.id].unbuffered_geometry;
       let sf=1/b.matrix[7];
       if(sf<0.2)continue;
       let matrix=buildBranchTransformMat(b.matrix);
       if(!this.branchesMergedLOD[level]){
           this.branchesMergedLOD[level]=new THREE.Geometry();
           this.branchesMergedLOD[level].merge(geo,matrix);
        }else  this.branchesMergedLOD[level].merge(geo,matrix);
    }
    return this.branchesMergedLOD[level];
   }
}
class TreeInstanced{
    constructor(referringTreeID,transform,id){
             this.referringTreeID= referringTreeID;
             this.transform=transform;
             this.id=id;
           this.lod=9;
           this.transformMatrix=buildTreeTransformMat(transform);
    }
    generateInstancedTree(branchLib,treeLib){
          let mat=buildTreeTransformMat(this.transform);
          treeLib[this.referringTreeID].generateInstancedTree(mat,branchLib, this.id,this.level);
    }
}
 
function buildBranchLib(_list,max,meshLib,materialInfo){
    
     let data=_list.split('\n');
     for(let i=0;i<data.length;i++)data[i]=data[i].replace(/[\x00-\x1F\x7F-\x9F]/g, "");
     let now=1;
     let ans={};
     let now_id="";
     let now_len=0;
     let now_spinePoints=[];
     let maxCount=0;
     let now_level=-1;
     while(now<data.length){
         let str=data[now];
         if(str.length==0){
            now++;continue;
         }
         if(str=="branchLibEnd"){
             break;
         }
         let list=str.split('_');
         if(list.length==3){
                now_level=Number(list[1]);
                list=str.split(':');
                 now_id=String(list[0]);maxCount=Number(list[1]);
                 now+=2;
                 let splitTest=data[now].split(':');
                 if(splitTest.length!=1){
                    now_len=Number(splitTest[0]);
                 }else now_len=Number(data[now]);
                 continue;
         }
         list=str.split(' ');
         if(list.length==4){
            now_spinePoints.push(toFloat32Array(list,4));
           if(now_len!=0&&now_spinePoints.length==now_len){
          
            ans[now_id]=new BranchReferred(now_spinePoints,max,maxCount,now_level,now_id);

            now_id="";
            now_len=0;

            now_spinePoints=[];
            maxCount=0;
            now_level=-1;
           }
        }
        now++;
     } 
if(data[now]=="branchLibEnd"){
  now++;
  //load mesh
  if(data[now]=="meshesBegin"&&meshLib){
      now++;
     
        while(now<data.length){
           if(data[now]=="meshesEnd")break; 
           let mesh=generateMeshFromTXT(data[now],data[now+1]);
           meshLib[mesh.idInXML]=mesh;
           now+=2;
        }
  }
  if(data[now]=="meshesEnd")now++;
  if(data[now]=="materialnfo"&&materialInfo){
    now++;
    materialInfo["JSON"]=JSON.parse(data[now]);
}
}
     return ans;
};

function buildForest(x,y,count,branchLib,treeLib,meshLib,materialLib){
    let interval=128;let forest={};
    let baseScale=2;
    forest["trees"]=[];
    forest["branchLib"]=branchLib;
    forest["treeLib"]=treeLib;
    forest["meshLib"]=meshLib;
    forest["materialLib"]=materialLib;

    for(let b of Object.values(branchLib)){
            b.InstancedMesh.material=materialLib["1"];
    }
    let index=0;let total_count=x*y;
    let begin_x=-1*x*interval*0.5;let begin_z=-1*y*interval*0.5;
	
    for(let i=0;i<x;i++){
        for(let j=0;j<y;j++){
            let transform=new Float32Array(5);
            transform[0]=begin_x+i*interval;transform[2]=begin_z+j*interval;
            let sampleY=samplingPositionYOnTerrain( transform[0],transform[2]);
            if(!sampleY)continue;
            transform[1]=sampleY;
            transform[3]=Math.random()*Math.PI*2;
            transform[4]=(Math.random()*0.6+0.7)*baseScale;
            let referingID=Math.floor(Math.random()*count);
            //let neo_tree=new TreeInstanced(id,transform);
            //neo_tree.generateInstancedTree(branchLib,treeLib);
            forest["trees"].push(new TreeInstanced(referingID,transform,index));
            forest["trees"][index].generateInstancedTree(branchLib,treeLib);
            index++;
        }

    }

    forest["generateInstancedBranches"]=function(forest_group){

        let branchLib=forest["branchLib"];
          let tree_branches_group=new THREE.Group();
          tree_branches_group.name="forest_branches";
        for(let id of Object.keys(branchLib)){
           
          branchLib[id].InstancedMesh.name="InstancedBranches_"+id;
          tree_branches_group.add(branchLib[id].InstancedMesh);
        }
        forest_group.add(tree_branches_group);

  }
    forest["updateLOD"]=function(){
           let that=forest;
   
            setInterval(function(){
                for(let tree of that.trees )tree.updateLOD();
                for(let id of Object.keys(that.branchLib)){
                    that.branchLib[id].updateLOD(that.trees);
                }
               forceRender();
            },1000);
    };
    return forest;
}
function buildForestMaterial(prefix,type,material){
          
                   let promise=new Promise(
                        function(res,rej){
                            let colorMapLoader=new THREE.TextureLoader();
                            colorMapLoader.load(`../myImage/${prefix}.${type}`,
                            function(tex)
                            {  
                               
                                tex.encoding=THREE.sRGBEncoding;
                                material.map=tex;
                                material.map.wrapS = THREE.RepeatWrapping;
                                material.map.wrapT = THREE.RepeatWrapping;
                                material.map.repeat.set(4,1);
                                material.map.updateMatrix ();
                                material.needsUpdate=true;
                              
                                 res("colorMapOK");
                            });
                        });
                        promise.then(function(msg){
                                      console.log(msg);

                                  let promise_2=new Promise(function(res,rej){

                                    let normalMapLoader=new THREE.TextureLoader();
                                      normalMapLoader.load(`../myImage/${prefix}_Normal.${type}`,
                                    function(tex)
                                    {  



                                     
                                        tex.encoding=THREE.sRGBEncoding;
                                        material.normalMap=tex;
                                        material.normalMap.wrapS = THREE.RepeatWrapping;
                                        material.normalMap.wrapT = THREE.RepeatWrapping;
                                        material.normalMap.repeat.set(4,1);
                                        material.normalMap.updateMatrix ();
                                        material.needsUpdate=true;
                                       
                                        res("normalMapOK");
                                  })

                        });
                            return promise_2;
                          }).then(function(msg){
                            console.log(msg);
                            console.log("allOK");
                          });
}

function mergeLeavesAndBuildMesh(leavesInfo,meshes,materials){
    let leavesGroup=new THREE.Group();
    leavesGroup.name="leaves_group_merged";
    let leavesInstance={};
    let id=0;
    for(let info of leavesInfo){
         if(!leavesInstance[info.mesh]){
            leavesInstance[info.mesh]={};
         }
         if(!leavesInstance[info.mesh][info.materail]){
            leavesInstance[info.mesh][info.materail]=[];
            leavesInstance[info.mesh][info.materail].push(id);
         }else{
     
            leavesInstance[info.mesh][info.materail].push(id);
         }
         id++;
    }
    for(let meshID of Object.keys(leavesInstance)){
        if(meshID[meshID.length-1]==""){
            meshID=meshID.substring(0,mesh.length-1);
        }
 
        let geo=meshes[meshID]["geometry_unbuffered"];
        
        for(let matID of Object.keys(leavesInstance[meshID])){
     
            let mat=materials[matID].clone();
         
             
           mat.alphaTest=0.46;
            mat.roughness=0.4;
           mat.normalScale.x=0.3;   mat.normalScale.y=0.3;
            mat.side=THREE.DoubleSide; 
            let count=leavesInstance[meshID][matID].length;
            let list =leavesInstance[meshID][matID];
            let geometry=new THREE.Geometry();
          /* 
            let mesh_test=new THREE.Mesh(geo,mat);
            mesh_test.name="mesh_test_1";
            window.editor.addObject(mesh_test); */
           
            for(let i=0;i<count;i++){
                let leafInfo=leavesInfo[list[i]];
                let matrix=computeLeafTransform(leafInfo.transformData);
                geometry.merge(geo,matrix);
            }
        //shadow and Material
     let bufferGeo=new THREE.BufferGeometry().fromGeometry(geometry) ;
        let mergedLeavesMesh=new THREE.Mesh(bufferGeo,mat);
        mergedLeavesMesh.name="merged_leaves_"+meshID+"_"+matID;
        mergedLeavesMesh.castShadow=true;
         mergedLeavesMesh.customDepthMaterial = new THREE.MeshDepthMaterial( {
            depthPacking: THREE.RGBADepthPacking,
            alphaMap: mat.alphaMap,
            alphaTest:0.46
        } );
           leavesGroup.add(mergedLeavesMesh);
           //window.editor.addObject(mergedLeavesMesh);
        }
    } 
    return leavesGroup;
}
function mergeLeaves(leavesInfo,meshes){
    let leavesInstance={};
    let result=[];
    let id=0;
    for(let info of leavesInfo){
         if(!leavesInstance[info.mesh]){
            leavesInstance[info.mesh]={};
         }
         if(!leavesInstance[info.mesh][info.materail]){
            leavesInstance[info.mesh][info.materail]=[];
            leavesInstance[info.mesh][info.materail].push(id);
         }else{
     
            leavesInstance[info.mesh][info.materail].push(id);
         }
         id++;
    }
    for(let meshID of Object.keys(leavesInstance)){
        if(meshID[meshID.length-1]==""){
            meshID=meshID.substring(0,mesh.length-1);
        }
        let geo=meshes[meshID]["geometry_unbuffered"];
        for(let matID of Object.keys(leavesInstance[meshID])){
            let list =leavesInstance[meshID][matID];
            let count=list.length;
            let geometry=new THREE.Geometry();
            for(let i=0;i<count;i++){
                let leafInfo=leavesInfo[list[i]];
                let matrix=computeLeafTransform(leafInfo.transformData);
                geometry.merge(geo,matrix);
            }
            let bufferGeo=new THREE.BufferGeometry().fromGeometry(geometry) ;
            result.push({materialID:matID,meshID:meshID,geometry:bufferGeo});
        }
    } 
    return result;
}
class TreeSpecies{
    constructor(sp){
        this.name=sp.name;
        this.count=sp.count;
        this.treeLib="Loading";
        this.treeLib_state="Loading";
        this.branchLib="Loading";
        this.meshLib="Loading";
        this.materialLib="Loading";
        this.trees=[];
        this.barkMaterialID=sp.barkMaterialID;
        this.scaleBase=sp.scaleBase;
    }
    addInstancedTree(transform){
        let referingID=Math.floor(Math.random()*this.count);
        //let referingID=8;
        let index=  this.trees.length
        let _transform=transform
        if(this.scaleBase)_transform[4]*=this.scaleBase;
        this.trees.push(new TreeInstanced(referingID,_transform,index));
        this.trees[index].generateInstancedTree(this.branchLib,this.treeLib);
    }
    generateInstancedBranches(species_group){
        let branchLib=this.branchLib
        let tree_branches_group=new THREE.Group()
        tree_branches_group.name="branches_group"
        for(let id of Object.keys(branchLib)){
            branchLib[id].InstancedMesh.name="InstancedBranches_"+id
            tree_branches_group.add(branchLib[id].InstancedMesh)
        }
        species_group.add(tree_branches_group);
    }
}
function buildForestMultiSpecies(x,y,species,terrain){
    let terrainSize=window["myObject"].terrainScene.terrainOptions.xSize;
    let interval=terrainSize/x; 
    let baseScale=2.5;
 


    let index=0;let total_count=x*y;
    let begin_x=-1*x*interval*0.5;let begin_z=-1*y*interval*0.5;
	
    for(let i=0;i<x;i++){
        for(let j=0;j<y;j++){
            let transform=new Float32Array(5);
            let random_offset_x=interval/3*(-1+2*Math.random());
            let random_offset_y=interval/3*(-1+2*Math.random());
            transform[0]=begin_x+i*interval+random_offset_x;
            transform[2]=begin_z+j*interval+random_offset_y;
            let sampleY=0;
             //need edit
 
                sampleY=samplingPositionYOnTerrain( transform[0],transform[2]);
                if(!sampleY)continue;
 
            transform[1]=sampleY;
            transform[3]=Math.random()*Math.PI*2;
            transform[4]=(Math.random()*0.6+0.7)*baseScale;
            let speciesID=Math.floor(Math.random()*species.length);
       
            //let neo_tree=new TreeInstanced(id,transform);
            //neo_tree.generateInstancedTree(branchLib,treeLib);
            species[speciesID].addInstancedTree(transform);
        }

}
}
function mergeLeaves_includeID(leavesInfo,meshes){
            
 
    let leavesInstance={};
    let result=[];
    let id=0;
    for(let info of leavesInfo){
         if(!leavesInstance[info.mesh]){
            leavesInstance[info.mesh]={};
         }
         if(!leavesInstance[info.mesh][info.materail]){
            leavesInstance[info.mesh][info.materail]=[];
            leavesInstance[info.mesh][info.materail].push(id);
         }else{
     
            leavesInstance[info.mesh][info.materail].push(id);
         }
         id++;
    }
    for(let meshID of Object.keys(leavesInstance)){
        if(meshID[meshID.length-1]==""){
            meshID=meshID.substring(0,mesh.length-1);
        }
 
        let geo=meshes[meshID]["geometry_unbuffered"];
        
        for(let matID of Object.keys(leavesInstance[meshID])){
          
            let list =leavesInstance[meshID][matID];
 
            let count=list.length;
            let geometry=new THREE.Geometry();

            for(let i=0;i<count;i++){
                let leafInfo=leavesInfo[list[i]];
         
                let matrix=computeLeafTransform(leafInfo.transformData);
                geometry.merge(geo,matrix);
            }
    
               let bufferGeo=new THREE.BufferGeometry().fromGeometry(geometry) ;
               result.push({materialID:matID,meshID:meshID,geometry:bufferGeo,index:list});
        }
    } 

return result;
}
function mergedLeavesSeperateingOnLOD(leavesInfo,meshes,leavesMerged){
    for(let leaves of leavesMerged){
        leaves.geometry.computeBoundingSphere();
        let center=leaves.geometry.boundingSphere.center;
        let geo=meshes[leaves.meshID]["geometry_unbuffered"];
        let data=[];
        for(let id of leaves.index){
            let transform=leavesInfo[id].transformData;
            let position=new THREE.Vector3(transform[0],transform[1],transform[2]);
            let dist=center.distanceTo(position);
            data.push({index:id,distance:dist});
        }
        data.sort(
            function(a,b){
            if(a.index<b.index)return 1;
          if(a.index==b.index)return 0;
          if(a.index>b.index)return -1;
        });
 
        let lod_0=new THREE.Geometry();let lod_1=new THREE.Geometry();let lod_2=new THREE.Geometry();
        for(let i=0;i<data.length;i++){
            let id=data[i].index;
            let leafInfo=leavesInfo[id];
            let matrix=computeLeafTransform(leafInfo.transformData);
            if(i%4<1){
                lod_0.merge(geo,matrix);
            }else  if(i%4<2){
                lod_1.merge(geo,matrix);
            }else {
                lod_2.merge(geo,matrix);
            }
        }
         lod_0=new THREE.BufferGeometry().fromGeometry(lod_0);
         lod_1=new THREE.BufferGeometry().fromGeometry(lod_1);
          lod_2=new THREE.BufferGeometry().fromGeometry(lod_2);
        leaves["LOD"]=[lod_0,lod_1,lod_2];
    }

}