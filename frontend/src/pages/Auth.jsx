import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { login, register } from '../services/api';

export default function Auth({ onLogin }) {
  const navigate = useNavigate();
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    department: 'Other',
    joiningDate: '',
    dob: '',
    password: '',
    confirmPassword: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    if (!isLogin && formData.password !== formData.confirmPassword) {
      return setError("Passwords do not match!");
    }

    setLoading(true);
    try {
      let res;
      if (isLogin) {
        res = await login({ email: formData.email, password: formData.password });
      } else {
        res = await register(formData);
      }
      
      localStorage.setItem('token', res.data.token);
      localStorage.setItem('user', JSON.stringify(res.data.user));
      
      if (onLogin) onLogin(res.data.user);
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.error || 'Authentication failed. Please try again.');
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="max-w-md w-full card p-8">
        <div className="text-center mb-8">
          <h2 className="font-head font-black text-3xl text-gray-900">{isLogin ? 'Welcome Back' : 'Create Account'}</h2>
          <p className="text-gray-500 mt-2">{isLogin ? 'Sign in to your account' : 'Register as a new employee'}</p>
        </div>

        {error && <div className="bg-red-50 text-red-500 p-3 rounded-lg mb-6 text-sm text-center border border-red-200">{error}</div>}

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          {!isLogin && (
            <input className="form-input" required placeholder="Full Name" name="name" value={formData.name} onChange={handleChange} />
          )}
          
          <input className="form-input" type="email" required placeholder="Email Address" name="email" value={formData.email} onChange={handleChange} />
          
          {!isLogin && (
            <>
              <div className="flex gap-4">
                <div className="flex-1">
                  <label className="text-xs text-gray-500 mb-1 block">Department</label>
                  <select className="form-input" name="department" value={formData.department} onChange={handleChange}>
                    <option>IT</option>
                    <option>HR</option>
                    <option>Finance</option>
                    <option>Engineering</option>
                    <option>Sales</option>
                    <option>Other</option>
                  </select>
                </div>
                <div className="flex-1">
                  <label className="text-xs text-gray-500 mb-1 block">Joining Date</label>
                  <input className="form-input" type="date" required name="joiningDate" value={formData.joiningDate} onChange={handleChange} />
                </div>
              </div>
              <div>
                <label className="text-xs text-gray-500 mb-1 block">Date of Birth</label>
                <input className="form-input" type="date" required name="dob" value={formData.dob} onChange={handleChange} />
              </div>
            </>
          )}

          <input className="form-input" type="password" required placeholder="Password" name="password" value={formData.password} onChange={handleChange} />
          
          {!isLogin && (
            <input className="form-input" type="password" required placeholder="Confirm Password" name="confirmPassword" value={formData.confirmPassword} onChange={handleChange} />
          )}

          <button type="submit" disabled={loading} className="btn-primary w-full mt-2 py-3 text-base">
            {loading ? 'Processing...' : (isLogin ? 'Sign In' : 'Register')}
          </button>
        </form>

        <div className="text-center mt-6 text-sm text-gray-500">
          {isLogin ? "Don't have an account? " : "Already have an account? "}
          <button type="button" onClick={() => {setIsLogin(!isLogin); setError('');}} className="text-green font-semibold hover:underline bg-transparent border-none cursor-pointer p-0">
            {isLogin ? 'Sign up' : 'Log in'}
          </button>
        </div>
      </div>
    </div>
  );
}
