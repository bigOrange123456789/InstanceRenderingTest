var localConnection = new RTCPeerConnection(null, null);//创建一个RTCPeerConnection对象.对于SCTP，可靠且有序的交付默认为true。
var sendChannel = localConnection.createDataChannel('sendDataChannel', null);
localConnection.onicecandidate = event=> {//网络候选变得可用时，调用此函数。
    if (event.candidate) {
        localConnection.addIceCandidate(
            event.candidate
        ).then(
            ()=>console.log('AddIceCandidate1 success.',event.candidate),
            (e)=>console.log('Failed to add Ice Candidate: ',e)
        )
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
    }
};
remoteConnection.ondatachannel = event=>{
    var receiveChannel = event.channel;
    receiveChannel.onmessage = (event)=>console.log("receive:",event.data);
};

localConnection.createOffer().then(
    desc =>{
        localConnection.setLocalDescription(desc);//desc.sdp
        remoteConnection.setRemoteDescription(desc);
        remoteConnection.createAnswer().then(
            desc0 =>{
                remoteConnection.setLocalDescription(desc0);//desc0.sdp
                localConnection.setRemoteDescription(desc0);
            },
            e=>console.log(e)
        )
    },
    e=>console.log(e)
)

sendChannel.onopen=(event)=>{
    console.log("sendChannel.onopen",event)
    sendChannel.send(123);
}
