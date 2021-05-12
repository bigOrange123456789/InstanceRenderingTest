let ipconfig = '47.117.77.217';//'100.66.43.238';
//unity视点服务器：cgm的端口是8081； demo1的端口是8082；
let host = ipconfig, port = (sceneName==="cgm"?8081:8082);
//资源服务器的端口是9091
let assetHost = ipconfig, assetPort = 9091;
//测试时间60秒
let browsingtime=60000;
let userName=prompt("请输入您的姓名", "");