//开始创建连接
var localConnection = new RTCPeerConnection(null, null);//对于SCTP，可靠且有序的交付默认为true。
var sendChannel = localConnection.createDataChannel('sendDataChannel', null);
localConnection.onicecandidate = event=> {
    if (event.candidate) {
        localConnection.addIceCandidate(
            event.candidate
        ).then(
            ()=>console.log('AddIceCandidate1 success.',event.candidate),
            (e)=>console.log('Failed to add Ice Candidate: ',e)
        );
        console.log('Remote ICE candidate: \n ' + event.candidate.candidate);
    }
}

var remoteConnection = new RTCPeerConnection(null, null);
remoteConnection.onicecandidate = event =>{
    if (event.candidate) {
        localConnection.addIceCandidate(
            event.candidate
        ).then(
            ()=>console.log('AddIceCandidate success.'),
            (e)=>console.log('Failed to add Ice Candidate: ',e)
        );
        console.log('Remote ICE candidate: \n ' + event.candidate.candidate);
    }
};
remoteConnection.ondatachannel = event=>{
    var receiveChannel = event.channel;
    receiveChannel.onmessage = (event)=>console.log("receive:",event.data);
};

localConnection.createOffer().then(
    desc =>{
        localConnection.setLocalDescription(desc);
        console.log('Offer from localConnection \n' + desc.sdp);
        remoteConnection.setRemoteDescription(desc);
        remoteConnection.createAnswer().then(
            desc0 =>{
                remoteConnection.setLocalDescription(desc0);
                localConnection.setRemoteDescription(desc0);
            },
            e=>console.log(e)
        );
    },
    e=>console.log(e)
)

setTimeout(()=>{
    sendChannel.send(123);
},100)

//完成创建连接
