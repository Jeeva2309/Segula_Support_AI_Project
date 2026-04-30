import React, { useState, useEffect } from 'react';
import {
  BarChart, Bar, LineChart, Line, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer
} from 'recharts';
import { getDashboardStats, getAgentPerformance, getRecentActivity, getChartData } from '../services/api';

const CAT_DATA = [
  { name: 'Software', value: 98, color: '#1DB954' },
  { name: 'Network', value: 72, color: '#f59e0b' },
  { name: 'Hardware', value: 54, color: '#ef4444' },
  { name: 'Other', value: 24, color: '#8b5cf6' },
];

const PRI_DATA = [
  { name: 'High', value: 67, color: '#ef4444' },
  { name: 'Medium', value: 112, color: '#f59e0b' },
  { name: 'Low', value: 69, color: '#1DB954' },
];

const HBAR_DATA = [
  { category: 'Network', minutes: 28 },
  { category: 'Hardware', minutes: 42 },
  { category: 'Software', minutes: 22 },
  { category: 'Other', minutes: 35 },
];

export default function AdminDashboard() {
  const [stats, setStats] = useState(null);
  const [chartData, setChartData] = useState({ bar: [], line: [] });
  const [agents, setAgents] = useState([]);
  const [activity, setActivity] = useState([]);

  useEffect(() => {
    Promise.all([
      getDashboardStats(),
      getChartData(),
      getAgentPerformance(),
      getRecentActivity()
    ]).then(([sRes, cRes, aRes, actRes]) => {
      setStats(sRes.data);
      setChartData({ bar: cRes.data.bar_chart, line: cRes.data.line_chart });
      setAgents(aRes.data);
      setActivity(actRes.data);
    }).catch(err => console.error("Error loading dashboard data", err));
  }, []);

  if (!stats) return <div className="p-20 text-center text-gray-500">Loading Dashboard...</div>;

  const KPI_DATA = [
    { label: 'Total Tickets', value: stats.total_tickets, trend: 'Lifetime total', up: true, dark: true },
    { label: 'Resolved', value: stats.resolved, trend: 'Lifetime resolved', up: true, green: true },
    { label: 'Pending', value: stats.pending, trend: 'Currently open', up: false, orange: true },
    { label: 'Avg Response', value: stats.avg_response, trend: 'Overall', up: true },
    { label: 'SLA Compliance', value: stats.sla_compliance, trend: 'Overall', up: true },
    { label: 'Chatbot Resolved', value: stats.chatbot_resolved, trend: 'AI interactions', up: true },
  ];

  return (
    <div>
      {/* Header */}
      <div className="px-20 pt-8 pb-0 flex items-start justify-between">
        <div>
          <div className="badge-green mb-3">📊 Admin Panel</div>
          <h1 className="font-head font-black text-4xl text-gray-900">IT Operations Dashboard</h1>
          <p className="text-sm text-gray-400 mt-1">Real-time Metrics</p>
        </div>
        <div className="flex gap-3 mt-2">
          <button className="btn-outline">
            <span className="w-2 h-2 rounded-full bg-green pulse-dot" /> Live Data
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-6 gap-3.5 px-20 py-6">
        {KPI_DATA.map(({ label, value, trend, up, dark, green: g, orange }) => (
          <div key={label} className={`rounded-2xl p-5 ${dark ? 'bg-navy' : g ? 'bg-green' : orange ? 'bg-amber-400' : 'card'}`}>
            <div className={`font-head font-black text-3xl leading-none mb-1 ${dark || g || orange ? 'text-white' : 'text-gray-900'}`}>{value}</div>
            <div className={`text-xs mt-1 ${dark || g || orange ? 'text-white/70' : 'text-gray-400'}`}>{label}</div>
            <div className={`text-xs font-semibold mt-1.5 ${dark || g || orange ? 'text-white/80' : up ? 'text-green' : 'text-red-400'}`}>{trend}</div>
          </div>
        ))}
      </div>

      {/* Row 1: Bar + Line */}
      <div className="grid grid-cols-2 gap-6 px-20 pb-6">
        <div className="card p-6">
          <h3 className="font-head font-bold text-base mb-1">Tickets Raised vs Resolved</h3>
          <p className="text-xs text-gray-400 mb-5">Monthly comparison over the last 6 months</p>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={chartData.bar} barGap={4}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="month" tick={{ fontSize: 12 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 12 }} axisLine={false} tickLine={false} />
              <Tooltip />
              <Legend iconType="square" iconSize={10} wrapperStyle={{ fontSize: 12 }} />
              <Bar dataKey="Raised" fill="#1a2535" radius={[4,4,0,0]} />
              <Bar dataKey="Resolved" fill="#1DB954" radius={[4,4,0,0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
        <div className="card p-6">
          <h3 className="font-head font-bold text-base mb-1">SLA Compliance Trend</h3>
          <p className="text-xs text-gray-400 mb-5">Resolution rate % over time</p>
          <ResponsiveContainer width="100%" height={200}>
            <LineChart data={chartData.line}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="month" tick={{ fontSize: 12 }} axisLine={false} tickLine={false} />
              <YAxis domain={[0, 100]} tick={{ fontSize: 12 }} axisLine={false} tickLine={false} />
              <Tooltip />
              <Line type="monotone" dataKey="SLA" stroke="#1DB954" strokeWidth={2.5} dot={{ fill: '#1DB954', r: 4 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Row 2: Donuts + HBar */}
      <div className="grid grid-cols-3 gap-6 px-20 pb-6">
        {/* By Category */}
        <div className="card p-6">
          <h3 className="font-head font-bold text-base mb-1">Tickets by Category</h3>
          <p className="text-xs text-gray-400 mb-3">Distribution across issue types</p>
          <div className="flex items-center gap-4">
            <PieChart width={130} height={130}>
              <Pie data={CAT_DATA} cx={60} cy={60} innerRadius={38} outerRadius={58} dataKey="value" paddingAngle={2}>
                {CAT_DATA.map((entry) => <Cell key={entry.name} fill={entry.color} />)}
              </Pie>
            </PieChart>
            <div>
              {CAT_DATA.map(({ name, value, color }) => (
                <div key={name} className="flex items-center justify-between gap-4 mb-2">
                  <span className="flex items-center gap-1.5 text-sm text-gray-500">
                    <span className="w-2.5 h-2.5 rounded-full inline-block" style={{ background: color }} />{name}
                  </span>
                  <span className="text-sm font-bold text-gray-900">{value}%</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* By Priority */}
        <div className="card p-6">
          <h3 className="font-head font-bold text-base mb-1">Tickets by Priority</h3>
          <p className="text-xs text-gray-400 mb-3">High / Medium / Low breakdown</p>
          <div className="flex items-center gap-4">
            <PieChart width={130} height={130}>
              <Pie data={PRI_DATA} cx={60} cy={60} innerRadius={38} outerRadius={58} dataKey="value" paddingAngle={2}>
                {PRI_DATA.map((entry) => <Cell key={entry.name} fill={entry.color} />)}
              </Pie>
            </PieChart>
            <div>
              {PRI_DATA.map(({ name, value, color }) => (
                <div key={name} className="flex items-center justify-between gap-4 mb-2">
                  <span className="flex items-center gap-1.5 text-sm text-gray-500">
                    <span className="w-2.5 h-2.5 rounded-full inline-block" style={{ background: color }} />{name}
                  </span>
                  <span className="text-sm font-bold text-gray-900">{value}%</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Avg Response Time */}
        <div className="card p-6">
          <h3 className="font-head font-bold text-base mb-1">Avg Response Time</h3>
          <p className="text-xs text-gray-400 mb-5">Minutes to first response</p>
          <ResponsiveContainer width="100%" height={160}>
            <BarChart data={HBAR_DATA} layout="vertical" barSize={14}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" horizontal={false} />
              <XAxis type="number" tick={{ fontSize: 11 }} axisLine={false} tickLine={false} />
              <YAxis type="category" dataKey="category" tick={{ fontSize: 12 }} axisLine={false} tickLine={false} width={65} />
              <Tooltip />
              <Bar dataKey="minutes" fill="#f59e0b" radius={[0,4,4,0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Row 3: Agent Table + Activity */}
      <div className="grid px-20 pb-16 gap-6" style={{ gridTemplateColumns: '2fr 1fr' }}>
        {/* Agent Performance */}
        <div className="card p-6">
          <h3 className="font-head font-bold text-base mb-1">Agent Performance</h3>
          <p className="text-xs text-gray-400 mb-5">Top IT support agents this month</p>
          <table className="w-full border-collapse">
            <thead>
              <tr className="border-b border-gray-100">
                {['Agent', 'Resolved', 'Avg Time', 'Rating'].map(h => (
                  <th key={h} className="text-xs font-semibold text-gray-400 text-left py-2 pb-3">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {agents.map(({ initials, name, rank, resolved, avg_time, rating }) => (
                <tr key={name} className="border-b border-gray-100 last:border-0">
                  <td className="py-3">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-lg text-white text-xs font-bold flex items-center justify-center bg-green">{initials}</div>
                      <div>
                        <div className="text-sm font-semibold">{name}</div>
                        <div className="text-xs text-gray-400">{rank}</div>
                      </div>
                    </div>
                  </td>
                  <td className="py-3 text-sm font-bold">{resolved}</td>
                  <td className="py-3 text-sm text-gray-600">{avg_time}</td>
                  <td className="py-3 text-sm"><span className="text-amber-400">★</span> {rating}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Recent Activity */}
        <div className="card p-6">
          <h3 className="font-head font-bold text-base mb-1">Recent Activity</h3>
          <p className="text-xs text-gray-400 mb-5">Latest ticket updates</p>
          {activity.map(({ title, tid, time }, i) => (
            <div key={tid + i} className="flex items-start gap-3 py-3 border-b border-gray-100 last:border-0">
              <div className="w-8 h-8 bg-blue-50 text-blue-500 rounded-xl flex items-center justify-center text-sm flex-shrink-0">🔵</div>
              <div className="flex-1">
                <div className="text-sm font-semibold">{title}</div>
                <div className="text-xs text-gray-400">{tid}</div>
              </div>
              <div className="text-xs text-gray-400 whitespace-nowrap">{time}</div>
            </div>
          ))}
          {activity.length === 0 && <p className="text-sm text-gray-500">No recent activity.</p>}
        </div>
      </div>
    </div>
  );
}
