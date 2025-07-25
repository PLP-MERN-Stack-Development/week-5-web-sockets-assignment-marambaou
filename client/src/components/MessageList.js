import React from 'react';

function MessageList({ messages, self, onRead }) {
  React.useEffect(() => {
    if (messages.length > 0) {
      const last = messages[messages.length - 1];
      if (last.sender !== self && onRead) {
        onRead(last.timestamp);
      }
    }
  }, [messages, self, onRead]);

  return (
    <div>
      {messages.map((msg, i) => (
        <div key={i} style={{ margin: '8px 0', textAlign: msg.sender === self ? 'right' : 'left' }}>
          <div><b>{msg.sender}</b> <span style={{ fontSize: 12, color: '#888' }}>{new Date(msg.timestamp).toLocaleTimeString()}</span></div>
          <div>{msg.message}</div>
          {msg.readBy && msg.readBy.length > 1 && (
            <div style={{ fontSize: 10, color: '#0a0' }}>Read by: {msg.readBy.join(', ')}</div>
          )}
        </div>
      ))}
    </div>
  );
}

export default MessageList; 