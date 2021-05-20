function initWebRTC(str) {
    var rtConnection = new RTCMultiConnection();
    rtConnection.socketURL =  'https://rtcmulticonnection.herokuapp.com:443/';//"http://localhost:9001/"
    rtConnection.enableFileSharing = true; // 准许发送文件
    rtConnection.session = {
        data: true
    };
    rtConnection.onopen = function () {
        setInterval(() => {
            console.log("发送数据：",str)
            rtConnection.send(str)
        }, 1000);
    };
    rtConnection.onmessage = function (event) {
        console.log("收到:",event.data)
    };
    rtConnection.openOrJoin("room001");
}
