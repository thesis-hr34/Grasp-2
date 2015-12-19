module.exports = function(socket) {
  socket.on('canvasChange', function(data) {
    socket.broadcast.emit('onCanvasChange', data);
  }); 
  socket.on('changePosition', function(data) {
    socket.broadcast.emit('updatePosition', data);
  }); 

  // // Chat events 
  // // when the client emits 'adduser', this listens and executes
  // client.on('adduser', function(username){
  //   // store the username in the socket session for this client
  //   socket.username = username;
  //   // store the room name in the socket session for this client
  //   socket.room = 'room1';
  //   // add the client's username to the global list
  //   usernames[username] = username;
  //   // send client to room 1
  //   socket.join('room1');
  //   // echo to client they've connected
  //   socket.emit('updatechat', 'SERVER', 'you have connected to room1');
  //   // echo to room 1 that a person has connected to their room
  //   socket.broadcast.to('room1').emit('updatechat', 'SERVER', username + ' has connected to this room');
  //   socket.emit('updaterooms', rooms, 'room1');
  // });

  // // when the client emits 'sendchat', this listens and executes
  // client.on('sendchat', function (data) {
  //   // we tell the client to execute 'updatechat' with 2 parameters
  //   io.sockets.in(socket.room).emit('updatechat', socket.username, data);
  // });
  // client.on('switchRoom', function(newroom){
  //     // leave the current room (stored in session)
  //     socket.leave(socket.room);
  //     // join new room, received as function parameter
  //     socket.join(newroom);
  //     socket.emit('updatechat', 'SERVER', 'you have connected to '+ newroom);
  //     // sent message to OLD room
  //     socket.broadcast.to(socket.room).emit('updatechat', 'SERVER', socket.username+' has left this room');
  //     // update socket session room title
  //     socket.room = newroom;
  //     socket.broadcast.to(newroom).emit('updatechat', 'SERVER', socket.username+' has joined this room');
  //     socket.emit('updaterooms', rooms, newroom);
  //   });

  // // when the user disconnects.. perform this
  // client.on('disconnect', function(){
  //   // remove the username from global usernames list
  //   delete usernames[socket.username];
  //   // update list of users in chat, client-side
  //   io.sockets.emit('updateusers', usernames);
  //   // echo globally that this client has left
  //   socket.broadcast.emit('updatechat', 'SERVER', socket.username + ' has disconnected');
  //   socket.leave(socket.room);
  // });

  socket.on('addMessage', function(data) {
    console.log(data)
    socket.emit('onMessageAdded', data); 
  }); 
}; 
