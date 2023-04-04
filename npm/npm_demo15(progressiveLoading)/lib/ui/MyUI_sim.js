import config from '../../config/config.json'
export {MyUI}
class MyUI{
    createInput(){
        this.config=config.src.Building_new
    }
    constructor() {
        var fontSize=10
        this.width=window.innerWidth
        this.height=window.innerHeight

        function Input(name,value,x,y,valueSize){//输入框的高取决于文字字体的大小
            this.element=input(name,value,x,y,valueSize);
            function input(name,value,x,y,valueSize){
                var inp=document.createElement('input');
                inp.name=name
                inp.value=value;
                inp.size=valueSize;
                inp.style.cssText=
                    //'color:skyblue;'+
                    //'background:#aff;'+//背景颜色
                    'font-size:'+fontSize+'px;'+//文字大小
                    //'width:60px;height:40px;'+//文本大小
                    'font-weight:normal;'+
                    //+'padding-top:50px;'//距离上一个对象的距离
                    'position:fixed;'+//到窗体的位置
                    'left:'+x+'px;'+//到部件左边距离
                    'top:'+y+'px;'; //到部件右边 距离
                document.body.appendChild(inp);
                return inp;
            }
        }
        function Text(str,x,y,size){//文本
            this.str=str;
            //this.size=size*fontSize;
            this.element=h1(str,x,y,fontSize);
            function h1(str,x,y,size){
                var oText=document.createElement('h1');
                oText.innerHTML=str;
                oText.style.cssText=
                    //'color:skyblue;'+
                    //'color:'+color+';'+//文字颜色
                    //'background:#aff;'+//背景颜色
                    'font-size:'+size+'px;'+//文字大小
                    //'width:60px;height:40px;'+//文本大小
                    'font-weight:normal;'+
                    //+'padding-top:50px;'//距离上一个对象的距离
                    'position:fixed;'+//到窗体的位置
                    'left:'+x+'px;'+//到部件左边距离
                    'top:'+y+'px;'; //到部件右边 距离
                    document.body.appendChild(oText);
                return oText;
            }
        }
        function Button(str,color1,color2,color3,size,radius,w,h,x,y,cb) {
            if(typeof (w)=="undefined")w=100;
            if(typeof (h)=="undefined")h=50;
            var parentNode = document.body;
            this.element=p(str,color1,color2,color3,size,radius,w,h,parentNode);
            function p(html,color1,color2,color3,size,radius,width,height,parentNode){
                var oButton=document.createElement('p');//按钮
                oButton.innerHTML=html;
                oButton.style.cssText='font-size:'+size+'px;'//字体大小
                    +'width:'+width+'px;height:'+height+'px;'//按钮大小
                    +'background:'+color1+';'//字体颜色
                    +'color:white;'//按钮颜色
                    +'vertical-align:middle;'
                    +'text-align:center;'
                    +'line-height:'+height+'px;'
                    +'border-radius: '+radius+'px;'
                    +'border: 2px solid '+color1+';'
                    +'position:fixed;'//到窗体的位置
                    +'left:'+(window.innerWidth-width)+'px;'//到部件左边距离
                    +'top:'+0+'px;'; //到部件右边 距离
                //+'cursor:pointer;'
                oButton.style.left=x+'px';
                oButton.style.top=y+'px';
                oButton.style.cursor='hand';
                oButton.onmouseover=function(){
                    oButton.style.cursor='hand';
                    oButton.style.backgroundColor = color3;
                    oButton.style.color = color1;
                }
                oButton.onmouseout=function(){
                    oButton.style.cursor='normal';
                    oButton.style.backgroundColor = color1;
                    oButton.style.color = 'white';
                }
                oButton.onmousedown = function() {
                    oButton.style.backgroundColor = color2;
                    oButton.style.color = 'black';
                }
                oButton.onmouseup = function() {
                    oButton.style.backgroundColor = color3;
                    oButton.style.color = 'white';
                }
                parentNode.appendChild(oButton);
                if(cb)oButton.onclick=()=>{
                    cb(oButton)
                }
                return oButton;
            }
        }
        Button.prototype=Text.prototype={
            reStr:function(str){
                this.element.innerHTML=str;
            },
            rePos:function (x,y) {
                this.element.style.left=x+'px';
                this.element.style.top=y+'px';
            },
            addEvent:function(event){
                this.element.onclick=event;
            },
        }
        this.Text=Text
        this.Button=Button
        this.Input=Input

        
        //this.computeOptStep()
    }
    init(){
        // this.showCameraState()
        // this.tag0=new this.Text( "", 0,3*60,3)//用于输出程序进度
        // this.tag1=new this.Text( "", 0,3*70,3)//用于输出程序起始时间
        // this.createInput()
    }
    showCameraState(){
        var s1=new this.Text( "", 0*5,0,3)
        var s2=new this.Text( "", 0,3*10,3)
        var s3=new this.Text( "", 0,3*20,3)
        var s4=new this.Text( "", 0,3*30,3)
        var s5=new this.Text( "", 0,3*40,3)
        var s6=new this.Text( "", 0,3*50,3)
        setInterval(()=>{
            s1.element.innerHTML="px:"+window.camera.position.x
            s2.element.innerHTML="py:"+window.camera.position.y
            s3.element.innerHTML="pz:"+window.camera.position.z
            s4.element.innerHTML="rx:"+window.camera.rotation.x
            s5.element.innerHTML="ry:"+window.camera.rotation.y
            s6.element.innerHTML="rz:"+window.camera.rotation.z
        },800)
    }
    getFloat(name){
            return parseFloat(
                document.getElementsByName(name)[0].value
                )
    }
    setValue(name,value){
        document.getElementsByName(name)[0].value=value
    }
    getStr(name){
        return document.getElementsByName(name)[0].value 
    }
    setInput(ui0,x0,y0,l1,l2){
        //x0,y0 起始位置
        //l1,l2 标签和输入框长度
        if(typeof l1==="undefined")l1=100;
        if(typeof l2==="undefined")l2=20;
        var number=0
        for(var i in ui0){
          new this.Text( i, 
            x0+this.width/100,//起始位置x
            y0+(number+0.5)*this.height/40,//起始位置y
            1);
          new this.Input(i, ui0[i]  , 
            x0+this.width/100+l1,//起始位置x
            y0+(number+0.5)*this.height/40,//起始位置y
            l2
            );
          number++;
        }
    }
    computeOptStep(){//计算采样密度
        function getNumber(x,y,z,d){
            return ((x[1]-x[0])/d+1)*((y[1]-y[0])/d+1)*((z[1]-z[0])/d+1)
        }
        var x1=this.getFloat('x1')
        var y1=this.getFloat('y1')
        var z1=this.getFloat('z1')
        var x2=this.getFloat('x2')
        var y2=this.getFloat('y2')
        var z2=this.getFloat('z2')
        var x=[x1,x2]
        var y=[y1,y2]
        var z=[z1,z2]
        var n=145000//70000
        var min_i=0.5
        var min_v=Math.abs(n-getNumber(x,y,z,min_i))
        for(var i=min_i;i<=100;i+=0.5)
            if(min_v>Math.abs(n-getNumber(x,y,z,i))){
              min_v=Math.abs(n-getNumber(x,y,z,i))
              min_i=i
            }	
        var d=min_i
 
        
        var add=[
                (d-(x[1]-x[0])%d)%d,
                (d-(y[1]-y[0])%d)%d,
                (d-(z[1]-z[0])%d)%d
            ]
        var x_new=[
            x1-add[0]/2,
            x2+add[0]/2
        ]
        var y_new=[
            y1-add[1]/2,
            y2+add[1]/2
        ]
        var z_new=[
            z1-add[2]/2,
            z2+add[2]/2
        ]

        var result={
            "i":d,
            "v":min_v,
            "add":add,
            "new":{
                "number":getNumber(x_new,y_new,z_new,d),
                "v":Math.abs(n-getNumber(x_new,y_new,z_new,d)),
                "mod step":[
                    (x_new[1]-x_new[0])%d,
                    (y_new[1]-y_new[0])%d,
                    (z_new[1]-z_new[0])%d
                ],
                "step":d,
                "x":x_new,
                "y":y_new,
                "z":z_new,
            },
        }
        this.setValue('x1',x_new[0])
        this.setValue('y1',y_new[0])
        this.setValue('z1',z_new[0])
        this.setValue('x2',x_new[1])
        this.setValue('y2',y_new[1])
        this.setValue('z2',z_new[1])
        this.setValue('step',d)
        console.log(result)
        return result
    }
    computeOuterBoundingBox(){//外侧包围盒
        var x1=this.getFloat('x1')
        var y1=this.getFloat('y1')
        var z1=this.getFloat('z1')
        var x2=this.getFloat('x2')
        var y2=this.getFloat('y2')
        var z2=this.getFloat('z2')
        var step=this.getFloat('step')
        
        
        var x0=(x2+x1)/2
        var xdd=(x2-x1)/2

        var scale=5//新的包围盒边长变为原来的scale倍
        var box={}//新的包围盒
        box.xdd=xdd*scale
        

    }

}
