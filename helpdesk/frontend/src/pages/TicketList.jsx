import { useEffect, useState, useCallback } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { api, fmtDate, CATEGORIES } from "../api.js";

export const Badge = ({ kind, value }) => (
  <span className={`badge ${kind}-${value.toLowerCase().replace(/\s+/g, "-")}`}>
    {value}
  </span>
);

export default function TicketList() {
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const { state } = useLocation();

  const load = useCallback(() => {
    setLoading(true);
    setError("");
    api
      .list()
      .then(setTickets)
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  return (
    <>
      <section className="hero">
        <p className="eyebrow">IT service desk</p>
        <h1 className="display">Tickets</h1>
        <p className="lead">
          Track, review and resolve service requests across the network.
        </p>
        <Link to="/tickets/new" className="btn primary">
          New ticket
        </Link>
      </section>

      <div className="marquee" aria-hidden="true">
        <div className="track">
          {[...CATEGORIES, ...CATEGORIES, ...CATEGORIES, ...CATEGORIES].map(
            (c, i) => (
              <span key={i}>{c} ✦</span>
            ),
          )}
        </div>
      </div>

      <p className="eyebrow">All tickets</p>
      {state?.notice && (
        <p className="notice" role="status">
          {state.notice}
        </p>
      )}
      {loading && <p className="muted">Loading tickets…</p>}
      {error && (
        <div className="alert" role="alert">
          {error}{" "}
          <button className="link" onClick={load}>
            Try again
          </button>
        </div>
      )}
      {!loading && !error && tickets.length === 0 && (
        <p className="muted">
          No tickets yet. Use the + button to create the first one.
        </p>
      )}

      {tickets.length > 0 && (
        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Ticket</th>
                <th>Requester</th>
                <th>Subject</th>
                <th>Priority</th>
                <th>Status</th>
                <th>Created</th>
              </tr>
            </thead>
            <tbody>
              {tickets.map((t) => (
                <tr
                  key={t.id}
                  onClick={() => navigate(`/tickets/${t.id}`)}
                  className="row"
                >
                  <td>
                    <Link
                      to={`/tickets/${t.id}`}
                      onClick={(e) => e.stopPropagation()}
                    >
                      {t.ticket_number}
                    </Link>
                  </td>
                  <td>{t.requester_name}</td>
                  <td>{t.subject}</td>
                  <td>
                    <Badge kind="p" value={t.priority} />
                  </td>
                  <td>
                    <Badge kind="s" value={t.status} />
                  </td>
                  <td className="nowrap">{fmtDate(t.created_at)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <Link
        to="/tickets/new"
        className="fab"
        aria-label="Add ticket"
        title="Add ticket"
      >
        +
      </Link>
    </>
  );
}
