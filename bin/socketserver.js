/**
 * Created by Ese on 2016-05-13.
 */

module.exports = function(server){
    var _ = require('underscore');
   // var server = require('./www');
    var client = require('socket.io')(server).of("/socket");



    function randomXPos(){
        return Math.random() * 800 + 50;
    }

    function randomYPos(){
        return Math.random() * 500 + 50;
    }

    var Entity = function(){
        this.y = randomYPos();
        this.x = randomXPos();
        this.speed = 2 ;
    }


    var Player =  function(socket){
        Entity.call(this);
        this.socket = socket;
        this.rotation = 3;
        this.pressingLeftKey = false;
        this.pressingRightKey = false;
        this.pressingUpKey = false;
        this.pressingDownKey = false;
        this.isPlayerBoosting = false;
        this.isPlayerShooting = false;
    }


    Player.prototype.constructor = Player;
    Player.prototype.update = function(){
        if(this.pressingLeftKey){
            this.x -= this.speed;
        }
        if(this.pressingDownKey){
            this.y += this.speed;
        }
        if(this.pressingRightKey){
            this.x += this.speed;
        }
        if(this.pressingUpKey){
            this.y -= this.speed;
        }
    }


    var players = {};


    client.on('connection',function(socket){

        var sockid = socket.id.substr(8);
        players[sockid] = new Player(sockid);


        socket.on("keyPress",function(key){
            if(key.input == "w"){
                players[sockid].pressingUpKey = key.state;
            }
            else if(key.input == "a"){
                players[sockid].pressingLeftKey = key.state;
            }
            else if(key.input == "s"){
                players[sockid].pressingDownKey = key.state;
            }
            else if(key.input == "d"){
                players[sockid].pressingRightKey = key.state;
            }
        });

        socket.on("rotation",function(data){
            players[sockid].rotation = data;
        });

        socket.on('disconnect',function() {
            socket.broadcast.emit("player disconnect",sockid);
            delete players[sockid];
        });


        console.log("Some socket: " + socket.id + " has joined the socket page");




    });


    setInterval(function(){
        _.each(players,function(p){
            p.update();
        });
        client.emit("players",players);
    },1000/60);



    return client;

};

