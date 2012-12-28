module.exports = function  (socket, sockets) {
  console.log("user connected: ", socket.handshake.user.role);
};