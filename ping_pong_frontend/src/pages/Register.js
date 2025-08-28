import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Navigate, useNavigate } from 'react-router-dom';

// PUBLIC_INTERFACE
export default function Register() {
  /** Registration form for name, email, password. */
  const { user, register } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [err, setErr] = useState('');

  if (user) return <Navigate to="/" replace />;

  const onSubmit = (e) => {
    e.preventDefault();
    setErr('');
    try {
      register(form.name.trim(), form.email.trim(), form.password);
      navigate('/');
    } catch (e2) {
      setErr(e2.message);
    }
  };

  return (
    <div className="main">
      <div className="card" style={{maxWidth: 480, margin: '40px auto'}}>
        <h2 className="section-title">Create your account</h2>
        <form onSubmit={onSubmit} className="grid" style={{gap: 12}}>
          <div>
            <div className="label">Name</div>
            <input className="input" required
              value={form.name} onChange={e=>setForm({...form, name: e.target.value})}/>
          </div>
          <div>
            <div className="label">Email</div>
            <input className="input" type="email" required
              value={form.email} onChange={e=>setForm({...form, email: e.target.value})}/>
          </div>
          <div>
            <div className="label">Password</div>
            <input className="input" type="password" required minLength={6}
              value={form.password} onChange={e=>setForm({...form, password: e.target.value})}/>
          </div>
          {err && <div className="badge" style={{background:'rgba(177,154,163,0.15)', color:'#b19aa3'}}>{err}</div>}
          <button className="btn" type="submit">Register</button>
        </form>
      </div>
    </div>
  );
}
