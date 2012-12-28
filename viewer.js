module.exports = function  (socket, sockets) {
  // this entire file may end up being extraneous
  console.log("viewer connected.");

  socket.emit('presenter', false);
};