function PicHandle() {//只服务于MaterialHandle对象
    this.image;
    this.h;
    this.w;
    this.compressionRatio=0.1;//0-1
}
PicHandle.prototype={
    getCanvas:function (image) {
        var flipY = true;
        var canvas =  document.createElement( 'canvas' );
        //计算画布的宽、高
        canvas.width = image.width*this.compressionRatio;
        canvas.height = image.height*this.compressionRatio;

        var ctx = canvas.getContext( '2d' );

        if ( flipY === true ) {
            ctx.translate( 0, canvas.height );
            ctx.scale( 1, - 1 );
        }
        //将image画到画布上
        ctx.drawImage( image, 0, 0, canvas.width, canvas.height );


        /*var ctx=this.canvas.getContext( "2d" );  //设置画布类型2d
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
        }*/
        return canvas;
    },

}