function ParamMeasure(obj,type){
    this.obj=obj;//animation
    this.type=type;
    this.beforeKey=-1;//type记录是THREEJS对象(0)还是引擎对象（1）
    this.stepPosition=1;//
    this.stepRotation=1;
    this.stepScale=1;
    this.boneIndex=7;
    this.obj0={position:{},scale:{},rotation:{}};
    this.quaternion2euler=function (quaternion) {
        var euler=new THREE.Euler(0,0,0, 'XYZ');
        euler.setFromQuaternion(quaternion);
        return euler;
    }
    this.euler2quaternion=function (euler) {
        var quaternion=new THREE.Quaternion();
        quaternion.setFromEuler(euler);
        return quaternion;
    }
    this.AnimationObj=function () {
        var This=this;//beforeKey = -1;

        function loop() {
            var i=This.boneIndex;
            var time=0;//修改地0帧的数据
            var obj={};
            var animation=This.obj;
            obj.position={};
            obj.position.x=animation.tracks[3*i].values[3*time];
            obj.position.y=animation.tracks[3*i].values[3*time+1];
            obj.position.z=animation.tracks[3*i].values[3*time+2];
            obj.rotation={};
            var quaternion=new THREE.Quaternion();
            quaternion.set(
                animation.tracks[3*i+1].values[4*time],
                animation.tracks[3*i+1].values[4*time+1],
                animation.tracks[3*i+1].values[4*time+2],
                animation.tracks[3*i+1].values[4*time+3],
            );
            var euler=This.quaternion2euler(quaternion);
            obj.rotation.x=euler.x;
            obj.rotation.y=euler.y;
            obj.rotation.z=euler.z;
            This.obj0=obj;
            requestAnimationFrame(loop);
        }loop();

        var loader = new THREE.XHRLoader(THREE.DefaultLoadingManager);
        loader.load("animation/animation (单手托下巴2).json", function(str){//dataTexture
            var data=JSON.parse(str).data;//204//animation(单手托下巴1)
            This.setAnimation(data);//"animation/animation (3).json",
        });
        //0 14举手
        //1 2 鼓掌
        //3 4 5 6静止
        //7 8 9抱胸
        //10 11托腮
        //12 13后仰放松
        //

        //开始测试

        var step=this.stepPosition;//
        var stepRotation=0.3;
        var stepScale=this.stepScale;
        document.onkeydown = function (e) {
            //7,8,9,10
            var obj=This.obj0;
            var time=0;


            if (e.key === "t") obj.position.x += step;
            else if (e.key === "g") obj.position.x -= step;
            else if (e.key === "r") obj.position.y += step;
            else if (e.key === "y") obj.position.y -= step;
            else if (e.key === "f") obj.position.z += step;
            else if (e.key === "h") obj.position.z -= step;
            else if (e.key === "v")
                console.log(
                    "["+
                        i+","+//骨骼
                        time+","+//帧数
                        obj.position.x+","+obj.position.y+","+obj.position.z+","+
                        quaternion.x+","+quaternion.y+","+quaternion.z+","+quaternion.w+
                    "],"
                );
            if (e.key === '=') {
                 if (This.beforeKey === '4') obj.rotation.x +=stepRotation;
                else if (This.beforeKey === '5') obj.rotation.y +=stepRotation;
                else if (This.beforeKey === '6') obj.rotation.z +=stepRotation;
            } else if (e.key === '-') {
                if (This.beforeKey === '4') obj.rotation.x -=stepRotation;
                else if (This.beforeKey === '5') obj.rotation.y -=stepRotation;
                else if (This.beforeKey === '6') obj.rotation.z -=stepRotation;
            }
            if (e.key === '1' || e.key === '2' || e.key === '3'||e.key === '4' || e.key === '5' || e.key === '6') This.beforeKey = e.key;


            This.update();
        }
    }
    this.setAnimation=function (data) {
        //举起左手
        var datas=data;

        for(var i=0;i<datas.length;i++)
            this.setBone(datas[i]);
    }
    this.setBone=function (data) {
        var i=data[0];
        var time=data[1];

        this.obj.tracks[3*i].values[3*time]=data[2];
        this.obj.tracks[3*i].values[3*time+1]=data[3];
        this.obj.tracks[3*i].values[3*time+2]=data[4];

        this.obj.tracks[3*i+1].values[4*time]=data[5];
        this.obj.tracks[3*i+1].values[4*time+1]=data[6];
        this.obj.tracks[3*i+1].values[4*time+2]=data[7];
        this.obj.tracks[3*i+1].values[4*time+3]=data[8];
    }

    this.update=function () {
        var This=this;
        var time=0;
        var i=This.boneIndex;
        var obj=this.obj0;
        var rx=obj.rotation.x,ry=obj.rotation.y,rz=obj.rotation.z;
        This.obj.tracks[3*i].values[3*time]=obj.position.x;
        This.obj.tracks[3*i].values[3*time+1]=obj.position.y;
        This.obj.tracks[3*i].values[3*time+2]=obj.position.z;

        quaternion=This.euler2quaternion(new THREE.Euler(rx,ry,rz, 'XYZ'));
        This.obj.tracks[3*i+1].values[4*time]=quaternion.x;
        This.obj.tracks[3*i+1].values[4*time+1]=quaternion.y;
        This.obj.tracks[3*i+1].values[4*time+2]=quaternion.z;
        This.obj.tracks[3*i+1].values[4*time+3]=quaternion.w;
    };

    this.AnimationObj(this.obj);
}