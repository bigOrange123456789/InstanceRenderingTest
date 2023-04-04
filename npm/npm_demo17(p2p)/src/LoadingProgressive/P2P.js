export class P2P{
    constructor(){
        const self=this
        this.parse=data=>console.log(data)
        this.socketURL="http://localhost:8011"
        this.socket = this.initSocket(this.socketURL)
        this.socket.on('receive', data=> self.parse(data))
    }
    initSocket(socketURL){
        var scope=this
        var socket = io.connect(socketURL,{transports:['websocket','xhr-polling','jsonp-polling']})
        socket.on('receive',  data=> {
            scope.parse(data)
        })
        return socket
    }
    send(message){
        this.socket.emit('send',message)
    }
}