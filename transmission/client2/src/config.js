let ipconfig ='100.67.74.153'//'100.67.124.45';// '101.132.25.75'
//unity视点服务器：cgm的端口是8081； demo1的端口是8082；
let host = ipconfig;
let port;
if(sceneName==="cgm")port= 8081;
else if(sceneName==="szt")port= 8082;
else if(sceneName==="demo3")port= 8083;
else alert("请检查这个场景名："+sceneName)
//资源服务器的端口是9091
let assetHost = ipconfig, assetPort = 9091;
//P2P服务器的端口是9092
let p2pHost = ipconfig, p2pPort = 9092;
//测试时间60秒
let browsingtime=600000;
//let userName="user_x";//prompt("请输入您的姓名", "");
//document.getElementById("inputUserName").onclick=function (){userName=prompt("请输入您的姓名", "");}
