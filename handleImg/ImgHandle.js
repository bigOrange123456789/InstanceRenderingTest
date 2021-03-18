function ImgHandle() {
    this.canvas;
    this.context;
}
ImgHandle.prototype={
    init:function (width,height) {
        //生成画布
        var canvas = document.createElement("canvas");
        canvas.width = width;
        canvas.height = height;

        //生成画笔
        var context = canvas.getContext("2d");

        this.canvas=canvas;
        this.context=context;
    },
    getBlackBackground:function(name){
        var ctx=this.canvas.getContext( "2d" );  //设置画布类型2d
        ctx.fillStyle = "#FFFFFF";//白色
        for( var y = 0; y < this.canvas.height; y++ ) {
            for( var x = 0; x < this.canvas.width ; x++ ) {
                // 获取当前位置的元素
                var pixel = ctx.getImageData( x, y, 1, 1 );//获取一个像素点的数据
                // 判断透明度不为0
                if( pixel.data[0] +pixel.data[1] +pixel.data[2] >100) {//如果颜色较亮
                    ctx.fillRect(x,y,1,1);
                }
            }
        }
        if(typeof (name)==="undefined")name="bg.jpg";
        this.download(name);
    },
    enhance:function(name){
        function getColorArr() {
            function getColor(x) {
                //if(x<50)return x;
                /*k=0.5;//暗端减少比
                y=x-256*k;
                y=y<0?0:(1/(1-k))*y;
                //y+=50;
                return Math.floor(y);*/

                /*var y;
                if(x<100)y=2*x;
                else if(x<240)y=(2*x+1200)/7;
                else y=x;
                return Math.floor(y);*/
                var y=(x-128)*2;
                if(y<0)y=0;
                return Math.floor(y);
            }
            var arr=[];
            for(i=0;i<256;i++)
                arr.push(getColor(i));
            return arr;
        }
        var arr0=getColorArr();
        console.log(arr0)
        var ctx=this.canvas.getContext( "2d" );  //设置画布类型2d
        for( var y = 0; y < this.canvas.height; y++ ) {//for( var y = 0; y < this.canvas.height; y++ ) {
            for( var x = 0; x < this.canvas.width ; x++ ) {
                // 获取当前位置的元素
                var pixel = ctx.getImageData( x, y, 1, 1 );//获取一个像素点的数据
                pixel.data[0]=arr0[pixel.data[0]];
                pixel.data[1]=arr0[pixel.data[1]];
                pixel.data[2]=arr0[pixel.data[2]];
                ctx.putImageData(pixel, x, y);
            }
            if(y%100===0)console.log(y+"/"+this.canvas.height);
            //console.log(y);
        }
        if(typeof (name)==="undefined")name="bg.jpg";
        this.download(name);
    },
    drawPoint:function(ps,color){
        var ctx=this.canvas.getContext( "2d" );  //设置画布类型2d
        ctx.fillStyle = "#000000";
        for(i=0;i<this.canvas.width;i++)
            for(j=0;j<this.canvas.height;j++){
            ctx.fillRect(i, j,1,1);
        }
        ctx.fillStyle = typeof(color)==="undefined"?"#ffffff":color;//"#00ff00";
        for(i=0;i<ps.length;i++){
            ctx.fillRect(ps[i][0], ps[i][1],1,1);
        }
        this.download("assignment2");
        //for(i=0;i<50;i++) for(j=0;j<50;j++) ctx.fillRect(i,j,1,1);
    },
    drawTex:function(){
        context.font = "60px Courier New";
        context.fillText("我是文字",350,450);
    },
    drawImg:function(src,pos,myOnload){
        var scope=this;
        var myImage2 = new Image();
        myImage2.src = src;   //你自己本地的图片或者在线图片
        myImage2.crossOrigin = 'Anonymous';
        myImage2.onload = function(){//pos[0],pos[1]是落笔的起始位置，pos[2],pos[3]是落笔区域的大小
            scope.context.drawImage(myImage2 , pos[0],pos[1],pos[2],pos[3]);
            myOnload();
        }
    },
    drawImg2:function(src,myOnload){
        var scope=this;
        var myImage2 = new Image();
        myImage2.src = src;   //你自己本地的图片或者在线图片
        myImage2.crossOrigin = 'Anonymous';
        myImage2.onload = function(){//pos[0],pos[1]是落笔的起始位置，pos[2],pos[3]是落笔区域的大小
            console.log(myImage2);
            scope.init(myImage2.width,myImage2.height);
            scope.context.drawImage(myImage2 ,0,0,myImage2.width,myImage2.height);
            myOnload();
        }
    },
    download:function (name) {//将画布的内容保存为图片
        let url = this.canvas.toDataURL("image/jpeg");
        //let url = this.canvas.toDataURL("image/png"); //得到图片的base64编码数据
        //console.log(url);
        let a = document.createElement("a"); // 生成一个a元素
        let event = new MouseEvent("click"); // 创建一个单击事件
        a.download = name || "photo"; // 设置图片名称
        a.href = url; // 将生成的URL设置为a.href属性
        a.dispatchEvent(event); // 触发a的单击事件
    },
    mergeImg:function (srcs,name) {
        var index=0;
        var scope=this;
        this.drawImg(srcs[index],[510*index , 0 ,510 ,510],callback);
        function callback() {
            //setInterval(function () {},100);
            console.log(index);
            index++;
            if (index === srcs.length) scope.download(name);
            else scope.drawImg(srcs[index], [510 * index, 0, 510, 510], callback);
        }
    },
    mergeImg2:function (srcs,name) {
        var index=0;
        var scope=this;
        this.drawImg(srcs[index],[510*index/2 , 0 ,510 ,510],callback);
        function callback() {
            //setInterval(function () {},100);
            console.log(index);
            index++;
            if (index === srcs.length) scope.download(name);
            else scope.drawImg(srcs[index], [510 * index/2+0.001, 0, 510, 510], callback);
        }
    },
}