import React from 'react';

function UserList({ users, onPrivate, self }) {
  return (
    <div>
      <h4>Online Users</h4>
      <ul style={{ listStyle: 'none', padding: 0 }}>
        {users.filter(u => u !== self).map(u => (
          <li key={u}>
            <button onClick={() => onPrivate(u)} style={{ background: 'none', border: 'none', color: 'blue', cursor: 'pointer' }}>{u}</button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default UserList; 