
// Express
const express = require('express')
const app = express()

// Serve static files from /public
app.use( express.static(".", {
  setHeaders: (res, path, stat) => {
    // Serve .wasm files with correct mime type
    if (path.endsWith('.wasm')) {
      res.set('Content-Type', 'application/wasm')
    }
  }
}) )

// Start server
app.listen( 7799, () => console.log('Server running on port 7799!') )


/* app.get("/forest",function(req,res){
  res.sendFile(__dirname +"/editor/index.html");
}); */
