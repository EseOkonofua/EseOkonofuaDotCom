/**
 * Created by Ese on 2016-05-13.
 */
var app = require('../server');
var http = require('http');


var port = (process.env.PORT || 80);
app.set('port',port);

var server = http.createServer(app);
require('./socketserver')(server); //require socket server configs


server.listen(app.get("port"),function(){
    console.log("Now listening on port " + app.get("port"));
});

server.on('Error',onError);
server.on('listening',onListening);




/**
 * Event listener for HTTP server "error" event.
 */

function onError(error) {
    if (error.syscall !== 'listen') {
        throw error;
    }

    var bind = typeof port === 'string'
        ? 'Pipe ' + port
        : 'Port ' + port;

    // handle specific listen errors with friendly messages
    switch (error.code) {
        case 'EACCES':
            console.error(bind + ' requires elevated privileges');
            process.exit(1);
            break;
        case 'EADDRINUSE':
            console.error(bind + ' is already in use');
            process.exit(1);
            break;
        default:
            throw error;
    }
}


/**
 * Event listener for HTTP server "listening" event.
 */

function onListening() {
    var addr = server.address();
    var bind = typeof addr === 'string'
        ? 'pipe ' + addr
        : 'port ' + addr.port;
    console.log('Listening on ' + bind);
}

module.exports = server;