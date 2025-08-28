import React, { useState } from 'react';
import { useData } from '../context/DataContext';

// PUBLIC_INTERFACE
export default function Matches() {
  /** Record match results and list recent matches. */
  const { players, matches, recordMatch } = useData();
  const [form, setForm] = useState({ p1: '', p2: '', p1Score: 11, p2Score: 7 });

  const onSubmit = (e) => {
    e.preventDefault();
    recordMatch(form);
    setForm({ p1: '', p2: '', p1Score: 11, p2Score: 7 });
  };

  return (
    <div>
      <h2 className="section-title">Record Match</h2>
      <div className="card" style={{marginBottom: 16}}>
        <form onSubmit={onSubmit} className="grid cols-3">
          <div>
            <div className="label">Player 1</div>
            <select value={form.p1} onChange={e=>setForm({...form, p1: e.target.value})}>
              <option value="">Select Player 1</option>
              {players.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
            </select>
          </div>
          <div>
            <div className="label">Player 2</div>
            <select value={form.p2} onChange={e=>setForm({...form, p2: e.target.value})}>
              <option value="">Select Player 2</option>
              {players.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
            </select>
          </div>
          <div>
            <div className="label">Scores</div>
            <div className="grid" style={{gridTemplateColumns: '1fr 1fr', gap: 8}}>
              <input className="input" type="number" min="0" value={form.p1Score}
                onChange={e=>setForm({...form, p1Score: e.target.value})}/>
              <input className="input" type="number" min="0" value={form.p2Score}
                onChange={e=>setForm({...form, p2Score: e.target.value})}/>
            </div>
          </div>
          <div style={{gridColumn: '1 / -1', display: 'flex', gap: 8}}>
            <button className="btn" type="submit" disabled={!form.p1 || !form.p2 || form.p1===form.p2}>Save Result</button>
            <button type="button" className="btn ghost" onClick={()=>setForm({ p1:'', p2:'', p1Score:11, p2Score:7})}>Reset</button>
          </div>
        </form>
      </div>

      <div className="card">
        <div className="label" style={{marginBottom: 8}}>Recent Matches</div>
        {matches.length === 0 ? 'No matches yet.' : (
          <table className="table">
            <thead>
              <tr><th>Date</th><th>Players</th><th>Score</th><th>Winner</th></tr>
            </thead>
            <tbody>
              {matches.map(m => (
                <MatchRow key={m.id} match={m} />
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}

function MatchRow({ match }) {
  const { players } = useData();
  const p1 = players.find(p=>p.id===match.p1)?.name || '—';
  const p2 = players.find(p=>p.id===match.p2)?.name || '—';
  const winner = players.find(p=>p.id===match.winner)?.name || '—';

  return (
    <tr>
      <td>{new Date(match.date).toLocaleString()}</td>
      <td>{p1} vs {p2}</td>
      <td>{match.p1Score} - {match.p2Score}</td>
      <td><span className="badge">{winner}</span></td>
    </tr>
  );
}
