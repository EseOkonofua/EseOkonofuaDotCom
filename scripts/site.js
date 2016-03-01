/**
 * Created by Wirepick on 2016-02-27.
 */
$(document).ready(function () {
    //Fun UI Stuff
    var colors = ["saddlebrown", "#F44336", "lightblue", "lightgreen", "#9C27B0"];
    var index = 0;
    setInterval(function () {
        index++;
        $(".header").css("border-bottom", "3px solid " + colors[index % 5]);
        $("#nav-bar > button").each(function () {
            if ($(this).data('hover')) {
                $(this).css("color", colors[index % 5]);
            }
        });
    }, 2000);;


    $("#nav-bar > button").click(function () {
        $(this).blur();
        if (!$(this).hasClass("selected")) {
            var theClass = this.className;
            document.getElementsByClassName("selected")[0].className = theClass;
            this.className = "selected";
        }
    });


    $("#nav-bar > button").hover(function () {
        $.data(this, 'hover', true);
        var color = colors[index % 5];
        $(this).css({"color": color});
    }, function () {
        $.data(this, 'hover', false);

        $(this).css({"color": "white"});
    });

    $("#about-me-scroll").click(function () {
        var body = $("html, body");
        var pos = $("#about-me").offset().top - 280;
        body.stop().animate({scrollTop: pos}, '5000', 'linear');
    });

    $("#projects-scroll").click(function () {
        var body = $("html, body");
        var pos = $("#projects").offset().top - 150;
        body.stop().animate({scrollTop: pos}, '5000', 'linear');
    });

    $("#contact-scroll").click(function () {
        var body = $("html, body");
        var pos = $(document).height() - $(window).height();
        body.stop().animate({scrollTop: pos}, '5000', 'linear');
    });


    $(".circle-btn").click(function () {
        $(".circle-btn").each(function () {
            if ($(this).hasClass("selected")) {
                $(this).removeClass("selected");
            }
        });
        $(this).addClass("selected");
    });

    $("#DSmasher-btn").click(function () {
        $("#slider").css("left", "0");

    });
    $("#ReelMovies-btn").click(function () {

        $("#slider").css("left", "-100%");
    });

    $("#uTunes-btn").click(function(){
        $("#slider").css("left","-200%");
    });

    function calibrateNav(){
        var aboutme = 0;
        var projects = $("#projects").offset().top - 200;
        var contact = $(document).height() - $(window).height();

        var body = Math.round($("body").scrollTop()) + 1;



        if (body >= aboutme && body < projects ) {
            var className = document.getElementById("about-me-scroll").className;
            $("#nav-bar > button").each(function () {
                if ($(this).hasClass("selected")) {
                    this.className = className;
                }
            });
            document.getElementById("about-me-scroll").className = "selected";
        }
        else if (body >= projects  && body < contact) {
            var className = document.getElementById("projects-scroll").className;
            $("#nav-bar > button").each(function () {
                if ($(this).hasClass("selected")) {
                    this.className = className;
                }
            });
            document.getElementById("projects-scroll").className = "selected";
        }
        else if (body >= contact) {
            var className = document.getElementById("contact-scroll").className;
            $("#nav-bar > button").each(function () {
                if ($(this).hasClass("selected")) {
                    this.className = className;
                }
            });
            document.getElementById("contact-scroll").className = "selected";
        }
    }

    $(window).scroll(function(){calibrateNav()});

    $(window).resize(function(){calibrateNav()});
});