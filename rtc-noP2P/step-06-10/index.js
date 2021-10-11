var myId=''
var otherId=''
// Connect to the signaling server
var socket = io.connect()
socket.on('ready',  (id)=> {//收到一个请求
    otherId=id
    createPeerConnection_answer()
})
socket.on('id',  id=> {
    myId=id
    console.log(id)
})
socket.on('message', data=> {//用于接收SDP和candidate
    if(data.targetType==='answer')
        signalingMessageCallback_answer(data.message)
    else//offer
        signalingMessageCallback_offer(data.message)
})
function sendMessage(message,targetType) {
    socket.emit('message', {
        message:message,
        targetId0:otherId,
        targetType:targetType
    })//用于发送SDP和candidate
}
socket.emit('create or join', "room001")
window.connect0=(id)=>{
    otherId=id
    createPeerConnection_offer()//准备offer
    socket.emit('connect0', {offerId:myId,answerId:otherId})//准备answer
}
/****************************************************************************
 * WebRTC peer connection and data channel
 ****************************************************************************/
var peerConn

function signalingMessageCallback_answer(message) {
    if (message.type === 'answer') {
        peerConn.setRemoteDescription(new RTCSessionDescription(message), function() {}, logError)
    } else if (message.type === 'candidate') {
        peerConn.addIceCandidate(new RTCIceCandidate({
            candidate: message.candidate,
            sdpMLineIndex: message.label,
            sdpMid: message.id
        }))
    }
}
function createPeerConnection_answer() {
    peerConn = new RTCPeerConnection()
    peerConn.onicecandidate = function(event) {
        if (event.candidate) {
            console.log("on candidate : send candidate")
            sendMessage({//向对方发送自己的candidate
                type: 'candidate',
                label: event.candidate.sdpMLineIndex,
                id: event.candidate.sdpMid,
                candidate: event.candidate.candidate,
            },'offer')
        } else {
            console.log('on candidate : End of candidates.')
        }
    }

    onDataChannelCreated(peerConn.createDataChannel('photos'))

    peerConn.createOffer().then(function(offer) {
        return peerConn.setLocalDescription(offer)
    }).then(() => {
        var obj=peerConn.localDescription
        obj.targetId0=otherId
        sendMessage(obj,'offer')
    }).catch(logError)
}
function signalingMessageCallback_offer(message) {
    if (message.type === 'offer') {
        console.log('receive offer : set remote sdp & create answer')
        peerConn.setRemoteDescription(new RTCSessionDescription(message), function() {}, logError)
        peerConn.createAnswer(desc =>{
            console.log('set local sdp')
            peerConn.setLocalDescription(desc).then(function() {
                console.log('send local sdp')
                var obj=peerConn.localDescription
                obj.targetId0=otherId
                sendMessage(obj,'answer')
            }).catch(logError)
        }, logError)
    } else if (message.type === 'candidate') {
        console.log('receive candidate : add candidate')
        console.log(message)
        peerConn.addIceCandidate(new RTCIceCandidate({
            candidate: message.candidate,
            sdpMLineIndex: message.label,
            sdpMid: message.id
        }))
    }
}
function createPeerConnection_offer() {//自己启动
    console.log('Creating Peer connection')
    peerConn = new RTCPeerConnection()
    peerConn.onicecandidate = function(event) {
        if (event.candidate) {
            console.log("on candidate : send candidate")
            sendMessage({
                type: 'candidate',
                label: event.candidate.sdpMLineIndex,
                id: event.candidate.sdpMid,
                candidate: event.candidate.candidate,
                targetId0:otherId
            },'answer')
        } else {
            console.log('on candidate : End of candidates.')
        }
    }
    peerConn.ondatachannel = function(event) {
        onDataChannelCreated(event.channel)
    }
}
/////////////////////////////////////////////////////////////////
function onDataChannelCreated(channel) {
    channel.onopen = ()=>{
        console.log('channel opened!!!!!!!!!!!!!!!!!')
        window.send=channel.send
    }
    channel.onmessage=message=>console.log("message",message)
}

function logError(err) {
}
