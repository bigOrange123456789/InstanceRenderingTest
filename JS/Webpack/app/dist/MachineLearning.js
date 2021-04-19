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
        var scope=this;
        this.load("../client/grid1.json",function () {
            scope.initPF();
            scope.train();
        })
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
                if(finished)finished();
            }
        }
    }
    initPF(){
        this.grid = new PF.Grid(20,20);//生成网格
        for(var i=0;i<this.wall.length;i++){
            this.grid.setWalkableAt(
                this.wall[i][0],
                this.wall[i][1],
                false);
        }
        for(i=0;i<this.board.length;i++) {
            var I=this.board[i][0],
                J=this.board[i][1];
            this.grid.nodes[I][J].boardAngle
                =this.board[i][2];
            console.log(this.grid.nodes[I][J].boardAngle)
        }
        this.finder = new PF.BiAStarFinder({
            allowDiagonal: true,//允许对角线
            dontCrossCorners: false,//不要拐弯?
            heuristic: PF.Heuristic["manhattan"],//启发式["曼哈顿"]
            weight: 1
        });
    }

    train(){
        var grid=this.grid.clone();
        var path = this.finder.findPath(
            this.start[0],this.start[1],
            this.end[0],this.end[1],
            grid);
        console.log(path)
        console.log("搜索过的区域大小为："+this.PFAreaSize(grid));
    }
    PFAreaSize(grid0){
        console.log(grid0)
        var count=0;
        for(var i=0;i<grid0.nodes.length;i++){
            for(var j=0;j<grid0.nodes[i].length;j++){
                if(grid0.nodes[i][j].closed===true){
                    count++;
                    console.log(i,j)
                }
            }
        }
        return count;
    }
}
