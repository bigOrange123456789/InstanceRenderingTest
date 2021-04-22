export {MachineLearning}//nv dun
class MachineLearning{
    //loadJson获得
    max;min;
    wall;board;
    start;end;
    //initPF获得
    grid;
    finder;
    constructor(){
    }
    load(url,finished){
        var scope=this;
        var request = new XMLHttpRequest();
        request.open("get", url);/*设置请求方法与路径*/
        request.send(null);/*不发送数据到服务器*/
        request.onload = function () {/*XHR对象获取到返回信息后执行*/
            if (request.status === 200) {/*返回状态为200，即为数据获取成功*/
                var json = JSON.parse(request.responseText);
                var arr=json.data;
                scope.wall=arr;

                var max=[arr[0][0],arr[0][1]],
                    min=[arr[0][0],arr[0][1]];
                for(var i=1;i<arr.length;i++){
                    for(var j=0;j<2;j++)
                        if(arr[i][j]!==null)if(arr[i][j]>max[j])max[j]=arr[i][j];
                    for(j=0;j<2;j++)
                        if(arr[i][j]!==null)if(arr[i][j]<min[j])min[j]=arr[i][j];
                }
                scope.max=max;
                scope.min=min;

                scope.start=json.start;
                scope.end=json.end;

                scope.board=json.board;
                scope.initPF();

                if(finished)finished();

            }
        }
    }
    initPF(){
        this.grid = new PF.Grid(30,30);//生成网格
        for(var i=0;i<this.wall.length;i++){
            this.grid.setWalkableAt(
                this.wall[i][0],
                this.wall[i][1],
                false);
        }
        /*for(i=0;i<this.board.length;i++) {
            var I=this.board[i][0],
                J=this.board[i][1];
            this.grid.nodes[I][J].boardAngle =this.board[i][2];
            console.log(I,J,this.grid.nodes[I][J].boardAngle)
        }*/
        this.finder = new PF.AStarFinder({
            allowDiagonal: true,//允许对角线
            dontCrossCorners: false,//不要拐弯?
            heuristic: PF.Heuristic["manhattan"],//启发式["曼哈顿"]
            weight: 1
        });
    }

    //穷举法
    getAngle3(i,j){//5,0
        return this.exhaustion(i,j);
    }
    exhaustion(i,j){
        var step=Math.PI/180;

        var x=this.xInit({"i":i,"j":j});

        var w_opt=x.angle;
        var l_min=this.loss(x);

        var test="";
        for(var t=0;t<2*Math.PI;t+=step){
            x.angle=t;
            var l=this.loss(x);
            test=test+","+(Math.floor(l*100)/100);
            if(l<l_min){
                l_min=l;
                w_opt=x.angle;
            }
        }
        console.log(l_min,w_opt)
        console.log(test)
        return w_opt;
    }
    getI0(){//0,182
        var scope=this;
        exhaustion();
        function exhaustion(){
            var step=1;

            var x=scope.xInit({i:-100});

            var w_opt=x.i;
            var l_min=scope.loss(x);

            var test="";
            for(var t=x.i;t<100;t+=step){
                x.i=t;
                var l=scope.loss(x);
                test=test+","+(Math.floor(l*100)/100);
                if(l<l_min){
                    l_min=l;
                    w_opt=x.i;
                }
            }
            console.log(l_min,w_opt)
            console.log(test)
            return w_opt;
        }
    }


    //梯度下降法
    getAngle(i,j){
        console.log(this.grid)
        return this.train(i,j);
    }
    getI(){

    }
    train(i,j){
        var time=100;
        var step=0.25*Math.PI/180;//变参步长

        var x=this.xInit({"i":i,"j":j});
        for(var t=0;t<time;t++){
            var g=this.grad(x,0.02);
            //console.log(Math.round(w*180/Math.PI), g)
            x.angle=x.angle-g*step;
        }
        return x.angle;
    }

    xInit(x0){
        //var x={"i":i,"j":j};
        if(typeof (x0)==="undefined")x0={};
        if(typeof (x0.i)==="undefined")x0.i=5;
        if(typeof (x0.j)==="undefined")x0.j=0;
        if(typeof (x0.angle)==="undefined")x0.angle=325*Math.PI/180;//角度
        console.log(x0)
        return x0;
    }
    xPlus(x0,step){
        var x=clone(x0);
        x.angle+=step;//求导步长
        return x;
        function clone(obj){
            console.log(obj)
            var newObj = {};
            if (obj instanceof Array) {
                newObj = [];
            }
            for (var key in obj) {
                var val = obj[key];
                newObj[key] = typeof val === 'object' ? cloneObj(val): val;
            }
            return newObj;
        }
    }

    grad(x0,step){
        var l2=this.loss(this.xPlus(x0,step));
        var l1=this.loss(x0);
        return (l2-l1)/step;
    }

    loss(x){//损失函数
        //this.grid.nodes[x.i][x.j].boardAngle=x.angle;
        this.grid.boards=[
            [x.i,x.j,x.angle]
        ];
        var sum=0;
        var rMax=this.grid.width-10,cMax=this.grid.height-10;
        //var rMax=1,cMax=1;
        var err=0;
        for(var r=0;r<rMax;r++)
            for(var c=0;c<cMax;c++){
                var l=this.find(
                    this.start[0]+c,
                    this.start[1]+c,
                    this.end[0]+r,
                    this.end[1]+r);
                if(l>0)sum+=l;
                else err++;
            }
        return sum/(rMax*cMax-err);
    }
    find(start1,start2,end1,end2){//返回搜索过的区域大小为
        if(!this.grid.nodes[start1][start2].walkable)return 0;
        var grid=this.grid.clone();

        if(typeof (this.grid.boards)!=="undefined"){
            grid.boards=this.grid.boards;
        }else{
            for(var i=0;i<this.grid.nodes.length;i++)
                for(var j=0;j<this.grid.nodes.length;j++){
                    var angle=this.grid.nodes[i][j].boardAngle;
                    if(typeof (angle)!=="undefined")
                        grid.nodes[i][j].boardAngle=angle;
                }
        }

        var path = this.finder.findPath(
            start1,start2,
            end1,end2,
            grid);
        if(path.length===0)return 0;
        else return PFAreaSize(grid);//搜索过的区域大小
        function PFAreaSize(grid0){
            var count=0;
            for(var i=0;i<grid0.nodes.length;i++){
                for(var j=0;j<grid0.nodes[i].length;j++){
                    if(grid0.nodes[i][j].closed===true){
                        count++;
                    }
                }
            }
            return count;
        }
    }
}

class AngleTrain{

}
class GradientDescent{
    static loss(){

    }

}
