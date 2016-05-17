/**
 * Created by Ese on 2016-05-13.
 */
var server = require('./www');
var client = require('socket.io')(server);

var players = {};
client.of('/socket').on('connection',function(socket){


    socket.on("join",function(Player){
        //emit players already in the server;
        socket.emit("players",players);

        players[Player.socket] = Player;

        socket.broadcast.emit("newplayer",Player);
    });

    socket.on('disconnect',function() {
        var sock = socket.id.substr(8);
        delete players[sock];
        socket.broadcast.emit("playerleft",sock);
    });

    socket.on('player move',function(Player){
        //TODO check for player positions
        players[Player.socket] = Player;
        socket.broadcast.emit('player move',Player);
    });


    console.log("Some socket: " + socket.id + " has joined the socket page");



});

module.exports = client;
