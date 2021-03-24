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
        glb.scene.traverse(node => {
            if (node instanceof THREE.Mesh) {//instanceof THREE.SkinnedMesh
                arr.push(node);
            }
        });
        for(i0=arr.length-1;i0>0;i0--){
            if(this.needDelete(arr[i0])){
                arr.splice(i0,1);
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