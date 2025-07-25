// server.js - Main server file for Socket.io chat application

const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');

const app = express();
app.use(cors());
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST']
  }
});

let users = {};
let rooms = { global: { name: 'global', users: [] } };

io.on('connection', (socket) => {
  let username = null;
  let currentRoom = 'global';

  socket.on('login', (name, cb) => {
    if (!name || Object.values(users).find(u => u.username === name)) {
      return cb({ success: false, error: 'Username taken or invalid' });
    }
    username = name;
    users[socket.id] = { username, online: true };
    socket.join('global');
    rooms['global'].users.push(username);
    io.emit('onlineUsers', Object.values(users).map(u => u.username));
    io.emit('userJoined', username);
    cb({ success: true, username });
  });

  socket.on('sendMessage', ({ room, message }, cb) => {
    if (!username) return;
    const msg = {
      sender: username,
      message,
      timestamp: new Date().toISOString(),
      room: room || 'global',
      readBy: [username]
    };
    io.to(room || 'global').emit('message', msg);
    cb && cb({ delivered: true });
  });

  socket.on('typing', ({ room, typing }) => {
    if (!username) return;
    socket.to(room || 'global').emit('typing', { user: username, typing });
  });

  socket.on('joinRoom', (room, cb) => {
    if (!rooms[room]) rooms[room] = { name: room, users: [] };
    socket.leave(currentRoom);
    rooms[currentRoom].users = rooms[currentRoom].users.filter(u => u !== username);
    socket.join(room);
    rooms[room].users.push(username);
    currentRoom = room;
    io.emit('rooms', Object.keys(rooms));
    cb && cb({ joined: room });
  });

  socket.on('privateMessage', ({ to, message }, cb) => {
    const targetId = Object.keys(users).find(id => users[id].username === to);
    if (targetId) {
      const msg = {
        sender: username,
        message,
        timestamp: new Date().toISOString(),
        private: true,
        to
      };
      io.to(targetId).emit('privateMessage', msg);
      cb && cb({ delivered: true });
    }
  });

  socket.on('readMessage', ({ room, timestamp }) => {
    io.to(room || 'global').emit('readReceipt', { user: username, timestamp });
  });

  socket.on('disconnect', () => {
    if (username) {
      delete users[socket.id];
      Object.values(rooms).forEach(r => {
        r.users = r.users.filter(u => u !== username);
      });
      io.emit('onlineUsers', Object.values(users).map(u => u.username));
      io.emit('userLeft', username);
    }
  });
});

app.get('/', (req, res) => {
  res.send('Socket.io Chat Server Running');
});

server.listen(3001, () => {
  console.log('Server listening on port 3001');
}); 