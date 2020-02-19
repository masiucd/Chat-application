const path = require('path');
const http = require('http');
const express = require('express');
const socketio = require('socket.io');
const Filter = require('bad-words');
const {
  getUser,
  getUsersInRoom,
  removeUser,
  addUser,
} = require('./utils/users');
const {
  generateMessage,
  generateLocationMessage,
} = require('./utils/messages');

const app = express();
const server = http.createServer(app);
const io = socketio(server);
const { randomWord, greetings } = require('./utils/helpers');

const port = process.env.PORT || 5000;
const publicDirectoryPath = path.join(__dirname, '../public');

app.use(express.static(publicDirectoryPath));

io.on('connection', socket => {
  console.log('New WebSocket connection');

  socket.on('join', ({ username, room }, cb) => {
    const { error, user } = addUser({ id: socket.id, username, room });

    if (error) {
      return cb(error);
    }

    socket.join(user.room);

    socket.emit('message', generateMessage(randomWord(greetings)));
    socket.broadcast
      .to(user.room)
      .emit(
        'message',
        generateMessage(`username: ${user.username} has joined the chat!`)
      );
    // send back callback without an error, everyting went well
    cb();
  });

  socket.on('sendMessage', (message, callback) => {
    const filter = new Filter();

    if (filter.isProfane(message)) {
      return callback('Profanity is not allowed!');
    }

    // TODO: Change it to dynamic
    io.to('123').emit('message', generateMessage(message));
    callback();
  });

  socket.on('sendLocation', (coords, callback) => {
    io.emit(
      'locationMessage',
      generateLocationMessage(
        `https://google.com/maps?q=${coords.latitude},${coords.longitude}`
      )
    );
    callback();
  });

  socket.on('disconnect', () => {
    const user = removeUser(socket.id);

    if (user) {
      io.to(user.room).emit(
        'message',
        generateMessage(`${user.username} has left the chat!`)
      );
    }
  });
});

server.listen(port, () => {
  console.log(`Server is up on port ${port}!`);
});
