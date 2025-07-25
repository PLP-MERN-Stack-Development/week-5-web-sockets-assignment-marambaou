import React, { useState, useEffect } from 'react';
import socket from './socket/socket';
import ChatRoom from './components/ChatRoom';
import UserList from './components/UserList';
import RoomList from './components/RoomList';
import PrivateChat from './components/PrivateChat';

function App() {
  const [username, setUsername] = useState('');
  const [loggedIn, setLoggedIn] = useState(false);
  const [onlineUsers, setOnlineUsers] = useState([]);
  const [rooms, setRooms] = useState(['global']);
  const [currentRoom, setCurrentRoom] = useState('global');
  const [privateChatUser, setPrivateChatUser] = useState(null);

  useEffect(() => {
    socket.on('onlineUsers', setOnlineUsers);
    socket.on('rooms', setRooms);
    return () => {
      socket.off('onlineUsers');
      socket.off('rooms');
    };
  }, []);

  const handleLogin = (e) => {
    e.preventDefault();
    socket.emit('login', username, (res) => {
      if (res.success) setLoggedIn(true);
      else alert(res.error);
    });
  };

  if (!loggedIn) {
    return (
      <div style={{ padding: 40 }}>
        <h2>Login</h2>
        <form onSubmit={handleLogin}>
          <input value={username} onChange={e => setUsername(e.target.value)} placeholder="Enter username" required />
          <button type="submit">Join Chat</button>
        </form>
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', height: '100vh' }}>
      <div style={{ width: 200, borderRight: '1px solid #ccc', padding: 10 }}>
        <UserList users={onlineUsers} onPrivate={setPrivateChatUser} self={username} />
        <RoomList rooms={rooms} onJoin={setCurrentRoom} currentRoom={currentRoom} />
      </div>
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
        {privateChatUser ? (
          <PrivateChat user={privateChatUser} onClose={() => setPrivateChatUser(null)} self={username} />
        ) : (
          <ChatRoom room={currentRoom} username={username} />
        )}
      </div>
    </div>
  );
}

export default App; 