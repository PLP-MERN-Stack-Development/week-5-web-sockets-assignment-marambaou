import React, { useState } from 'react';

function RoomList({ rooms, onJoin, currentRoom }) {
  const [newRoom, setNewRoom] = useState('');
  return (
    <div>
      <h4>Rooms</h4>
      <ul style={{ listStyle: 'none', padding: 0 }}>
        {rooms.map(r => (
          <li key={r}>
            <button onClick={() => onJoin(r)} style={{ fontWeight: r === currentRoom ? 'bold' : 'normal' }}>{r}</button>
          </li>
        ))}
      </ul>
      <form onSubmit={e => { e.preventDefault(); if (newRoom) { onJoin(newRoom); setNewRoom(''); } }}>
        <input value={newRoom} onChange={e => setNewRoom(e.target.value)} placeholder="New room" />
        <button type="submit">Add</button>
      </form>
    </div>
  );
}

export default RoomList; 