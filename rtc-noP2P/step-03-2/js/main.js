'use strict';

var localConnection;
var remoteConnection;
var sendChannel;
var receiveChannel;
var pcConstraint;
var dataConstraint;


//创建连接
createConnection()
function createConnection() {
  var servers = null;
  pcConstraint = null;
  dataConstraint = null;
  console.log('Using SCTP based data channels');
  // For SCTP, reliable and ordered delivery is true by default.
  // Add localConnection to global scope to make it visible
  // from the browser console.
  window.localConnection = localConnection =
      new RTCPeerConnection(servers, pcConstraint);
  console.log('Created local peer connection object localConnection');

  sendChannel = localConnection.createDataChannel('sendDataChannel',
      dataConstraint);
  console.log('Created send data channel');

  localConnection.onicecandidate = iceCallback1;

  // Add remoteConnection to global scope to make it visible
  // from the browser console.
  window.remoteConnection = remoteConnection =
      new RTCPeerConnection(servers, pcConstraint);
  console.log('Created remote peer connection object remoteConnection');

  remoteConnection.onicecandidate = iceCallback2;
  remoteConnection.ondatachannel = receiveChannelCallback;

  localConnection.createOffer().then(
    gotDescription1,
    e=>console.log(e)
  );

  var time=0
  setInterval(()=>{
    sendChannel.send(time);
    time++
  },1000)
}


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
  console.log('local ice callback');
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
  console.log('remote ice callback');
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

//接收数据
function receiveChannelCallback(event) {
  console.log('Receive Channel Callback');
  receiveChannel = event.channel;
  receiveChannel.onmessage = (event)=>console.log("receive:",event.data);
}
