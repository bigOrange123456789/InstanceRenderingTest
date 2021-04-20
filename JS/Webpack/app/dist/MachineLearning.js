export {MachineLearning}
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
                console.log(scope.grid)
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
        for(i=0;i<this.board.length;i++) {
            var I=this.board[i][0],
                J=this.board[i][1];
            this.grid.nodes[I][J].boardAngle =this.board[i][2];
            console.log(I,J,this.grid.nodes[I][J].boardAngle)
        }/**/
        this.finder = new PF.AStarFinder({
            allowDiagonal: true,//允许对角线
            dontCrossCorners: false,//不要拐弯?
            heuristic: PF.Heuristic["manhattan"],//启发式["曼哈顿"]
            weight: 1
        });
    }
    getAngle(i,j){
        console.log(this.grid)
        return this.train({"i":i,"j":j});
    }
    getAngle2(i,j){
        var scope=this;
        return train2({"i":i,"j":j});
        function train2(x){
            var w_init=0;
            var time=100;
            var step=Math.PI/180;

            var w=w_init;
            //var test=[];
            for(var t=0;t<time;t++){
                x.angle=w;
                var l1=scope.loss(x);x.angle+=step;
                var l2=scope.loss(x);x.angle-=step;

                if(l1<l2)w+=step;
                else w-=step;
                console.log(w)
            }

            return w;
        }
    }
    getAngle3(i,j){
        var scope=this;
        return train2({"i":i,"j":j});
        function train2(x){
            var w_init=0;
            var step=Math.PI/180;

            x.angle=w_init;
            var w_opt=w_init;
            var l_min=scope.loss(x);

            var test="";
            for(var t=w_init;t<Math.PI*2;t+=step){
                x.angle+=t;
                var l=scope.loss(x);
                test=test+","+(Math.floor(l*100)/100);
                if(l<l_min){
                    l_min=l;
                    w_opt=x.angle;
                }
            }
            console.log(test)

            x.angle=1;
            console.log(scope.loss(x));

            x.angle=1+Math.PI*2;
            console.log(scope.loss(x));

            return w_opt;
        }
    }
    train(x){
        var w_init=0;
        var time=100;
        var step=Math.PI/180;

        var w=w_init;
        var test=[];
        for(var t=0;t<time;t++){
            x.angle=w;
            var g=this.grad(x);
            w=w-g*step;
            test.push(g);
            console.log(g)
        }
        for(t=10;t>0;t--) console.log(test[test.length-t]);

        return w;
    }

    grad(x0){
        var step=0.01;
        var l1=this.loss(x0);x0.angle+=step;
        var l2=this.loss(x0);x0.angle-=step;

        //var dl=l2-l1;
        //if(dl===0)return 0;

        /*var g=0;
        var d=l2-l1;
        while(d!==0){
            g=d/step;
            step/=2;
            l1=this.loss(x0);x0.angle+=step;
            l2=this.loss(x0);x0.angle-=step;
            d=l2-l1;
        }*/
        return (l2-l1)/step;//g;//
    }
    loss(x){//损失函数
        this.grid.nodes[x.i][x.j].boardAngle=x.angle;

        var sum=0;
        var rMax=10,cMax=10;
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
        return sum/((rMax+1)*(cMax+1)-err);
    }
    find(start1,start2,end1,end2){//返回搜索过的区域大小为
        if(!this.grid.nodes[start1][start2].walkable)return 0;
        var grid=this.grid.clone();
        for(var i=0;i<this.grid.nodes.length;i++)
            for(var j=0;j<this.grid.nodes.length;j++){
                var angle=this.grid.nodes[i][j].boardAngle;
                if(typeof (angle)!=="undefined")
                    grid.nodes[i][j].boardAngle=angle;
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
