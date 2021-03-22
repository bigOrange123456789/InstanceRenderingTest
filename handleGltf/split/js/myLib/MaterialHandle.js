function MaterialHandle() {
    this.meshArr;
    this.canvass;
    this.names;
    this.mapsIndex;
    this.fileName;
}
MaterialHandle.prototype={
    init:function (arr,fileName) {
        this.meshArr=arr;
        this.canvass=[];
        this.names=[];
        this.mapsIndex=[];
        this.fileName=fileName;
    },
    process:function () {
        for(i=0;i<this.meshArr.length;i++){
            var map=this.meshArr[i].material.emissiveMap;
            if(map){//有纹理贴图
                this.mapsIndex.push(1);
                this.names.push(this.fileName+i+'.jpg');
                var canvas=new PicHandle().getCanvas( map.image);
                this.canvass.push(canvas);
                this.meshArr[i].material=new THREE.MeshBasicMaterial({//反光材质
                    color:this.getColor(canvas)
                });
            }else this.mapsIndex.push(0);
        }
    },
    getColor:function (canvas) {
        var ctx=canvas.getContext( "2d" );  //设置画布类型2d
        var r=0,g=0,b=0,n;
        for( var y = 0; y < canvas.height; y++ )
            for( var x = 0; x < canvas.width ; x++ ) {
                // 获取当前位置的元素
                var pixel = ctx.getImageData( x, y, 1, 1 );//获取一个像素点的数据
                r+=pixel.data[0];
                g+=pixel.data[1];
                b+=pixel.data[2];
            }
        n=canvas.height*canvas.width;
        r=Math.floor(r/n);
        g=Math.floor(g/n);
        b=Math.floor(b/n);
        var color=(r*256*256+g*256+b);//.toString(16);
        console.log(color.toString(16));
        return color;
    },
    getColor0:function (canvas) {
        var ctx=canvas.getContext( "2d" );  //设置画布类型2d
        var r=0,g=0,b=0,n=0;
        for( var y = 0; y < canvas.height; y++ )
            for( var x = 0; x < canvas.width ; x++ ) {
                // 获取当前位置的元素
                var pixel = ctx.getImageData( x, y, 1, 1 );//获取一个像素点的数据
                r+=pixel.data[0];
                g+=pixel.data[1];
                b+=pixel.data[2];
            }
        n=canvas.height*canvas.width;
        r=Math.floor(r/n);
        g=Math.floor(g/n);
        b=Math.floor(b/n);
        var color=(r*256*256+g*256+b);//.toString(16);
        console.log(color.toString(16));
        return color;
    },
}