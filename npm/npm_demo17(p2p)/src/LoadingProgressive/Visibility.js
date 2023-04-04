export class Visibility{
    constructor(areaInf,camera,loading,meshes) {
        areaInf["min"][1]-=0.5
        areaInf["max"][1]-=0.5
        this.areaInf=areaInf
        this.camera=camera
        this.meshes=meshes//用于可见性剔除剔除
        this.componentNum=1278
        this.vd=new Array(this.componentNum)//{}//当前每个构件的可见度
        this.visualList={}//用于视点的可见资源列表
        this.visualList_request={}//记录资源列表的请求是否已经发送
        this.prePoint="";//视点变化就进行加载 (或者添加了新的模型) 
        this.prePoint2="";//视点变化就进行可见性剔除
        this.loading=loading
        this.dynamicLoading()//加载和预加载
        this.culling()//遮挡剔除和视锥剔除
    }
    getDirection(){
        var d=this.camera.getWorldDirection()
        var d1={x: 1, y: 0, z: 0}   //  //[0,-Math.PI/2,0]
        var d2={x: -1, y: 0, z: 0}  //  //[0,Math.PI/2,0]
        var d3={x: 0, y: 1, z: 0}   //上//[Math.PI/2,0,0]
        var d4={x: 0, y: -1, z: 0}  //下//[Math.PI*1.5,0,0]
        var d5={x: 0, y: 0, z: 1}   //  //[Math.PI,0,0]
        var d6={x: 0, y: 0, z: -1}  //  //[0,0,0]
        var getMul=(a,b)=>{
            let m=a.x*b.x+a.y*b.y+a.z*b.z
            let l=Math.pow((
                Math.pow(a.x,2)+
                Math.pow(a.y,2)+
                Math.pow(a.z,2)
            ),0.5)
            m=m/l
            m=(m+1)/2
            m-=0.25
            if(m<0)m=0
            return m
        }
        return [
            getMul(d,d1),getMul(d,d2),getMul(d,d3),getMul(d,d4),getMul(d,d5),getMul(d,d6)
        ]
    }
    updateVd(){
        const index=getPosIndex()[3]
        const visualList0=this.visualList[index]
        if(visualList0){
            const direction=this.getDirection()
            
            
            for(let i=0;i<this.componentNum;i++){
                const vd1=i in visualList0["1"]?visualList0["1"][str(i)]:0
                const vd2=i in visualList0["2"]?visualList0["2"][str(i)]:0
                const vd3=i in visualList0["3"]?visualList0["3"][str(i)]:0
                const vd4=i in visualList0["4"]?visualList0["4"][str(i)]:0
                const vd5=i in visualList0["5"]?visualList0["5"][str(i)]:0
                const vd6=i in visualList0["6"]?visualList0["6"][str(i)]:0
                this.vd[i]=vd1*d[0]+vd2*d[1]+vd3*d[2]+vd4*d[3]+vd5*d[4]+vd6*d[5]
            }
            const sortedIds = 
                this.vd.map((value, index) => ({ value, index }))
                .filter(item => item.value !== 0)
                .sort((a, b) => b.value - a.value)
                .map((value, index) => value.index )
            
        }
        // const v;
    }
    dynamicLoading(){//用于加载和预加载
        const scope=this
		const c=this.camera
        let first=true
		setInterval(()=>{
					var point0=c.position.x+","+c.position.y+","+c.position.z
                            +c.rotation.x+","+c.rotation.y+","+c.rotation.z
                    if(this.prePoint===point0){//如果视点没有移动或旋转
						if(first){//如果是第一次暂停 => 加载资源
                            scope.getList()
							first=false
						}
					}else {//如果视点发生了移动或旋转
						scope.prePoint=point0
						first=true
					}
		},200)
        setInterval(()=>{
            scope.getList()
        },1500)
		console.log("开始动态加载资源")
    }
    culling(){//遮挡剔除和视锥剔除
        const scope=this
		const c=this.camera
        this.prePoint2=""
		function setInterval0(){
            requestAnimationFrame(setInterval0)
			var point0=c.position.x+","+c.position.y+","+c.position.z
                    +c.rotation.x+","+c.rotation.y+","+c.rotation.z
            if(scope.prePoint2!==point0){//如果视点发生了移动或旋转
                    scope.showOnlyEvs()
                    scope.prePoint2=point0
			}
        }setInterval0()
		console.log("开始动态加载资源")
    }
    start2(){//用于渲染的遮挡剔除
        var scope=this
        var prePoint2_rot=""
        
		function setInterval0(){
            requestAnimationFrame(setInterval0)
            var point0=window.c.position.x+","+window.c.position.y+","+window.c.position.z
            var point0_rot=window.c.rotation.x+","+window.c.rotation.y+","+window.c.rotation.z
            if(scope.prePoint2!==point0||prePoint2_rot!=point0_rot){//如果视点位置或方向变化就进行剔除
                // scope.cullingFrustum()
                var list_data=scope.getList()
                if(list_data){//如果知道此刻的可见度列表
                    for(var i in window.meshes){
                        window.meshes[i].visible=false
                        // window.meshes[i].Obscured=true//被遮挡，不可见
                    }
                    var directs=scope.getDirect()
                    for(var i=0;i<5;i++){//遮挡剔除
                        var direct=directs[i]+1
                        var list=list_data[direct]
                        for(var j=0;j<list.length;j++){
                            var mesh0=window.meshes[list[j]]
                            if(mesh0)mesh0.visible=true
                        }
                    }
                    var count=0
                    for(var i in window.meshes){
                        if(window.meshes[i].visible)count++
                    }
                    // console.log(count)

                }//if(list_data)
                scope.displayShell()
            }
            scope.prePoint2=point0 
            prePoint2_rot=point0_rot
		}setInterval0()
		console.log("开始进行遮挡剔除")  
    }
    getList(){
        const posIndex=this.getPosIndex()[3]
        const visualList0=this.visualList[posIndex]
        if(visualList0){
            const d=this.getDirection()
            for(let i=0;i<this.componentNum;i++){
                const vd1=i in visualList0["1"]?visualList0["1"][i]:0
                const vd2=i in visualList0["2"]?visualList0["2"][i]:0
                const vd3=i in visualList0["3"]?visualList0["3"][i]:0
                const vd4=i in visualList0["4"]?visualList0["4"][i]:0
                const vd5=i in visualList0["5"]?visualList0["5"][i]:0
                const vd6=i in visualList0["6"]?visualList0["6"][i]:0
                this.vd[i]=vd1*d[0]+vd2*d[1]+vd3*d[2]+vd4*d[3]+vd5*d[4]+vd6*d[5]
            } 
            const list=this.vd.map((value, index) => ({ value, index }))
                .filter(item => item.value !== 0)
                .sort((a, b) => b.value - a.value)
                .map((value, index) => value.index )
            if(list.length>0)this.loading(list)
        }else{
            this.request(posIndex)
        }
    }
    showOnlyEvs(){
        const posIndex=this.getPosIndex()[3]
        const visualList0=this.visualList[posIndex]
        if(visualList0){
            const d=this.getDirection()
            for(let i=0;i<this.componentNum;i++)
            if(this.meshes[i]){
                const vd1=i in visualList0["1"]?visualList0["1"][i]:0
                const vd2=i in visualList0["2"]?visualList0["2"][i]:0
                const vd3=i in visualList0["3"]?visualList0["3"][i]:0
                const vd4=i in visualList0["4"]?visualList0["4"][i]:0
                const vd5=i in visualList0["5"]?visualList0["5"][i]:0
                const vd6=i in visualList0["6"]?visualList0["6"][i]:0
                this.vd[i]=vd1*d[0]+vd2*d[1]+vd3*d[2]+vd4*d[3]+vd5*d[4]+vd6*d[5]
                this.meshes[i].visible= this.vd[i]>0
            } 
        }
    }
    request(posIndex){
        var scope=this
        if(!this.visualList_request[posIndex]){
            console.log("发送请求:",posIndex)
            var oReq = new XMLHttpRequest();
            oReq.open("POST", "http://localhost:8091", true);
            oReq.responseType = "arraybuffer";
            oReq.onload = function () {//接收数据
                var unitArray=new Uint8Array(oReq.response) //网络传输基于unit8Array
                var str=String.fromCharCode.apply(null,unitArray)
                scope.visualList[posIndex]=JSON.parse(str)
                console.log(posIndex,scope.visualList[posIndex])
                scope.getList()
            }
            oReq.send(JSON.stringify(posIndex));//发送请求
            this.visualList_request[posIndex]=true//已经完成了请求
        }
    }
    getPosIndex(){
        let min =this.areaInf.min
        let step=this.areaInf.step
        let max =this.areaInf.max
        const c=this.camera
        var x=c.position.x
        var y=c.position.y
        var z=c.position.z
        if(x>max[0]||y>max[1]||z>max[2]||x<min[0]||y<min[1]||z<min[2]){
            this.border=true//视点在采样区域之外
            if(x>max[0])x=max[0]
            if(y>max[1])y=max[1]
            if(z>max[2])z=max[2]
            if(x<min[0])x=min[0]
            if(y<min[1])y=min[1]
            if(z<min[2])z=min[2]
        }else this.border=false
        var dl=[]
        for(var i=0;i<3;i++)
            dl.push(
                step[i]==0?0:
                (max[i]-min[i])/step[i]
            )
        var xi=dl[0]==0?0:Math.round((x-min[0])/dl[0])
        var yi=dl[1]==0?0:Math.round((y-min[1])/dl[1])
        var zi=dl[2]==0?0:Math.round((z-min[2])/dl[2])
        var s=step
        var index=xi*(s[1]+1)*(s[2]+1)+yi*(s[2]+1)+zi
        return [xi,yi,zi,index]
    } 
}