/**
 * Created by Ese on 2016-05-13.
 */
'use strict';



window.onload = function(){



    function randomXPos(){
        return Math.random() * 800 + 50;
    }

    function randomYPos(){
        return Math.random() * 500 + 50;
    }

    var enemies = {};
    var socket;
    var player ={};

    //Player Object
    var Player =  function(data,socket){
        this.x = data.x;
        this.y = data.y;
        this.rotation = data.rotation;
        this.socket = socket;
        this.isPlayerBoosting = false;
        this.isPlayerShooting = false;
    }

    Player.prototype.constructor = Player;
    Player.prototype.hasPlayerMoved = function(){
        if(this.x != player.sprite.x && this.y != player.sprite.y && this.rotation != player.sprite.rotation) return true;
        else return false;
    }
    Player.prototype.hasPlayerStateChanged = function(){
        if(this.isPlayerBoosting || this.isPlayerShooting || this.hasPlayerMoved())
            return true;
        else return false;
    }





    var game = new Phaser.Game(1240,600,Phaser.AUTO,'game',{preload:preload,create:create,update:update, render: render});
    console.log("Game created");






    //HELPER FUNCTIONS
    function configSockets(){

        try {
            socket = io.connect("http://localhost:3000/socket");
        } catch (err) {
            console.log(err);
            //TO DO Set status to warn user
        }
        //SOCKET HANDLERS
        socket.on("connect",function(){
            debugger
            console.log("You have connected: "+ socket.id);


            //Player starting position
            var x = randomXPos();
            var y = randomYPos();

            //Set up and add player
            player.sprite = game.add.sprite(x,y,'player');
            game.physics.enable(player.sprite, Phaser.Physics.ARCADE);
            player.sprite.scale.set(0.4);
            player.sprite.anchor.set(0.5,0.5);
            player.sprite.body.allowRotation = false;

            //create new player object to be passed on to server
            player.object = new Player(player.sprite,socket.id);


            console.log(player.object);
            //Emit the players information
            socket.emit("join",player.object);
        });

        socket.on("newplayer",function(Player){
            console.log("New Player: " + Player.socket + " has joined! ");

            addEnemy(Player);
        });

        socket.on("players",function(Players){

            _.each(Players,function(player){
                addEnemy(player);
            });

        });


        socket.on("playerleft",function(player){

            enemey[player].kill();
            delete enemy[player];
        });

        socket.on("player move",function(Player){
            console.log("Enemy moving");
            var enemy = enemies[Player.socket];
            enemy.x = Player.x;
            enemy.y = Player.y;
            enemy.rotation = Player.rotation;
        });
    }


    function addEnemy(Player){
        var enemy =  game.add.sprite(Player.x,Player.y,'enemy');
        enemy.scale.set(0.4);
        enemy.anchor.set(0.5,0.5);
        enemy.rotation = Player.rotation;
        enemies[Player.socket] = enemy;

        return enemy;
    }


    /**********************************************GAME STUFF******************************************/

    function preload(){
        game.load.image('background', 'socketassets/black.png');
        game.load.image('player', 'socketassets/playerShip2_blue.png');
        game.load.image('enemy', 'socketassets/playerShip2_red.png');

    }

    function create(){

        //  We're going to be using physics, so enable the Arcade Physics system
        game.physics.startSystem(Phaser.Physics.ARCADE);

        //Add background star sky
        for (var x = 0;x <5; x++){
            for (var y = 0; y < 3; y++) {
                game.add.sprite(x*256,y*256,'background');
            }
        }


        configSockets();
    }




    function update(){

        if(player.sprite !== undefined){
            if (Phaser.Rectangle.contains(player.sprite.body, game.input.x, game.input.y))
                player.sprite.body.velocity.setTo(0, 0);
            else
                player.sprite.rotation = game.physics.arcade.moveToPointer(player.sprite, 80, game.input.activePointer, 0) + 1.57;


            if(player.sprite.x != player.object.x && player.sprite.y != player.object.y && player.sprite.rotation != player.object.rotation){ //if you've moved
                //if you've moved
                socket.emit("player move",player.object);
            }



          //  console.log("X: " + player.x+ "Y: "+ player.y + " rotation: " +player.rotation);
            player.object.x = player.sprite.x;
            player.object.y = player.sprite.y;
            player.object.rotation = player.sprite.rotation;

        }

    }

    function render(){
        //if(player !== undefined)
        //    game.debug.spriteInfo(player, 32, 450);
    }






}