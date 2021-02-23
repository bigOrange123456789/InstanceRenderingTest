const express = require('express');//Express是目前最流行的基于Node.js的Web开发框架
const app = express();
app.listen(8080);

app.use('/', express.static('client/'));

app.get('/communication', function (req, res) {
    res.send(req.query);
});