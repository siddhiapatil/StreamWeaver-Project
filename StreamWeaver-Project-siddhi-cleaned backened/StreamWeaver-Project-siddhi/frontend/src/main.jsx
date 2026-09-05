import React, { useEffect, useState } from 'react';
import { createRoot } from 'react-dom/client';
import { AutoSizer, Column, Table } from 'react-virtualized';
import 'react-virtualized/styles.css';
import './styles.css';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:4000';
const TOKEN_KEY = 'streamweaver_token';
const USER_KEY = 'streamweaver_user';

// Shared fetch helper: attaches the JWT, and normalizes the backend's
// { success, error: { code, message } } shape into a thrown Error.
async function api(path, { method = 'GET', body, token } = {}) {
  const response = await fetch(`${API_URL}${path}`, {
    method,
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {})
    },
    body: body ? JSON.stringify(body) : undefined
  });
  const isJson = response.headers.get('content-type')?.includes('application/json');
  const data = isJson ? await response.json() : null;
  if (!response.ok) {
    const message = data?.error?.message || data?.error || `Request failed (${response.status}).`;
    throw new Error(message);
  }
  return data;
}

function Login({ onAuthenticated }) {
  const [mode, setMode] = useState('login');
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [status, setStatus] = useState('');

  const submit = async (event) => {
    event.preventDefault();
    setStatus('Sending request…');
    try {
      const data = await api(`/api/auth/${mode === 'login' ? 'login' : 'register'}`, { method: 'POST', body: form });
      localStorage.setItem(TOKEN_KEY, data.token);
      localStorage.setItem(USER_KEY, JSON.stringify(data.user));
      setStatus(`Signed in as ${data.user.name}.`);
      onAuthenticated(data.token, data.user);
    } catch (error) {
      setStatus(`Error: ${error.message}`);
    }
  };

  return (
    <section className="card">
      <h1>StreamWeaver</h1>
      <p>Login API test client</p>
      <form onSubmit={submit}>
        {mode === 'register' && (
          <input required placeholder="Name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
        )}
        <input required type="email" placeholder="Email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
        <input required minLength="8" type="password" placeholder="Password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} />
        <button>{mode === 'login' ? 'Log in' : 'Create account'}</button>
      </form>
      <button className="link" onClick={() => { setMode(mode === 'login' ? 'register' : 'login'); setStatus(''); }}>
        {mode === 'login' ? 'Need an account?' : 'Already have an account?'}
      </button>
      <output>{status}</output>
    </section>
  );
}

function PipelineForm({ token, editing, onSaved, onCancel }) {
  const [name, setName] = useState(editing?.name || '');
  const [mappings, setMappings] = useState(editing?.mappings?.length ? editing.mappings : [{ source: '', destination: '', transform: '' }]);
  const [status, setStatus] = useState('');

  const updateMapping = (index, field, value) => {
    setMappings((rows) => rows.map((row, i) => (i === index ? { ...row, [field]: value } : row)));
  };
  const addMapping = () => setMappings((rows) => [...rows, { source: '', destination: '', transform: '' }]);
  const removeMapping = (index) => setMappings((rows) => rows.filter((_, i) => i !== index));

  const submit = async (event) => {
    event.preventDefault();
    setStatus('Saving…');
    try {
      const payload = { name, mappings: mappings.filter((m) => m.source && m.destination) };
      const data = editing
        ? await api(`/api/pipelines/${editing._id}`, { method: 'PUT', body: payload, token })
        : await api('/api/pipelines', { method: 'POST', body: payload, token });
      setStatus('Saved.');
      onSaved(data.pipeline);
    } catch (error) {
      setStatus(`Error: ${error.message}`);
    }
  };

  return (
    <form className="pipeline-form" onSubmit={submit}>
      <input required placeholder="Pipeline name" value={name} onChange={(e) => setName(e.target.value)} />
      <div className="mappings">
        <span className="label">Column mappings (source → destination)</span>
        {mappings.map((row, index) => (
          <div className="mapping-row" key={index}>
            <input required placeholder="source column" value={row.source} onChange={(e) => updateMapping(index, 'source', e.target.value)} />
            <input required placeholder="destination field" value={row.destination} onChange={(e) => updateMapping(index, 'destination', e.target.value)} />
            <input placeholder="transform (optional JS)" value={row.transform} onChange={(e) => updateMapping(index, 'transform', e.target.value)} />
            <button type="button" className="link small" onClick={() => removeMapping(index)}>✕</button>
          </div>
        ))}
        <button type="button" className="link small" onClick={addMapping}>+ Add mapping</button>
      </div>
      <div className="form-actions">
        <button>{editing ? 'Update pipeline' : 'Save pipeline'}</button>
        {editing && <button type="button" className="link" onClick={onCancel}>Cancel</button>}
      </div>
      <output>{status}</output>
    </form>
  );
}

function RunPanel({ token, pipeline }) {
  const [sourceJobId, setSourceJobId] = useState('');
  const [run, setRun] = useState(null);
  const [status, setStatus] = useState('');

  // Poll run status every 2s while it's still RUNNING.
  useEffect(() => {
    if (!run || run.status !== 'RUNNING') return;
    const timer = setInterval(async () => {
      try {
        const data = await api(`/api/pipelines/${pipeline._id}/runs/${run.id}`, { token });
        setRun({ ...data.run, id: data.run._id || data.run.id });
      } catch (error) {
        setStatus(`Error checking status: ${error.message}`);
      }
    }, 2000);
    return () => clearInterval(timer);
  }, [run, pipeline._id, token]);

  const triggerRun = async (event) => {
    event.preventDefault();
    setStatus('Triggering run…');
    try {
      const data = await api(`/api/pipelines/${pipeline._id}/run`, { method: 'POST', body: { sourceJobId }, token });
      setRun(data.run);
      setStatus('');
    } catch (error) {
      setStatus(`Error: ${error.message}`);
    }
  };

  return (
    <div className="run-panel">
      <form onSubmit={triggerRun} className="run-form">
        <input required placeholder="Source upload job id" value={sourceJobId} onChange={(e) => setSourceJobId(e.target.value)} />
        <button>Run pipeline</button>
      </form>
      <output>{status}</output>
      {run && (
        <div className="run-status">
          <span className={`badge badge-${run.status?.toLowerCase()}`}>{run.status}</span>
          <span className="run-meta">processed: {run.processedRows ?? 0} · inserted: {run.insertedRows ?? 0}</span>
          {run.error?.message && <p className="run-error">{run.error.message}</p>}
          {run.steps?.length > 0 && (
            <ul className="steps">
              {run.steps.map((step) => (
                <li key={step.name}>
                  <span className={`badge badge-${step.status?.toLowerCase()}`}>{step.status}</span> {step.name}
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  );
}

function Dashboard({ token, user, onLogout }) {
  const [pipelines, setPipelines] = useState([]);
  const [status, setStatus] = useState('');
  const [editing, setEditing] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [selected, setSelected] = useState(null);

  const loadPipelines = async () => {
    setStatus('Loading pipelines…');
    try {
      const data = await api('/api/pipelines', { token });
      setPipelines(data.pipelines);
      setStatus('');
    } catch (error) {
      setStatus(`Error: ${error.message}`);
    }
  };

  useEffect(() => { loadPipelines(); }, []);

  const handleSaved = (pipeline) => {
    setShowForm(false);
    setEditing(null);
    loadPipelines();
    setSelected(pipeline);
  };

  const deletePipeline = async (id) => {
    if (!confirm('Delete this pipeline?')) return;
    try {
      await api(`/api/pipelines/${id}`, { method: 'DELETE', token });
      if (selected?._id === id) setSelected(null);
      loadPipelines();
    } catch (error) {
      setStatus(`Error: ${error.message}`);
    }
  };

  return (
    <section className="card dashboard">
      <div className="dashboard-header">
        <div>
          <h1>StreamWeaver</h1>
          <p>Signed in as {user?.name}</p>
        </div>
        <button className="link" onClick={onLogout}>Log out</button>
      </div>

      <div className="dashboard-actions">
        <button onClick={() => { setEditing(null); setShowForm(true); }}>+ New pipeline</button>
        <button className="link" onClick={loadPipelines}>Refresh</button>
      </div>
      <output>{status}</output>

      {showForm && (
        <PipelineForm
          token={token}
          editing={editing}
          onSaved={handleSaved}
          onCancel={() => { setShowForm(false); setEditing(null); }}
        />
      )}

      <ul className="pipeline-list">
        {pipelines.map((pipeline) => (
          <li key={pipeline._id} className={selected?._id === pipeline._id ? 'active' : ''}>
            <div className="pipeline-row">
              <button className="link pipeline-name" onClick={() => setSelected(pipeline)}>{pipeline.name}</button>
              <span className="pipeline-meta">{pipeline.mappings?.length || 0} mappings</span>
              <button className="link small" onClick={() => { setEditing(pipeline); setShowForm(true); }}>Edit</button>
              <button className="link small" onClick={() => deletePipeline(pipeline._id)}>Delete</button>
            </div>
          </li>
        ))}
        {pipelines.length === 0 && !status && <p className="empty">No pipelines yet. Create one above.</p>}
      </ul>

      {selected && (
        <div className="selected-pipeline">
          <h2>Run: {selected.name}</h2>
          <RunPanel token={token} pipeline={selected} />
        </div>
      )}
    </section>
  );
}

function Preview() {
  const rows = Array.from({ length: 1000 }, (_, index) => ({ id: index + 1, firstName: `Preview ${index + 1}`, status: 'Ready' }));
  return (
    <section className="preview">
      <h2>Virtualized CSV preview</h2>
      <div className="table">
        <AutoSizer>
          {({ width, height }) => (
            <Table width={width} height={height} headerHeight={38} rowHeight={32} rowCount={rows.length} rowGetter={({ index }) => rows[index]}>
              <Column label="#" dataKey="id" width={80} />
              <Column label="First name" dataKey="firstName" width={260} />
              <Column label="Status" dataKey="status" width={140} />
            </Table>
          )}
        </AutoSizer>
      </div>
    </section>
  );
}

function App() {
  const [token, setToken] = useState(() => localStorage.getItem(TOKEN_KEY));
  const [user, setUser] = useState(() => {
    const raw = localStorage.getItem(USER_KEY);
    return raw ? JSON.parse(raw) : null;
  });

  const handleLogout = () => {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
    setToken(null);
    setUser(null);
  };

  return (
    <main>
      {token ? <Dashboard token={token} user={user} onLogout={handleLogout} /> : <Login onAuthenticated={(t, u) => { setToken(t); setUser(u); }} />}
      <Preview />
    </main>
  );
}

createRoot(document.getElementById('root')).render(<App />);
