const express = require('express');//Express是目前最流行的基于Node.js的Web开发框架
const app = express();
app.listen(8888);
app.use('/', express.static('./'));
console.log("This project has been released to: localhost:8888");

