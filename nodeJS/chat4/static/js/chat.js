$(function() {
    //建立websocket连接
    socket = io.connect('http://localhost:3000');
    var userName = $("#user").val();
    socket.emit('login', userName);
    //收到server的系统消息
    socket.on('system', function(obj) {
        if (obj.type === "login") {
            //登录消息
            var msg = '<p><span class="time">' + obj.time + '</span><span class="person">' + obj.author + '</span><span class="msg">进入了聊天室。</span></p>';
            $(".chat-panel").append(msg);

            //刷新在线列表
            $("#memer-list").empty();
            var member = obj.member;
            var cnt = member.length;
            $("#memeber-count").text(cnt);
            for (var i = 0; i < cnt; i++) {
                var html = '<li><span class="label label-info user">' + member[i] + '</span></li>';
                $("#memer-list").append(html);
            }
        } else if (obj.type === "loginout") {
            //登出消息
            var msg = '<p><span class="time">' + obj.time + '</span><span class="person">' + obj.author + '</span><span class="msg">离开了聊天室。</span></p>';
            $(".chat-panel").append(msg);

            //刷新在线列表
            $("#memer-list").empty();
            var member = obj.member;
            var cnt = member.length;
            $("#memeber-count").text(cnt);
            for (var i = 0; i < cnt; i++) {
                var html = '<li><span class="label label-info user">' + member[i] + '</span></li>';
                $("#memer-list").append(html);
            }
        }
    });

    socket.on('message', function(obj) {
        if (obj.type === "message") {
            //发送消息
            var msg = '<p><span class="time">' + obj.time + '</span><span class="person">' + obj.author + '</span>：<span class="msg">' + obj.msg + '</span></p>';
            $(".chat-panel").append(msg);
        }
    });

    $("#send").on("click", function() {
        var msg = $("#text").val();
        if (msg !== "") {
            socket.emit('message', msg);
            $("#text").val("");
        }
    });
});
