// App 
var express = require('express');
var app = express();
var http = require('http').Server(app);
// Sockets & RabbitMQ
var socketConfig = require('./socket-config');
var io = require('socket.io')(http);

// Database
var db = require('./database/dbsetup.js');
var controller = require('./database/controllers.js');

// Bodyparser
var bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Serve client-side files
app.use(express.static(__dirname + '/../app'));

// SOCKET LISTENERS =======================================
// rabbitMQ.on('ready', function() {
//   console.log('Connected to RabbitMQ');
//   io.sockets.on('connection', function (socket) {
//     console.log('Socket connected: ' + socket.id);
//     rabbitMQ.queue('offer', { autoDelete: false, durable: false, exclusive: false }, function(q) {    
//       q.bind('#'); // Catch all messages    
//       q.subscribe(function (message) {
//         console.log(message);
//         socket.emit('addMessage', message); 
//         // //socket.broadcast.to(obj.id).emit('message', obj);
//         // io.sockets.in(obj.id).emit('message', obj);
//       });
//     });
//   });
// });
exports.teachers = []; 
exports.students = [];

io.sockets.on('connection', function(socket) {
  socket.rooms = Array.prototype.slice.call(socket.rooms); 
  socketConfig(socket);
});

// API ============================================
app.post('/api/signup', function (request, response) {
  controller.users.signup(request, function (err, result) {
    if(err) {
      response.status(409).send(err.detail);
    } else {
      console.log("result", result);
      response.status(201).send(result);
    }
  });
});

app.post('/api/signin', function (request, response) {
  controller.users.signin(request, function (err, result) {
    console.log("Back in controller", result === null);
    if(result === null) {
      response.sendStatus(409);
      throw new Error("Sign in failed");
    } else if(err) {
      console.log(err);
      response.send(err.detail).status(409);
    } else {
      response.status(201).send(result);
      //render canvas
    }
  });
});

app.get('/api/signedin', function (request, response) {
  controller.users.checkAuth(request, function (err, result) {
    if (err) {
      response.sendStatus(409);
      throw new Error("Sign in failed");
    } else {
      response.sendStatus(200);
    }
  });
});

http.listen(3000, function() {
  console.log('listening on 3000');
});

module.exports = app;
