/****************************************************************************
 * Initial setup
 ****************************************************************************/
var configuration = null;

var isInitiator;
var room = "room001"

// Connect to the signaling server
var socket = io.connect();
socket.on('created', function (room, clientId) {
    console.log('Created room', room, '- my client ID is', clientId);
    isInitiator = true;
});
socket.on('joined', function (room, clientId) {
    console.log('This peer has joined room', room, 'with client ID', clientId);
    isInitiator = false;
    createPeerConnection(isInitiator, configuration);
});
socket.on('ready', function () {
    console.log('Socket is ready');
    createPeerConnection(isInitiator, configuration);
});
socket.on('message', function (message) {
    console.log('Client received message:', message);
    signalingMessageCallback(message);
});
// Leaving rooms and disconnecting from peers.
socket.on('disconnect', function (reason) {
    console.log(`Disconnected: ${reason}.`);
});

socket.emit('create or join', room);

function sendMessage(message) {
    console.log('Client sending message: ', message);
    socket.emit('message', message);
}

/****************************************************************************
 * WebRTC peer connection and data channel
 ****************************************************************************/

var peerConn;
var dataChannel;

function signalingMessageCallback(message) {
    if (message.type === 'offer') {
        peerConn.setRemoteDescription(new RTCSessionDescription(message))
        peerConn.createAnswer(desc => {
            peerConn.setLocalDescription(desc).then(() =>
                sendMessage(peerConn.localDescription)
            )
        })
    } else if (message.type === 'answer') {
        peerConn.setRemoteDescription(new RTCSessionDescription(message))
    } else if (message.type === 'candidate') {
        peerConn.addIceCandidate(new RTCIceCandidate({
            candidate: message.candidate,
            sdpMLineIndex: message.label,
            sdpMid: message.id
        }))
    }
}

function createPeerConnection(isInitiator, config) {
    peerConn = new RTCPeerConnection(config);
    peerConn.onicecandidate = function (event) {// send any ice candidates to the other peer
        if (event.candidate) {
            sendMessage({
                type: 'candidate',
                label: event.candidate.sdpMLineIndex,
                id: event.candidate.sdpMid,
                candidate: event.candidate.candidate
            })
        } else {
            console.log('End of candidates.');
        }
    }
    if (isInitiator) {
        console.log('Creating Data Channel');
        dataChannel = peerConn.createDataChannel('photos');
        onDataChannelCreated(dataChannel);
        console.log('Creating an offer');
        peerConn.createOffer().then(function (offer) {
            return peerConn.setLocalDescription(offer);
        })
            .then(() => {
                console.log('sending local desc:', peerConn.localDescription);
                sendMessage(peerConn.localDescription);
            })
            .catch(console.warn);

    } else {
        peerConn.ondatachannel = function (event) {
            console.log('ondatachannel:', event.channel);
            dataChannel = event.channel;
            onDataChannelCreated(dataChannel);
        };
    }
    function onDataChannelCreated(channel) {
        channel.onopen = function () {
            for (var i = 0; i < 4; i++)
                channel.send(i)
        }
        channel.onmessage = message => console.log("message.data", message.data)

    }
}

