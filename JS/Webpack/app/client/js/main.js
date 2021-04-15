$(document).ready(function() {
    var xMin=0;//-39;
    var yMin=0;//112;
    Panel.init();
    Controller.init();

    var names=[
        'FJK_1.vsg',
        'FJK_2.vsg',
        'FJK_3.vsg',
        'HSH_1_100.vsg',
        'HSH_1_200.vsg',
        'HSH_1_300.vsg',
        'HSH_1_400.vsg',
        'grid1',
    ];
    for(var i=0;i<names.length;i++){
        document.getElementById("map"+i).fileName=names[i]+".json";
        document.getElementById("map"+i).onclick=function(){loadMap0(this.fileName);};
    }
    document.getElementById("download").onclick=function(){
        //console.log(Controller.grid);
        var arr=[];
        var nodes=Controller.grid.nodes;
        for(var i=0;i<nodes.length;i++)
            for(var j=0;j<nodes[i].length;j++)
                if(!nodes[i][j].walkable){
                    arr.push([
                    nodes[i][j].x+xMin,
                    nodes[i][j].y+yMin
                ])
        }
        console.log(arr)
        var json={};
        json.data=arr;
        json.start=[Controller.startX, Controller.startY];
        json.end=[Controller.endX, Controller.endY];
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
