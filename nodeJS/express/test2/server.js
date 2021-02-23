const express = require('express');//Express是目前最流行的基于Node.js的Web开发框架
const app = express();


app.use('/', express.static('client/'));
app.use('/myroom_number',require('./routers/myroom_number'));

app.listen(8080);