var express = require('express');
var path = require('path');


var home = require('./routes/home');
var socket = require('./routes/socket');


//initialize express
var app = express();

app.set('views',path.join(__dirname,'views'));
//if using view engine jade use:
app.set('view engine', 'jade');

//serve static files in the public directory
app.use(express.static(path.join(__dirname,'public')));


//Routes section
app.use('/',home);
app.use('/socket',socket);




// catch 404 and forward to error handler
app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.send("Error 404 message");
});


module.exports = app;