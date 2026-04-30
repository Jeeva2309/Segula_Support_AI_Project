import React from 'react';
import { useNavigate } from 'react-router-dom';

const chatDemoMessages = [
  { type: 'user', text: 'WiFi not working' },
  { type: 'bot', text: 'Try restarting your router and checking LAN cable connections...' },
  { type: 'user', text: 'System running slow' },
  { type: 'bot', text: 'Close background apps via Task Manager and restart...' },
];

const FEATURES = [
  {
    badge: 'Auto-Classify',
    badgeColor: 'bg-green text-white',
    bg: 'from-gray-100 to-gray-200',
    icon: '🎟️',
    iconColor: 'text-green',
    title: 'Smart Ticket Raising',
    desc: 'Submit IT issues with a simple form. The system instantly classifies your ticket by category and priority using ML.',
  },
  {
    badge: 'Instant Answers',
    badgeColor: 'bg-amber-400 text-white',
    bg: 'from-indigo-900 to-purple-900',
    icon: '🤖',
    iconColor: 'text-amber-400',
    title: 'AI Chatbot Assistant',
    desc: 'Get instant answers to common IT problems 24/7. The chatbot uses intent classification to provide step-by-step solutions.',
  },
  {
    badge: 'Live Insights',
    badgeColor: 'bg-red-500 text-white',
    bg: 'from-gray-900 to-gray-800',
    icon: '📈',
    iconColor: 'text-red-400',
    title: 'Admin Analytics Dashboard',
    desc: 'Real-time insights into ticket volume, resolution rates, SLA compliance, and agent performance with interactive charts.',
  },
];

export default function Home() {
  const navigate = useNavigate();
  const [chatInput, setChatInput] = React.useState('');

  return (
    <div>
      {/* ─── HERO ─── */}
      <section className="relative min-h-[calc(100vh-64px)] bg-gradient-to-br from-[#0a1628] via-[#0f2340] to-[#0d3a2e] overflow-hidden flex items-center px-20 py-16">
        {/* Grid overlay */}
        <div className="hero-grid absolute inset-0 pointer-events-none" />

        {/* Left Content */}
        <div className="relative z-10 max-w-2xl">
          <div className="badge-green mb-7">
            <span className="w-2 h-2 rounded-full bg-green pulse-dot" />
            AI-Powered IT Support
          </div>
          <h1 className="font-head font-black text-7xl text-white leading-tight mb-3">
            Resolve Faster.
          </h1>
          <h1 className="font-head font-black text-7xl text-green leading-tight mb-6">
            Support Smarter.
          </h1>
          <p className="text-white/60 text-lg leading-relaxed mb-9 max-w-xl">
            AI-driven IT helpdesk with real-time ticket classification, instant chatbot resolution, and powerful admin analytics — all in one platform.
          </p>
          <div className="flex gap-4 flex-wrap">
            <button className="btn-primary" onClick={() => navigate('/raise-ticket')}>
              <span>⊕</span> Raise a Ticket
            </button>
            <button className="btn-secondary" onClick={() => navigate('/chatbot')}>
              <span>🤖</span> Ask AI Chatbot
            </button>
          </div>

          {/* Stats */}
          <div className="flex gap-12 mt-14">
            {[['94%', 'SLA Compliance'], ['28min', 'Avg Response Time'], ['312+', 'Chatbot Resolutions']].map(([val, label]) => (
              <div key={label}>
                <div className="font-head font-black text-4xl text-white">{val}</div>
                <div className="text-sm text-white/50 mt-1">{label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Chat widget */}
        <div className="absolute right-20 top-1/2 -translate-y-1/2 w-80 bg-[#14203280] backdrop-blur-xl border border-white/10 rounded-2xl p-5 shadow-2xl">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 bg-green/20 rounded-xl flex items-center justify-center text-xl">🤖</div>
            <div>
              <div className="font-head font-semibold text-white text-sm">AI Assistant</div>
              <div className="text-green text-xs">Online</div>
            </div>
          </div>
          <div className="flex flex-col gap-2 mb-3">
            {chatDemoMessages.map((msg, i) => (
              <div key={i} className={`rounded-xl px-3.5 py-2.5 text-xs ${msg.type === 'user' ? 'bg-white/10 text-white/80' : 'bg-green/20 text-white/85 border-l-2 border-green'}`}>
                {msg.text}
              </div>
            ))}
          </div>
          <div className="flex gap-2">
            <input
              value={chatInput}
              onChange={e => setChatInput(e.target.value)}
              placeholder="Ask anything..."
              className="flex-1 bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white/50 text-xs outline-none placeholder-white/30 focus:border-green/50"
            />
            <button
              className="w-8 h-8 bg-green rounded-lg flex items-center justify-center text-white text-xs hover:bg-green-dark transition-colors"
              onClick={() => navigate('/chatbot')}
            >➤</button>
          </div>
        </div>
      </section>

      {/* ─── FEATURES ─── */}
      <section className="px-20 py-20">
        <div className="flex gap-20 items-start mb-14">
          <div>
            <p className="text-xs font-bold text-green tracking-[2px] uppercase mb-4">Core Features</p>
            <h2 className="font-head font-black text-4xl text-gray-900 leading-tight">
              Everything you need for<br />
              <span className="text-green">intelligent</span> IT support
            </h2>
          </div>
          <p className="text-gray-500 text-base leading-relaxed max-w-xs mt-2">
            From ticket submission to resolution — our ML-powered platform handles it all with speed and precision.
          </p>
        </div>

        <div className="grid grid-cols-3 gap-7">
          {FEATURES.map((f) => (
            <div key={f.title} className="card overflow-hidden hover:-translate-y-1 hover:shadow-xl hover:border-green transition-all duration-300 cursor-pointer">
              <div className={`h-48 bg-gradient-to-br ${f.bg} relative flex items-center justify-center`}>
                <span className="text-8xl opacity-20">{f.icon}</span>
                <span className={`absolute top-3 left-3 ${f.badgeColor} text-xs font-semibold px-3 py-1 rounded-full`}>{f.badge}</span>
              </div>
              <div className="p-6">
                <div className={`text-2xl mb-3 ${f.iconColor}`}>{f.icon}</div>
                <h3 className="font-head font-bold text-lg mb-2">{f.title}</h3>
                <p className="text-sm text-gray-500 leading-relaxed">{f.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
