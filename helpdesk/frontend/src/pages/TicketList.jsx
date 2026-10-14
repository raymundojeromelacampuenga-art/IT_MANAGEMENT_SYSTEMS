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

  const show = (n) => (loading || error ? "–" : n);
  const open = tickets.filter((t) => t.status === "Open").length;
  const critical = tickets.filter(
    (t) =>
      t.priority === "Critical" && !["Resolved", "Closed"].includes(t.status),
  ).length;

  return (
    <>
      <section className="hero">
        <div>
          <p className="eyebrow">IT service desk</p>
          <h1 className="display">Tickets</h1>
          <p className="lead">
            Track, review and resolve service requests across the network.
          </p>
          <Link to="/tickets/new" className="btn primary">
            New ticket
          </Link>
        </div>
        <div className="stats">
          <div>
            <span>{show(tickets.length)}</span>Total
          </div>
          <div>
            <span>{show(open)}</span>Open
          </div>
          <div>
            <span>{show(critical)}</span>Critical
          </div>
        </div>
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
                  <td data-label="Ticket">
                    <Link
                      to={`/tickets/${t.id}`}
                      onClick={(e) => e.stopPropagation()}
                    >
                      {t.ticket_number}
                    </Link>
                  </td>
                  <td data-label="Requester">{t.requester_name}</td>
                  <td data-label="Subject">{t.subject}</td>
                  <td data-label="Priority">
                    <Badge kind="p" value={t.priority} />
                  </td>
                  <td data-label="Status">
                    <Badge kind="s" value={t.status} />
                  </td>
                  <td data-label="Created" className="nowrap">
                    {fmtDate(t.created_at)}
                  </td>
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
