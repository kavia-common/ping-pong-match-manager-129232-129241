import React, { useState } from 'react';
import { useData } from '../context/DataContext';
import { Link } from 'react-router-dom';

// PUBLIC_INTERFACE
export default function Players() {
  /** Player management: add, toggle active, rename, delete. */
  const { players, addPlayer, updatePlayer, removePlayer, playerStats } = useData();
  const [name, setName] = useState('');
  const [err, setErr] = useState('');

  const onAdd = (e) => {
    e.preventDefault();
    setErr('');
    try {
      if (name.trim()) addPlayer(name.trim());
      setName('');
    } catch (e2) {
      setErr(e2.message);
    }
  };

  return (
    <div>
      <h2 className="section-title">Players</h2>
      <div className="card" style={{marginBottom: 16}}>
        <form onSubmit={onAdd} className="grid" style={{gridTemplateColumns: '1fr auto', gap: 8}}>
          <input className="input" placeholder="New player name" value={name} onChange={e=>setName(e.target.value)} />
          <button className="btn" type="submit">Add</button>
        </form>
        {err && <div className="badge" style={{marginTop: 8, background:'rgba(177,154,163,0.15)', color:'#b19aa3'}}>{err}</div>}
      </div>

      <div className="card">
        {players.length === 0 ? (
          <div>No players yet.</div>
        ) : (
          <table className="table">
            <thead>
              <tr><th>Name</th><th>Status</th><th>Record</th><th>Actions</th></tr>
            </thead>
            <tbody>
              {players.map(p => (
                <tr key={p.id}>
                  <td><Link to={`/players/${p.id}`}>{p.name}</Link></td>
                  <td>{p.active ? <span className="badge">Active</span> : <span className="badge" style={{background:'rgba(177,154,163,0.15)', color:'#b19aa3'}}>Inactive</span>}</td>
                  <td>{playerStats[p.id]?.wins || 0}W - {playerStats[p.id]?.losses || 0}L</td>
                  <td style={{display: 'flex', gap: 8}}>
                    <button className="btn ghost" onClick={()=>updatePlayer(p.id, { active: !p.active })}>
                      {p.active ? 'Deactivate' : 'Activate'}
                    </button>
                    <button className="btn secondary" onClick={()=>{
                      const newName = prompt('Rename player', p.name);
                      if (newName && newName.trim()) updatePlayer(p.id, { name: newName.trim() });
                    }}>Rename</button>
                    <button className="btn accent" onClick={()=>{
                      if (window.confirm('Delete player and related matches?')) removePlayer(p.id);
                    }}>Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
