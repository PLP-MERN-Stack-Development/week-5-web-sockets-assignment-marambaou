import React, { useState, useRef } from 'react';

function MessageInput({ onSend, onTyping }) {
  const [text, setText] = useState('');
  const typing = useRef(false);
  let typingTimeout = useRef(null);

  const handleChange = (e) => {
    setText(e.target.value);
    if (!typing.current) {
      typing.current = true;
      onTyping(true);
    }
    clearTimeout(typingTimeout.current);
    typingTimeout.current = setTimeout(() => {
      typing.current = false;
      onTyping(false);
    }, 1000);
  };

  const handleSend = (e) => {
    e.preventDefault();
    if (text.trim()) {
      onSend(text);
      setText('');
      onTyping(false);
      typing.current = false;
      clearTimeout(typingTimeout.current);
    }
  };

  return (
    <form onSubmit={handleSend} style={{ display: 'flex', gap: 8, padding: 8 }}>
      <input
        value={text}
        onChange={handleChange}
        placeholder="Type a message..."
        style={{ flex: 1 }}
      />
      <button type="submit">Send</button>
    </form>
  );
}

export default MessageInput; 