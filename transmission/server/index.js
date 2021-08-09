var oReq = new XMLHttpRequest();
oReq.open("POST", "http://localhost:8080", true);
oReq.responseType = "arraybuffer";
oReq.onload = function () {//接收数据
    console.log(String.fromCharCode.apply(null, new Uint8Array(oReq.response)))
};
oReq.send(JSON.stringify({ 'type':'test'}));//发送请求
