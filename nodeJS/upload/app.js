const express = require('express')
const app = express()

var upload = require('./router/upload');
app.use('/upload', upload)

app.use(express.static('./static/'))

app.listen(3000, () => {
    console.log('Server is running at http://127.0.0.1:3000')
})

