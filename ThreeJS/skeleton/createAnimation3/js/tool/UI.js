function Text(str,color,size,parentNode){//文本
    if (typeof(parentNode) == "undefined") parentNode = document.body;
    this.parentNode=parentNode;
    this.str=str;
    this.color=color;
    this.size=size;
    this.element=h1(str,color,size,parentNode);
    function h1(str,color,size,parentNode){
        var oText=document.createElement('h1');
        oText.innerHTML=str;
        oText.style.cssText=
            //'color:skyblue;'+
            'color:'+color+';'+//文字颜色
            //'background:#aff;'+//背景颜色
            'font-size:'+size+'px;'+//文字大小
            //'width:60px;height:40px;'+//文本大小
            'font-weight:normal;'+
            //+'padding-top:50px;'//距离上一个对象的距离
            'position:fixed;'+//到窗体的位置
            'left:'+0+'px;'+//到部件左边距离
            'top:'+0+'px;'; //到部件右边 距离
        parentNode.appendChild(oText);
        return oText;
    }
}

function ButtonS(str) {
    this.element=p(str,"white","#2ECC71",20,120,50,document.body);
    function p(html,color,background,size,width,height,parentNode){
        var oButton=document.createElement('p');//按钮
        oButton.innerHTML=html;
        oButton.style.cssText='font-size:'+size+'px;'//字体大小
            +'width:'+width+'px;height:'+height+'px;'//按钮大小
            +'color:'+color+';'//字体颜色
            +'background:'+background+';'//按钮颜色
            +'vertical-align:middle;'
            +'text-align:center;'
            +'line-height:50px;'
            +'border-radius: 6px;' 
            +'position:fixed;'//到窗体的位置
            +'left:'+(window.innerWidth-width-50)+'px;'//到部件左边距离
            +'top:'+0+'px;'; //到部件右边 距离
        //+'cursor:pointer;'
        oButton.style.cursor='hand';
        oButton.onmouseover=function(){
            oButton.style.cursor='hand';
            oButton.style.borderRadius='70px';
            oButton.style.backgroundColor = '#81F79F';
        }
        oButton.onmouseout=function(){
            oButton.style.cursor='normal';
            oButton.style.borderRadius='6px';
            oButton.style.backgroundColor = '#2ECC71';
        }
        oButton.onmousedown = function() {
            oButton.style.backgroundColor = '#27AE60';
            oButton.style.color = 'black';
        }
        oButton.onmouseup = function() {
            oButton.style.backgroundColor = '#81F79F';
            oButton.style.color = 'white';
        }
        parentNode.appendChild(oButton);
        return oButton;
    }
}

function Button(str,color1,color2,color3,size,radius,w,h,parentNode) {
    if(typeof (w)=="undefined")w=100;
    if(typeof (h)=="undefined")h=50;
    if(typeof(parentNode) == "undefined") parentNode = document.body;
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
        return oButton;
    }
}

function ButtonP(str,color1,color2,size,radius,w,h,parentNode) {
    if(typeof (w)=="undefined")w=100;
    if(typeof (h)=="undefined")h=50;
    if(typeof(parentNode) == "undefined") parentNode = document.body;
    this.element=p(str,color1,color2,size,radius,w,h,parentNode);
    function p(html,color1,color2,size,radius,width,height,parentNode){
        var oButton=document.createElement('p');//按钮
        oButton.innerHTML=html;
        oButton.style.cssText='font-size:'+size+'px;'//字体大小
            +'width:'+width+'px;height:'+height+'px;'//按钮大小
            +'color:'+color1+';'//字体颜色
            +'background:transparent;'//按钮颜色
            +'vertical-align:middle;'
            +'text-align:center;'
            +'line-height:'+height+'px;'
            +'border-radius: '+radius+'px;' 
            +'border: 2px solid '+color1+';'
            +'position:fixed;'//到窗体的位置
            +'left:'+(window.innerWidth-width)+'px;'//到部件左边距离
            +'top:'+0+'px;'; //到部件右边 距离
        //+'cursor:pointer;'
        oButton.style.cursor='hand';
        oButton.onmouseover=function(){
            oButton.style.cursor='hand';
            oButton.style.backgroundColor = color1;
            oButton.style.color = 'white';
        }
        oButton.onmouseout=function(){
            oButton.style.cursor='normal';
            oButton.style.backgroundColor = 'transparent';
            oButton.style.color = color1;
        }
        oButton.onmousedown = function() {
            oButton.style.backgroundColor = color2;
            oButton.style.color = 'black';
        }
        oButton.onmouseup = function() {
            oButton.style.backgroundColor = color1;
            oButton.style.color = 'white';
        }
        parentNode.appendChild(oButton);
        return oButton;
    }
}

ButtonP.prototype=ButtonS.prototype=Button.prototype=Text.prototype={
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
