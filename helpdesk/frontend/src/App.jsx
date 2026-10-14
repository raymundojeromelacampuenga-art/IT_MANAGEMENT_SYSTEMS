import { Routes, Route, Navigate, Link } from 'react-router-dom';
import { ProtectedRoute, useAuth } from './auth.jsx';
import Login from './pages/Login.jsx';
import TicketList from './pages/TicketList.jsx';
import TicketForm from './pages/TicketForm.jsx';
import TicketDetails from './pages/TicketDetails.jsx';

function Shell({ children }) {
  const { logout } = useAuth();
  return (
    <>
      <header className="bar">
        <Link to="/" className="brand">IT Helpdesk</Link>
        <button className="btn ghost" onClick={logout}>Log out</button>
      </header>
      <main className="page">{children}</main>
    </>
  );
}

const guard = (el) => (
  <ProtectedRoute>
    <Shell>{el}</Shell>
  </ProtectedRoute>
);

export default function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/" element={guard(<TicketList />)} />
      <Route path="/tickets/new" element={guard(<TicketForm />)} />
      <Route path="/tickets/:id" element={guard(<TicketDetails />)} />
      <Route path="/tickets/:id/edit" element={guard(<TicketForm />)} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
