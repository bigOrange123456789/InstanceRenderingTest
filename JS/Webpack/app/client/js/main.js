$(document).ready(function() {
    if (!Raphael.svg) {
        window.location = './notsupported.html';
    }

    // suppress select events
    $(window).bind('selectstart', function(event) {
        event.preventDefault();
    });

    // initialize visualization
    Panel.init();
    Controller.init();

    window.onload = function () {
        var url = "map.json"/*json文件url，本地的就写本地的位置，如果是服务器的就写服务器的路径*/
        var request = new XMLHttpRequest();
        request.open("get", url);/*设置请求方法与路径*/
        request.send(null);/*不发送数据到服务器*/
        request.onload = function () {/*XHR对象获取到返回信息后执行*/
            if (request.status === 200) {/*返回状态为200，即为数据获取成功*/
                var json = JSON.parse(request.responseText);
                console.log(json);
                var arr=json.data;
                var max=arr[0],min=arr[0];
                console.log("min:",min,"max:",max)
                for(i=1;i<arr.length-1;i++){
                    for(j=0;j<2;j++)
                        if(arr[i][j]>max[j])max[j]=arr[i][j];
                    for(j=0;j<2;j++)
                        if(arr[i][j]<min[j])min[j]=arr[i][j];
                }
                console.log("min:",min,"max:",max)
                setTimeout(function () {
                    for(var i=0;i<arr.length-1;i++){
                        Controller.grid.setWalkableAt(arr[i][0],arr[i][1],false);
                        View.setWalkableAt(arr[i][0],arr[i][1],false);
                    }
                },15000);
            }
        }
    }
});
