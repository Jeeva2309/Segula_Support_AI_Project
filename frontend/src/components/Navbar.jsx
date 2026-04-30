import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';

const ALL_LINKS = [
  { to: '/', label: 'Home' },
  { to: '/raise-ticket', label: 'Raise Ticket' },
  { to: '/chatbot', label: 'Chatbot' },
  { to: '/my-tickets', label: 'My Tickets' },
  { to: '/admin', label: 'Admin Dashboard', adminOnly: true },
];

export default function Navbar({ user }) {
  const navigate = useNavigate();

  const navLinks = ALL_LINKS.filter(link => !link.adminOnly || user?.role === 'admin');

  return (
    <nav className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-gray-200 flex items-center px-8 h-16 gap-6">
      {/* Logo */}
      <NavLink to="/" className="flex items-center gap-2.5 no-underline">
        <img src="/logo.png" alt="SEGULA Technologies Logo" className="h-8 object-contain" />
      </NavLink>
      <span className="font-head font-semibold text-base text-gray-900 border-l border-gray-300 pl-4 ml-2">SupportAI</span>

      {/* Nav Links */}
      <div className="flex gap-1 ml-auto items-center">
        {navLinks.map(({ to, label }) => (
          <NavLink
            key={to}
            to={to}
            end={to === '/'}
            className={({ isActive }) =>
              `nav-link ${isActive ? 'active' : ''}`
            }
          >
            {label}
          </NavLink>
        ))}
      </div>

      {/* Status */}
      <div className="flex items-center gap-1.5 text-sm text-green font-medium ml-4 border-l border-gray-200 pl-4">
        <span className="w-2 h-2 rounded-full bg-green pulse-dot" />
        System Online
      </div>

      {/* User */}
      <button 
        onClick={() => navigate('/profile')}
        className="w-9 h-9 rounded-full border border-gray-200 flex items-center justify-center text-gray-400 hover:border-green hover:text-green transition-colors ml-3 bg-white cursor-pointer"
        title="View Profile"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" />
        </svg>
      </button>
    </nav>
  );
}
