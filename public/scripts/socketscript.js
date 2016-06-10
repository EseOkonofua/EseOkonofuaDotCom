/**
 * Created by Ese on 2016-05-13.
 */
'use strict';



window.onload = function(){


    var socket;
    //Player Object

    var game = new Phaser.Game(1240,800,Phaser.AUTO,'game',{preload:preload,create:create,update:update, render: render});

    console.log("Game created");

    var upKey;
    var downKey;
    var leftKey;
    var rightKey;


    var playerSprites = {};
    var bulletSprites = {};


    //HELPER FUNCTIONS
    function configSockets(){

        try {
            socket = io.connect("https://localhost/socket");
        } catch (err) {
            console.log(err);
            //TO DO Set status to warn user
        }


        //SOCKET HANDLERS
        socket.on("connect",function(){
            console.log("You have connected: "+ socket.id);
        });

        socket.on("player disconnect",function(socket){
            playerSprites[socket].destroy();
            delete playerSprites[socket];
        });


        socket.on('update',function(data){


            //PLAYERS
            _.each(data.players,function(dt){
                if(playerSprites[dt.socket] == undefined){
                    var sprite;
                    if(dt.socket == socket.id)
                        sprite = game.add.sprite(dt.x,dt.y,'player');
                    else
                        sprite = game.add.sprite(dt.x,dt.y,'enemy');
                    sprite.scale.set(0.4);
                    sprite.anchor.set(0.5,0.5);
                    game.physics.enable(sprite,Phaser.Physics.ARCADE);
                    sprite.body.allowRotation = false;
                    playerSprites[dt.socket] = sprite;
                }
                else{
                    var sprite = playerSprites[dt.socket];
                    sprite.x = dt.x;
                    sprite.y = dt.y;
                    sprite.rotation = dt.rotation;
                }
            });


            //BULLETS
            _.each(data.bullets,function(bt){
                if(bulletSprites[bt.id] == undefined){
                    var sprite;
                    if(bt.owner == socket.id)
                        sprite = game.add.sprite(bt.x,bt.y,'playerBullet');
                    else
                        sprite = game.add.sprite(bt.x,bt.y,'enemyBullet');
                    sprite.scale.set(0.6);
                    sprite.anchor.set(0.5,0.5);
                    game.physics.enable(sprite,Phaser.Physics.ARCADE);
                    sprite.body.allowRotation = false;
                    sprite.rotation = bt.angle ;
                    bulletSprites[bt.id] = sprite;
                }
                else{
                    var sprite = bulletSprites[bt.id];
                    if(bt.setRemove){
                        console.log("delete bullet " + bt.id);
                        bulletSprites[bt.id].destroy();
                        delete bulletSprites[bt.id];
                        socket.emit("bullet removed",bt.id);
                    }
                    else{
                        sprite.x = bt.x;
                        sprite.y = bt.y;
                    }
                }
            });





        });
    }


    /**********************************************GAME STUFF******************************************/

    function preload(){
        game.load.image('background', 'socketassets/black.png');
        game.load.image('player', 'socketassets/playerShip2_blue.png');
        game.load.image('enemy', 'socketassets/playerShip2_red.png');
        game.load.image('playerBullet', 'socketassets/laserBlue03.png');
        game.load.image('enemyBullet', 'socketassets/laserRed03.png');
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

        //controls
        upKey = game.input.keyboard.addKey(Phaser.KeyCode.W);
        downKey = game.input.keyboard.addKey(Phaser.KeyCode.S);
        leftKey = game.input.keyboard.addKey(Phaser.KeyCode.A);
        rightKey = game.input.keyboard.addKey(Phaser.KeyCode.D);
    }




    function update(){
        if(playerSprites[socket.id] != undefined){
            var rotation =  game.physics.arcade.angleToPointer(playerSprites[socket.id]) + 1.57;
            if(upKey.isDown){
                socket.emit("keyPress",{input:"w",state:true});
            }
            else socket.emit("keyPress",{input:"w",state:false})
            if(downKey.isDown){
                socket.emit("keyPress",{input:"s",state:true});
            }
            else socket.emit("keyPress",{input:"s",state:false})
            if(leftKey.isDown){
                socket.emit("keyPress",{input:"a",state:true});
            }
            else  socket.emit("keyPress",{input:"a",state:false})
            if(rightKey.isDown){
                socket.emit("keyPress",{input:"d",state:true});
            }
            else socket.emit("keyPress",{input:"d",state:false})

            //mouse click
            if(game.input.activePointer.isDown){
                socket.emit("shoot",{socket:socket.id,state:true});
            }
            else{
                socket.emit("shoot",{socket:socket.id,state:false});
            }

            socket.emit("rotation",rotation );
        }

    }

    function render(){
    }

}