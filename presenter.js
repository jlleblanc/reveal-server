module.exports = function  (socket, sockets) {
  console.log("user connected: ", socket.handshake.user.role);

  socket.emit('presenter', true);

  socket.on('slidechanged', function  (data) {
    console.log(data);
    socket.broadcast.emit('slidechanged', data);
  });

  socket.on('fragmentchanged', function  (data) {
    console.log(data);
    socket.broadcast.emit('fragmentdata', data);
  });

};