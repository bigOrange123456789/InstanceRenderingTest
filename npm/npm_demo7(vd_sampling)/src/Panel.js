
import {
    Vector3,
  } from 'three';
import{MyUI} from "./MyUI.js"
export class Panel{
  constructor(){
      this.camera=window.camera
      this.addMyUI()
  }
  addMyUI()
  {
    const c=this.camera
    this.weight=this.computeWeight()
    window.weight=this.weight
    //开始设置个数
    this.viewPointNumber=0
    this.viewPointData=[]
    //完成设置个数
    
    var width=window.innerWidth
    var height=window.innerHeight
    var scope=this;
    var ui=new MyUI()
    ui.init()
    function setSceneStatus(){//调整场景
    }
    window.startSample=()=>{
      setSceneStatus()
      var timeStart=new Date()
      //输出当前视点的资源列表
      var x1=ui.getFloat('x1')
      var y1=ui.getFloat('y1')
      var z1=ui.getFloat('z1')
      var x2=ui.getFloat('x2')
      var y2=ui.getFloat('y2')
      var z2=ui.getFloat('z2')
      
      var dx,dy,dz,nx,ny,nz
      dx=dy=dz=ui.getFloat('step')

      //开始设置dx dy dz
      console.log("dx,dy,dz:",dx,dy,dz)

      nx=(x2-x1)/dx
      ny=(y2-y1)/dy
      nz=(z2-z1)/dz

      var pcSum=ui.getFloat('pcSum')
      var pcId=ui.getFloat('pcId')
      var skipRatio=ui.getFloat('skipRatio')
      
      //var skipNumber=Math.floor(skipRatio*(nx+1)*(ny+1)*(nz+1))
      var skipNumber=Math.floor(skipRatio*(nx+1)*(ny+1)*(nz+1)/pcSum)*pcSum
      //scope.download("config.json",{min:[x1,y1,z1],max:[x2,y2,z2],step:[nx,ny,nz]})
      var i00=-1
      var j00=0
      var k00=0
      var configLoaded=false
      function move2NextPoint(){
        i00++
        if(i00==nx+1){
          i00=0
          j00++
        }
        if(j00==ny+1){
          j00=0
          k00++
        }
        //开始输出进度
        var all00=(nx+1)*(ny+1)*(nz+1)
        var order=i00 + 
                    (nx+1)*j00 + 
                    (nx+1)*(ny+1)*k00
        var r=0.01*Math.floor(10000*order/all00)
        ui.tag0.element.innerHTML=("采样进度："+r+"%"+","+order+"/"+all00);
        var time_run=0.01*Math.floor(100*(new Date()-timeStart)/(1000*60))
        ui.tag1.element.innerHTML=("采样起始时间："+timeStart.toLocaleString()+"，程序执行时间："+time_run+"分钟")
        //完成输出进度
        if(k00>=nz+1){//if(k00==nz+1){
          var timeEnd=new Date()
          console.log("采样完成时间为：",timeEnd)
          if(!configLoaded){
            scope.download("config.json",{
              min:[x1,y1,z1],
              max:[x2,y2,z2],
              step:[nx,ny,nz],
              "Rpp.scale":1,//window.instanceRoot.parent.parent.scale.x,
              "Rpp.position":[0,0,0],//[window.instanceRoot.parent.parent.position.x,window.instanceRoot.parent.parent.position.y,window.instanceRoot.parent.parent.position.z],
              timeStart:timeStart.toLocaleString(),
              timeEnd:timeEnd.toLocaleString(),
              time_run:time_run,
              skipRatio:skipRatio,
              pcSum:pcSum,
              pcId:pcId
            })
            configLoaded=true//参数文件只需要输入一次
            console.log("finish")
            setTimeout(()=>alert("finish"),5000)//结束的提示只需要显示一次
          }
          return false
        }else{
          scope.camera.position.set(
            x1+i00*dx,
            y1+j00*dy,
            z1+k00*dz
          )
          return true
        }              
      }
      function sampling(){
        for(var i=0;i<pcSum-1;i++)//中间间隔的视点个数
          move2NextPoint()
        if(move2NextPoint())//移动到下一个位置（如果有下一个）
        scope.getBoxResourceList6((visibility)=>{
          scope.download(
            scope.camera.position.x+","+
            scope.camera.position.y+","+
            scope.camera.position.z+".json",visibility)
          setTimeout(()=>{
            sampling()
          },300)
          
        })
      }
      for(var i=0;i<skipNumber;i++)//跳过的采样点
        move2NextPoint()
      for(var i=0;i<pcId;i++)//添加视点移动的偏移量
        move2NextPoint()
      sampling()
    }
    new ui.Button('调整场景', "#3498DB", '#2980B9', '#01DFD7',
          (width/10)/6, 150,
          width/10, (width/10)/4,
          800,30,(b)=>{
            setSceneStatus()
          })
    new ui.Button('视点采样', "#3498DB", '#2980B9', '#01DFD7',
          (width/10)/6, 150,
          width/10, (width/10)/4,
          800,200,(b)=>{
            window.startSample()
          })  
    new ui.Button('全景图', "#3498DB", '#2980B9', '#01DFD7',
          (width/10)/6, 150,
          width/10, (width/10)/4,
          950,200,(b)=>{
            function nextFrame(){
              requestAnimationFrame(nextFrame);
              if(window.run_nextFrame){
                window.run_nextFrame()
              }
            }
            if(!window.nextFrame){
              window.nextFrame=nextFrame
              nextFrame()
            }
            c.rotation.set(0,0,0)
            window.run_nextFrame=()=>{
              scope.getCut()
              c.rotation.set(Math.PI/2,0,0)
              window.run_nextFrame=()=>{
                scope.getCut()
                c.rotation.set(Math.PI,0,0)
                window.run_nextFrame=()=>{
                  scope.getCut()
                  c.rotation.set(Math.PI*1.5,0,0)
                  window.run_nextFrame=()=>{
                    scope.getCut()
                    c.rotation.set(0,Math.PI/2,0)
                    window.run_nextFrame=()=>{
                      scope.getCut()
                      c.rotation.set(0,-Math.PI/2,0)
                      window.run_nextFrame=()=>{
                        scope.getCut()
                        window.run_nextFrame=false
                      }
                    }
                  }
                }
              }
            }
          })
    new ui.Button('资源列表box', "#3498DB", '#2980B9', '#01DFD7',
          (width/10)/6, 150,
          width/10, (width/10)/4,
          1100,200,(b)=>{//x,y
            //输出当前视点的资源列表
            // scope.getBoxResourceList((visibility)=>{
            //   scope.download("list.json",visibility)
            // })
            scope.getBoxResourceList6((visibility)=>{
              scope.download(
                scope.camera.position.x+","+
                scope.camera.position.y+","+
                scope.camera.position.z+".json",visibility)
            })
          })
    new ui.Button('定方向采样', "#3498DB", '#2980B9', '#01DFD7',
          (width/10)/6, 150,
          width/10, (width/10)/4,
          1250,200,(b)=>{//x,y
            //输出当前视点的资源列表//=ui.getStr('sample_list')
            var sample_list=ui.getStr('sample_list')//"-466.4390895332649,30.71205448145341,64.64089466342176;2.901298135522005,1.5270419187461541,-2.9015193753173683"
            sample_list=sample_list.split(";")
            for(var i=0;i<sample_list.length;i++)
              sample_list[i]=sample_list[i].split(",")
            console.log(sample_list)
            var visibility_all={}
            var sample_list_index=0
            function sample0(){
              var p=sample_list[sample_list_index]
              console.log("sample_list_index",sample_list_index)
              scope.getPlaneResourceList(p[0],p[1],p[2],p[3],p[4],p[5],(visibility)=>{
                for(i in visibility){
                  if(visibility_all[i])visibility_all[i]+=visibility[i]
                  else visibility_all[i]=visibility[i]
                }
                sample_list_index++
                console.log(sample_list_index,sample_list.length-1)
                if(sample_list_index<sample_list.length-1){
                  //console.log("sample0",sample0)
                  sample0()
                }else{
                  var keys=Object.keys(visibility_all)
                  var values=Object.values(visibility_all)
                  for(var i=0;i<values.length-1;i++){
                      for(var j=0;j<values.length-i;j++){
                        if(values[j]<values[j+1]){
                          var temp=values[j]
                          values[j]=values[j+1]
                          values[j+1]=temp

                          temp=keys[j]
                          keys[j]=keys[j+1]
                          keys[j+1]=temp
                        }
                      }
                  }
                  var keys2=""
                  for(var i=0;i<500;i++)
                  //for(var i=0;i<keys.length;i++)
                    keys2+=(","+keys[i])
                  console.log(keys.length,keys)
                  scope.download("固定方向采样.txt",keys2)
                }
              })
              
            }sample0()
            
            
          })
    new ui.Button('定方向球采', "#3498DB", '#2980B9', '#01DFD7',
          (width/10)/7, 150,
          width/10, (width/10)/4,
          1400,200,(b)=>{
            setSceneStatus()
            //输出当前视点的资源列表//=ui.getStr('sample_list')
            var sample_list=ui.getStr('sample_list')//"-466.4390895332649,30.71205448145341,64.64089466342176;2.901298135522005,1.5270419187461541,-2.9015193753173683"
            sample_list=sample_list.split(";")
            for(var i=0;i<sample_list.length;i++)
              sample_list[i]=sample_list[i].split(",")
            console.log(sample_list)

            function sample0(sample_list_index){
              if(sample_list_index>=sample_list.length)
                  alert("finish!")
              var p=sample_list[sample_list_index]
              scope.camera.position.set(p[0],p[1],p[2])
              scope.camera.rotation.set(p[3],p[4],p[5])
              console.log("sample_list_index",sample_list_index)
              scope.getBoxResourceList_sim((list)=>{
                scope.download(sample_list_index+".json",list)
                sample0(sample_list_index+1)
              })     
            }sample0(0)
          })
    new ui.Button('计算采样密度', "#3498DB", '#2980B9', '#01DFD7',
          (width/10)/7, 150,
          width/10, (width/10)/4,
          1550,200,(b)=>{
            ui.computeOptStep()
          })

    new ui.Button('模型拆分', "#3498DB", '#2980B9', '#01DFD7',
          (width/10)/7, 150,//w,h,x,y
          width/10, (width/10)/4,
          800,350,(b)=>{
          })
    new ui.Button('获取包围球', "#3498DB", '#2980B9', '#01DFD7',
          (width/10)/7, 150,//w,h,x,y
          width/10, (width/10)/4,
          800,500,(b)=>{
            window.updateSpheres()
            var bounding_sph={}
            for (var i in window.bounding_sph) {
              var sphere=[]
              var arr=window.bounding_sph[i]
              if(arr.length==0){
                console.log("出现空数组",i)
                continue
              }
              var r=arr[0].radius
              sphere.push(r)
              for(var j=0;j<arr.length;j++){
                var r=arr[j].radius
                if(r!==sphere[0])if(Math.abs(r-sphere[0])/r>0.001)console.log("包围球半径不一致:"+i,";偏差率:"+Math.abs(r-sphere[0])/r)
                sphere.push(arr[j].center.x)
                sphere.push(arr[j].center.y)
                sphere.push(arr[j].center.z)
              }
              bounding_sph[i]=sphere
            }
            scope.download("bounding_sph.json",bounding_sph ) 
          })
    // new ui.Button('打包(合并)', "#3498DB", '#2980B9', '#01DFD7',
    //       (width/10)/6, 250,
    //       width/10, (width/10)/4,//w,h
    //       950,350,(b)=>{//x,y
    //       })
    // new ui.Button('对补集打包', "#3498DB", '#2980B9', '#01DFD7',
    //       (width/10)/6, 350,//w,h,x,y
    //       width/10, (width/10)/4,
    //       1100,350,(b)=>{//x,y

    //       })

    new ui.Button('最优视点', "#3498DB", '#2980B9', '#01DFD7',
          (width/10)/6, 150,
          width/10, (width/10)/4,
          0 ,height- (width/10)/2,(b)=>{
            function setBestViewPoint(n){
              var list=scope.getVisibility()
              var length=Object.keys(list).length
              console.log(length)
              if(!window.bestViewPoint||
                !window.bestViewPoint.min||
                length<window.bestViewPoint.min
                ){
                  console.log("min")
                  window.bestViewPoint.min=length
                  window.bestViewPoint.c=[
                    scope.camera.position.x,
                    scope.camera.position.y,
                    scope.camera.position.z,
      
                    scope.camera.rotation.x,
                    scope.camera.rotation.y,
                    scope.camera.rotation.z
                  ]
                }
            }
            if(!window.bestViewPoint)window.bestViewPoint={hasFinish:false}
            else window.bestViewPoint.hasFinish=!window.bestViewPoint.hasFinish
            if(window.bestViewPoint.hasFinish){
              b.innerHTML='最优视点'
              scope.camera.position.set(
                window.bestViewPoint.c[0],
                window.bestViewPoint.c[1],
                window.bestViewPoint.c[2]
              )
              scope.camera.rotation.set(
                window.bestViewPoint.c[3],
                window.bestViewPoint.c[4],
                window.bestViewPoint.c[5]
              )
              clearInterval(window.bestViewPoint.interval)   
              scope.download("bestViewPoint.json",window.bestViewPoint )           
            }else{
              b.innerHTML='最优视点.开'
              window.bestViewPoint.min=999999
              setBestViewPoint()
              window.bestViewPoint.interval=setInterval(()=>{
                setBestViewPoint()
              },500)
            }
          })
    new ui.Button('获取可见度', "#3498DB", '#2980B9', '#01DFD7',
          (width/10)/6, 150,
          width/10, (width/10)/4,
          6*width/10 - width/10,height- (width/10)/2,(b)=>{
            scope.analysis('test.json')
          })
    new ui.Button('计算优先级', "#3498DB", '#2980B9', '#01DFD7',
          (width/10)/6, 150,//w,h,x,y
          width/10, (width/10)/4,
          6*width/10,height- (width/10)/2,(b)=>{
            var degree={}
            for(var i=0;i<scope.viewPointData.length;i++){
              var viewPointData0=scope.viewPointData[i]
              for(var j in viewPointData0){
                if(degree[j]){
                  degree[j]=viewPointData0[j]+degree[j]
                }else{
                  degree[j]=viewPointData0[j]
                }
              }
            }
            var keys=Object.keys(degree)
            var values=Object.values(degree)
            for(var i=0;i<values.length-1;i++){
              var maxV=values[i]
              var maxI=i
              for(var j=i+1;j<values.length;j++){
                if(values[j]>maxV){
                  maxV=values[j]
                  maxI=j
                }
              }
              if(maxI!==i){
                var temp=values[i]
                values[i]=values[maxI]
                values[maxI]=temp

                temp=keys[i]
                keys[i]=keys[maxI]
                keys[maxI]=temp
              }
            }
            console.log(keys,values)

            var str=''
            if(keys.length>0)str=keys[0]
            for(var i=1;i<keys.length;i++)
              str+=(','+keys[i])
            //var str=JSON.stringify(keys , null, "\t")
            var link = document.createElement('a');
            link.style.display = 'none';
            document.body.appendChild(link);
            link.href = URL.createObjectURL(new Blob([str], { type: 'text/plain' }));
            link.download =name?name:"test.txt";
            link.click();
          })
          
  }
  getBoxResourceList(callback){//获得一个位置的投影
    var scope=this;
    function nextFrame(){
      requestAnimationFrame(nextFrame);
      if(window.run_nextFrame){
        window.run_nextFrame()
      }
    }
    if(!window.nextFrame){
      window.nextFrame=nextFrame
      nextFrame()
    }
    var visibility={}
    function updateVisibility(){
              var visibility0=scope.getVisibility()
              for(var i in visibility0) 
                if(visibility[i])visibility[i]+=visibility0[i]
                else visibility[i]=visibility0[i]
    }
    var directions=[
      [0,0,0],
      [Math.PI/2,0,0],
      [Math.PI,0,0],
      [Math.PI*1.5,0,0],
      [0,Math.PI/2,0],
      [0,-Math.PI/2,0],
    ]
    var transparentMeshHide=false
    var myIndex0=0
    function next0(){
      var d=directions[myIndex0++]
      c.rotation.set(d[0],d[1],d[2])
      requestAnimationFrame(()=>{
        updateVisibility()
        if(myIndex0<directions.length)next0()//下一个
        else if(!transparentMeshHide){
          transparentMeshHide=true
          for(var i in window.transparentMesh)
            window.transparentMesh[i].visible=false
          myIndex0=0
          next0()
        }else{
          for(var i in window.transparentMesh)
            window.transparentMesh[i].visible=true
          if(callback)callback(visibility)//完成
        } 
      })
    }next0()
  }
  getBoxResourceList6(callback){//6个面的资料列表不进行合并 不考虑透明构件//获得一个位置的投影
    var scope=this;
    const c=scope.camera
    function nextFrame(){
      requestAnimationFrame(nextFrame);
      if(window.run_nextFrame){
        window.run_nextFrame()
      }
    }
    if(!window.nextFrame){
      window.nextFrame=nextFrame
      nextFrame()
    }
    var visibilitys={}//分别记录6个方向的资源列表
    var visibility={}
    function updateVisibility(){
              var visibility0=scope.getVisibility()
              // for(var i in visibility0) 
              //   if(visibility[i])visibility[i]+=visibility0[i]
              //   else visibility[i]=visibility0[i]
              visibilitys[myIndex0]=visibility0
    }
    var directions=[
      [0,0,0],
      [Math.PI/2,0,0],
      [Math.PI,0,0],
      [Math.PI*1.5,0,0],
      [0,Math.PI/2,0],
      [0,-Math.PI/2,0],
    ]
    var transparentMeshHide=false
    var myIndex0=0
    function next0(){
      var d=directions[myIndex0++]
      c.rotation.set(d[0],d[1],d[2])
      requestAnimationFrame(()=>{
        updateVisibility()
        if(myIndex0<directions.length)next0()//下一个
        // else if(!transparentMeshHide){
        //   transparentMeshHide=true
        //   for(var i in window.transparentMesh)
        //     window.transparentMesh[i].visible=false
        //   myIndex0=0
        //   next0()}
        else{
          // for(var i in window.transparentMesh)
          //   window.transparentMesh[i].visible=true
          if(callback)callback(visibilitys)//完成//if(callback)callback(visibility)//完成
        } 
      })
    }next0()
  }
  getBoxResourceList_sim(callback){//获得一个位置的投影
    var scope=this;
    function nextFrame(){
      requestAnimationFrame(nextFrame);
      if(window.run_nextFrame){
        window.run_nextFrame()
      }
    }
    if(!window.nextFrame){
      window.nextFrame=nextFrame
      nextFrame()
    }
    var visibility={}
    function updateVisibility(){
          var visibility0=scope.getVisibility()
          for(var i in visibility0) 
            if(visibility[i])visibility[i]+=visibility0[i]
            else visibility[i]=visibility0[i]
    }
    var directions=[
      [0,0,0],
      [Math.PI/2,0,0],
      [Math.PI,0,0],
      [Math.PI*1.5,0,0],
      [0,Math.PI/2,0],
      [0,-Math.PI/2,0],
    ]
    var myIndex0=0
    function next0(){
      var d=directions[myIndex0++]
      c.rotation.set(d[0],d[1],d[2])
      requestAnimationFrame(()=>{//等到下一帧执行
        updateVisibility()
        if(myIndex0<directions.length)next0()//下一个
        else{  
          if(callback)callback(visibility)//完成
        } 
      })
    }next0()
  }
  getPlaneResourceList(px,py,pz,rx,ry,rz,callback){//获得一个面的投影
    scope.camera.position.set(px,py,pz)
    scope.camera.rotation.set(rx,ry,rz)
    var scope=this;
    var firstFrame=true
    function nextFrame0(){
      if(firstFrame){
        firstFrame=false
        requestAnimationFrame(nextFrame0);
      }else{
        if(callback)callback(scope.getVisibility())
      }
    }nextFrame0()
  }
  getCut(){
    var canvas=renderer.domElement;
    //下载
    let url = canvas.toDataURL("image/png"); //得到图片的base64编码数据
    let a = document.createElement("a"); // 生成一个a元素
    let event = new MouseEvent("click"); // 创建一个单击事件
    a.download ="IMG"; // 设置图片名称
    a.href = url; // 将生成的URL设置为a.href属性
    a.dispatchEvent(event); // 触发a的单击事件
  }
  computeWeight(){
    var getNormal1=(a,h)=>{
        return new Vector3(0,-1,1-2*a/h)
    }
    var getNormal2=(b,w)=>{
        return new Vector3(-1,0,1-2*b/w)
    }
    var canvas=renderer.domElement;
    var w=canvas.width;
    var h=canvas.height;
    var normalW=[],normalH=[]
    for(var i=0;i<=h;i++)
        normalH.push(getNormal1(i,h))
    for(var i=0;i<=w;i++)
        normalW.push(getNormal2(i,w))
    var weight=[]
    for(var i = 0; i < h; i++) {
        weight.push([])
        for(var j=0;j<w;j++){
            var normal=[
                  normalW[i],
                  normalH[j],
                  normalW[i+1].clone().multiplyScalar(-1),
                  normalH[j+1].clone().multiplyScalar(-1)
                ]
            var sum = -2*Math.PI;
            for (var k = 0; k < normal.length; k++) 
                sum += Math.PI - normal[k].angleTo(normal[(k + 1) % 4]);
            weight[i].push(sum)
        }
    }
    return weight
  }
  getVisibility(){
    var canvas=renderer.domElement;
    var newCanvas = document.createElement('canvas');
    var context = newCanvas.getContext('2d');
    newCanvas.width = canvas.width;
    newCanvas.height = canvas.height;
    context.drawImage(canvas, 0, 0);
    
    var data=context.getImageData( 0, 0, canvas.width, canvas.height).data
    var result={}
    for (let i = 0; i < canvas.height; i++) {
      for (let j = 0; j < canvas.width; j++) {
        const index = (canvas.width * i + j) * 4;
        var r = data[index], g = data[index+ 1], b = data[index+ 2];
        var id = (r * 256 + g) * 256 + b;
        if (id == 16777215) continue;
        if (result[id]) result[id] += this.weight[i][j];
        else result[id] = this.weight[i][j];
      }
    }
    return result
  }
  getVisibility_number(){//通过像素个数来估算面积
    var canvas=renderer.domElement;
    var newCanvas = document.createElement('canvas');
    var context = newCanvas.getContext('2d');
    newCanvas.width = canvas.width;
    newCanvas.height = canvas.height;
    context.drawImage(canvas, 0, 0);

    var data=context.getImageData( 0, 0, canvas.width, canvas.height).data
    var result={}
    for(var i=0;i<data.length/4;i++){//
      var r=data[4*i]
      var g=data[4*i+1]
      var b=data[4*i+2]
      var id=(r*256+g)*256+b
      if(id==16777215)
            continue
      if(result[id])result[id]++
      else result[id]=1
    }
    return result
  }
  analysis(name){
    var result=this.getVisibility()
    this.viewPointData.push(result)

    var ui=new MyUI()
    var width=window.innerWidth
    var height=window.innerHeight
    var scope=this;
    new ui.Button('可见度列表'+scope.viewPointNumber, "#5498DB", '#2970B9', '#11DFD7',
          (width/10)/6, 150,
          width/10, (width/10)/3,
          width/10,(scope.viewPointNumber+1)*(width/20),(b)=>{
            console.log(b,b.myId)
            //scope.viewPointData[this.myId]
            scope.download(name,scope.viewPointData[b.myId] )
          }).element.myId=scope.viewPointNumber++
    return result;
  }
  download(name,data){
    var str=JSON.stringify(
      data//scope.viewPointData[b.myId] 
      , null, "\t")
    var link = document.createElement('a');
    link.style.display = 'none';
    document.body.appendChild(link);
    link.href = URL.createObjectURL(new Blob([str], { type: 'text/plain' }));
    link.download =name?name:"test.json";
    link.click();
  }
}