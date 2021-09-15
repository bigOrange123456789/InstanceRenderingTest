var localConnection = new RTCPeerConnection(null, null);//创建一个RTCPeerConnection对象.对于SCTP，可靠且有序的交付默认为true。
var sendChannel = localConnection.createDataChannel('sendDataChannel', null);
localConnection.onicecandidate = event=>localConnection.addIceCandidate(event.candidate)


var remoteConnection = new RTCPeerConnection(null, null);
remoteConnection.onicecandidate = event => localConnection.addIceCandidate(event.candidate)
remoteConnection.ondatachannel = event=>{
    event.channel.onmessage = message=>console.log(message,message.data);
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
    for(var i=0;i<5;i++)
        sendChannel.send(i)
}
