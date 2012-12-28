
/**
 * Module dependencies.
 */

var express = require('express')
  , routes = require('./routes')
  , http = require('http')
  , path = require('path')
  , config = require('./config')
  , auth = require('./auth')
  , socketio = require('socket.io')
  , passsio = require('passport.socketio')
  , MemoryStore = require('connect/lib/middleware/session/memory')
  , viewer = require('./viewer')
  , presenter = require('./presenter');

var session_store = new MemoryStore();

var app = express();

app.configure(function(){
  app.set('port', process.env.PORT || 3000);
  app.set('views', __dirname + '/views');
  app.set('view engine', 'hjs');
  app.use(express.favicon());
  app.use(express.logger('dev'));
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(express.cookieParser());
  app.use(express.session({
    secret: config.get('session_secret'),
    store: session_store
  }));
  app.use(auth.initialize());
  app.use(auth.session());
  app.use(app.router);
  app.use(express.static(path.join(__dirname, 'public')));
});

app.configure('development', function(){
  app.use(express.errorHandler());
});

app.get('/login', routes.login_page);
app.post('/login', routes.login);
app.get('/logged', routes.logged);

var server = http.createServer(app).listen(app.get('port'), function(){
  console.log("Express server listening on port " + app.get('port'));
});

// sockets

var io = socketio.listen(server);

io.set("authorization", passsio.authorize({
  sessionKey: 'connect.sid',
  sessionSecret: config.get('session_secret'),
  sessionStore: session_store,
  fail: function  (data, accept) {
    // allow unauthed users to connect, we just handle them separately.
    accept(null, true);
  }
}));

io.sockets.on("connection", function  (socket) {

  if (socket.handshake.user === undefined) {
    viewer(socket, io.sockets);
  } else {
    presenter(socket, io.sockets);
  }

});
