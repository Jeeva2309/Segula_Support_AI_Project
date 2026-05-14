import React from 'react';
import { useNavigate } from 'react-router-dom';
import { logout } from '../services/api';
import toast from 'react-hot-toast';

export default function Profile({ user, onLogout }) {
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    if (onLogout) onLogout();
    toast.success("Logged out successfully");
    navigate('/auth');
  };

  if (!user) return null;

  return (
    <div className="max-w-3xl mx-auto px-4 py-12">
      <div className="card p-8">
        <div className="flex items-center gap-6 mb-8 border-b border-gray-100 pb-8">
          <div className="w-24 h-24 bg-green text-white rounded-2xl flex items-center justify-center text-4xl font-black font-head">
            {user.name?.charAt(0).toUpperCase()}
          </div>
          <div>
            <h1 className="font-head font-black text-3xl text-gray-900">{user.name}</h1>
            <p className="text-gray-500 mt-1">{user.role === 'admin' ? 'IT Administrator' : 'Employee'}</p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-8 mb-8">
          <div>
            <div className="text-xs text-gray-400 uppercase tracking-wider font-semibold mb-1">Email Address</div>
            <div className="font-medium text-gray-900">{user.email}</div>
          </div>
          <div>
            <div className="text-xs text-gray-400 uppercase tracking-wider font-semibold mb-1">Department</div>
            <div className="font-medium text-gray-900">{user.department || 'Not specified'}</div>
          </div>
          <div>
            <div className="text-xs text-gray-400 uppercase tracking-wider font-semibold mb-1">Joining Date</div>
            <div className="font-medium text-gray-900">{user.joining_date || 'Not specified'}</div>
          </div>
          <div>
            <div className="text-xs text-gray-400 uppercase tracking-wider font-semibold mb-1">Date of Birth</div>
            <div className="font-medium text-gray-900">{user.dob || 'Not specified'}</div>
          </div>
        </div>

        <div className="flex justify-end pt-6 border-t border-gray-100">
          <button onClick={handleLogout} className="btn-outline border-red-200 text-red-500 hover:bg-red-50 hover:border-red-300">
            Log Out
          </button>
        </div>
      </div>
    </div>
  );
}
