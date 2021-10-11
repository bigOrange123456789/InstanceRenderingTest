var pc1 = new RTCPeerConnection(null, null)//创建一个RTCPeerConnection对象.对于SCTP，可靠且有序的交付默认为true。
var sendChannel = pc1.createDataChannel('channel1', null)
pc1.onicecandidate = event=>{
    console.log("candidate1",event.candidate)
    pc1.addIceCandidate(event.candidate)

}

var pc2 = new RTCPeerConnection(null, null)
pc2.onicecandidate = event => {
    console.log("candidate2",event.candidate)
    pc1.addIceCandidate(event.candidate)

}
pc2.ondatachannel = event=> event.channel.onmessage = message=>console.log(message.data)

//双向通道有两套协议,需要四次确认
pc1.createOffer().then(
    desc1 =>{
        console.log("desc1",desc1)
        pc1.setLocalDescription(desc1);//desc.sdp
        pc2.setRemoteDescription(desc1);
        pc2.createAnswer().then(
            desc2 =>{
                console.log("desc2",desc2)
                pc2.setLocalDescription(desc2);//desc0.sdp
                pc1.setRemoteDescription(desc2);
            }
        )
    }
)

sendChannel.onopen=()=>{
    for(var i=0;i<5;i++)
        sendChannel.send(i)
}
/**/