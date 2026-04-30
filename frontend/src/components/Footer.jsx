import React from 'react';
import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="bg-gray-50 border-t border-gray-200 px-20 pt-12 pb-8">
      <div className="grid grid-cols-4 gap-10 mb-10">
        <div>
          <h4 className="font-head font-bold text-sm text-gray-900 mb-4">Product</h4>
          {[['/', 'Home'], ['/raise-ticket', 'Raise Ticket'], ['/chatbot', 'AI Chatbot'], ['/my-tickets', 'My Tickets']].map(([to, label]) => (
            <Link key={to} to={to} className="block text-sm text-gray-500 mb-2 hover:text-green transition-colors no-underline">{label}</Link>
          ))}
        </div>
        <div>
          <h4 className="font-head font-bold text-sm text-gray-900 mb-4">Analytics</h4>
          {[['Admin Dashboard', '/admin'], ['SLA Reports', '#'], ['Agent Performance', '#'], ['Category Insights', '#']].map(([label, to]) => (
            <Link key={label} to={to} className="block text-sm text-gray-500 mb-2 hover:text-green transition-colors no-underline">{label}</Link>
          ))}
        </div>
        <div>
          <h4 className="font-head font-bold text-sm text-gray-900 mb-4">Support</h4>
          {['Knowledge Base', 'IT Helpdesk: ext. 1234', 'Email: it@company.com', 'Emergency: ext. 911'].map((item) => (
            <span key={item} className="block text-sm text-gray-500 mb-2 cursor-pointer hover:text-green transition-colors">{item}</span>
          ))}
        </div>
        <div>
          <h4 className="font-head font-bold text-sm text-gray-900 mb-4">Company</h4>
          {['About Us', 'Privacy Policy', 'Terms of Service', 'Contact'].map((item) => (
            <span key={item} className="block text-sm text-gray-500 mb-2 cursor-pointer hover:text-green transition-colors">{item}</span>
          ))}
        </div>
      </div>
      <div className="flex items-center justify-between pt-6 border-t border-gray-200">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 bg-navy rounded-md relative overflow-hidden">
            <div className="absolute w-3.5 h-3.5 rounded-full bg-green top-0.5 left-0.5" />
            <div className="absolute w-2.5 h-2.5 rounded-full bg-blue-400 bottom-0.5 right-0.5" />
          </div>
          <span className="font-head font-black text-sm text-navy tracking-widest">SEGULA</span>
          <span className="font-head font-semibold text-sm text-gray-700">SupportAI</span>
        </div>
        <span className="text-sm text-gray-400">© 2026 SupportAI. All rights reserved. Smart IT Support Automation Platform.</span>
        <div className="flex gap-3">
          {['⌥', 'in', '𝕏'].map((icon) => (
            <button key={icon} className="w-8 h-8 rounded-lg border border-gray-200 flex items-center justify-center text-sm text-gray-400 hover:border-green hover:text-green transition-colors cursor-pointer bg-transparent">{icon}</button>
          ))}
        </div>
      </div>
    </footer>
  );
}
