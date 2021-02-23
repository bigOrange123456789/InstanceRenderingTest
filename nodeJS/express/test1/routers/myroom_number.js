const express = require('express');

var router = express.Router();
module.exports = router;

router.get('/myfind', myfind);
function myfind(req, res){
    //let {id} = req.query;
    let query = req.query;
    console.log(query);
    res.send({ result:"haha"});
}