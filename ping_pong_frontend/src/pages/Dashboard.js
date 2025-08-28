import React from 'react';
import { useData } from '../context/DataContext';
import { Link } from 'react-router-dom';

// PUBLIC_INTERFACE
export default function Dashboard() {
  /** Overview KPIs, recent matches, top players. */
  const { players, matches, leaderboard } = useData();

  const totalMatches = matches.length;
  const totalPlayers = players.length;
  const top = leaderboard[0];

  return (
    <div>
      <h2 className="section-title">Overview</h2>
      <div className="grid cols-3">
        <div className="card kpi">
          <div className="label">Players</div>
          <div className="value">{totalPlayers}</div>
        </div>
        <div className="card kpi">
          <div className="label">Matches</div>
          <div className="value">{totalMatches}</div>
        </div>
        <div className="card kpi">
          <div className="label">Top Player</div>
          <div className="value">{top ? top.name : '—'}</div>
          {top && <div className="badge">{top.wins}W · {top.losses}L · {top.winRate}%</div>}
        </div>
      </div>

      <h3 className="section-title" style={{marginTop: 24}}>Recent Matches</h3>
      <div className="card">
        {matches.length === 0 ? (
          <div>No matches yet. <Link to="/matches">Record your first match</Link>.</div>
        ) : (
          <table className="table">
            <thead>
              <tr>
                <th>Date</th><th>Player 1</th><th>Score</th><th>Player 2</th><th>Winner</th>
              </tr>
            </thead>
            <tbody>
              {matches.slice(0, 5).map(m => (
                <tr key={m.id}>
                  <td>{new Date(m.date).toLocaleString()}</td>
                  <td>{players.find(p=>p.id===m.p1)?.name || 'Deleted'}</td>
                  <td>{m.p1Score} - {m.p2Score}</td>
                  <td>{players.find(p=>p.id===m.p2)?.name || 'Deleted'}</td>
                  <td><span className="badge">{players.find(p=>p.id===m.winner)?.name || '—'}</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
