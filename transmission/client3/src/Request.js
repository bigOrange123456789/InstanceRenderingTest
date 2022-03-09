import {DataParser} from "./DataParser.js";

export {Request};
class Request{
    ModelHasBeenLoaded;
    startTime;
    synTotalDelay;
    synTotalTimes;
    constructor() {
        this.ModelHasBeenLoaded = [];
        this.startTime = performance.now();
        this.synTotalDelay=0;//总的请求延迟
        this.synTotalTimes=0;//总的请求次数
        this.myDataParser=new DataParser();
    }

    requestModelPackage(visibleList, type) {//检测可视列表中哪些已经在场景中了，只加载不再场景中的//获取模型资源
        var NUM_PACKAGE = 100;

        let packSize = 0;
        let postData = "";
        let tempModelArr = visibleList.split('/');
        for (let i = 0; i < tempModelArr.length - 1; i++) {
            if (this.ModelHasBeenLoaded.indexOf(tempModelArr[i]) === -1) {
                postData += tempModelArr[i] + '/';
                packSize++;
            }
            if (packSize >= NUM_PACKAGE || i === tempModelArr.length - 2) {
                if (postData.length !== 0) {
                    this.requestModelPackageByHttp(postData, type);
                    packSize = 0;
                    postData = "";
                }
            }
        }
    }

    //通过http请求获取模型数据包
    requestModelPackageByHttp(visibleList, type) {
        var scope=this;
        var oReq = new XMLHttpRequest();
        oReq.open("POST", `http://${assetHost}:${assetPort}`, true);
        oReq.responseType = "arraybuffer";

        oReq.onload = function (oEvent) {
            //console.log(oReq.response)
            let data = new Uint8Array(oReq.response);
            var headLength= parseInt(ab2str(data.slice(0, 10)));

            //console.log(headLength)
            // glb file length info
            let glbLengthData = ab2str(data.slice(10,10+ headLength-1));//数据包头部
            function ab2str(buf) {
                return String.fromCharCode.apply(null, new Uint8Array(buf));
            }
            //glb file
            let glbData = data.slice(10+ headLength);//数据包内容

            let glbLengthArr = glbLengthData.split('/');//将头部进行划分
            //console.log(glbLengthArr)
            let totalLength = 0;

            for (let i = 0; i < glbLengthArr.length - 1; i++) {//通过头部缺点模型个数
                if (!glbLengthArr[i])continue;//文件大小

                let buffer = glbData.slice(totalLength, totalLength + 1.0 * glbLengthArr[i]);//将内容进行划分
                scope.myDataParser.parser(buffer, i === glbLengthArr.length - 2);
                totalLength += 1.0 * glbLengthArr[i];
            }
            //if(myCallback_get)myCallback_get();//myCallback_pop,myCallback_get//收到一个数据包后再请求对方发一个数据包

            var endTime = performance.now();
            var tempDelay = (endTime - scope.startTime) / 1000;
            scope.synTotalDelay += tempDelay;
            //console.log("响应间隔：" + tempDelay.toFixed(2) + "S");
            scope.startTime = endTime;
            //type用于区分可视列表的来源，1：peer 2：服务器
            /*if (type === 1) {

                synFromPeerTimes++;
            } else {
                synTotalTimes++;
                synFromServerTimes++;
            }
            */
            scope.synTotalTimes++;
        };
        oReq.send(JSON.stringify({ 'type': 'requestdata', 'scene': sceneName, 'data': visibleList }));
    }


}
