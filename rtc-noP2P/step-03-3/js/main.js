'use strict';

var localConnection;
var remoteConnection;
var sendChannel;
var receiveChannel;
var pcConstraint;
var dataConstraint;


//开始创建连接
var servers = null;
pcConstraint = null;
dataConstraint = null;

//接收？
localConnection = new RTCPeerConnection(servers, pcConstraint);//对于SCTP，可靠且有序的交付默认为true。
sendChannel = localConnection.createDataChannel('sendDataChannel', dataConstraint);
localConnection.onicecandidate = iceCallback1;

//发送 ？
remoteConnection = new RTCPeerConnection(servers, pcConstraint);
remoteConnection.onicecandidate = iceCallback2;
remoteConnection.ondatachannel = event=>{
  receiveChannel = event.channel;
  receiveChannel.onmessage = (event)=>console.log("receive:",event.data);
};

localConnection.createOffer().then(
    gotDescription1,
    e=>console.log(e)
);

var time=0
setInterval(()=>{
  sendChannel.send(time);
  time++
},1000)
//完成创建连接

function gotDescription1(desc) {
  localConnection.setLocalDescription(desc);
  console.log('Offer from localConnection \n' + desc.sdp);
  remoteConnection.setRemoteDescription(desc);
  remoteConnection.createAnswer().then(
    gotDescription2,
    e=>console.log(e)
  );
}

function gotDescription2(desc) {
  remoteConnection.setLocalDescription(desc);
  localConnection.setRemoteDescription(desc);
}

function iceCallback1(event) {
  if (event.candidate) {
    remoteConnection.addIceCandidate(
      event.candidate
    ).then(
        ()=>console.log('AddIceCandidate success.'),
        (e)=>console.log('Failed to add Ice Candidate: ',e)
    );
    console.log('Local ICE candidate: \n' + event.candidate.candidate);
  }
}

function iceCallback2(event) {
  if (event.candidate) {
    localConnection.addIceCandidate(
      event.candidate
    ).then(
        ()=>console.log('AddIceCandidate success.'),
        (e)=>console.log('Failed to add Ice Candidate: ',e)
    );
    console.log('Remote ICE candidate: \n ' + event.candidate.candidate);
  }
}

