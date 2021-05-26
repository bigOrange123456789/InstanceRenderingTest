const express = require('express');//Express是目前最流行的基于Node.js的Web开发框架
const app = express();
const ip="0.0.0.0"
const port=8088

const http = require('http');

var server =http.createServer(app);
server.listen(port,ip,() => {
    console.log('App listening at port:'+ ip +':'+port);
});
app.listen(port,ip);
app.use('/', express.static('./'));

