var Heap       = require('../heap');
var Util       = require('../core/Util');
var Heuristic  = require('../core/Heuristic');
var DiagonalMovement = require('../core/DiagonalMovement');

/**
 * A* path-finder. Based upon https://github.com/bgrins/javascript-astar
 * @constructor
 * @param {Object} opt
 * @param {boolean} opt.allowDiagonal Whether diagonal movement is allowed.
 *     Deprecated, use diagonalMovement instead.
 * @param {boolean} opt.dontCrossCorners Disallow diagonal movement touching
 *     block corners. Deprecated, use diagonalMovement instead.
 * @param {DiagonalMovement} opt.diagonalMovement Allowed diagonal movement.
 * @param {function} opt.heuristic Heuristic function to estimate the distance
 *     (defaults to manhattan).
 * @param {number} opt.weight Weight to apply to the heuristic to allow for
 *     suboptimal paths, in order to speed up the search.
 */
function AStarFinder(opt) {
    opt = opt || {};
    this.allowDiagonal = opt.allowDiagonal;
    this.dontCrossCorners = opt.dontCrossCorners;
    this.heuristic = opt.heuristic || Heuristic.manhattan;
    this.weight = opt.weight || 1;
    this.diagonalMovement = opt.diagonalMovement;

    if (!this.diagonalMovement) {
        if (!this.allowDiagonal) {
            this.diagonalMovement = DiagonalMovement.Never;
        } else {
            if (this.dontCrossCorners) {
                this.diagonalMovement = DiagonalMovement.OnlyWhenNoObstacles;
            } else {
                this.diagonalMovement = DiagonalMovement.IfAtMostOneObstacle;
            }
        }
    }

    // When diagonal movement is allowed the manhattan heuristic is not
    //admissible. It should be octile instead
    if (this.diagonalMovement === DiagonalMovement.Never) {
        this.heuristic = opt.heuristic || Heuristic.manhattan;
    } else {
        this.heuristic = opt.heuristic || Heuristic.octile;
    }

    this.boards;
    this.disScope;//距离的最大范围
}
AStarFinder.prototype={

    computeDisScope:function(startX, startY, endX, endY){
        var disScope=[];
        var max=getDistance(startX,endX,startY,endY);
        for(var i=0;i<this.boards.length;i++){
            disScope.push(max);//最大值
            for(var j=0;j<this.boards.length;j++)
                if(i!==j){
                    var distance=getDistance(this.boards[i][0],this.boards[j][0],this.boards[i][1],this.boards[j][1]);
                    if(distance<disScope[i])disScope[i]=distance/2;
                }

        }
        return disScope;
        function getDistance(x1,x2,y1,y2) {
            return Math.pow(
                Math.pow(x1-x2,2)+
                Math.pow(y1-y2,2),
                0.5);
        }
    },
    computeBoards:function (endX, endY, grid) {
        if(typeof(grid.boards)!=="undefined")
            boards=grid.boards;
        else{
            boards=[];
            for(var i=0;i<grid.nodes.length;i++)
                for(var j=0;j<grid.nodes.length;j++){
                    var angle=grid.nodes[i][j].boardAngle;
                    if(typeof(angle)!=="undefined")
                        boards.push([i,j,angle]);
                }
        }
        //for(boards)
        boards.push([endX, endY]);
        return boards;
    },
    computeWeight:function(node,neighbor){
        var scope=this;
        var board,dis_scope;
        [board,dis_scope]=getBoard(neighbor.x,neighbor.y);
        function getBoard(x2,y2) {//boards
            var boards=this.boards;
            if(boards.length===0)return null;
            var dis_min=getDistance(boards[0][0],x2,boards[0][1],y2);
            var k=0;
            for(var i=1;i<boards.length;i++){
                var dis0=getDistance(boards[i][0],x2,boards[i][1],y2);
                if(dis0<dis_min){
                    dis_min=dis0;
                    k=i;
                }
            }
            return [boards[k],scope.disScope[k]];
        }

        //到指示牌的距离
        var distance=getDistance(board[0],neighbor.x,board[1],neighbor.y);

        neighbor.h=getH();
        var k=getK();

        neighbor.f = k*neighbor.g+(1-k)*neighbor.h;//f=g+h//g是实际代价 h是估计代价

        function getK() {
            //var dis_max= getDistance(startNode.x,endNode.x,startNode.y,endNode.y);//(boards.length+1);
            //var dis_scope=1.5*dis_max /(scope.boards.length+1);//常数系数需要考虑 路线的弯曲度，分支路径的长度和个数
            var dis=distance/dis_scope;//Math.pow(LD[1],4);
            if(dis>1)dis=1;
            return dis;
        }
        function getH() {
            var x1=node.x,
                y1=node.y,
                x2=neighbor.x,
                y2=neighbor.y;
            //角度差和距离之间如何放到一起进行比较
            var w;
            if(board.length===3){
                var da=getDa(x1,y1,x2,y2,board[2]);
                w=da*40;
            }else{
                w=distance;
            }
            return w;//角度差➗距离
            function getDa(x1,y1,x2,y2,a) {
                while(a>2*Math.PI)a-=2*Math.PI;
                var dx=x2-x1;
                var dy=y2-y1;
                var angle=Math.atan2(dy,dx);
                var da=Math.abs(angle-a);
                if(da>Math.PI)da=Math.abs(2*Math.PI-da);
                //console.log(angle*180/Math.PI,da*180/Math.PI);
                return da;
            }

        }
        function getDistance(x1,x2,y1,y2) {
            return Math.pow(
                Math.pow(x1-x2,2)+
                Math.pow(y1-y2,2),
                0.5);
        }
    },
    //将出口也看作标志牌
    findPath:function(startX, startY, endX, endY, grid) {
        //标志牌类型：
        // 0：终点指示牌 i,j
        // 1：指引方向   i,j,a
        //可以通过数组长度判断是那种类型的指示牌
        this.boards=this.computeBoards(endX, endY, grid);
        this.disScope=this.computeDisScope(startX, startY, endX, endY);

        var openList = new Heap(function(nodeA, nodeB) {
                return nodeA.f - nodeB.f;
            }),
            startNode = grid.getNodeAt(startX, startY),
            endNode = grid.getNodeAt(endX, endY),
            heuristic = this.heuristic,
            diagonalMovement = this.diagonalMovement,
            weight = this.weight,
            abs = Math.abs, SQRT2 = Math.SQRT2,
            node, neighbors, neighbor, i, l, x, y, ng;

        // set the `g` and `f` value of the start node to be 0//将开始节点的“g”和“f”值设置为0
        startNode.g = 0;
        startNode.f = 0;
        //f=g+h//弄清g,h是如何计算的

        // push the start node into the open list//将开始节点推入打开列表
        openList.push(startNode);
        startNode.opened = true;

        // while the open list is not empty//当打开列表不为空时
        while (!openList.empty()) {//openList是待加入区域的列表//openList是一个节点集合
            // pop the position of node which has the minimum `f` value.//弹出具有最小“f”值的节点的位置。
            node = openList.pop();
            node.closed = true;//这个节点已经确定在路径上了

            // if reached the end position, construct the path and return it//如果到达终点位置，构造路径并返回
            if (node === endNode) {
                return Util.backtrace(endNode);//通过节点的parent对象可以很容易得到路径
            }

            // get neigbours of the current node//获得当前节点的邻居
            neighbors = grid.getNeighbors(node, diagonalMovement);//去除障碍物后的邻居
            for (i = 0, l = neighbors.length; i < l; ++i) {//去除障碍物后的长度，没有障碍物就是8
                neighbor = neighbors[i];

                if (neighbor.closed) {//去除已经确定的部分
                    continue;
                }

                x = neighbor.x;
                y = neighbor.y;

                // get the distance between current node and the neighbor //获取当前节点与邻居的距离
                // and calculate the next g score //然后计算下一个g分数
                ng = node.g + ((x - node.x === 0 || y - node.y === 0) ? 1 : SQRT2);//起点验证路径到这里的长度

                // check if the neighbor has not been inspected yet, or
                // can be reached with smaller cost from the current node
                if (!neighbor.opened || ng < neighbor.g) {
                    neighbor.g = ng;//实际代价
                    neighbor.h = neighbor.h || weight * heuristic(abs(x - endX), abs(y - endY));//如果已经计算过就不用再计算了//启发式函数的输入是dx,dy
                    this.computeWeight(node,neighbor);
                    neighbor.parent = node;//设置父节点
                    if (!neighbor.opened) {
                        openList.push(neighbor);
                        neighbor.opened = true;
                    } else {
                        // the neighbor can be reached with smaller cost.//可以以较小的成本联系到邻居。
                        // Since its f value has been updated, we have to//因为它的f值已经更新了，我们必须
                        // update its position in the open list//更新其在打开列表中的位置
                        openList.updateItem(neighbor);
                    }
                }
            } // end for each neighbor
        } // end while not open list empty

        // fail to find the path
        return [];
    },

}
/**
 * Find and return the the path.
 * @return {Array<Array<number>>} The path, including both start and
 *     end positions.
 */


//单独输入标志牌
AStarFinder.prototype.findPath2 = function(startX, startY, endX, endY, grid) {
    var boards;
    if(typeof(grid.boards)!=="undefined")
        boards=grid.boards;
    else{
        boards=[];
        for(var i=0;i<grid.nodes.length;i++)
            for(var j=0;j<grid.nodes.length;j++){
                var angle=grid.nodes[i][j].boardAngle;
                if(typeof(angle)!=="undefined")
                    boards.push([i,j,angle]);
            }
    }

    var openList = new Heap(function(nodeA, nodeB) {
            return nodeA.f - nodeB.f;
        }),
        startNode = grid.getNodeAt(startX, startY),
        endNode = grid.getNodeAt(endX, endY),
        heuristic = this.heuristic,
        diagonalMovement = this.diagonalMovement,
        weight = this.weight,
        abs = Math.abs, SQRT2 = Math.SQRT2,
        node, neighbors, neighbor, i, l, x, y, ng;

    // set the `g` and `f` value of the start node to be 0//将开始节点的“g”和“f”值设置为0
    startNode.g = 0;
    startNode.f = 0;
    //f=g+h//弄清g,h是如何计算的

    // push the start node into the open list//将开始节点推入打开列表
    openList.push(startNode);
    startNode.opened = true;

    // while the open list is not empty//当打开列表不为空时
    while (!openList.empty()) {//openList是待加入区域的列表//openList是一个节点集合
        // pop the position of node which has the minimum `f` value.//弹出具有最小“f”值的节点的位置。
        node = openList.pop();
        node.closed = true;//这个节点已经确定在路径上了

        // if reached the end position, construct the path and return it//如果到达终点位置，构造路径并返回
        if (node === endNode) {
            return Util.backtrace(endNode);//通过节点的parent对象可以很容易得到路径
        }

        // get neigbours of the current node//获得当前节点的邻居
        neighbors = grid.getNeighbors(node, diagonalMovement);//去除障碍物后的邻居
        for (i = 0, l = neighbors.length; i < l; ++i) {//去除障碍物后的长度，没有障碍物就是8
            neighbor = neighbors[i];

            if (neighbor.closed) {//去除已经确定的部分
                continue;
            }

            x = neighbor.x;
            y = neighbor.y;

            // get the distance between current node and the neighbor //获取当前节点与邻居的距离
            // and calculate the next g score //然后计算下一个g分数
            ng = node.g + ((x - node.x === 0 || y - node.y === 0) ? 1 : SQRT2);//起点验证路径到这里的长度

            // check if the neighbor has not been inspected yet, or
            // can be reached with smaller cost from the current node
            if (!neighbor.opened || ng < neighbor.g) {
                neighbor.g = ng;//实际代价
                neighbor.h = neighbor.h || weight * heuristic(abs(x - endX), abs(y - endY));//如果已经计算过就不用再计算了//启发式函数的输入是dx,dy
                if(boards.length>0){
                    //neighbor.l = neighbor.l ||getL(node.x,node.y,x,y);
                    //neighbor.f = (neighbor.g + neighbor.h)*(neighbor.l+0.01);//f=g+h//g是实际代价 h是估计代价

                    //neighbor.l = getL(node.x,node.y,x,y);
                    //neighbor.f = (neighbor.g + neighbor.h)*(neighbor.l+0.01);//f=g+h//g是实际代价 h是估计代价

                    //var k= Math.pow(getDistance(startNode.x,endNode.x,startNode.y,endNode.y), 5)/Math.PI;
                    //neighbor.l = k*getL(node.x,node.y,x,y);
                    //neighbor.f = neighbor.g + neighbor.h+neighbor.l;//f=g+h//g是实际代价 h是估计代价


                    var LD=get_L_D(node.x,node.y,x,y);
                    neighbor.l=LD[0]*40;


                    //var k=Math.exp(-1*LD[1]);
                    var dis_max=
                        getDistance(startNode.x,endNode.x,startNode.y,endNode.y);//(boards.length+1);
                    var k=LD[1]/(dis_max /(boards.length+1));//Math.pow(LD[1],4);
                    if(k<0)k=0;
                    else if(k>1)k=1;

                    neighbor.k=k;//test
                    neighbor.distance_board=LD[1];
                    neighbor.f = k*(neighbor.g + neighbor.h)+(1-k)*neighbor.l;//f=g+h//g是实际代价 h是估计代价



                }else{
                    neighbor.f = neighbor.g + neighbor.h;
                }
                neighbor.parent = node;//设置父节点

                function get_L_D(x1,y1,x2,y2) {
                    var board=getBoard(x2,y2);
                    var da=getDa(x1,y1,x2,y2,board[2]);
                    var distance= getDistance(board[0],x2,board[1],y2);
                    //if(distance===0)distance=0.00001;

                    return [da,distance];//角度差➗距离
                    function getDa(x1,y1,x2,y2,a) {
                        while(a>2*Math.PI)a-=2*Math.PI;
                        var dx=x2-x1;
                        var dy=y2-y1;
                        var angle=Math.atan2(dy,dx);
                        var da=Math.abs(angle-a);
                        if(da>Math.PI)da=Math.abs(2*Math.PI-da);
                        //console.log(angle*180/Math.PI,da*180/Math.PI);
                        return da;
                    }
                    function getBoard(x2,y2) {//boards
                        if(boards.length===0)return null;
                        var dis_min=getDistance(boards[0][0],x2,boards[0][1],y2);
                        var k=0;
                        for(var i=1;i<boards.length;i++){
                            var dis0=getDistance(boards[i][0],x2,boards[i][1],y2);
                            if(dis0<dis_min){
                                dis_min=dis0;
                                k=i;
                            }
                        }
                        return boards[k];
                    }
                }
                function getDistance(x1,x2,y1,y2) {
                    return Math.pow(
                        Math.pow(x1-x2,2)+
                        Math.pow(y1-y2,2),
                        0.5);
                }

                if (!neighbor.opened) {
                    openList.push(neighbor);
                    neighbor.opened = true;
                } else {
                    // the neighbor can be reached with smaller cost.//可以以较小的成本联系到邻居。
                    // Since its f value has been updated, we have to//因为它的f值已经更新了，我们必须
                    // update its position in the open list//更新其在打开列表中的位置

                    openList.updateItem(neighbor);
                }
            }
        } // end for each neighbor
    } // end while not open list empty

    // fail to find the path
    return [];
};

//标志牌在网格上
AStarFinder.prototype.findPath1 = function(startX, startY, endX, endY, grid) {
    var boards=[];
    for(var i=0;i<grid.nodes.length;i++)
        for(var j=0;j<grid.nodes.length;j++){
            var angle=grid.nodes[i][j].boardAngle;
            if(typeof(angle)!=="undefined")
                boards.push([i,j,angle]);
        }

    var openList = new Heap(function(nodeA, nodeB) {
            return nodeA.f - nodeB.f;
        }),
        startNode = grid.getNodeAt(startX, startY),
        endNode = grid.getNodeAt(endX, endY),
        heuristic = this.heuristic,
        diagonalMovement = this.diagonalMovement,
        weight = this.weight,
        abs = Math.abs, SQRT2 = Math.SQRT2,
        node, neighbors, neighbor, i, l, x, y, ng;

    // set the `g` and `f` value of the start node to be 0//将开始节点的“g”和“f”值设置为0
    startNode.g = 0;
    startNode.f = 0;
    //f=g+h//弄清g,h是如何计算的

    // push the start node into the open list//将开始节点推入打开列表
    openList.push(startNode);
    startNode.opened = true;

    // while the open list is not empty//当打开列表不为空时
    while (!openList.empty()) {//openList是待加入区域的列表//openList是一个节点集合
        // pop the position of node which has the minimum `f` value.//弹出具有最小“f”值的节点的位置。
        node = openList.pop();
        node.closed = true;//这个节点已经确定在路径上了

        // if reached the end position, construct the path and return it//如果到达终点位置，构造路径并返回
        if (node === endNode) {
            return Util.backtrace(endNode);//通过节点的parent对象可以很容易得到路径
        }

        // get neigbours of the current node//获得当前节点的邻居
        neighbors = grid.getNeighbors(node, diagonalMovement);//去除障碍物后的邻居
        for (i = 0, l = neighbors.length; i < l; ++i) {//去除障碍物后的长度，没有障碍物就是8
            neighbor = neighbors[i];

            if (neighbor.closed) {//去除已经确定的部分
                continue;
            }

            x = neighbor.x;
            y = neighbor.y;

            // get the distance between current node and the neighbor //获取当前节点与邻居的距离
            // and calculate the next g score //然后计算下一个g分数
            ng = node.g + ((x - node.x === 0 || y - node.y === 0) ? 1 : SQRT2);//起点验证路径到这里的长度

            // check if the neighbor has not been inspected yet, or
            // can be reached with smaller cost from the current node
            if (!neighbor.opened || ng < neighbor.g) {
                neighbor.g = ng;//实际代价
                neighbor.h = neighbor.h || weight * heuristic(abs(x - endX), abs(y - endY));//如果已经计算过就不用再计算了//启发式函数的输入是dx,dy
                if(boards.length>0){
                    //neighbor.l = neighbor.l ||getL(node.x,node.y,x,y);
                    //neighbor.f = (neighbor.g + neighbor.h)*(neighbor.l+0.01);//f=g+h//g是实际代价 h是估计代价

                    //neighbor.l = getL(node.x,node.y,x,y);
                    //neighbor.f = (neighbor.g + neighbor.h)*(neighbor.l+0.01);//f=g+h//g是实际代价 h是估计代价

                    //var k= Math.pow(getDistance(startNode.x,endNode.x,startNode.y,endNode.y), 5)/Math.PI;
                    //neighbor.l = k*getL(node.x,node.y,x,y);
                    //neighbor.f = neighbor.g + neighbor.h+neighbor.l;//f=g+h//g是实际代价 h是估计代价


                    var LD=get_L_D(node.x,node.y,x,y);
                    neighbor.l=LD[0]*40;


                    //var k=Math.exp(-1*LD[1]);
                    var dis_max=
                        getDistance(startNode.x,endNode.x,startNode.y,endNode.y);//(boards.length+1);
                    var k=LD[1]/(dis_max /(boards.length+1));//Math.pow(LD[1],4);
                    if(k<0)k=0;
                    else if(k>1)k=1;

                    neighbor.k=k;//test
                    neighbor.distance_board=LD[1];
                    neighbor.f = k*(neighbor.g + neighbor.h)+(1-k)*neighbor.l;//f=g+h//g是实际代价 h是估计代价



                }else{
                    neighbor.f = neighbor.g + neighbor.h;
                }
                neighbor.parent = node;//设置父节点

                function get_L_D(x1,y1,x2,y2) {
                    var board=getBoard(x2,y2);
                    var da=getDa(x1,y1,x2,y2,board[2]);
                    var distance= getDistance(board[0],x2,board[1],y2);
                    //if(distance===0)distance=0.00001;

                    return [da,distance];//角度差➗距离
                    function getDa(x1,y1,x2,y2,a) {
                        while(a>2*Math.PI)a-=2*Math.PI;
                        var dx=x2-x1;
                        var dy=y2-y1;
                        var angle=Math.atan2(dy,dx);
                        var da=Math.abs(angle-a);
                        if(da>Math.PI)da=Math.abs(2*Math.PI-da);
                        //console.log(angle*180/Math.PI,da*180/Math.PI);
                        return da;
                    }
                    function getBoard(x2,y2) {//boards
                        if(boards.length===0)return null;
                        var dis_min=getDistance(boards[0][0],x2,boards[0][1],y2);
                        var k=0;
                        for(var i=1;i<boards.length;i++){
                            var dis0=getDistance(boards[i][0],x2,boards[i][1],y2);
                            if(dis0<dis_min){
                                dis_min=dis0;
                                k=i;
                            }
                        }
                        return boards[k];
                    }
                }
                function getDistance(x1,x2,y1,y2) {
                    return Math.pow(
                        Math.pow(x1-x2,2)+
                        Math.pow(y1-y2,2),
                        0.5);
                }

                if (!neighbor.opened) {
                    openList.push(neighbor);
                    neighbor.opened = true;
                } else {
                    // the neighbor can be reached with smaller cost.//可以以较小的成本联系到邻居。
                    // Since its f value has been updated, we have to//因为它的f值已经更新了，我们必须
                    // update its position in the open list//更新其在打开列表中的位置

                    openList.updateItem(neighbor);
                }
            }
        } // end for each neighbor
    } // end while not open list empty

    // fail to find the path
    return [];
};
AStarFinder.prototype.findPath0 = function(startX, startY, endX, endY, grid) {
    var openList = new Heap(function(nodeA, nodeB) {
            return nodeA.f - nodeB.f;
        }),
        startNode = grid.getNodeAt(startX, startY),
        endNode = grid.getNodeAt(endX, endY),
        heuristic = this.heuristic,
        diagonalMovement = this.diagonalMovement,
        weight = this.weight,
        abs = Math.abs, SQRT2 = Math.SQRT2,
        node, neighbors, neighbor, i, l, x, y, ng;

    // set the `g` and `f` value of the start node to be 0//将开始节点的“g”和“f”值设置为0
    startNode.g = 0;
    startNode.f = 0;

    // push the start node into the open list//将开始节点推入打开列表
    openList.push(startNode);
    startNode.opened = true;

    // while the open list is not empty//当打开列表不为空时
    while (!openList.empty()) {
        //openList是一个节点集合
        // pop the position of node which has the minimum `f` value.//弹出具有最小“f”值的节点的位置。
        node = openList.pop();
        node.closed = true;//这个节点已经确定在路径上了

        // if reached the end position, construct the path and return it//如果到达终点位置，构造路径并返回
        if (node === endNode) {
            return Util.backtrace(endNode);
        }

        // get neigbours of the current node
        neighbors = grid.getNeighbors(node, diagonalMovement);
        for (i = 0, l = neighbors.length; i < l; ++i) {
            neighbor = neighbors[i];

            if (neighbor.closed) {
                continue;
            }

            x = neighbor.x;
            y = neighbor.y;

            // get the distance between current node and the neighbor //获取当前节点与邻居的距离
            // and calculate the next g score //然后计算下一个g分数
            ng = node.g + ((x - node.x === 0 || y - node.y === 0) ? 1 : SQRT2);

            // check if the neighbor has not been inspected yet, or
            // can be reached with smaller cost from the current node
            if (!neighbor.opened || ng < neighbor.g) {
                neighbor.g = ng;//实际代价
                neighbor.h = neighbor.h || weight * heuristic(abs(x - endX), abs(y - endY));//启发式函数的输入是dx,dy
                neighbor.f = neighbor.g + neighbor.h;//f(n)=g(n)+h(n)//g是实际代价 h是估计代价
                neighbor.parent = node;//设置父节点

                if (!neighbor.opened) {
                    openList.push(neighbor);
                    neighbor.opened = true;
                } else {
                    // the neighbor can be reached with smaller cost.//可以以较小的成本联系到邻居。
                    // Since its f value has been updated, we have to//因为它的f值已经更新了，我们必须
                    // update its position in the open list//更新其在打开列表中的位置

                    openList.updateItem(neighbor);
                }
            }
        } // end for each neighbor
    } // end while not open list empty

    // fail to find the path
    return [];
};

module.exports = AStarFinder;
