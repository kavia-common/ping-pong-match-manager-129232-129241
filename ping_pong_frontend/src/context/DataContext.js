import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { v4 as uuidv4 } from 'uuid';

const DataContext = createContext(null);

const STORE = {
  PLAYERS: 'pp.data.players',
  MATCHES: 'pp.data.matches'
};

function readJSON(key, fallback) {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch {
    return fallback;
  }
}

function writeJSON(key, value) {
  localStorage.setItem(key, JSON.stringify(value));
}

// PUBLIC_INTERFACE
export function useData() {
  /** Access to data context: players, matches, add/update operations, and derived stats. */
  return useContext(DataContext);
}

// PUBLIC_INTERFACE
export function DataProvider({ children }) {
  /** Manages players and matches with localStorage persistence. */
  const [players, setPlayers] = useState([]);
  const [matches, setMatches] = useState([]);

  useEffect(() => {
    const p = readJSON(STORE.PLAYERS, []);
    const m = readJSON(STORE.MATCHES, []);
    setPlayers(p);
    setMatches(m);
  }, []);

  useEffect(() => { writeJSON(STORE.PLAYERS, players); }, [players]);
  useEffect(() => { writeJSON(STORE.MATCHES, matches); }, [matches]);

  const addPlayer = (name) => {
    const exists = players.some(p => p.name.toLowerCase() === name.trim().toLowerCase());
    if (exists) throw new Error('Player already exists');
    const player = { id: uuidv4(), name: name.trim(), active: true, createdAt: new Date().toISOString() };
    setPlayers(prev => [...prev, player]);
    return player;
  };

  const updatePlayer = (id, patch) => {
    setPlayers(prev => prev.map(p => p.id === id ? { ...p, ...patch } : p));
  };

  const removePlayer = (id) => {
    setPlayers(prev => prev.filter(p => p.id !== id));
    setMatches(prev => prev.filter(m => m.p1 !== id && m.p2 !== id)); // clean matches
  };

  const recordMatch = ({ p1, p2, p1Score, p2Score, date }) => {
    if (p1 === p2) throw new Error('Players must be different');
    const match = {
      id: uuidv4(),
      p1, p2,
      p1Score: Number(p1Score),
      p2Score: Number(p2Score),
      winner: Number(p1Score) > Number(p2Score) ? p1 : p2,
      date: date || new Date().toISOString()
    };
    setMatches(prev => [match, ...prev]);
    return match;
  };

  const playerStats = useMemo(() => {
    const stats = {};
    players.forEach(p => stats[p.id] = { id: p.id, name: p.name, wins: 0, losses: 0, pointsFor: 0, pointsAgainst: 0, winRate: 0, streak: 0 });
    matches.forEach(m => {
      const p1 = stats[m.p1]; const p2 = stats[m.p2];
      if (!p1 || !p2) return;
      p1.pointsFor += m.p1Score; p1.pointsAgainst += m.p2Score;
      p2.pointsFor += m.p2Score; p2.pointsAgainst += m.p1Score;
      if (m.winner === m.p1) { p1.wins++; p2.losses++; }
      else { p2.wins++; p1.losses++; }
    });
    Object.values(stats).forEach(s => {
      const total = s.wins + s.losses;
      s.winRate = total ? Math.round((s.wins / total) * 100) : 0;
      // simple streak calc: last match outcome
      const last = matches.find(m => m.p1 === s.id || m.p2 === s.id);
      if (last) s.streak = last.winner === s.id ? 1 : -1;
    });
    return stats;
  }, [players, matches]);

  const leaderboard = useMemo(() => {
    return [...players]
      .map(p => ({ ...p, ...playerStats[p.id] }))
      .sort((a, b) => (b.wins - a.wins) || (b.winRate - a.winRate) || (b.pointsFor - a.pointsFor));
  }, [players, playerStats]);

  const value = {
    players, matches,
    addPlayer, updatePlayer, removePlayer,
    recordMatch,
    playerStats,
    leaderboard
  };

  return <DataContext.Provider value={value}>{children}</DataContext.Provider>;
}
