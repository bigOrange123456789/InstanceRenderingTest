/****************************************************************************
* Initial setup
****************************************************************************/

var configuration = null;

// Create a random room if not already present in the URL.
var isInitiator;
var room = window.location.hash.substring(1);
if (!room) {
  room = window.location.hash = randomToken();
}

/****************************************************************************
* Signaling server
****************************************************************************/

// Connect to the signaling server
var socket = io.connect();

socket.on('ipaddr', function(ipaddr) {
  console.log('Server IP address is: ' + ipaddr);
});

socket.on('created', function(room, clientId) {
  console.log('Created room', room, '- my client ID is', clientId);
  isInitiator = true;
});

socket.on('joined', function(room, clientId) {
  console.log('This peer has joined room', room, 'with client ID', clientId);
  isInitiator = false;
  createPeerConnection(isInitiator, configuration);
});

socket.on('full', function(room) {
  alert('Room ' + room + ' is full. We will create a new room for you.');
  window.location.hash = '';
  window.location.reload();
});

socket.on('ready', function() {
  console.log('Socket is ready');
  createPeerConnection(isInitiator, configuration);
});

socket.on('log', function(array) {
  console.log.apply(console, array);
});

socket.on('message', function(message) {
  console.log('Client received message:', message);
  signalingMessageCallback(message);
});

// Joining a room.
socket.emit('create or join', room);

if (location.hostname.match(/localhost|127\.0\.0/)) {
  socket.emit('ipaddr');
}

// Leaving rooms and disconnecting from peers.
socket.on('disconnect', function(reason) {
  console.log(`Disconnected: ${reason}.`);
});

socket.on('bye', function(room) {
  console.log(`Peer leaving room ${room}.`);
  // If peer did not create the room, re-enter to be creator.
  if (!isInitiator) {
    window.location.reload();
  }
});

window.addEventListener('unload', function() {
  console.log(`Unloading window. Notifying peers in ${room}.`);
  socket.emit('bye', room);
});

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
    console.log('CHANNEL opened!!!!!!!!!!!!!!!!!');

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
