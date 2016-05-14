/**
 * Created by Ese on 2016-05-13.
 */
var server = require('./www');
var client = require('socket.io')(server);


client.of('/socket').on('connection',function(socket){
    console.log("Some socket: " + socket.id + " has joined the socket page");
});
