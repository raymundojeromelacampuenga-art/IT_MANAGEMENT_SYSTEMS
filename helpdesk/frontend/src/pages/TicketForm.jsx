import { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { api, CATEGORIES, PRIORITIES, STATUSES } from '../api.js';

const EMPTY = {
  requester_name: '', requester_email: '', issue_category: '',
  priority: '', subject: '', description: '', status: 'Open',
};
const LABELS = {
  requester_name: 'Requester name', requester_email: 'Requester email',
  issue_category: 'Issue category', priority: 'Priority',
  subject: 'Subject', description: 'Description',
};

function validate(f) {
  const e = {};
  Object.keys(LABELS).forEach((k) => {
    if (!String(f[k]).trim()) e[k] = `${LABELS[k]} is required.`;
  });
  if (!e.requester_email && !/^\S+@\S+\.\S+$/.test(f.requester_email)) {
    e.requester_email = 'Enter a valid email address.';
  }
  return e;
}

export default function TicketForm() {
  const { id } = useParams();
  const editing = Boolean(id);
  const navigate = useNavigate();
  const [form, setForm] = useState(EMPTY);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(editing);
  const [saving, setSaving] = useState(false);
  const [loadError, setLoadError] = useState('');

  useEffect(() => {
    if (!editing) return;
    api.get(id)
      .then((t) => setForm({ ...EMPTY, ...t }))
      .catch((e) => setLoadError(e.message))
      .finally(() => setLoading(false));
  }, [id, editing]);

  const set = (k) => (e) => {
    setForm({ ...form, [k]: e.target.value });
    if (errors[k]) setErrors({ ...errors, [k]: undefined });
  };

  const submit = async (e) => {
    e.preventDefault();
    const found = validate(form);
    setErrors(found);
    if (Object.keys(found).length) return;

    setSaving(true);
    try {
      if (editing) {
        await api.update(id, form);
        navigate(`/tickets/${id}`, { state: { notice: 'Ticket updated.' } });
      } else {
        const t = await api.create(form);
        navigate('/', { state: { notice: `Ticket ${t.ticket_number} created.` } });
      }
    } catch (err) {
      const server = {};
      Object.entries(err.errors || {}).forEach(([k, v]) => (server[k] = v[0]));
      setErrors({ ...server, general: Object.keys(server).length ? 'Fix the highlighted fields.' : err.message });
      setSaving(false);
    }
  };

  if (loading) return <p className="muted">Loading ticket…</p>;
  if (loadError) return <p className="alert" role="alert">{loadError}</p>;

  const field = (k, input) => (
    <label className={errors[k] ? 'invalid' : ''}>
      {LABELS[k]}
      {input}
      {errors[k] && <span className="err">{errors[k]}</span>}
    </label>
  );
  const select = (k, options) =>
    field(k, (
      <select value={form[k]} onChange={set(k)}>
        <option value="">Select…</option>
        {options.map((o) => <option key={o}>{o}</option>)}
      </select>
    ));

  return (
    <form className="card form" onSubmit={submit} noValidate>
      <h1>{editing ? 'Edit ticket' : 'Add ticket'}</h1>
      {errors.general && <p className="alert" role="alert">{errors.general}</p>}
      <div className="grid2">
        {field('requester_name', <input value={form.requester_name} onChange={set('requester_name')} />)}
        {field('requester_email', <input type="email" value={form.requester_email} onChange={set('requester_email')} />)}
        {select('issue_category', CATEGORIES)}
        {select('priority', PRIORITIES)}
      </div>
      {field('subject', <input value={form.subject} onChange={set('subject')} />)}
      {field('description', <textarea rows="6" value={form.description} onChange={set('description')} />)}
      {editing && (
        <label>
          Status
          <select value={form.status} onChange={set('status')}>
            {STATUSES.map((s) => <option key={s}>{s}</option>)}
          </select>
        </label>
      )}
      <div className="actions">
        <button className="btn primary" disabled={saving}>
          {saving ? 'Saving…' : editing ? 'Save changes' : 'Create ticket'}
        </button>
        <Link className="btn ghost" to={editing ? `/tickets/${id}` : '/'}>Cancel</Link>
      </div>
    </form>
  );
}
