import{getRandomString,isData,isUnifiedPlanSupportedDefault}from "./globals.js"
import{SocketConnection}from"./SocketConnection.js"
import{getUserMediaHandler}from"./getUserMediaHandler.js"
import{MultiPeers}from"./MultiPeers.js"
import{DetectRTC_}from"./DetectRTC.js"
import{CodecsHandler_}from"./CodecsHandler.js"

export{RTCMultiConnection}
class RTCMultiConnection{
    constructor(roomid) {
        var DetectRTC=new DetectRTC_()
        var CodecsHandler=new CodecsHandler_()// CodecsHandler.js

        var connection=this

        connection.channel = connection.sessionid = (roomid || location.href.replace(/\/|:|#|\?|\$|\^|%|\.|`|~|!|\+|@|\[|\||]|\|*. /g, '').split('\n').join('').split('\r').join('')) + '';

        var mPeer = new MultiPeers(connection);

        mPeer.onNegotiationNeeded = function(message, remoteUserId, callback) {
            //需要谈判
            callback = callback || function() {};

            remoteUserId = remoteUserId || message.remoteUserId;
            message = message || '';

            // usually a message looks like this
            var messageToDeliver = {
                remoteUserId: remoteUserId,
                message: message,
                sender: connection.userid
            };

            if (message.remoteUserId && message.message && message.sender) {
                // if a code is manually passing required data
                messageToDeliver = message;
            }

            connectSocket(function() {
                connection.socket.emit(connection.socketMessageEvent, messageToDeliver, callback);
            });
        };

        connection.socketOptions = {
            // 'force new connection': true, // For SocketIO version < 1.0
            // 'forceNew': true, // For SocketIO version >= 1.0
            'transport': 'polling' // fixing transport:unknown issues
        };

        function connectSocket(connectCallback) {
            connection.socketAutoReConnect = true;

            if (connection.socket) {
                if (connectCallback) {
                    connectCallback(connection.socket);
                }
            }else{
                new SocketConnection(connection, function(s) {
                    if (connectCallback) {
                        connectCallback(connection.socket);
                    }
                });
            }


        }

        // 1st paramter is roomid
        // 2rd paramter is a callback function
        connection.openOrJoin = function(roomid, callback) {
            callback = callback || function() {};

            connection.checkPresence(roomid, function(isRoomExist, roomid) {
                if (isRoomExist) {//加入房间//如果房间已存在
                    connection.sessionid = roomid;
                    var isOneWay = !!connection.session.oneway;
                    var isDataOnly = isData(connection.session);

                    var remotePeerSdpConstraints = {
                        OfferToReceiveAudio: connection.sdpConstraints.mandatory.OfferToReceiveAudio,
                        OfferToReceiveVideo: connection.sdpConstraints.mandatory.OfferToReceiveVideo
                    }

                    var localPeerSdpConstraints = {
                        OfferToReceiveAudio: isOneWay ? !!connection.session.audio : connection.sdpConstraints.mandatory.OfferToReceiveAudio,
                        OfferToReceiveVideo: isOneWay ? !!connection.session.video || !!connection.session.screen : connection.sdpConstraints.mandatory.OfferToReceiveVideo
                    }

                    var connectionDescription = {
                        remoteUserId: connection.sessionid,
                        message: {
                            newParticipationRequest: true,
                            isOneWay: isOneWay,
                            isDataOnly: isDataOnly,
                            localPeerSdpConstraints: localPeerSdpConstraints,
                            remotePeerSdpConstraints: remotePeerSdpConstraints
                        },
                        sender: connection.userid
                    };
                    joinRoom(connectionDescription, callback);
                }else{//新建房间
                    connection.waitingForLocalMedia = true;
                    connection.isInitiator = true;
                    connection.sessionid = roomid || connection.sessionid;

                    if (isData(connection.session)) {
                        openRoom(callback);
                        return;
                    }

                    connection.captureUserMedia(function() {
                        openRoom(callback);
                    });
                }


            });
        };

        // don't allow someone to join this person until he has the media
        connection.waitingForLocalMedia = false;

        // this object keeps extra-data records for all connected users
        // this object is never cleared so you can always access extra-data even if a user left
        connection.peersBackup = {};

        connection.rejoin = function(connectionDescription) {
            if (connection.isInitiator || !connectionDescription || !Object.keys(connectionDescription).length) {
                return;
            }

            var extra = {};

            if (connection.peers[connectionDescription.remoteUserId]) {
                extra = connection.peers[connectionDescription.remoteUserId].extra;
                connection.deletePeer(connectionDescription.remoteUserId);
            }

            if (connectionDescription && connectionDescription.remoteUserId) {
                connection.join(connectionDescription.remoteUserId);

                connection.onReConnecting({
                    userid: connectionDescription.remoteUserId,
                    extra: extra
                });
            }
        };

        connection.join = function(remoteUserId, options) {
            connection.sessionid = (remoteUserId ? remoteUserId.sessionid || remoteUserId.remoteUserId || remoteUserId : false) || connection.sessionid;
            connection.sessionid += '';

            var localPeerSdpConstraints = false;
            var remotePeerSdpConstraints = false;
            var isOneWay = false;
            var isDataOnly = false;

            if ((remoteUserId && remoteUserId.session) || !remoteUserId || typeof remoteUserId === 'string') {
                var session = remoteUserId ? remoteUserId.session || connection.session : connection.session;
                isOneWay = !!session.oneway;
                isDataOnly = isData(session);
                remotePeerSdpConstraints = {
                    OfferToReceiveAudio: connection.sdpConstraints.mandatory.OfferToReceiveAudio,
                    OfferToReceiveVideo: connection.sdpConstraints.mandatory.OfferToReceiveVideo
                };
                localPeerSdpConstraints = {
                    OfferToReceiveAudio: isOneWay ? !!connection.session.audio : connection.sdpConstraints.mandatory.OfferToReceiveAudio,
                    OfferToReceiveVideo: isOneWay ? !!connection.session.video || !!connection.session.screen : connection.sdpConstraints.mandatory.OfferToReceiveVideo
                };
            }

            options = options || {};

            var cb = function() {};
            if (typeof options === 'function') {
                cb = options;
                options = {};
            }

            if (typeof options.localPeerSdpConstraints !== 'undefined') {
                localPeerSdpConstraints = options.localPeerSdpConstraints;
            }

            if (typeof options.remotePeerSdpConstraints !== 'undefined') {
                remotePeerSdpConstraints = options.remotePeerSdpConstraints;
            }

            if (typeof options.isOneWay !== 'undefined') {
                isOneWay = options.isOneWay;
            }

            if (typeof options.isDataOnly !== 'undefined') {
                isDataOnly = options.isDataOnly;
            }

            var connectionDescription = {
                remoteUserId: connection.sessionid,
                message: {
                    newParticipationRequest: true,
                    isOneWay: isOneWay,
                    isDataOnly: isDataOnly,
                    localPeerSdpConstraints: localPeerSdpConstraints,
                    remotePeerSdpConstraints: remotePeerSdpConstraints
                },
                sender: connection.userid
            };
            connectSocket(function() {
                joinRoom(connectionDescription, cb);
            });
            return connectionDescription;
        };

        function joinRoom(connectionDescription, cb) {
            connection.socket.emit('join-room', {
                sessionid: connection.sessionid,//唯一有用信息
                session: connection.session,
                mediaConstraints: connection.mediaConstraints,
                sdpConstraints: connection.sdpConstraints,
                streams: getStreamInfoForAdmin(),
                extra: connection.extra,
                password: typeof connection.password !== 'undefined' && typeof connection.password !== 'object' ? connection.password : ''
            }, function(isRoomJoined, error) {
                if (isRoomJoined === true) {//已经加入
                    if (connection.enableLogs) {
                        console.log('isRoomJoined: ', isRoomJoined, ' roomid: ', connection.sessionid);
                    }

                    if (!!connection.peers[connection.sessionid]) {
                        // on socket disconnect & reconnect
                        return;
                    }

                    mPeer.onNegotiationNeeded(connectionDescription);
                }else{//没有成功加入房间
                    if (connection.enableLogs) {
                        console.warn('isRoomJoined: ', error, ' roomid: ', connection.sessionid);
                    }
                    setTimeout(function() {//3秒之后再次尝试加入房间// [disabled] retry after 3 seconds
                        joinRoom(connectionDescription, cb);
                    }, 3000);
                }

                cb(isRoomJoined, connection.sessionid, error);
            });
        }

        connection.publicRoomIdentifier = '';

        function openRoom(callback) {
            if (connection.enableLogs) {
                console.log('Sending open-room signal to socket.io');
            }

            connection.waitingForLocalMedia = false;
            connection.socket.emit('open-room', {
                sessionid: connection.sessionid,
                session: connection.session,
                mediaConstraints: connection.mediaConstraints,
                sdpConstraints: connection.sdpConstraints,
                streams: getStreamInfoForAdmin(),
                extra: connection.extra,
                identifier: connection.publicRoomIdentifier,
                password: typeof connection.password !== 'undefined' && typeof connection.password !== 'object' ? connection.password : ''
            }, function(isRoomOpened, error) {
                if (isRoomOpened === true) {
                    if (connection.enableLogs) {
                        console.log('isRoomOpened: ', isRoomOpened, ' roomid: ', connection.sessionid);
                    }
                    callback(isRoomOpened, connection.sessionid);
                }

                if (isRoomOpened === false) {
                    if (connection.enableLogs) {
                        console.warn('isRoomOpened: ', error, ' roomid: ', connection.sessionid);
                    }

                    callback(isRoomOpened, connection.sessionid, error);
                }
            });
        }

        function getStreamInfoForAdmin() {
            try {
                return connection.streamEvents.selectAll('local').map(function(event) {
                    return {
                        streamid: event.streamid,
                        tracks: event.stream.getTracks().length
                    };
                });
            } catch (e) {
                return [];
            }
        }

        connection.onbeforeunload = function(arg1, dontCloseSocket) {
            if (!connection.closeBeforeUnload) {
                return;
            }

            connection.peers.getAllParticipants().forEach(function(participant) {
                mPeer.onNegotiationNeeded({
                    userLeft: true
                }, participant);

                if (connection.peers[participant] && connection.peers[participant].peer) {
                    connection.peers[participant].peer.close();
                }

                delete connection.peers[participant];
            });

            if (!dontCloseSocket) {
                connection.closeSocket();
            }

            connection.isInitiator = false;
        };

        connection.userid = getRandomString();

        connection.extra = {};
        connection.attachStreams = [];

        connection.session = {
            audio: true,
            video: true
        };

        connection.processSdp = function(sdp) {
            // ignore SDP modification if unified-pan is supported
            if (isUnifiedPlanSupportedDefault()) {
                return sdp;
            }

            if (DetectRTC.browser.name === 'Safari') {
                return sdp;
            }

            if (connection.codecs.video.toUpperCase() === 'VP8') {
                sdp = CodecsHandler.preferCodec(sdp, 'vp8');
            }

            if (connection.codecs.video.toUpperCase() === 'VP9') {
                sdp = CodecsHandler.preferCodec(sdp, 'vp9');
            }

            if (connection.codecs.video.toUpperCase() === 'H264') {
                sdp = CodecsHandler.preferCodec(sdp, 'h264');
            }

            if (connection.codecs.audio === 'G722') {
                sdp = CodecsHandler.removeNonG722(sdp);
            }

            if (DetectRTC.browser.name === 'Firefox') {
                return sdp;
            }

            if (connection.bandwidth.video || connection.bandwidth.screen) {
                sdp = CodecsHandler.setApplicationSpecificBandwidth(sdp, connection.bandwidth, !!connection.session.screen);
            }

            if (connection.bandwidth.video) {
                sdp = CodecsHandler.setVideoBitrates(sdp, {
                    min: connection.bandwidth.video * 8 * 1024,
                    max: connection.bandwidth.video * 8 * 1024
                });
            }

            if (connection.bandwidth.audio) {
                sdp = CodecsHandler.setOpusAttributes(sdp, {
                    maxaveragebitrate: connection.bandwidth.audio * 8 * 1024,
                    maxplaybackrate: connection.bandwidth.audio * 8 * 1024,
                    stereo: 1,
                    maxptime: 3
                });
            }

            return sdp;
        };

        connection.sdpConstraints = {
            mandatory: {
                OfferToReceiveAudio: true,
                OfferToReceiveVideo: true
            },
            optional: [{
                VoiceActivityDetection: false
            }]
        };

        connection.candidates = {
            host: true,
            stun: true,
            turn: true
        };

        connection.iceProtocols = {
            tcp: true,
            udp: true
        };

        connection.onmessage = function(event) {
            if (!!connection.enableLogs) {
                console.debug('data-message', event.userid, event.data);
            }
        };

        connection.send = function(data, remoteUserId) {
            connection.peers.send(data, remoteUserId);
        };

        connection.onNewParticipant = function(participantId, userPreferences) {
            connection.acceptParticipationRequest(participantId, userPreferences);
        };

        connection.acceptParticipationRequest = function(participantId, userPreferences) {
            if (userPreferences.successCallback) {
                userPreferences.successCallback();
                delete userPreferences.successCallback;
            }

            mPeer.createNewPeer(participantId, userPreferences);
        };

        connection.onExtraDataUpdated = function(event) {
            event.status = 'online';
            connection.onUserStatusChanged(event, true)
        }

        connection.getAllParticipants = function(sender) {
            return connection.peers.getAllParticipants(sender);
        }

        connection.connectSocket = function(callback) {
            connectSocket(callback);
        }

        connection.getSocket = function(callback) {
            if (!callback && connection.enableLogs) {
                console.warn('getSocket.callback paramter is required.');
            }

            callback = callback || function() {};

            if (!connection.socket) {
                connectSocket(function() {
                    callback(connection.socket);
                });
            } else {
                callback(connection.socket);
            }

            return connection.socket; // callback is preferred over return-statement
        };

        connection.getRemoteStreams = mPeer.getRemoteStreams

        connection.socketURL = '/'; // generated via config.json
        connection.socketMessageEvent = 'RTCMultiConnection-Message'; // generated via config.json
        connection.socketCustomEvent = 'RTCMultiConnection-Custom-Message'; // generated via config.json
        connection.DetectRTC = DetectRTC;

        connection.getNumberOfBroadcastViewers = function(broadcastId, callback) {
            if (!connection.socket || !broadcastId || !callback) return;

            connection.socket.emit('get-number-of-users-in-specific-broadcast', broadcastId, callback);
        };

        connection.onNumberOfBroadcastViewersUpdated = function(event) {
            if (!connection.enableLogs || !connection.isInitiator) return;
            console.info('Number of broadcast (', event.broadcastId, ') viewers', event.numberOfBroadcastViewers);
        };

        connection.onUserStatusChanged = function(event, dontWriteLogs) {
            if (!!connection.enableLogs && !dontWriteLogs) {
                console.info(event.userid, event.status);
            }
        };

        connection.getUserMediaHandler = getUserMediaHandler;
        connection.multiPeersHandler = mPeer;
        connection.enableLogs = true;
        connection.setCustomSocketHandler = function(customSocketHandler) {
            if (typeof SocketConnection !== 'undefined') {
                SocketConnection = customSocketHandler;
            }
        }

        // check if room exist on server
        // we will pass roomid to the server and wait for callback (i.e. server's response)
        connection.checkPresence = function(roomid, callback) {
            roomid = roomid || connection.sessionid;

            if (SocketConnection.name === 'SSEConnection') {
                SSEConnection.checkPresence(roomid, function(isRoomExist, _roomid, extra) {
                    if (!connection.socket) {
                        if (!isRoomExist) {
                            connection.userid = _roomid;
                        }

                        connection.connectSocket(function() {
                            callback(isRoomExist, _roomid, extra);
                        });
                        return;
                    }
                    callback(isRoomExist, _roomid);
                });
                return;
            }

            if (!connection.socket) {
                connection.connectSocket(function() {
                    connection.checkPresence(roomid, callback);
                });
                return;
            }

            connection.socket.emit('check-presence', roomid + '', function(isRoomExist, _roomid, extra) {
                if (connection.enableLogs) {
                    console.log('checkPresence.isRoomExist: ', isRoomExist, ' roomid: ', _roomid);
                }
                callback(isRoomExist, _roomid, extra);
            });
        }

        connection.setUserPreferences = function(userPreferences) {
            if (connection.dontAttachStream) {
                userPreferences.dontAttachLocalStream = true;
            }

            if (connection.dontGetRemoteStream) {
                userPreferences.dontGetRemoteStream = true;
            }

            return userPreferences;
        }
        connection.onPeerStateChanged = function(state) {
            if (connection.enableLogs) {
                if (state.iceConnectionState.search(/closed|failed/gi) !== -1) {
                    console.error('Peer connection is closed between you & ', state.userid, state.extra, 'state:', state.iceConnectionState);
                }
            }
        }
    }
}
