import { useEffect, useState, useCallback } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { api, fmtDate } from '../api.js';

export const Badge = ({ kind, value }) => (
  <span className={`badge ${kind}-${value.toLowerCase().replace(/\s+/g, '-')}`}>{value}</span>
);

export default function TicketList() {
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { state } = useLocation();

  const load = useCallback(() => {
    setLoading(true);
    setError('');
    api.list()
      .then(setTickets)
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => { load(); }, [load]);

  return (
    <>
      <div className="head">
        <h1>Tickets</h1>
      </div>

      {state?.notice && <p className="notice" role="status">{state.notice}</p>}
      {loading && <p className="muted">Loading tickets…</p>}
      {error && (
        <div className="alert" role="alert">
          {error} <button className="link" onClick={load}>Try again</button>
        </div>
      )}
      {!loading && !error && tickets.length === 0 && (
        <p className="muted">No tickets yet. Use the + button to create the first one.</p>
      )}

      {tickets.length > 0 && (
        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Ticket</th><th>Requester</th><th>Subject</th>
                <th>Priority</th><th>Status</th><th>Created</th>
              </tr>
            </thead>
            <tbody>
              {tickets.map((t) => (
                <tr key={t.id} onClick={() => navigate(`/tickets/${t.id}`)} className="row">
                  <td><Link to={`/tickets/${t.id}`} onClick={(e) => e.stopPropagation()}>{t.ticket_number}</Link></td>
                  <td>{t.requester_name}</td>
                  <td>{t.subject}</td>
                  <td><Badge kind="p" value={t.priority} /></td>
                  <td><Badge kind="s" value={t.status} /></td>
                  <td className="nowrap">{fmtDate(t.created_at)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <Link to="/tickets/new" className="fab" aria-label="Add ticket" title="Add ticket">+</Link>
    </>
  );
}
