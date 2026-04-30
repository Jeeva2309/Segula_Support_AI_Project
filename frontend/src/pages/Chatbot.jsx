import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { sendChatMessage } from '../services/api';

const HELP_TOPICS = [
  { icon: '📶', label: 'WiFi & Network', query: 'WiFi not working' },
  { icon: '🖥️', label: 'Hardware Issues', query: 'Hardware issue' },
  { icon: '🔒', label: 'Password Reset', query: 'Forgot my password' },
  { icon: '✉️', label: 'Email Problems', query: 'Email not syncing' },
  { icon: '🖨️', label: 'Printer Issues', query: 'Printer offline' },
  { icon: '🛡️', label: 'VPN Access', query: 'Cannot connect to VPN' },
  { icon: '⚡', label: 'Slow Performance', query: 'System running slow' },
  { icon: '💿', label: 'Software Install', query: 'Software installation help' },
];

const COMMON_QS = ['WiFi not working', 'System running slow', 'Forgot my password', 'Email not syncing', 'Printer offline', 'Cannot connect to VPN'];

const HOW_STEPS = [
  { num: 1, title: 'Intent Detection', desc: 'Analyzes your message to identify the type of IT issue.' },
  { num: 2, title: 'Knowledge Match', desc: 'Matches against a database of common IT solutions.' },
  { num: 3, title: 'Step-by-Step Fix', desc: 'Provides actionable troubleshooting steps instantly.' },
];

// Local fallback responses (used if backend unavailable)
const FALLBACK_RESPONSES = {
  wifi: 'Try these steps:\n1. Restart your router/modem\n2. Forget the network and reconnect\n3. Check if other devices connect\n4. Update network drivers\n5. If issue persists, raise a ticket.',
  slow: 'To fix slow performance:\n1. Open Task Manager (Ctrl+Shift+Esc)\n2. Close high CPU/Memory processes\n3. Restart your computer\n4. Run Disk Cleanup\n5. Check for malware.',
  password: 'To reset your password:\n1. Go to company portal\n2. Click "Forgot Password"\n3. Enter your employee ID\n4. Check your mobile for OTP\n5. Set a new password.',
  email: 'For email sync issues:\n1. Close and reopen Outlook\n2. Go to File > Account Settings > Repair\n3. Clear browser cache if using web mail.',
  printer: 'Printer troubleshooting:\n1. Check printer is powered on\n2. Remove and re-add the printer in Settings\n3. Clear print queue\n4. Restart Print Spooler service.',
  vpn: 'VPN connection steps:\n1. Ensure VPN client is installed\n2. Use your employee credentials\n3. Check if firewall is blocking VPN\n4. Contact IT for VPN account reset.',
  default: 'I understand you have an IT issue. Could you be more specific?\n• What exactly is the problem?\n• When did it start?\n• What have you tried?\n\nOr pick a topic from the right panel.',
};

function getLocalResponse(msg) {
  const m = msg.toLowerCase();
  if (m.includes('wifi') || m.includes('network') || m.includes('internet')) return FALLBACK_RESPONSES.wifi;
  if (m.includes('slow') || m.includes('performance') || m.includes('freeze')) return FALLBACK_RESPONSES.slow;
  if (m.includes('password') || m.includes('forgot') || m.includes('reset')) return FALLBACK_RESPONSES.password;
  if (m.includes('email') || m.includes('outlook')) return FALLBACK_RESPONSES.email;
  if (m.includes('printer') || m.includes('print')) return FALLBACK_RESPONSES.printer;
  if (m.includes('vpn') || m.includes('remote')) return FALLBACK_RESPONSES.vpn;
  return FALLBACK_RESPONSES.default;
}

export default function Chatbot() {
  const navigate = useNavigate();
  const [messages, setMessages] = useState([
    {
      role: 'bot',
      text: "Hello! I'm your IT Support Assistant. I can help you with WiFi issues, slow performance, password resets, email problems, printer issues, VPN access, and more.\n\nJust describe your issue or pick a common question below!",
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    },
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);

  useEffect(() => { messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' }); }, [messages]);

  const sendMessage = async (text) => {
    const msg = text || input.trim();
    if (!msg) return;
    setInput('');
    const time = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    setMessages(prev => [...prev, { role: 'user', text: msg, time }]);
    setLoading(true);
    try {
      const res = await sendChatMessage(msg);
      setMessages(prev => [...prev, { role: 'bot', text: res.data.reply, time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) }]);
    } catch {
      setMessages(prev => [...prev, { role: 'bot', text: getLocalResponse(msg), time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) }]);
    }
    setLoading(false);
  };

  return (
    <div>
      <div className="px-20 pt-10 pb-0">
        <div className="badge-green mb-4">🤖 AI Chatbot</div>
        <h1 className="font-head font-black text-4xl text-gray-900 mb-2">IT Support Assistant</h1>
        <p className="text-gray-500 text-base max-w-lg">
          Get instant answers to common IT problems. Our AI chatbot uses intent classification to provide step-by-step solutions 24/7.
        </p>
      </div>

      <div className="grid px-20 py-8 gap-7" style={{ gridTemplateColumns: '1fr 320px' }}>
        {/* Chat Window */}
        <div className="card flex flex-col" style={{ height: 580 }}>
          {/* Header */}
          <div className="flex items-center gap-3 p-5 border-b border-gray-100">
            <div className="w-11 h-11 bg-green rounded-xl flex items-center justify-center text-xl relative">
              🤖
              <span className="absolute bottom-0.5 right-0.5 w-2.5 h-2.5 bg-green-400 border-2 border-white rounded-full" />
            </div>
            <div>
              <div className="font-head font-bold text-sm">IT Support Assistant</div>
              <div className="text-xs text-green">Online — Typically replies instantly</div>
            </div>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-5 flex flex-col gap-3">
            {messages.map((msg, i) => (
              <div key={i} className={msg.role === 'user' ? 'flex justify-end' : 'flex items-start gap-2.5'}>
                {msg.role === 'bot' && (
                  <div className="w-8 h-8 bg-green rounded-lg flex items-center justify-center text-base flex-shrink-0">🤖</div>
                )}
                <div className={`rounded-2xl px-4 py-3 text-sm leading-relaxed max-w-[82%] whitespace-pre-line ${
                  msg.role === 'user'
                    ? 'bg-green text-white rounded-tr-none'
                    : 'bg-gray-50 text-gray-800 rounded-tl-none'
                }`}>
                  {msg.text}
                  <div className={`text-xs mt-1.5 ${msg.role === 'user' ? 'text-white/60' : 'text-gray-400'}`}>{msg.time}</div>
                </div>
              </div>
            ))}
            {loading && (
              <div className="flex items-start gap-2.5">
                <div className="w-8 h-8 bg-green rounded-lg flex items-center justify-center text-base">🤖</div>
                <div className="bg-gray-50 rounded-2xl rounded-tl-none px-4 py-3">
                  <div className="flex gap-1">
                    <span className="w-2 h-2 bg-gray-300 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                    <span className="w-2 h-2 bg-gray-300 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                    <span className="w-2 h-2 bg-gray-300 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Quick Questions */}
          <div className="px-5 pb-2 border-t border-gray-100 pt-3">
            <div className="text-xs text-gray-400 mb-2">Common questions:</div>
            <div className="flex flex-wrap gap-2">
              {COMMON_QS.map(q => (
                <button key={q} onClick={() => sendMessage(q)}
                  className="bg-gray-50 border border-gray-200 rounded-full px-3 py-1.5 text-xs cursor-pointer hover:bg-green-light hover:border-green hover:text-green transition-all">
                  {q}
                </button>
              ))}
            </div>
          </div>

          {/* Input */}
          <div className="flex gap-2 p-4 border-t border-gray-100">
            <input
              className="form-input flex-1"
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && !e.shiftKey && sendMessage()}
              placeholder="Describe your IT issue..."
            />
            <button
              onClick={() => sendMessage()}
              className="w-10 h-10 bg-green rounded-xl flex items-center justify-center text-white hover:bg-green-dark transition-colors flex-shrink-0"
            >➤</button>
          </div>
          <div className="text-center text-xs text-gray-400 pb-2">Press Enter to send • Shift+Enter for new line</div>
        </div>

        {/* Sidebar */}
        <div>
          <div className="card p-5 mb-5">
            <h3 className="font-head font-bold text-base mb-4">I can help with</h3>
            <div className="grid grid-cols-2 gap-2">
              {HELP_TOPICS.map(({ icon, label, query }) => (
                <button key={label} onClick={() => sendMessage(query)}
                  className="flex items-center gap-2 text-xs text-gray-700 cursor-pointer px-2.5 py-2 rounded-lg border border-gray-200 hover:bg-green-light hover:border-green hover:text-green transition-all bg-transparent text-left">
                  <span>{icon}</span> {label}
                </button>
              ))}
            </div>
          </div>

          <div className="card p-5 mb-5">
            <h3 className="font-head font-bold text-base mb-4">How the AI Works</h3>
            {HOW_STEPS.map(({ num, title, desc }) => (
              <div key={num} className="flex gap-3.5 mb-3.5 last:mb-0">
                <div className="w-7 h-7 bg-green text-white rounded-lg flex items-center justify-center text-xs font-bold flex-shrink-0">{num}</div>
                <div>
                  <div className="text-sm font-semibold">{title}</div>
                  <div className="text-xs text-gray-500 mt-0.5">{desc}</div>
                </div>
              </div>
            ))}
          </div>

          <div className="bg-navy rounded-2xl p-5">
            <div className="text-3xl mb-3">🎧</div>
            <h3 className="font-head font-bold text-base text-white mb-2">Need Human Support?</h3>
            <p className="text-xs text-white/60 mb-4 leading-relaxed">If the chatbot can't resolve your issue, raise a formal ticket and our IT team will assist you.</p>
            <button className="btn-primary w-full justify-center" onClick={() => navigate('/raise-ticket')}>
              🎟️ Raise a Ticket
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
