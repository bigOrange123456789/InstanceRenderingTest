import {getTracks} from "./globals.js";
export{PeerInitiator}
var defaults = {};
function setSdpConstraints(config) {
    var sdpConstraints = {
        OfferToReceiveAudio: !!config.OfferToReceiveAudio,
        OfferToReceiveVideo: !!config.OfferToReceiveVideo
    };

    return sdpConstraints;
}

function PeerInitiator(config) {

    RTCSessionDescription = window.RTCSessionDescription || window.mozRTCSessionDescription;
    MediaStreamTrack = window.MediaStreamTrack;

    var connection = config.rtcMultiConnection;

    this.extra = config.remoteSdp ? config.remoteSdp.extra : connection.extra;
    this.userid = config.userid;
    this.streams = [];
    this.channels = config.channels || [];
    this.connectionDescription = config.connectionDescription;

    this.addStream = function(session) {
        connection.addStream(session, self.userid);
    };

    var self = this;

    if (config.remoteSdp) {
        this.connectionDescription = config.remoteSdp.connectionDescription;
    }

    var allRemoteStreams = {};

    defaults.sdpConstraints = setSdpConstraints({
        OfferToReceiveAudio: true,
        OfferToReceiveVideo: true
    });

    var peer;

    var renegotiatingPeer = !!config.renegotiatingPeer;
    if (config.remoteSdp) {
        renegotiatingPeer = !!config.remoteSdp.renegotiatingPeer;
    }

    var localStreams = [];
    connection.attachStreams.forEach(function(stream) {
        if (!!stream) {
            localStreams.push(stream);
        }
    });

    if (!renegotiatingPeer) {
        var iceTransports = 'all';

        try {
            // ref: developer.mozilla.org/en-US/docs/Web/API/RTCConfiguration
            var params = {
                iceServers: connection.iceServers,
                iceTransportPolicy: connection.iceTransportPolicy || iceTransports
            };

            if (typeof connection.bundlePolicy !== 'undefined') {
                params.bundlePolicy = connection.bundlePolicy;
            }

            if (typeof connection.rtcpMuxPolicy !== 'undefined') {
                params.rtcpMuxPolicy = connection.rtcpMuxPolicy;
            }

            if (!!connection.sdpSemantics) {
                params.sdpSemantics = connection.sdpSemantics || 'unified-plan';
            }

            if (!connection.iceServers || !connection.iceServers.length) {
                params = null;
                connection.optionalArgument = null;
            }

            peer = new RTCPeerConnection(params, connection.optionalArgument);
        } catch (e) {
            try {
                var params = {
                    iceServers: connection.iceServers
                };

                peer = new RTCPeerConnection(params);
            } catch (e) {
                peer = new RTCPeerConnection();
            }
        }
    } else {
        peer = config.peerRef;
    }

    if (!peer.getRemoteStreams && peer.getReceivers) {
        peer.getRemoteStreams = function() {
            var stream = new MediaStream();
            peer.getReceivers().forEach(function(receiver) {
                stream.addTrack(receiver.track);
            });
            return [stream];
        };
    }

    if (!peer.getLocalStreams && peer.getSenders) {
        peer.getLocalStreams = function() {
            var stream = new MediaStream();
            peer.getSenders().forEach(function(sender) {
                stream.addTrack(sender.track);
            });
            return [stream];
        };
    }

    peer.onicecandidate = function(event) {
        console.log("event.candidate",event.candidate===null,event.candidate)

        if (!event.candidate) {
            if (!connection.trickleIce) {
                var localSdp = peer.localDescription;
                config.onLocalSdp({
                    type: localSdp.type,
                    sdp: localSdp.sdp,
                    remotePeerSdpConstraints: config.remotePeerSdpConstraints || false,
                    renegotiatingPeer: !!config.renegotiatingPeer || false,
                    connectionDescription: self.connectionDescription,
                    dontGetRemoteStream: !!config.dontGetRemoteStream,
                    extra: connection ? connection.extra : {},
                    streamsToShare: streamsToShare
                })
            }
        }
    };

    localStreams.forEach(function(localStream) {
        if (config.remoteSdp && config.remoteSdp.remotePeerSdpConstraints && config.remoteSdp.remotePeerSdpConstraints.dontGetRemoteStream) {
            return;
        }

        if (config.dontAttachLocalStream) {
            return;
        }

        localStream = connection.beforeAddingStream(localStream, self);

        if (!localStream) return;

        peer.getLocalStreams().forEach(function(stream) {
            if (localStream && stream.id == localStream.id) {
                localStream = null;
            }
        });

        if (localStream && localStream.getTracks) {
            localStream.getTracks().forEach(function(track) {
                try {
                    // last parameter is redundant for unified-plan
                    // starting from chrome version 72
                    peer.addTrack(track, localStream);
                } catch (e) {}
            });
        }
    });

    peer.oniceconnectionstatechange = peer.onsignalingstatechange = function() {
        var extra = self.extra;
        if (connection.peers[self.userid]) {
            extra = connection.peers[self.userid].extra || extra;
        }

        if (!peer) {
            return;
        }

        config.onPeerStateChanged({
            iceConnectionState: peer.iceConnectionState,
            iceGatheringState: peer.iceGatheringState,
            signalingState: peer.signalingState,
            extra: extra,
            userid: self.userid
        });

        if (peer && peer.iceConnectionState && peer.iceConnectionState.search(/closed|failed/gi) !== -1 && self.streams instanceof Array) {
            self.streams.forEach(function(stream) {
                var streamEvent = connection.streamEvents[stream.id] || {
                    streamid: stream.id,
                    stream: stream,
                    type: 'remote'
                };

                connection.onstreamended(streamEvent);
            });
        }
    };

    var sdpConstraints = {
        OfferToReceiveAudio: !!localStreams.length,
        OfferToReceiveVideo: !!localStreams.length
    };

    if (config.localPeerSdpConstraints) sdpConstraints = config.localPeerSdpConstraints;

    defaults.sdpConstraints = setSdpConstraints(sdpConstraints);

    var dontDuplicate = {};

    peer.ontrack = function(event) {
        if (!event || event.type !== 'track') return;

        event.stream = event.streams[event.streams.length - 1];

        if (!event.stream.id) {
            event.stream.id = event.track.id;
        }

        if (dontDuplicate[event.stream.id] && DetectRTC.browser.name !== 'Safari') {
            if (event.track) {
                event.track.onended = function() { // event.track.onmute =
                    peer && peer.onremovestream(event);
                };
            }
            return;
        }

        dontDuplicate[event.stream.id] = event.stream.id;

        var streamsToShare = {};
        if (config.remoteSdp && config.remoteSdp.streamsToShare) {
            streamsToShare = config.remoteSdp.streamsToShare;
        } else if (config.streamsToShare) {
            streamsToShare = config.streamsToShare;
        }

        var streamToShare = streamsToShare[event.stream.id];
        if (streamToShare) {
            event.stream.isAudio = streamToShare.isAudio;
            event.stream.isVideo = streamToShare.isVideo;
            event.stream.isScreen = streamToShare.isScreen;
        } else {
            event.stream.isVideo = !!getTracks(event.stream, 'video').length;
            event.stream.isAudio = !event.stream.isVideo;
            event.stream.isScreen = false;
        }

        event.stream.streamid = event.stream.id;

        allRemoteStreams[event.stream.id] = event.stream;
        config.onRemoteStream(event.stream);

        event.stream.getTracks().forEach(function(track) {
            track.onended = function() { // track.onmute =
                peer && peer.onremovestream(event);
            };
        });

        event.stream.onremovetrack = function() {
            peer && peer.onremovestream(event);
        };
    };

    peer.onremovestream = function(event) {
        // this event doesn't works anymore
        event.stream.streamid = event.stream.id;

        if (allRemoteStreams[event.stream.id]) {
            delete allRemoteStreams[event.stream.id];
        }

        config.onRemoteStreamRemoved(event.stream);
    };

    if (typeof peer.removeStream !== 'function') {
        // removeStream backward compatibility
        peer.removeStream = function(stream) {
            stream.getTracks().forEach(function(track) {
                peer.removeTrack(track, stream);
            });
        };
    }

    this.addRemoteSdp = function(remoteSdp, cb) {
        cb = cb || function() {};

        if (DetectRTC.browser.name !== 'Safari') {
            remoteSdp.sdp = connection.processSdp(remoteSdp.sdp);
        }
        console.log("setRemoteDescription",remoteSdp)
        peer.setRemoteDescription(new RTCSessionDescription(remoteSdp)).then(
            cb, ()=> cb()
        ).catch(()=> cb());
    };

    var isOfferer = true;

    if (config.remoteSdp) {
        isOfferer = false;
    }

    this.createDataChannel = function() {
        var channel = peer.createDataChannel('sctp', {});
        console.log("channel",channel)
        window.channel=channel
        setChannelEvents(channel);
    };

    if (connection.session.data === true && !renegotiatingPeer) {
        if (!isOfferer) {
            peer.ondatachannel = function(event) {
                var channel = event.channel;
                setChannelEvents(channel);
            };
        } else {
            this.createDataChannel();
        }
    }

    if (config.remoteSdp) {
        if (config.remoteSdp.remotePeerSdpConstraints) {
            sdpConstraints = config.remoteSdp.remotePeerSdpConstraints;
        }
        defaults.sdpConstraints = setSdpConstraints(sdpConstraints);
        this.addRemoteSdp(config.remoteSdp, function() {
            createOfferOrAnswer('createAnswer');
        });
    }

    function setChannelEvents(channel) {
        // force ArrayBuffer in Firefox; which uses "Blob" by default.
        channel.binaryType = 'arraybuffer';

        channel.onmessage = function(event) {
            config.onDataChannelMessage(event.data);
        };

        channel.onopen = function() {
            console.log("channel已经打开！")
            config.onDataChannelOpened(channel);//这个操作会把channel放到channels中
        };

        channel.onerror = function(error) {
            config.onDataChannelError(error);
        };

        channel.onclose = function(event) {
            config.onDataChannelClosed(event);
        };

        channel.internalSend = channel.send;
        channel.send = function(data) {
            if (channel.readyState !== 'open') {
                return;
            }

            channel.internalSend(data);
        };

        peer.channel = channel;
    }

    if (connection.session.audio == 'two-way' || connection.session.video == 'two-way' || connection.session.screen == 'two-way') {
        defaults.sdpConstraints = setSdpConstraints({
            OfferToReceiveAudio: connection.session.audio == 'two-way' || (config.remoteSdp && config.remoteSdp.remotePeerSdpConstraints && config.remoteSdp.remotePeerSdpConstraints.OfferToReceiveAudio),
            OfferToReceiveVideo: connection.session.video == 'two-way' || connection.session.screen == 'two-way' || (config.remoteSdp && config.remoteSdp.remotePeerSdpConstraints && config.remoteSdp.remotePeerSdpConstraints.OfferToReceiveAudio)
        });
    }

    var streamsToShare = {};
    peer.getLocalStreams().forEach(function(stream) {
        streamsToShare[stream.streamid] = {
            isAudio: !!stream.isAudio,
            isVideo: !!stream.isVideo,
            isScreen: !!stream.isScreen
        };
    });

    function createOfferOrAnswer(_method) {//这个函数,每建立一次连接这个函数就被调用2次，通信双方各一次
        peer[_method](defaults.sdpConstraints).then(function(localSdp) {
            console.log("setLocalDescription",localSdp,_method)
            peer.setLocalDescription(localSdp).then(function() {
                if (!connection.trickleIce) return
                config.onLocalSdp({
                    type: localSdp.type,
                    sdp: localSdp.sdp,
                    remotePeerSdpConstraints: config.remotePeerSdpConstraints || false,
                    renegotiatingPeer: !!config.renegotiatingPeer || false,
                    connectionDescription: self.connectionDescription,
                    dontGetRemoteStream: !!config.dontGetRemoteStream,
                    extra: connection ? connection.extra : {},
                    streamsToShare: streamsToShare
                })
                connection.onSettingLocalDescription(self)
            });
        });
    }

    if (isOfferer) {
        createOfferOrAnswer('createOffer');
    }

    peer.nativeClose = peer.close;
    peer.close = function() {
        if (!peer) {
            return;
        }

        try {
            if (peer.nativeClose !== peer.close) {
                peer.nativeClose();
            }
        } catch (e) {}

        peer = null;
        self.peer = null;
    };

    this.peer = peer;
}
