/**
 * Created by Ese on 2016-05-13.
 */

var express = require('express');
var router = express.Router();

router.get('/',function(req,res,next){
    console.log("Home page");
    res.render('index');
});

module.exports = router;