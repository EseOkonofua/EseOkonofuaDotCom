/**
 * Created by Wirepick on 2016-02-27.
 */
$(document).ready(function(){
    //Fun UI Stuff
    var colors = ["saddlebrown","#F44336","#EAEA52","green","#9C27B0"];
    var index = 0;
    setInterval(function(){
        index++;
        $(".header").css("border-bottom","3px solid "+colors[index%5]);
    },2000);
    setTimeout(function(){
        $(".hidden-desc").fadeOut(500);
    },3000);

    $(".link").hover(function(){
        $(this).find(".hidden-desc").fadeIn(500);
    },function(){
        $(this).find(".hidden-desc").fadeOut(300);
    });

    $("#nav-bar > a").click(function(){

        if(!$(this).hasClass("selected")){
            var theClass = this.className;
            document.getElementsByClassName("selected")[0].className = theClass;
            this.className="selected";
        }
    });

    $("#nav-bar > a").hover(function(){
        var color = Math.floor(Math.random()*5);
        $(this).css("color",colors[color]);
    },function(){
        $(this).css("color","white");
    });

});