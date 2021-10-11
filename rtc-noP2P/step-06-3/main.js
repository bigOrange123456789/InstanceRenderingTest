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
    createPeerConnection(isInitiator, configuration);
})
socket.on('ready',  ()=> {
    createPeerConnection(isInitiator, configuration);
})
socket.on('message', message=> {//用于接收SDP和candidate
    signalingMessageCallback(message)
})

socket.emit('create or join', room);

function sendMessage(message) {
    console.log("send:",message)
    socket.emit('message', message)//用于发送SDP和candidate
}

/****************************************************************************
 * WebRTC peer connection and data channel
 ****************************************************************************/

var peerConn;
var dataChannel;

function signalingMessageCallback(message) {
    if (message.type === 'offer') {
        console.log('Got offer. Sending answer to peer.');
        peerConn.setRemoteDescription(new RTCSessionDescription(message), function() {},
            logError);
        peerConn.createAnswer(onLocalSessionCreated, logError);

    } else if (message.type === 'answer') {
        console.log('Got answer.');
        peerConn.setRemoteDescription(new RTCSessionDescription(message), function() {},
            logError);

    } else if (message.type === 'candidate') {
        peerConn.addIceCandidate(new RTCIceCandidate({
            candidate: message.candidate,
            sdpMLineIndex: message.label,
            sdpMid: message.id
        }));

    }
}

function createPeerConnection(isInitiator, config) {
    console.log('Creating Peer connection as initiator?', isInitiator, 'config:',
        config);
    peerConn = new RTCPeerConnection(config);

// send any ice candidates to the other peer
    peerConn.onicecandidate = function(event) {
        console.log('icecandidate event:', event);
        if (event.candidate) {
            sendMessage({
                type: 'candidate',
                label: event.candidate.sdpMLineIndex,
                id: event.candidate.sdpMid,
                candidate: event.candidate.candidate
            });
        } else {
            console.log('End of candidates.');
        }
    };

    if (isInitiator) {
        console.log('Creating Data Channel');
        dataChannel = peerConn.createDataChannel('photos');
        onDataChannelCreated(dataChannel);

        console.log('Creating an offer');
        peerConn.createOffer().then(function(offer) {
            return peerConn.setLocalDescription(offer);
        })
            .then(() => {
                console.log('sending local desc:', peerConn.localDescription);
                sendMessage(peerConn.localDescription);
            })
            .catch(logError);

    } else {
        peerConn.ondatachannel = function(event) {
            console.log('ondatachannel:', event.channel);
            dataChannel = event.channel;
            onDataChannelCreated(dataChannel);
        };
    }
}

function onLocalSessionCreated(desc) {
    console.log('local session created:', desc);
    peerConn.setLocalDescription(desc).then(function() {
        console.log('sending local desc:', peerConn.localDescription);
        sendMessage(peerConn.localDescription);
    }).catch(logError);
}

function onDataChannelCreated(channel) {
    console.log('onDataChannelCreated:', channel);
    window.channel=channel
    channel.onopen = function() {
        console.log('CHANNEL opened!!!!!!!!!!!!!!!!!')
    }
    channel.onclose = function () {
        console.log('Channel closed.');
    }
    channel.onmessage=(message)=>{
        console.log("message",message)
    }
}

/****************************************************************************
 * Aux functions, mostly UI-related
 ****************************************************************************/

function randomToken() {
    return Math.floor((1 + Math.random()) * 1e16).toString(16).substring(1);
}

function logError(err) {
    if (!err) return;
    if (typeof err === 'string') {
        console.warn(err);
    } else {
        console.warn(err.toString(), err);
    }
}
