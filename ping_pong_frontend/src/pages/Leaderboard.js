import React from 'react';
import { useData } from '../context/DataContext';
import { Link } from 'react-router-dom';

// PUBLIC_INTERFACE
export default function Leaderboard() {
  /** Displays leaderboard derived from stats. */
  const { leaderboard } = useData();

  return (
    <div>
      <h2 className="section-title">Leaderboard</h2>
      <div className="card">
        {leaderboard.length === 0 ? 'No players yet.' : (
          <table className="table">
            <thead>
              <tr><th>#</th><th>Player</th><th>Wins</th><th>Losses</th><th>Win Rate</th><th>PF</th><th>PA</th></tr>
            </thead>
            <tbody>
              {leaderboard.map((p, idx) => (
                <tr key={p.id}>
                  <td>{idx + 1}</td>
                  <td><Link to={`/players/${p.id}`}>{p.name}</Link></td>
                  <td>{p.wins || 0}</td>
                  <td>{p.losses || 0}</td>
                  <td>{p.winRate || 0}%</td>
                  <td>{p.pointsFor || 0}</td>
                  <td>{p.pointsAgainst || 0}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
