class Peer{
    constructor() {
        this.myId=''
        this.otherId=''
        this.socket =this.initSocket()
        this.peerConn=null
    }
    initSocket(){
        var scope=this
        var socket = io.connect()
        socket.on('ready',  (id)=> {//收到一个请求
            scope.otherId=id
            scope.createPeerConnection_answer()
        })
        socket.on('id',  id=> {
            scope.myId=id
            console.log("your id is:",id)
        })
        socket.on('message', data=> {//用于接收SDP和candidate
            if(data.targetType==='answer')
                scope.signalingMessageCallback_answer(data.message)
            else//offer
                scope.signalingMessageCallback_offer(data.message)
        })
        return socket
    }
    sendMessage(message,targetType) {
        this.socket.emit('message', {
            message:message,
            targetId0:this.otherId,
            targetType:targetType
        })//用于发送SDP和candidate
    }

    connect0(id){
        this.otherId=id
        this.createPeerConnection_offer()//准备offer
        this.socket.emit('connect0', {
            offerId:this.myId,
            answerId:this.otherId
        })//准备answer
    }
    signalingMessageCallback_answer(message) {
        var scope=this
        if (message.type === 'answer') {
            this.peerConn.setRemoteDescription(new RTCSessionDescription(message), function() {}, scope.logError)
        } else if (message.type === 'candidate') {
            this.peerConn.addIceCandidate(new RTCIceCandidate({
                candidate: message.candidate,
                sdpMLineIndex: message.label,
                sdpMid: message.id
            }))
        }
    }
    createPeerConnection_answer() {
        var scope=this
        var peerConn = new RTCPeerConnection()
        peerConn.onicecandidate = function(event) {
            if (event.candidate) {
                console.log("on candidate : send candidate")
                scope.sendMessage({//向对方发送自己的candidate
                    type: 'candidate',
                    label: event.candidate.sdpMLineIndex,
                    id: event.candidate.sdpMid,
                    candidate: event.candidate.candidate,
                },'offer')
            } else {
                console.log('on candidate : End of candidates.')
            }
        }

        scope.onDataChannelCreated(peerConn.createDataChannel('photos'))

        peerConn.createOffer().then(function(offer) {
            return peerConn.setLocalDescription(offer)
        }).then(() => {
            var obj=peerConn.localDescription
            obj.targetId0=scope.otherId
            scope.sendMessage(obj,'offer')
        }).catch(scope.logError)
        this.peerConn=peerConn

    }
    signalingMessageCallback_offer(message) {
        var scope=this;
        if (message.type === 'offer') {
            this.peerConn.setRemoteDescription(new RTCSessionDescription(message), function() {}, scope.logError)
            this.peerConn.createAnswer(desc =>{
                scope.peerConn.setLocalDescription(desc).then(function() {
                    var obj=scope.peerConn.localDescription
                    obj.targetId0=scope.otherId
                    scope.sendMessage(obj,'answer')
                }).catch(scope.logError)
            }, scope.logError)
        } else if (message.type === 'candidate') {
            scope.peerConn.addIceCandidate(new RTCIceCandidate({
                candidate: message.candidate,
                sdpMLineIndex: message.label,
                sdpMid: message.id
            }))
        }
    }
    createPeerConnection_offer() {//自己启动
        var scope=this;
        var peerConn = new RTCPeerConnection()
        peerConn.onicecandidate = function(event) {
            if (event.candidate) {
                scope.sendMessage({
                    type: 'candidate',
                    label: event.candidate.sdpMLineIndex,
                    id: event.candidate.sdpMid,
                    candidate: event.candidate.candidate,
                    targetId0:scope.otherId
                },'answer')
            } else {
                console.log('on candidate : End of candidates.')
            }
        }
        peerConn.ondatachannel = function(event) {
            scope.onDataChannelCreated(event.channel)
        }
        this.peerConn=peerConn
    }

    onDataChannelCreated(channel) {

        channel.onopen = ()=>{

            console.log('channel opened!!!!!!!!!!!!!!!!!')
            window.send=channel.send
        }
        channel.onmessage=message=>console.log("message",message)
    }
    logError(err) {
    }
}
var myPeer=new Peer()
window.myPeer=myPeer
