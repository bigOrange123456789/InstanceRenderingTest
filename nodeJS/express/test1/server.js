const express = require('express');
const path = require('path');

const app = express();
//开放给客户端的一些地址
app.use(express.static(path.join(__dirname+'/client')));

///响应的一些请求
app.use('/myroom_number',require('./routers/myroom_number'));

app.listen(8081);