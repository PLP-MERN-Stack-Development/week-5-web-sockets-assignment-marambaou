import React, { useState, useEffect, useRef } from 'react';
import socket from '../socket/socket';
import MessageInput from './MessageInput';

function PrivateChat({ user, onClose, self }) {
  const [messages, setMessages] = useState([]);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    const onPrivateMessage = (msg) => {
      if ((msg.sender === user && msg.to === self) || (msg.sender === self && msg.to === user)) {
        setMessages((msgs) => [...msgs, msg]);
      }
    };
    socket.on('privateMessage', onPrivateMessage);
    return () => {
      socket.off('privateMessage', onPrivateMessage);
    };
  }, [user, self]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = (text) => {
    socket.emit('privateMessage', { to: user, message: text }, () => {});
    setMessages((msgs) => [
      ...msgs,
      { sender: self, to: user, message: text, timestamp: new Date().toISOString(), private: true }
    ]);
  };

  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
      <div style={{ display: 'flex', alignItems: 'center', borderBottom: '1px solid #ccc', padding: 8 }}>
        <b>Private chat with {user}</b>
        <button onClick={onClose} style={{ marginLeft: 'auto' }}>Close</button>
      </div>
      <div style={{ flex: 1, overflowY: 'auto', padding: 10 }}>
        {messages.map((msg, i) => (
          <div key={i} style={{ margin: '8px 0', textAlign: msg.sender === self ? 'right' : 'left' }}>
            <div><b>{msg.sender}</b> <span style={{ fontSize: 12, color: '#888' }}>{new Date(msg.timestamp).toLocaleTimeString()}</span></div>
            <div>{msg.message}</div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>
      <MessageInput onSend={handleSend} onTyping={() => {}} />
    </div>
  );
}

export default PrivateChat; 