import React from 'react';
import { BrowserRouter, Routes, Route, NavLink, Navigate } from 'react-router-dom';
import './App.css';
import { AuthProvider, useAuth } from './context/AuthContext';
import { DataProvider } from './context/DataContext';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Players from './pages/Players';
import Matches from './pages/Matches';
import Leaderboard from './pages/Leaderboard';
import PlayerStats from './pages/PlayerStats';

// PUBLIC_INTERFACE
function App() {
  /** Root app with providers and routing. */
  return (
    <AuthProvider>
      <DataProvider>
        <BrowserRouter>
          <AppLayout />
        </BrowserRouter>
      </DataProvider>
    </AuthProvider>
  );
}

function AppLayout() {
  const { user, logout } = useAuth();

  return (
    <div className="app-shell">
      <header className="header">
        <div className="brand">
          <div className="brand-badge">PP</div>
          Ping Pong Manager
        </div>
        <nav className="nav" aria-label="Primary Navigation">
          {user ? (
            <>
              <NavLink to="/" end className={({isActive}) => isActive ? 'active' : undefined}>Dashboard</NavLink>
              <NavLink to="/matches" className={({isActive}) => isActive ? 'active' : undefined}>Matches</NavLink>
              <NavLink to="/players" className={({isActive}) => isActive ? 'active' : undefined}>Players</NavLink>
              <NavLink to="/leaderboard" className={({isActive}) => isActive ? 'active' : undefined}>Leaderboard</NavLink>
              <button className="btn ghost" onClick={logout} aria-label="Logout">Logout</button>
            </>
          ) : (
            <>
              <NavLink to="/login" className={({isActive}) => isActive ? 'active' : undefined}>Login</NavLink>
              <NavLink to="/register" className={({isActive}) => isActive ? 'active' : undefined}>Register</NavLink>
            </>
          )}
        </nav>
      </header>

      {user ? <Sidebar /> : <div className="sidebar"></div>}

      <main className="main">
        <Routes>
          {user ? (
            <>
              <Route path="/" element={<Dashboard />} />
              <Route path="/matches" element={<Matches />} />
              <Route path="/players" element={<Players />} />
              <Route path="/leaderboard" element={<Leaderboard />} />
              <Route path="/players/:id" element={<PlayerStats />} />
              <Route path="*" element={<Navigate to="/" replace />} />
            </>
          ) : (
            <>
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="*" element={<Navigate to="/login" replace />} />
            </>
          )}
        </Routes>
      </main>
    </div>
  );
}

function Sidebar() {
  return (
    <aside className="sidebar">
      <div className="card" style={{marginBottom: 16}}>
        <div className="label">Quick Actions</div>
        <div className="grid" style={{marginTop: 10}}>
          <NavLink to="/matches" className="btn">Record Match</NavLink>
          <NavLink to="/players" className="btn secondary">Manage Players</NavLink>
          <NavLink to="/leaderboard" className="btn accent">View Leaderboard</NavLink>
        </div>
      </div>
      <div className="card">
        <div className="label">Tips</div>
        <ul style={{margin: '10px 0 0 16px'}}>
          <li>Click a player to view detailed stats.</li>
          <li>Use Matches to record results quickly.</li>
          <li>Leaderboard updates automatically.</li>
        </ul>
      </div>
    </aside>
  );
}

export default App;
