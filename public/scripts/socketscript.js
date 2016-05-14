/**
 * Created by Ese on 2016-05-13.
 */
window.onload = function(){

    function getById(id){
        return document.getElementById(id);
    }


    var canvas = document.getElementById("canvas");
    var context = canvas.getContext("2d");

    canvas.width = "700";
    canvas.height = "500";

    context.fillStyle = "black";
    context.fillRect(0,0,700,500);


    try {
        var socket = io.connect("http://localhost/socket");
    } catch (err) {
        console.log(err);
        //TO DO Set status to warn user
    }

    socket.on('connect', function () {
        console.log("Client side works tooo");

    });



}