import React, { useState } from 'react';
import { createRoot } from 'react-dom/client';
import { AutoSizer, Column, Table } from 'react-virtualized';
import 'react-virtualized/styles.css';
import './styles.css';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:4000';

function Login() {
  const [mode, setMode] = useState('login');
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [status, setStatus] = useState('');
  const submit = async (event) => {
    event.preventDefault(); setStatus('Sending request…');
    const response = await fetch(`${API_URL}/api/auth/${mode === 'login' ? 'login' : 'register'}`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(form) });
    const body = await response.json();
    if (!response.ok) return setStatus(`Error: ${body.error}`);
    localStorage.setItem('streamweaver_token', body.token); setStatus(`Signed in as ${body.user.name}. JWT stored for ETL requests.`);
  };
  return <main><section className="card"><h1>StreamWeaver</h1><p>Login API test client</p><form onSubmit={submit}>
    {mode === 'register' && <input required placeholder="Name" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} />}
    <input required type="email" placeholder="Email" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} />
    <input required minLength="8" type="password" placeholder="Password" value={form.password} onChange={e => setForm({ ...form, password: e.target.value })} />
    <button>{mode === 'login' ? 'Log in' : 'Create account'}</button></form>
    <button className="link" onClick={() => { setMode(mode === 'login' ? 'register' : 'login'); setStatus(''); }}>{mode === 'login' ? 'Need an account?' : 'Already have an account?'}</button>
    <output>{status}</output></section><Preview /></main>;
}

function Preview() {
  const rows = Array.from({ length: 1000 }, (_, index) => ({ id: index + 1, firstName: `Preview ${index + 1}`, status: 'Ready' }));
  return <section className="preview"><h2>Virtualized CSV preview</h2><div className="table"><AutoSizer>{({ width, height }) => <Table width={width} height={height} headerHeight={38} rowHeight={32} rowCount={rows.length} rowGetter={({ index }) => rows[index]}>
    <Column label="#" dataKey="id" width={80} /><Column label="First name" dataKey="firstName" width={260} /><Column label="Status" dataKey="status" width={140} />
  </Table>}</AutoSizer></div></section>;
}
createRoot(document.getElementById('root')).render(<Login />);
