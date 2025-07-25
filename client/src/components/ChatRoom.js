import React, { useState, useEffect, useRef } from 'react';
import socket from '../socket/socket';
import MessageList from './MessageList';
import MessageInput from './MessageInput';

function ChatRoom({ room, username }) {
  const [messages, setMessages] = useState([]);
  const [typingUsers, setTypingUsers] = useState([]);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    setMessages([]);
    socket.emit('joinRoom', room);
    const onMessage = (msg) => {
      if (msg.room === room) setMessages((msgs) => [...msgs, msg]);
    };
    const onTyping = ({ user, typing }) => {
      setTypingUsers((users) => {
        if (typing) return [...new Set([...users, user])];
        return users.filter(u => u !== user);
      });
    };
    const onReadReceipt = ({ user, timestamp }) => {
      setMessages((msgs) =>
        msgs.map(m =>
          m.timestamp === timestamp ? { ...m, readBy: [...(m.readBy || []), user] } : m
        )
      );
    };
    socket.on('message', onMessage);
    socket.on('typing', onTyping);
    socket.on('readReceipt', onReadReceipt);
    return () => {
      socket.off('message', onMessage);
      socket.off('typing', onTyping);
      socket.off('readReceipt', onReadReceipt);
    };
  }, [room]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = (text) => {
    socket.emit('sendMessage', { room, message: text }, () => {
      // Optionally handle delivery ack
    });
  };

  const handleTyping = (typing) => {
    socket.emit('typing', { room, typing });
  };

  const handleRead = (timestamp) => {
    socket.emit('readMessage', { room, timestamp });
  };

  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
      <h3>Room: {room}</h3>
      <div style={{ flex: 1, overflowY: 'auto', padding: 10 }}>
        <MessageList messages={messages} self={username} onRead={handleRead} />
        <div ref={messagesEndRef} />
        {typingUsers.length > 0 && (
          <div style={{ fontStyle: 'italic', color: '#888' }}>
            {typingUsers.join(', ')} typing...
          </div>
        )}
      </div>
      <MessageInput onSend={handleSend} onTyping={handleTyping} />
    </div>
  );
}

export default ChatRoom; 