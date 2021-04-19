//function doNothing(){window.event.returnValue=false;}
$(document).ready(function() {
    var xMin=0;//-39;//
    var yMin=0;//112;//
    Panel.init();
    Controller.init();

    var names=[
        'FJK-1 S Dir-map.json',
        'FJK-1 S Dir-map反方向.json',
        'FJK-1 S Dir-sub1-map.json',
        'FJK-1 S Dir-sub2-map.json',
        'HSY 200 S Dir-map.json',
        'HSY 200 S Dir-map反方向.json',
        'HSY 200-1 S Dir-map.json',
        'HSY 200-1 S Dir-map反方向.json',
        'HSY 400 S Dir-map.json',
        'HSY 400 S Dir-map反方向.json',
        'HSY 400 论文对比 S Dir-map.json',
        'HSY 400 论文对比 S Dir-map反方向.json',
        'HSY 400 论文对比 分块 B Dir－map.json',
    ];
    for(var i=0;i<names.length;i++){
        document.getElementById("map"+i).innerHTML=names[i];
        document.getElementById("map"+i).fileName=names[i];
        document.getElementById("map"+i).onclick=function(){loadMap0(this.fileName);};
    }
    document.getElementById("download").onclick=function(){
        //console.log(Controller.grid);
        var arr=[];
        var board=[];
        var nodes=Controller.grid.nodes;
        for(var i=0;i<nodes.length;i++)
            for(var j=0;j<nodes[i].length;j++){
                if(!nodes[i][j].walkable)
                    arr.push([
                        nodes[i][j].x+xMin,
                        nodes[i][j].y+yMin
                    ])
                if(typeof (nodes[i][j].boardAngle)!=="undefined")
                    board.push([
                        i,j,
                        nodes[i][j].boardAngle
                    ])
        }
        console.log(arr)
        var json={};
        json.data=arr;
        json.start=[Controller.startX, Controller.startY];
        json.end=[Controller.endX, Controller.endY];
        json.board=board;

        let link = document.createElement('a');
        link.style.display = 'none';
        document.body.appendChild(link);
        link.href = URL.createObjectURL(new Blob([JSON.stringify(json)], { type: 'text/plain' }));
        link.download ="map.json";
        link.click();

    };
    document.getElementById("savePath").onclick=function () {
        let link = document.createElement('a');
        link.style.display = 'none';
        document.body.appendChild(link);
        link.href = URL.createObjectURL(new Blob([JSON.stringify({data:Controller.path})], { type: 'text/plain' }));
        link.download ="path.json";
        link.click();
    }
    function loadMap0(url) {
        var request = new XMLHttpRequest();
        request.open("get", url);/*设置请求方法与路径*/
        request.send(null);/*不发送数据到服务器*/
        request.onload = function () {/*XHR对象获取到返回信息后执行*/
            if (request.status === 200) {/*返回状态为200，即为数据获取成功*/
                var json = JSON.parse(request.responseText);
                var arr=json.data;
                console.log(arr);
                var max=[arr[0][0],arr[0][1]],
                    min=[arr[0][0],arr[0][1]];
                for(i=1;i<arr.length;i++){
                    for(j=0;j<2;j++)
                        if(arr[i][j]!==null)if(arr[i][j]>max[j])max[j]=arr[i][j];
                    for(j=0;j<2;j++)
                        if(arr[i][j]!==null)if(arr[i][j]<min[j])min[j]=arr[i][j];
                }
                console.log("min:",min,"max:",max)
                for(var i=0;i<arr.length;i++)
                    if(arr[i][0]!==null&&arr[i][1]!==null){
                        arr[i][0]-=xMin;
                        arr[i][1]-=yMin;
                        Controller.grid.setWalkableAt(arr[i][0],arr[i][1],false);
                        View.setAttributeAt(arr[i][0],arr[i][1],'walkable',false);
                }
                var start=json.start;
                var end=json.end;
                if(start)Controller.setStartPos(start[0],start[1]);
                if(end)Controller.setEndPos(end[0],end[1]);
            }
        }
    }
});
