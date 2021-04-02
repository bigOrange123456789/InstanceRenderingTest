//将glb分解为多个小文件，同时将纹理贴图单独存放为jpg格式
function GlbSplit(){
    this.names;
    this.init();
    this.resourceManager;
}
GlbSplit.prototype={
    init:function(){
        this.names=getNames();
        function getNames(){
            var names=[
                '室内-会议横幅（非）',
                '室内-舞台灯架（非）',
                '上层外墙',
                '窗体',
                '外部台阶与屋顶墙体',
                '网格103','网格.103_1','网格.103_2'
            ];
            arr=[22,23,25,26,27,28,29,30,31,32,33,34,35,38,39];
            for(i=0;i<arr.length;i++){
                names.push('网格0'+arr[i]);
                names.push('网格.0'+arr[i]+'_1');
                names.push('网格.0'+arr[i]+'_2');
            }
            return names;
        }
    },
    getArray:function(glb,resourceManager){
        this.resourceManager=resourceManager;
        var arr=[];
        var obj0=new THREE.Object3D();
        glb.scene.traverse(node => {
            if (node instanceof THREE.Mesh) {//instanceof THREE.SkinnedMesh
                console.log(node.name);
                node.updateMatrix();
                //var matrix=node.matrix.clone();
                //console.log(matrix)
                var node2=node.clone();
                var parent=node.parent;
                console.log(node2.matrix)
                while(parent&&parent.matrix){
                    console.log("parent:",parent.name,parent.matrix);
                    parent.updateMatrix();
                    var m1=parent.matrix.clone();
                    node2.matrix=m1.multiply(node2.matrix);
                    parent=parent.parent;
                }
                console.log(node2.matrix)

                var pos=new THREE.Vector3();
                var qua=new THREE.Quaternion();
                var sca=new THREE.Vector3();
                node2.matrix.decompose ( pos,qua, sca);
                //console.log(pos,qua, sca);
                //node2.matrix.needsUpdate=true;

                obj0.add(node2);
                arr.push(node2);
                node2.position.x=pos.x;
                node2.position.y=pos.y;
                node2.position.z=pos.z;
                node2.scale.x=sca.x;
                node2.scale.y=sca.y;
                node2.scale.z=sca.z;
                node2.quaternion.x=qua.x;
                node2.quaternion.y=qua.y;
                node2.quaternion.z=qua.z;
                node2.quaternion.w=qua.w;
            }
        });
        for(i0=arr.length-1;i0>0;i0--){
            if(this.needDelete(arr[i0])){
                //arr.splice(i0,1);
            }
        }
        this.resourceManager.meshs=arr;
    },
    needDelete:function(mesh){
        for(i=0;i<this.names.length;i++){
            if(this.names[i]===mesh.name)return true;
        }
        return false;
    }

}