import React, { useMemo } from 'react';
import { useParams } from 'react-router-dom';
import { useData } from '../context/DataContext';

// PUBLIC_INTERFACE
export default function PlayerStats() {
  /** Detailed stats for a specific player with recent matches. */
  const { id } = useParams();
  const { players, matches, playerStats } = useData();
  const player = players.find(p => p.id === id);

  const history = useMemo(() => matches.filter(m => m.p1 === id || m.p2 === id), [matches, id]);

  if (!player) return <div className="card">Player not found.</div>;

  const stats = playerStats[id];

  return (
    <div>
      <h2 className="section-title">Player: {player.name}</h2>
      <div className="grid cols-3">
        <div className="card kpi">
          <div className="label">Record</div>
          <div className="value">{stats.wins}W - {stats.losses}L</div>
        </div>
        <div className="card kpi">
          <div className="label">Win Rate</div>
          <div className="value">{stats.winRate}%</div>
        </div>
        <div className="card kpi">
          <div className="label">Points</div>
          <div className="value">{stats.pointsFor} PF / {stats.pointsAgainst} PA</div>
        </div>
      </div>

      <h3 className="section-title" style={{marginTop: 24}}>Match History</h3>
      <div className="card">
        {history.length === 0 ? 'No matches yet.' : (
          <table className="table">
            <thead>
              <tr><th>Date</th><th>Opponent</th><th>Score</th><th>Result</th></tr>
            </thead>
            <tbody>
              {history.map(m => {
                const isP1 = m.p1 === id;
                const myScore = isP1 ? m.p1Score : m.p2Score;
                const oppScore = isP1 ? m.p2Score : m.p1Score;
                const opp = players.find(p => p.id === (isP1 ? m.p2 : m.p1))?.name || '—';
                const result = m.winner === id ? 'Win' : 'Loss';
                return (
                  <tr key={m.id}>
                    <td>{new Date(m.date).toLocaleString()}</td>
                    <td>{opp}</td>
                    <td>{myScore} - {oppScore}</td>
                    <td><span className="badge" style={{background: result==='Win' ? 'rgba(84,192,96,0.15)' : 'rgba(177,154,163,0.15)', color: result==='Win' ? '#117e73' : '#b19aa3'}}>{result}</span></td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
