import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getTickets } from '../services/api';

const STATUS_ICONS = { 'Open': '○', 'In Progress': '↻', 'Resolved': '✓' };
const CAT_ICONS = { 'Hardware': '🖥️', 'Software': '💻', 'Network': '📶', 'Other': '📋' };

function PriorityBadge({ p }) {
  const level = (p || 'Low').trim();
  return <span className={level === 'High' ? 'priority-high' : level === 'Medium' ? 'priority-medium' : 'priority-low'}>{level}</span>;
}

function StatusBadge({ s }) {
  const status = (s || 'Open').trim();
  return <span className={status === 'In Progress' ? 'status-progress' : status === 'Open' ? 'status-open' : 'status-resolved'}>{STATUS_ICONS[status]} {status}</span>;
}

export default function MyTickets({ user }) {
  const navigate = useNavigate();
  const [tickets, setTickets] = useState([]);
  const [filter, setFilter] = useState('All');
  const [search, setSearch] = useState('');
  const [priority, setPriority] = useState('All Priorities');
  const [category, setCategory] = useState('All Categories');
  
  // Modal State
  const [selectedTicket, setSelectedTicket] = useState(null);

  useEffect(() => {
    getTickets().then(res => {
      const formatted = res.data.map(t => ({
        ...t,
        id: t.ticket_id || t.id,
        desc: t.description || t.desc,
        date: t.created_at || t.date
      }));
      setTickets(formatted);
    }).catch(err => console.error("Error fetching tickets:", err));
  }, []);

  const filtered = tickets.filter(t => {
    const tStatus = (t.status || '').trim();
    const tPriority = (t.priority || '').trim();
    const tCat = (t.category || '').trim();
    
    const matchStatus = filter === 'All' || tStatus.toLowerCase() === filter.toLowerCase();
    const matchSearch = t.title?.toLowerCase().includes(search.toLowerCase()) || t.desc?.toLowerCase().includes(search.toLowerCase());
    const matchPriority = priority === 'All Priorities' || tPriority.toLowerCase() === priority.toLowerCase();
    const matchCat = category === 'All Categories' || tCat.toLowerCase() === category.toLowerCase();
    
    return matchStatus && matchSearch && matchPriority && matchCat;
  });

  const total = tickets.length;
  const open = tickets.filter(t => (t.status || '').trim().toLowerCase() === 'open').length;
  const inprogress = tickets.filter(t => (t.status || '').trim().toLowerCase() === 'in progress').length;
  const resolved = tickets.filter(t => (t.status || '').trim().toLowerCase() === 'resolved').length;

  return (
    <div>
      {/* Header */}
      <div className="px-20 pt-8 pb-0 flex items-start justify-between">
        <div>
          <div className="badge-green mb-3">🎟️ Ticket Management</div>
          <h1 className="font-head font-black text-4xl text-gray-900">{user?.role === 'admin' ? 'Company Tickets' : 'My Tickets'}</h1>
        </div>
        <button className="btn-primary mt-2" onClick={() => navigate('/raise-ticket')}>+ New Ticket</button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-4 gap-4 px-20 py-6">
        {[[total, 'Total', '📋', ''], [open, 'Open', '○', ''], [inprogress, 'In Progress', '↻', 'amber'], [resolved, 'Resolved', '✓', 'green']].map(([num, label, icon, color]) => (
          <div key={label} className={`card p-5 flex items-center gap-4 ${color === 'amber' ? 'bg-amber-50 border-amber-200' : color === 'green' ? 'bg-green-light border-green/20' : ''}`}>
            <span className="text-xl">{icon}</span>
            <div>
              <div className={`font-head font-black text-3xl ${color === 'amber' ? 'text-amber-500' : color === 'green' ? 'text-green-dark' : 'text-gray-900'}`}>{num}</div>
              <div className="text-sm text-gray-500">{label}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Toolbar */}
      <div className="px-20 pb-4 flex items-center gap-3 flex-wrap">
        <div className="relative flex-1 min-w-64">
          <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-sm">🔍</span>
          <input
            className="form-input pl-10"
            placeholder="Search tickets..."
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>
        <div className="flex bg-gray-100 rounded-xl p-1 gap-0.5">
          {['All', 'Open', 'In Progress', 'Resolved'].map(s => (
            <button key={s} onClick={() => setFilter(s)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all border-none cursor-pointer ${filter === s ? 'bg-white text-gray-900 font-semibold shadow-sm' : 'bg-transparent text-gray-500 hover:text-gray-700'}`}>
              {s}
            </button>
          ))}
        </div>
        <select className="form-input w-36" value={priority} onChange={e => setPriority(e.target.value)}>
          <option>All Priorities</option>
          <option>High</option>
          <option>Medium</option>
          <option>Low</option>
        </select>
        <select className="form-input w-40" value={category} onChange={e => setCategory(e.target.value)}>
          <option>All Categories</option>
          <option>Hardware</option>
          <option>Software</option>
          <option>Network</option>
          <option>Other</option>
        </select>
      </div>

      {/* Tickets Grid */}
      <div className="grid grid-cols-2 gap-4 px-20 pb-16">
        {filtered.map(t => (
          <div key={t.id} className="card p-6 hover:-translate-y-0.5 hover:shadow-lg transition-all cursor-pointer" onClick={() => setSelectedTicket(t)}>
            <div className="flex items-center justify-between mb-2.5">
              <div className="flex items-center gap-2">
                <span className="text-xs font-semibold text-gray-400">{t.id}</span>
                <PriorityBadge p={t.priority} />
              </div>
              <StatusBadge s={t.status} />
            </div>
            <h3 className="font-head font-bold text-base mb-1.5">{t.title}</h3>
            <p className="text-sm text-gray-500 leading-relaxed mb-4 line-clamp-2">{t.desc}</p>
            <div className="flex items-center justify-between">
              <span className="text-xs text-gray-400">{CAT_ICONS[t.category] || '📋'} {t.category} &nbsp;🕐 {t.date}</span>
              <button className="text-sm font-semibold text-green hover:text-green-dark transition-colors bg-transparent border-none cursor-pointer">View Details</button>
            </div>
          </div>
        ))}
        {filtered.length === 0 && (
          <div className="col-span-2 text-center py-16 text-gray-400">
            <div className="text-5xl mb-4">🔍</div>
            <div className="font-head font-semibold text-lg">No tickets found</div>
            <div className="text-sm mt-1">Try adjusting your filters</div>
          </div>
        )}
      </div>

      {/* Ticket Details Modal */}
      {selectedTicket && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-[100] p-4 backdrop-blur-sm" onClick={() => setSelectedTicket(null)}>
          <div className="bg-white rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl p-8" onClick={e => e.stopPropagation()}>
            <div className="flex justify-between items-start mb-6">
              <div>
                <div className="flex items-center gap-3 mb-2">
                  <span className="text-sm font-semibold text-gray-500 bg-gray-100 px-2 py-1 rounded">{selectedTicket.id}</span>
                  <StatusBadge s={selectedTicket.status} />
                  <PriorityBadge p={selectedTicket.priority} />
                </div>
                <h2 className="font-head font-black text-2xl text-gray-900">{selectedTicket.title}</h2>
              </div>
              <button className="text-gray-400 hover:text-gray-900 bg-transparent border-none text-2xl cursor-pointer" onClick={() => setSelectedTicket(null)}>&times;</button>
            </div>
            
            <div className="grid grid-cols-2 gap-4 mb-6 p-4 bg-gray-50 rounded-xl">
              <div>
                <span className="text-xs text-gray-500 block mb-1">Category</span>
                <span className="font-medium text-sm">{selectedTicket.category || 'Other'}</span>
              </div>
              <div>
                <span className="text-xs text-gray-500 block mb-1">Created At</span>
                <span className="font-medium text-sm">{selectedTicket.date}</span>
              </div>
            </div>

            <div className="mb-8">
              <h3 className="font-semibold text-sm text-gray-900 mb-2">Description</h3>
              <p className="text-sm text-gray-600 leading-relaxed whitespace-pre-wrap">{selectedTicket.desc}</p>
            </div>

            <div className="flex justify-end pt-4 border-t border-gray-100">
              <button className="btn-outline" onClick={() => setSelectedTicket(null)}>Close</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
