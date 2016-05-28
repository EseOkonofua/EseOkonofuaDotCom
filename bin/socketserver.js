/**
 * Created by Ese on 2016-05-13.
 */

module.exports = function(server){
    var _ = require('underscore');
    var gameloop = require('node-gameloop');
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
        this.attSpeed = 60;
        this.attTimer = 100;
        this.pressingLeftKey = false;
        this.pressingRightKey = false;
        this.pressingUpKey = false;
        this.pressingDownKey = false;
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
        if(this.isPlayerShooting && this.attTimer >= this.attSpeed){
            this.shootBullet(this.rotation);
            this.attTimer = 0;
            this.isPlayerShooting = false;
        }
        this.attTimer++
    }
    Player.prototype.shootBullet = function(angle){
        var b = new Bullet(this.socket,angle);
        b.x = this.x+3;
        b.y = this.y+3;
        bullets[b.id] = b;
    }

    var Bullet = function(owner,angle){
        Entity.call(this);
        this.id = Math.random()*20;
        this.owner = owner;
        this.angle = angle;
        this.spdX = Math.cos(angle - 1.57) *10;
        this.spdY = Math.sin(angle - 1.57)*10;
        this.setRemove = false;
        this.timer = 0;

    }
    Bullet.prototype.constructor = Bullet;
    Bullet.prototype.update = function(){
        if(this.timer >= 50){
            this.setRemove = true;
        }else{
            this.x += this.spdX;
            this.y += this.spdY;
        }
        this.timer++;
    }



    var players = {};
    var bullets = {};

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

        socket.on("shoot",function(data){
            players[data.socket].isPlayerShooting = data.state;
        });

        socket.on("bullet removed",function(data){
            delete bullets[data];
        });


        console.log("Some socket: " + socket.id + " has joined the socket page");


    });

    var id = gameloop.setGameLoop(function(delta){
        _.each(players,function(p){
            p.update();
        });
        _.each(bullets,function(b){
            b.update();
        });
        var package = {players:players,bullets:bullets};
        client.emit("update",package);
    },1000/60);





    return client;

};

