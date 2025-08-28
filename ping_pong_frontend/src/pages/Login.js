import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Navigate, useNavigate } from 'react-router-dom';

// PUBLIC_INTERFACE
export default function Login() {
  /** Login form with email/password using AuthContext. */
  const { user, login } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: '', password: '' });
  const [err, setErr] = useState('');

  if (user) return <Navigate to="/" replace />;

  const onSubmit = (e) => {
    e.preventDefault();
    setErr('');
    try {
      login(form.email, form.password);
      navigate('/');
    } catch (e2) {
      setErr(e2.message);
    }
  };

  return (
    <div className="main">
      <div className="card" style={{maxWidth: 420, margin: '40px auto'}}>
        <h2 className="section-title">Welcome back</h2>
        <form onSubmit={onSubmit} className="grid" style={{gap: 12}}>
          <div>
            <div className="label">Email</div>
            <input className="input" type="email" required
              value={form.email} onChange={e=>setForm({...form, email: e.target.value})}/>
          </div>
          <div>
            <div className="label">Password</div>
            <input className="input" type="password" required
              value={form.password} onChange={e=>setForm({...form, password: e.target.value})}/>
          </div>
          {err && <div className="badge" style={{background:'rgba(177,154,163,0.15)', color:'#b19aa3'}}>{err}</div>}
          <button className="btn" type="submit">Login</button>
        </form>
      </div>
    </div>
  );
}
