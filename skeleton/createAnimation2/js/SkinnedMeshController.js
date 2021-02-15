function SkinnedMeshController() {
    this.mesh;
    this.animation;
    this.frameMax;//帧数
    this.boneNum;//骨骼个数
    this.time;
    this.speed;

    this.animationMixer;//动画混合器
}
SkinnedMeshController.prototype={
    init:function (originMesh,animation) {
        //console.log(originMesh);
        this.animation=animation;
        this.mesh=originMesh.clone();//new THREE.SkinnedMesh(originMesh.geometry.clone(),originMesh.material)
        this.frameMax=this.animation.tracks[0].times.length;
        this.speed=0.5;
        this.time=0;

        this.mesh.geometry=this.mesh.geometry.clone();
        this.mesh.material=this.mesh.material.clone();
        this.mesh.skeleton=this.mesh.skeleton.clone();
        this.mesh.matrixWorld=this.mesh.matrixWorld.clone();
        this.bones = [];
        cloneBones(this.mesh.skeleton.bones[0], this.bones);
        this.mesh.skeleton=new THREE.Skeleton(this.bones, this.mesh.skeleton.boneInverses);

        this.mesh.add(this.mesh.skeleton.bones[0]);//添加骨骼
        this.mesh.bind(this.mesh.skeleton,this.mesh.matrixWorld);//绑定骨架

        //this.autoTest();
        //this.autoPlay0();
        function cloneBones(rootBone , boneArray){//用于加载完gltf文件后的骨骼动画的处理
            var rootBoneClone=rootBone.clone();
            rootBoneClone.children.splice(0,rootBoneClone.children.length);
            boneArray.push(rootBoneClone);
            for (var i = 0 ; i < rootBone.children.length ; ++i)
                rootBoneClone.add(cloneBones(rootBone.children[i], boneArray));
            return rootBoneClone;
        }
    },
    //帧动画
    autoPlay:function() {//每帧更新一次动画--
        this.time+=this.speed;//t=0;
        var time=Math.floor(this.time%this.frameMax);
        this.setTime(time);
        requestAnimationFrame(this.autoPlay);
    },
    //使用AnimationMixer
    autoPlay0:function () {
        var scope=this;
        this.animationMixer=new THREE.AnimationMixer(this.mesh);//搞清动画混合器AnimationMixer的作用至关重要
        this.animationMixer.clipAction(this.animation).play();//不清楚这里的作用//可能是进行帧的插值
        myPlay();
        function myPlay() {
            scope.animationMixer.update(scope.speed);
            requestAnimationFrame(myPlay);
        }
    },
    setTime:function (time) {
        var animation=this.animation;
        var bones=this.bones;
        for(i=0;i<bones.length;i++){
            bones[i].matrixAutoUpdate=false;
            bones[i].matrix=this.compose(
                animation.tracks[3*i+1].values[4*time],
                animation.tracks[3*i+1].values[4*time+1],
                animation.tracks[3*i+1].values[4*time+2],
                animation.tracks[3*i+1].values[4*time+3],

                animation.tracks[3*i+2].values[3*time],
                animation.tracks[3*i+2].values[3*time+1],
                animation.tracks[3*i+2].values[3*time+2],

                animation.tracks[3*i].values[3*time],
                animation.tracks[3*i].values[3*time+1],
                animation.tracks[3*i].values[3*time+2]
            );
        }
    },
    compose:function(x,y,z,w,sx,sy,sz,px,py,pz) {
        var x2 = x + x,	y2 = y + y, z2 = z + z;
        var xx = x * x2, xy = x * y2, xz = x * z2;
        var yy = y * y2, yz = y * z2, zz = z * z2;
        var wx = w * x2, wy = w * y2, wz = w * z2;
        te = new THREE.Matrix4();
        te.set(
            ( 1.0-( yy + zz ) ) * sx,( xy - wz ) * sy        ,( xz + wy ) * sz        ,px,
            ( xy + wz ) * sx        ,( 1.0-( xx + zz ) ) * sy,( yz - wx ) * sz        ,py,
            ( xz - wy ) * sx        ,( yz + wx ) * sy        ,( 1.0-( xx + yy ) ) * sz,pz,
            0.0                     ,0.0                     ,0.0                     ,1.0
        );
        return te;
    },
    computeIntermediateFrame:function (animation) {
        //this.animation
        //console.log(animation);
        for(var i=0;i<25;i++){//25个骨头
            var position=animation.tracks[3*i].values;
            var quaternion=animation.tracks[3*i+1].values;

            for(var time=1;time<=34;time++){
                position[3*time  ]=get(time,position[0],position[3*35  ]);
                position[3*time+1]=get(time,position[1],position[3*35+1]);
                position[3*time+2]=get(time,position[2],position[3*35+2]);

                quaternion[4*time  ]=get(time,quaternion[0],quaternion[4*35  ]);
                quaternion[4*time+1]=get(time,quaternion[1],quaternion[4*35+1]);
                quaternion[4*time+2]=get(time,quaternion[2],quaternion[4*35+2]);
                quaternion[4*time+3]=get(time,quaternion[3],quaternion[4*35+3]);
            }/**/
        }
        function get(k,begin,end) {
            //console.log(k,begin,end);
            var k_max=35;
            return (k/k_max)*(end-begin)+begin;
        }
        //console.log(animation.tracks);
        return animation;
    },
}
SkinnedMeshController.prototype.pmHandle=function (obj,animation) {
    this.animationMixer=new THREE.AnimationMixer(obj);//动画混合器animationMixer是用于场景中特定对象的动画的播放器
    this.animationMixer.clipAction(animation).play();//动画剪辑AnimationClip是一个可重用的关键帧轨道集，它代表动画。
    return this.animationMixer;
}