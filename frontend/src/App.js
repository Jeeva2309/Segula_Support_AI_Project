import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
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
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem('user');
    return savedUser ? JSON.parse(savedUser) : null;
  });

  const ProtectedRoute = ({ children, requireAdmin, adminRestricted }) => {
    if (!user) return <Navigate to="/auth" replace />;
    if (requireAdmin && user.role !== 'admin') return <Navigate to="/" replace />;
    if (adminRestricted && user.role === 'admin') return <Navigate to="/" replace />;
    return children;
  };

  return (
    <BrowserRouter>
      <ScrollToTop />
      <Toaster position="top-right" />
      <div className="min-h-screen flex flex-col">
        <Navbar user={user} />
        <main className="flex-1">
          <Routes>
            <Route path="/auth" element={!user ? <Auth onLogin={setUser} /> : <Navigate to="/" replace />} />
            
            <Route path="/" element={<Home />} />
            <Route path="/raise-ticket" element={<ProtectedRoute adminRestricted={true}><RaiseTicket user={user} /></ProtectedRoute>} />
            <Route path="/chatbot" element={<ProtectedRoute adminRestricted={true}><Chatbot /></ProtectedRoute>} />
            <Route path="/my-tickets" element={<ProtectedRoute><MyTickets user={user} /></ProtectedRoute>} />
            <Route path="/profile" element={<ProtectedRoute><Profile user={user} onLogout={() => setUser(null)} /></ProtectedRoute>} />
            
            <Route path="/admin" element={<ProtectedRoute requireAdmin={true}><AdminDashboard /></ProtectedRoute>} />
            
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </BrowserRouter>
  );
}

export default App;
