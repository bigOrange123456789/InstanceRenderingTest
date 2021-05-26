var express = require('express'); //引用express
var crypto = require('crypto'); //加密
var path = require('path');
var bodyParser = require("body-parser");
var app = express();
var server = require('http').Server(app);
var mysql = require("mysql"); //数据库模块
var io = require('socket.io').listen(server); //socket io模块
var session = require('express-session'); //如果要使用session，需要单独包含这个模块

//连接数据库
var connPool = mysql.createPool({
    host: '127.0.0.1', //主机
    user: 'root', //MySQL认证用户名
    password: '123456', //MySQL认证用户密码
    port: '3306', //端口号
    database: 'sv_chat', //数据库
    waitForConnections: true, //当连接池没有连接或超出最大限制时，设置为true且会把连接放入队列
    //connectionLimit：10,//连接数限制
});
/*conn.connect(function(err) {
    if (err) {
        console.log('[mysql connect] failed:' + err);
        return;
    }
    console.log('[mysql connect] succeed!');
});*/

//express基本配置
app.set('port', 3000);
app.set('views', __dirname + '/views');
app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({
    extended: false
}));
app.use(session({
    secret: 'ScumVirus',
    name: 'sv_chat', //这里的name值得是cookie的name，默认cookie的name是：connect.sid
    cookie: {
        maxAge: 3600000
    }, //设置maxAge是3600000ms，即1h后session和相应的cookie失效过期
    resave: false,
    saveUninitialized: true,
}));
app.use(express.static(path.join(__dirname, 'static')));

//配置路由
//登录页
app.get('/', function(req, res) {
    //res.send('hello world');
    //console.log(getTime() + "  " + req.ip + "  visited.");
    //var ip = req.ip.substring(req.ip.lastIndexOf(":") + 1);
    res.redirect('/login');
});
app.get('/login', function(req, res) {
    res.sendFile(app.get("views") + '/login.html');
});
//登录方法 post
app.post('/login', function(req, res) {
    var name = req.body.name;
    var pwd = getMD5(req.body.pwd);
    var ip = req.ip.substring(req.ip.lastIndexOf(":") + 1);
    var time = getTime();
    var resData = {};
    getUserById(name, function(obj) {
        if (pwd == obj.pwd) {
            var params = [time, ip, obj.id];
            updateLoginInfo(params);
            resData.msg = 0;
        } else {
            resData.msg = -1;
        }
        //设置session
        req.session.user = name;
        res.send(resData);
    });
});
//注册页
app.get('/register', function(req, res) {
    res.sendFile(app.get("views") + '/register.html');
});
//注册方法 post
app.post('/register', function(req, res) {
    var name = req.body.name;
    var pwd = getMD5(req.body.pwd);
    var email = req.body.email;
    var phone = req.body.phone;
    var time = getTime();
    var params = [name, pwd, email, phone, time];
    var resData = {};
    addUser(params, function(flag) {
        if (flag) {
            resData.msg = 0;
        } else {
            resData.msg = -1;
        }
        res.send(resData);
    });
});
//聊天室首页
app.get('/index', function(req, res) {
    if (req.session.user == undefined) {
        res.redirect('/login');
    } else {
        res.render("index", {
            "user": req.session.user
        });
        //res.sendFile(app.get("view") + '/index.html');
    }
});

//监听服务器启动
server.listen(app.get('port'), function() {
    console.log("Express server listening on port " + app.get('port'));
});

//全局变量
var onlineMember = [];

//WebSocket连接监听
io.on('connection', function(socket) {
    //socket.emit('open',onlineMember); //通知客户端已连接

    // 打印握手信息
    // console.log(socket.handshake);

    // 构造客户端对象
    var client = {
        name: '',
    }

    // 对message事件的监听
    //登录事件
    socket.on('login', function(name) {
        var time = getTime();
        client.name = name;
        var index = getArrIndex(name,onlineMember);
        if(index == -1){
            onlineMember.push(client.name);
            console.log(time + " " + client.name + " login");
        }
        var obj = {
            time: time,
            author: client.name,
            text: '',
            type: 'login',
            member: onlineMember
        };
        socket.emit('system', obj);
        socket.broadcast.emit('system', obj);
    });
    //消息事件
    socket.on('message', function(msg) {
        var obj = {
            time: getTime(),
        };
        obj['msg'] = msg;
        obj['author'] = client.name;
        obj['type'] = 'message';

        // 返回消息（可以省略）
        socket.emit('message', obj);
        // 广播向其他用户发消息
        socket.broadcast.emit('message', obj);
    });

    //监听退出事件
    socket.on('disconnect', function() {
        var index = getArrIndex(client.name, onlineMember);
        if (index > -1) {
            onlineMember.splice(index, 1);
        }
        var time = getTime();
        var obj = {
            time: time,
            author: client.name,
            text: '',
            type: 'loginout',
            member: onlineMember
        };
        console.log(time + " " + client.name + " loginout");

        // 广播用户已退出
        socket.broadcast.emit('system', obj);
    });
});

//获取当前的时间yyyy-MM-dd HH:ii:ss
var getTime = function() {
    var date = new Date();
    return date.getFullYear() + "-" + tc(date.getMonth() + 1) + "-" + tc(date.getDate()) + " " + tc(date.getHours()) + ":" + tc(date.getMinutes()) + ":" + tc(date.getSeconds());
}

//不足10的首位补0
var tc = function(num) {
    if (num >= 10) {
        return num;
    } else {
        return "0" + num;
    }
}

//根据用户获取用户信息
var getUserById = function(name, callback) {
    //执行SQL语句
    var sql = 'select * from sv_user where name=?';
    var params = [name];
    connPool.query(sql, params, function(err, result) {
        if (err) {
            console.log('[SELECT ERROR] - ', err.message);
            return;
        }
        return callback(result[0]);
    });
}

//添加新用户
var addUser = function(params, callback) {
    //执行SQL语句
    var sql = 'insert into sv_user(`name`,`pwd`,`email`,`phone`,`create_time`) values(?,?,?,?,?)';
    connPool.query(sql, params, function(err, result) {
        if (err) {
            console.log('[INSERT ERROR] - ', err.message);
            return callback(false);
        } else {
            console.log('INSERT ID:', result.insertId);
            return callback(true);
        }
    });
}

//更新登录时间和ip
var updateLoginInfo = function(params) {
    var sql = 'update sv_user set login_time=?,login_ip=? where id=?';
    connPool.query(sql, params, function(err, result) {
        if (err) {
            console.log('[UPDATE ERROR] - ', err.message);
        } else {
            console.log('affectedRows:', result.affectedRows);
        }
    });
}

//获取md5加密后的值
var getMD5 = function(str) {
    var md5 = crypto.createHash('md5');
    md5.update(str);
    var d = md5.digest('hex');
    return d;
}

//获取数组中指定值的下标
var getArrIndex = function(str, arr) {
    var index = -1;
    for (var i = 0; i < arr.length; i++) {
        if (arr[i] == str) {
            index = i;
            break;
        }
    }
    return index;
}
