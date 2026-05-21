import React, { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';

const ALL_LINKS = [
  { to: '/', label: 'Home' },
  { to: '/raise-ticket', label: 'Raise Ticket', userOnly: true },
  { to: '/chatbot', label: 'Chatbot', userOnly: true },
  { to: '/my-tickets', label: 'My Tickets' },
  { to: '/admin', label: 'Admin Dashboard', adminOnly: true },
];

export default function Navbar({ user }) {
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState(user);

  useEffect(() => {
    setCurrentUser(user);
  }, [user]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setCurrentUser(null);
    navigate('/auth');
  };

  const navLinks = ALL_LINKS.filter(link => {
    if (!currentUser && link.to !== '/') return false;
    if (link.adminOnly && currentUser?.role !== 'admin') return false;
    if (link.userOnly && currentUser?.role === 'admin') return false;
    return true;
  }).map(link => {
    if (link.to === '/my-tickets' && currentUser?.role === 'admin') {
      return { ...link, label: 'Company Tickets' };
    }
    return link;
  });

  return (
    <nav className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-gray-200 flex flex-col md:flex-row items-center px-8 h-16 md:h-auto gap-4 md:gap-6">
      {/* Logo */}
      <NavLink to="/" className="flex items-center gap-2.5 no-underline">
        <img src="/logo.png" alt="SEGULA Technologies Logo" className="h-8 object-contain" />
        <span className="font-head font-semibold text-base text-gray-900 border-l border-gray-300 pl-4 ml-2">SupportAI</span>
      </NavLink>

      {/* Mobile menu button */}
      <button
        className="md:hidden ml-auto text-gray-600 hover:text-green transition-colors"
        onClick={() => setMobileOpen(!mobileOpen)}
        aria-label="Toggle navigation"
      >
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={mobileOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"} />
        </svg>
      </button>

      {/* Nav Links – hidden on mobile unless open */}
      <div className={`flex-1 md:flex md:items-center md:justify-center ${mobileOpen ? "block" : "hidden"}`}>
        <div className="flex flex-col md:flex-row gap-2 md:gap-4 ml-auto items-center">
          {navLinks.map(({ to, label }) => (
            <NavLink
              key={to}
              to={to}
              end={to === '/'}
              className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
            >
              {label}
            </NavLink>
          ))}
        </div>
      </div>

      {/* Status */}
      <div className="flex items-center gap-1.5 text-sm text-green font-medium ml-4 border-l border-gray-200 pl-4">
        <span className="w-2 h-2 rounded-full bg-green pulse-dot" />
        System Online
      </div>

      {/* User */}
      {currentUser ? (
        <div className="flex items-center gap-2">
          <button
            onClick={() => navigate('/profile')}
            className="w-9 h-9 rounded-full border border-gray-200 flex items-center justify-center text-gray-400 hover:border-green hover:text-green transition-colors ml-3 bg-white cursor-pointer"
            title="View Profile"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
              <circle cx="12" cy="7" r="4" />
            </svg>
          </button>
          <button
            onClick={handleLogout}
            className="text-sm text-red-600 hover:underline ml-3"
          >
            Logout
          </button>
        </div>
      ) : (
        <button
          onClick={() => navigate('/auth')}
          className="btn-primary py-2 px-5 text-sm font-semibold ml-3"
        >
          Sign In
        </button>
      )}
    </nav>
  );
}
