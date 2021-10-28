class Peer{//对 _Peer 对象进行封装
    constructor() {
        var scope=this
        var _myPeer=new _Peer()
        var waitingUser=[]

        this.send=(data,target)=>{
            if(typeof target==="undefined")
                for(var i in _myPeer.peers){
                    if(_myPeer.peers[i].readyState==='open')
                        _myPeer.peers[i].send(data)
                    else console.log(i+" is close")
                }
            else if(_myPeer.peers[target])
                _myPeer.peers[target].send(data)
            else
                console.log("target does not exist")
        }
        this.receive=(message,sourceId)=> {
            var data=JSON.parse(message.data)
            if(data.type==='timeStamp'){
                var reply={
                    type:'timeStamp_reply',
                    time:data.time
                }
                this.send(JSON.stringify(reply),sourceId)
            }else if(data.type==='timeStamp_reply'){
                var delay=performance.now()-data.time
                _myPeer.peers[sourceId].delay=delay
                console.log('delay of '+sourceId+' is '+delay)
            }
        }
        //this.connect=id=>_myPeer.connect(id)
        //以下是重新函数
        _myPeer.addUser=idOther=>{
            if(_myPeer.idle())
                _myPeer.connect(idOther)
            else{
                waitingUser.push(idOther)
            }
        }
        _myPeer.finish=()=>{
            if(waitingUser.length>0){
                _myPeer.connect(waitingUser.splice(0,1)[0])
            }
            //waitingUser.push(idOther)
        }
        _myPeer.openCallback=id=>{
            console.log(id+' is opened!')
            _myPeer.peers[id].onmessage=(data)=>{scope.receive(data,id)}
            var data={type:'timeStamp',time:performance.now()}
            _myPeer.peers[id].send(
                JSON.stringify(data)
            )
        }
        //以下是添加函数
        //_myPeer.
    }
}
class _Peer{
    constructor() {
        this.myId=''
        this.otherId=''//这个为空表示处于空闲状态，否则处于忙碌状态
        this.socket =this.initSocket()
        this.peerConn=null
        this.peers={}
        this.openCallback=id=>console.log(id+' is opened!')
        this.addUser=idOther=> console.log("another user id is:",idOther)
        this.finish=()=>console.log('完成了一个协商')
    }
    initSocket(){
        var scope=this
        var socket = io.connect('http://110.40.255.87:8088',{transports:['websocket','xhr-polling','jsonp-polling']});
        //var socket = io.connect()
        socket.on('id',  id=> {
            scope.myId=id
            console.log("your id is:",id)
        })
        socket.on('addUser',  idOther=> {
            setTimeout(()=>scope.addUser(idOther),500)
            //scope.addUser(idOther)
        })
        socket.on('connect0',  (id)=> {//收到一个请求
            scope.otherId=id
            scope.createPeerConnection('answer')
        })
        socket.on('message', data=> {//用于接收SDP和candidate
            if(data.targetType==='answer')
                scope.signalingMessageCallback(data.message)
            else//offer
                scope.signalingMessageCallback(data.message)
        })
        return socket
    }
    sendMessage(message,targetType) {//用于发送offer、answer、candidate
        this.socket.emit('message', {
            message:message,
            targetId0:this.otherId,
            targetType:targetType
        })//用于发送SDP和candidate
    }
    idle(){//判断是否空闲
        return this.otherId===''||this.peers[this.otherId]
    }
    connect(id){
        if(!this.idle()){
            console.log('The previous connection has not been completed')
        }else if(this.peers[id]){
            console.log('This connection has been established:'+id)
        }else{
            this.otherId=id
            this.createPeerConnection('offer')//准备offer
            this.socket.emit('connect0', {
                offerId:this.myId,
                answerId:this.otherId
            })//准备answer
        }
    }
    signalingMessageCallback(message) {//分析收到的消息
        var scope=this
        if (message.type === 'offer') {//这个消息是发送给offer的sdp
            this.peerConn.setRemoteDescription(new RTCSessionDescription(message), function() {}, scope.logError)
            this.peerConn.createAnswer(desc =>{
                scope.peerConn.setLocalDescription(desc).then(function() {
                    var obj=scope.peerConn.localDescription
                    obj.targetId0=scope.otherId
                    scope.sendMessage(obj,'answer')
                }).catch(scope.logError)
            }, scope.logError)
        } else if (message.type === 'answer') {//这个消息是发送给answer的sdp
            this.peerConn.setRemoteDescription(new RTCSessionDescription(message), function() {}, scope.logError)
        } else if (message.type === 'candidate') {
            this.peerConn.addIceCandidate(new RTCIceCandidate({
                candidate: message.candidate,
                sdpMLineIndex: message.label,
                sdpMid: message.id
            }))
        }
    }
    createPeerConnection(type){
        var typeOther
        if(type==='offer')typeOther='answer'//自己是offer一方
        else typeOther='offer'//自己是answer一方

        var scope=this
        var peerConn = new RTCPeerConnection()
        peerConn.onicecandidate = function(event) {
            if (event.candidate) {
                //console.log("on candidate : send candidate")
                scope.sendMessage({//向对方发送自己的candidate
                    type: 'candidate',
                    label: event.candidate.sdpMLineIndex,
                    id: event.candidate.sdpMid,
                    candidate: event.candidate.candidate,
                },typeOther)
            } else {
                //console.log('on candidate : End of candidates.')
            }
        }
        if(type==='offer'){
            peerConn.ondatachannel = function(event) {
                scope.onDataChannelCreated(event.channel)//offer方接收channel
            }
        }else{//type==='answer'
            scope.onDataChannelCreated(peerConn.createDataChannel('photos'))//answer方创建channel

            peerConn.createOffer().then(function(offer) {
                return peerConn.setLocalDescription(offer)
            }).then(() => {
                scope.sendMessage(peerConn.localDescription,'offer')
            }).catch(scope.logError)
        }
        this.peerConn=peerConn
    }

    onDataChannelCreated(channel) {
        var scope=this
        channel.peerId=this.otherId
        channel.onopen = ()=>{
            scope.peers[channel.peerId]=channel
            scope.openCallback(channel.peerId)
            scope.finish()
        }
        channel.onmessage=message=>console.log("message",message)
        channel.onclose=()=>{//连接通道关闭了
            delete scope.peers[channel.peerId]
        }
    }
    logError(err) {
        console.log('连接失败',err)
        this.otherId=''//这个为空表示处于空闲状态
        this.finish()
    }
}
export {Peer}
