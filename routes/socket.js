/**
 * Created by Ese on 2016-05-13.
 */
var express = require("express");
var router = express.Router();
var path = require("path");

router.get("/",function(req,res,next){
   console.log("Socket Page!");
    res.sendFile(path.join(__dirname,"../public/socket.html"));
});

module.exports = router;