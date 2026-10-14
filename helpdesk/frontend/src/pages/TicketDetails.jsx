import { useEffect, useState } from 'react';
import { Link, useNavigate, useParams, useLocation } from 'react-router-dom';
import { api, fmtDate } from '../api.js';
import { Badge } from './TicketList.jsx';

export default function TicketDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { state } = useLocation();
  const [ticket, setTicket] = useState(null);
  const [error, setError] = useState('');
  const [confirming, setConfirming] = useState(false);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    setTicket(null);
    setError('');
    api.get(id).then(setTicket).catch((e) => setError(e.status === 404 ? 'This ticket does not exist.' : e.message));
  }, [id]);

  const remove = async () => {
    setDeleting(true);
    try {
      await api.remove(id);
      navigate('/', { state: { notice: `Ticket ${ticket.ticket_number} deleted.` } });
    } catch (e) {
      setError(e.message);
      setDeleting(false);
    }
  };

  return (
    <>
      <Link to="/" className="btn ghost back">Back</Link>
      {state?.notice && <p className="notice" role="status">{state.notice}</p>}
      {error && <p className="alert" role="alert">{error}</p>}
      {!ticket && !error && <p className="muted">Loading ticket…</p>}
      {ticket && (
        <article className="card detail">
          <div className="head">
            <h1>{ticket.ticket_number}: {ticket.subject}</h1>
          </div>
          <dl>
            <dt>Status</dt><dd><Badge kind="s" value={ticket.status} /></dd>
            <dt>Priority</dt><dd><Badge kind="p" value={ticket.priority} /></dd>
            <dt>Category</dt><dd>{ticket.issue_category}</dd>
            <dt>Requester</dt><dd>{ticket.requester_name}</dd>
            <dt>Email</dt><dd>{ticket.requester_email}</dd>
            <dt>Created</dt><dd>{fmtDate(ticket.created_at)}</dd>
            <dt>Last updated</dt><dd>{fmtDate(ticket.updated_at)}</dd>
          </dl>
          <h2>Description</h2>
          <p className="desc">{ticket.description}</p>
          <div className="actions">
            <Link className="btn primary" to={`/tickets/${id}/edit`}>Edit ticket</Link>
            {!confirming ? (
              <button className="btn danger-ghost" onClick={() => setConfirming(true)}>Delete</button>
            ) : (
              <span className="confirm" role="alert">
                Delete this ticket permanently?
                <button className="btn danger" onClick={remove} disabled={deleting}>
                  {deleting ? 'Deleting…' : 'Yes, delete'}
                </button>
                <button className="btn ghost" onClick={() => setConfirming(false)}>Keep</button>
              </span>
            )}
          </div>
        </article>
      )}
    </>
  );
}
