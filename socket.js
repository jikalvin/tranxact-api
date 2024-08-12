// socket.js
let io;

const chatController = require('./controllers/chatController');

module.exports = {
  init: httpServer => {
    if (io) {
      throw new Error('Socket.io already initialized!');
    }

    io = require('socket.io')(httpServer);
    return io;
  },
  getIo: () => {
    if (!io) {
      throw new Error('Socket.io not initialized!');
    }
    return io;
  },
  chat: async (data) => {
    if (!io) {
      throw new Error('Socket.io not initialized!');
    }
    const message = await chatController.sendMessage(data);
    io.emit('newMessage', message);
      throw new Error('Socket.io not initialized!');
    }
  }
// };
