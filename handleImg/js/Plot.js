export {Plot};
class Plot{
    canvasController;
    test(){
        var scope=this;
        var canvasController0=new CanvasController();
        this.canvasController=new CanvasController();
        var myImageController=new ImageController();
        myImageController.load("1.jpg",function () {
            var wh=myImageController.getWH();
            var w=wh[0],h=wh[1];

            canvasController0.setSize(w,h);
            scope.canvasController.setSize(w,h);
            canvasController0.context.drawImage(
                myImageController.image,0,0,w,h
            );


            var canvas0=canvasController0;
            var canvas=scope.canvasController;
            for(var i=1;i<w-1;i++)
                for(var j=1;j<h-1;j++){
                    var p11=canvas0.getPixel(i-1,j-1);
                    var p12=canvas0.getPixel(i,j-1);
                    var p13=canvas0.getPixel(i+1,j-1);

                    var p21=canvas0.getPixel(i-1,j);
                    var p22=canvas0.getPixel(i,j);
                    var p23=canvas0.getPixel(i-1,j);

                    var p31=canvas0.getPixel(i-1,j+1);
                    var p32=canvas0.getPixel(i,j+1);
                    var p33=canvas0.getPixel(i+1,j+1);

                    var x=
                        Math.abs(p11.data[0]-p13.data[0])+
                        Math.abs(p21.data[0]-p23.data[0])*2+
                        Math.abs(p31.data[0]-p33.data[0]);
                    //p22.data[1]=0;
                    //p22.data[2]=0;
                    p22.data[0]=p22.data[1]=p22.data[2]=x;
                    canvas.setPixel(p22, i,j)
                }
        });
    }
    getChannel(){
        var scope=this;
        this.canvasController=new CanvasController();
        var myImageController=new ImageController();
        myImageController.load("1.jpg",function () {
            var wh=myImageController.getWH();
            var w=wh[0],h=wh[1];
            scope.canvasController.setSize(w,h);
            scope.canvasController.context.drawImage(
                myImageController.image,0,0,w,h
            );
            var canvas=scope.canvasController;
            for(var i=0;i<w;i++)
                for(var j=0;j<h;j++){
                    var pixel=canvas.getPixel(i,j);
                    pixel.data[0]=0;
                    pixel.data[1]=0;
                    canvas.setPixel(pixel, i,j)
                }
        });
    }
    download(src){
        var scope=this;
        this.canvasController=new CanvasController();
        var myImageController=new ImageController();
        myImageController.load(src,function () {
            var wh=myImageController.getWH();
            var w=wh[0],h=wh[1];
            scope.canvasController.setSize(w,h);
            scope.canvasController.context.drawImage(
                myImageController.image,0,0,w,h
            );
            scope.canvasController.download("test.jpg");
        });
    }
}
class CanvasController{
    canvas;
    context;
    constructor() {
        this.canvas = document.createElement("canvas");
        this.context = this.canvas.getContext("2d");
        document.body.append(this.canvas)
    }
    setSize(width,height){
        this.canvas.width = width;
        this.canvas.height = height;
    }
    download(name) {//将画布的内容保存为图片
        let url = this.canvas.toDataURL("image/jpeg");
        let a = document.createElement("a"); // 生成一个a元素
        let event = new MouseEvent("click"); // 创建一个单击事件
        a.download = name || "photo"; // 设置图片名称
        a.href = url; // 将生成的URL设置为a.href属性
        a.dispatchEvent(event); // 触发a的单击事件
    }
    getPixel(x,y){
        return this.context.getImageData( x, y, 1, 1 );
    }
    setPixel(pixel, x, y){
        this.context.putImageData(pixel, x, y);
    }
    setR(){

    }
    setG(){

    }
    setB(){

    }
}
class ImageController{
    image;
    constructor() {
        this.image= new Image();
    }
    load(src,finished){
        var scope=this;
        scope.image.src = src;
        scope.image.crossOrigin = 'Anonymous';
        scope.image.onload = function(){
            if(finished)finished();
        }
    }
    getWH(){
        var scope=this;
        return [scope.image.width,scope.image.height];
    }
    getImage(){
        var scope=this;
        return scope.image;
    }
}
