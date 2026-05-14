import React, { useState } from 'react';
import { classifyTicket, createTicket } from '../services/api';
import toast from 'react-hot-toast';

const TIPS = [
  { icon: '🎯', title: 'Be Specific', desc: 'Include error messages, when it started, and what you\'ve already tried.' },
  { icon: '🤖', title: 'AI Classification', desc: 'Our ML model auto-detects category (Network/Hardware/Software) and priority.' },
  { icon: '⚡', title: 'Instant Solution', desc: 'Before submitting, check the suggested fix — it might solve your issue immediately!' },
  { icon: '⏱️', title: 'Response Time', desc: 'High priority tickets are responded to within 1 hour. Medium within 4 hours.' },
];

const SLA = [
  { color: '#ef4444', label: 'High Priority', time: '< 1 hour' },
  { color: '#f59e0b', label: 'Medium Priority', time: '< 4 hours' },
  { color: '#1DB954', label: 'Low Priority', time: '< 24 hours' },
];

export default function RaiseTicket() {
  const [form, setForm] = useState({ title: '', description: '' });
  const [classification, setClassification] = useState(null);
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleChange = e => setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));

  const handleClassify = async () => {
    if (!form.description) return toast.error('Please describe your issue first!');
    setLoading(true);
    try {
      const res = await classifyTicket({ title: form.title, description: form.description });
      setClassification(res.data);
    } catch {
      // Fallback mock for demo
      setClassification({ category: 'Network', priority: 'Medium', suggested_fix: 'Try restarting your router and checking DNS settings.' });
    }
    setLoading(false);
  };

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async e => {
    e.preventDefault();
    if (!form.title || !form.description) return toast.error('Please fill in all required fields.');
    setIsSubmitting(true);
    try {
      await createTicket({ ...form, ...classification });
      toast.success('Ticket created successfully!');
      setSubmitted(true);
    } catch (err) {
      toast.error('Failed to submit ticket. Please check if the backend is running.');
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (submitted) return (
    <div className="flex flex-col items-center justify-center py-32">
      <div className="text-6xl mb-6">✅</div>
      <h2 className="font-head font-bold text-2xl mb-2">Ticket Submitted!</h2>
      <p className="text-gray-500 mb-6">Your ticket has been created. You'll receive an email confirmation shortly.</p>
      <button className="btn-primary" onClick={() => setSubmitted(false)}>Raise Another Ticket</button>
    </div>
  );

  return (
    <div>
      {/* Header */}
      <div className="px-20 pt-10 pb-0">
        <div className="badge-green mb-4">🎟️ IT Support</div>
        <h1 className="font-head font-black text-4xl text-gray-900 mb-2">Raise a Support Ticket</h1>
        <p className="text-gray-500 text-base leading-relaxed max-w-xl">
          Describe your IT issue and our AI will instantly classify it, suggest a solution, and route it to the right team.
        </p>
      </div>

      <div className="grid px-20 py-8 gap-8" style={{ gridTemplateColumns: '1fr 340px' }}>
        {/* Form */}
        <div className="card p-8">
          <h2 className="font-head font-bold text-xl mb-6">Issue Details</h2>
          <form onSubmit={handleSubmit}>
            <div className="mb-5">
              <label className="block text-sm font-semibold text-gray-900 mb-2">
                Issue Title <span className="text-red-500">*</span>
              </label>
              <input
                className="form-input"
                name="title"
                value={form.title}
                onChange={handleChange}
                placeholder="e.g. Laptop not turning on, WiFi keeps disconnecting..."
              />
            </div>
            <div className="mb-5">
              <label className="block text-sm font-semibold text-gray-900 mb-2">
                Description <span className="text-red-500">*</span>
              </label>
              <textarea
                className="form-input resize-y min-h-36"
                name="description"
                value={form.description}
                onChange={handleChange}
                maxLength={500}
                placeholder="Describe the issue in detail. When did it start? What have you tried? Any error messages?"
              />
              <div className="text-right text-xs text-gray-400 mt-1">{form.description.length}/500</div>
            </div>

            {/* AI Classification Result */}
            {classification && (
              <div className="bg-green-light border border-green/30 rounded-xl p-4 mb-5">
                <div className="font-semibold text-sm text-green mb-2">🤖 AI Classification Result</div>
                <div className="flex gap-4 text-sm mb-2">
                  <span><strong>Category:</strong> {classification.category}</span>
                  <span><strong>Priority:</strong> {classification.priority}</span>
                </div>
                {classification.suggested_fix && (
                  <div className="text-sm text-gray-600"><strong>Suggested Fix:</strong> {classification.suggested_fix}</div>
                )}
              </div>
            )}

            <button
              type="button"
              onClick={handleClassify}
              disabled={loading}
              className="w-full py-3 bg-gray-100 border border-gray-200 rounded-xl text-sm font-semibold text-gray-500 cursor-pointer flex items-center justify-center gap-2 mb-3 hover:bg-green-light hover:border-green hover:text-green transition-all disabled:opacity-50"
            >
              {loading ? '⏳ Classifying...' : '⊙ Auto-Classify with AI'}
            </button>
            <button type="submit" disabled={isSubmitting} className="btn-primary w-full justify-center py-3.5 text-base disabled:opacity-50">
              {isSubmitting ? '⏳ Submitting...' : '➤ Submit Ticket'}
            </button>
          </form>
        </div>

        {/* Sidebar */}
        <div>
          {/* Tips */}
          <div className="card p-6 mb-5">
            <h3 className="font-head font-bold text-base mb-4">Tips for Faster Resolution</h3>
            {TIPS.map(({ icon, title, desc }) => (
              <div key={title} className="flex gap-3 mb-4 last:mb-0">
                <div className="w-7 h-7 bg-green/10 rounded-lg flex items-center justify-center text-sm flex-shrink-0">{icon}</div>
                <div>
                  <div className="text-sm font-semibold mb-0.5">{title}</div>
                  <p className="text-xs text-gray-500 leading-relaxed">{desc}</p>
                </div>
              </div>
            ))}
          </div>

          {/* SLA */}
          <div className="bg-navy rounded-2xl p-6 mb-5">
            <h3 className="font-head font-bold text-base text-white mb-4">SLA Response Times</h3>
            {SLA.map(({ color, label, time }) => (
              <div key={label} className="flex items-center justify-between mb-2.5 last:mb-0">
                <span className="text-sm text-white/70 flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full inline-block" style={{ background: color }} />
                  {label}
                </span>
                <span className="text-sm text-white font-semibold">{time}</span>
              </div>
            ))}
          </div>

          {/* Urgent */}
          <div className="card p-6">
            <h3 className="font-head font-bold text-base mb-2">Need Urgent Help?</h3>
            <p className="text-sm text-gray-500 mb-4">For critical system outages, contact IT directly:</p>
            {[['📞', 'Ext. 1234 (IT Helpdesk)'], ['✉️', 'it@company.com'], ['🚨', 'Emergency: Ext. 911']].map(([icon, text]) => (
              <div key={text} className="flex items-center gap-2 text-sm text-gray-700 mb-2">{icon} {text}</div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
