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
    download:function (name) {//将画布的内容保存为图片
        let url = this.canvas.toDataURL("image/png"); //得到图片的base64编码数据
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
}