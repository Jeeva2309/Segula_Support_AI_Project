import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import RaiseTicket from './pages/RaiseTicket';
import Chatbot from './pages/Chatbot';
import MyTickets from './pages/MyTickets';
import AdminDashboard from './pages/AdminDashboard';
import Auth from './pages/Auth';
import Profile from './pages/Profile';

function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
}

function App() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    // Always start fresh - clear session on every page load
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
  }, []);

  const ProtectedRoute = ({ children, requireAdmin }) => {
    if (!user) return <Navigate to="/auth" replace />;
    if (requireAdmin && user.role !== 'admin') return <Navigate to="/" replace />;
    return children;
  };

  return (
    <BrowserRouter>
      <ScrollToTop />
      <div className="min-h-screen flex flex-col">
        {user && <Navbar user={user} />}
        <main className="flex-1">
          <Routes>
            <Route path="/auth" element={!user ? <Auth onLogin={setUser} /> : <Navigate to="/" replace />} />
            
            <Route path="/" element={<ProtectedRoute><Home /></ProtectedRoute>} />
            <Route path="/raise-ticket" element={<ProtectedRoute><RaiseTicket user={user} /></ProtectedRoute>} />
            <Route path="/chatbot" element={<ProtectedRoute><Chatbot /></ProtectedRoute>} />
            <Route path="/my-tickets" element={<ProtectedRoute><MyTickets user={user} /></ProtectedRoute>} />
            <Route path="/profile" element={<ProtectedRoute><Profile user={user} onLogout={() => setUser(null)} /></ProtectedRoute>} />
            
            <Route path="/admin" element={<ProtectedRoute requireAdmin={true}><AdminDashboard /></ProtectedRoute>} />
            
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </main>
        {user && <Footer />}
      </div>
    </BrowserRouter>
  );
}

export default App;
