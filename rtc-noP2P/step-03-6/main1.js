var pc1 = new RTCPeerConnection(null, null)//创建一个RTCPeerConnection对象.对于SCTP，可靠且有序的交付默认为true。
var sendChannel = pc1.createDataChannel('channel1', null)
pc1.onicecandidate = event=>pc1.addIceCandidate(event.candidate)


var pc2 = new RTCPeerConnection(null, null)
pc2.onicecandidate = event => pc1.addIceCandidate(event.candidate)
pc2.ondatachannel = event=> event.channel.onmessage = message=>console.log(message.data)


pc1.createOffer().then(
    desc =>{
        pc1.setLocalDescription(desc);//desc.sdp
        pc2.setRemoteDescription(desc);
        pc2.createAnswer().then(
            desc0 =>{
                pc2.setLocalDescription(desc0);//desc0.sdp
                pc1.setRemoteDescription(desc0);
            },
            e=>console.log(e)
        )
    },
    e=>console.log(e)
)

sendChannel.onopen=()=>{
    for(var i=0;i<5;i++)
        sendChannel.send(i)
}
