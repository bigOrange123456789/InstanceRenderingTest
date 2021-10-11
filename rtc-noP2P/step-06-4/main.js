var configuration = null;
var isInitiator;
var room = "room001"

// Connect to the signaling server
var socket = io.connect();
socket.on('created', ()=> {
    isInitiator = true;
})
socket.on('joined', ()=> {
    isInitiator = false;
    createPeerConnection(isInitiator, configuration)
})
socket.on('ready',  ()=> {
    createPeerConnection(isInitiator, configuration)
})
socket.on('message', message=> {//用于接收SDP和candidate
    signalingMessageCallback(message)
})
socket.emit('create or join', room)

function sendMessage(message) {
    socket.emit('message', message)//用于发送SDP和candidate
}
/****************************************************************************
 * WebRTC peer connection and data channel
 ****************************************************************************/
var peerConn
var dataChannel
function signalingMessageCallback(message) {
    if (message.type === 'offer') {
        console.log('receive offer : set remote sdp & create answer')
        peerConn.setRemoteDescription(new RTCSessionDescription(message), function() {}, logError)
        peerConn.createAnswer(desc =>{
            console.log('set local sdp')
            peerConn.setLocalDescription(desc).then(function() {
                console.log('send local sdp')
                sendMessage(peerConn.localDescription)
            }).catch(logError)
        }, logError)
    } else if (message.type === 'answer') {
        console.log('receive answer : set remote sdp')
        peerConn.setRemoteDescription(new RTCSessionDescription(message), function() {}, logError)
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
function createPeerConnection(isInitiator, config) {
    console.log('Creating Peer connection')
    peerConn = new RTCPeerConnection(config)
    peerConn.onicecandidate = function(event) {
        if (event.candidate) {
            console.log("on candidate : send candidate")
            sendMessage({
                type: 'candidate',
                label: event.candidate.sdpMLineIndex,
                id: event.candidate.sdpMid,
                candidate: event.candidate.candidate
            })
        } else {
            console.log('on candidate : End of candidates.')
        }
    }
    if (isInitiator) {
        console.log('Creating Channel')
        dataChannel = peerConn.createDataChannel('photos')
        onDataChannelCreated(dataChannel)
        console.log('creating offer')
        peerConn.createOffer().then(function(offer) {
            console.log('set local sdp')
            return peerConn.setLocalDescription(offer)
        }).then(() => {
            console.log('send local sdp')
            sendMessage(peerConn.localDescription)
        }).catch(logError)
    } else {
        peerConn.ondatachannel = function(event) {
            console.log('get channel')
            dataChannel = event.channel
            onDataChannelCreated(dataChannel)
        }
    }
}
function onDataChannelCreated(channel) {
    channel.onopen = ()=>{
        console.log('channel opened!!!!!!!!!!!!!!!!!')
        window.send=channel.send
    }
    channel.onclose = ()=>console.log('Channel closed')
    channel.onmessage=message=>console.log("message",message)
}

/****************************************************************************
 * Aux functions, mostly UI-related
 ****************************************************************************/
function logError(err) {
    if (!err) return
    if (typeof err === 'string') {
        console.warn(err)
    } else {
        console.warn(err.toString(), err)
    }
}
