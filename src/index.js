const path = require('path');
const http = require('http');
const express = require('express');
const socketio = require('socket.io');
const Filter = require('bad-words');
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

  socket.on('join', ({ username, room }) => {
    console.log(username, room);
    // join given chat room and pass the name of the room to join

    // io.to.emit = on specific room for given users
    // socket.broadcast.to.emit = on all except for this current user

    socket.emit('message', generateMessage(randomWord(greetings)));
    socket.broadcast
      .to(room)
      .emit(
        'message',
        generateMessage(`username: ${username} has joined the chat!`)
      );

    socket.join(room);
  });

  socket.on('sendMessage', (message, callback) => {
    const filter = new Filter();

    if (filter.isProfane(message)) {
      return callback('Profanity is not allowed!');
    }

    io.emit('message', generateMessage(message));
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
    io.emit('message', generateMessage('A user has left!'));
  });
});

server.listen(port, () => {
  console.log(`Server is up on port ${port}!`);
});
