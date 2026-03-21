import React from 'react';
import { Link } from 'react-router-dom';

export default function Footer() {
  const links = {
    'Shop': [
      { label: 'Electronics', to: '/products?category=Electronics' },
      { label: 'Fashion', to: '/products?category=Fashion' },
      { label: 'Home & Living', to: '/products?category=Home' },
      { label: 'Sports', to: '/products?category=Sports' },
    ],
    'Support': [
      { label: 'Help Center', to: '#' },
      { label: 'Track Order', to: '#' },
      { label: 'Returns', to: '#' },
      { label: 'Contact Us', to: '#' },
    ],
    'Company': [
      { label: 'About Us', to: '#' },
      { label: 'Careers', to: '#' },
      { label: 'Privacy Policy', to: '#' },
      { label: 'Terms of Service', to: '#' },
    ],
  };

  return (
    <footer className="bg-dark-800 border-t border-blue-500/10 mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="col-span-2 md:col-span-1">
            <Link to="/" className="flex items-center gap-2.5 mb-4">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-accent-blue to-accent-cyan flex items-center justify-center">
                <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                  <path d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 100 4 2 2 0 000-4z" />
                </svg>
              </div>
              <span className="text-lg font-bold">Smart<span className="text-gradient">Kart</span></span>
            </Link>
            <p className="text-sm text-slate-500 mb-4 leading-relaxed">
              Shop smart, shop secure. Premium products with enterprise-grade security and blazing-fast delivery.
            </p>
            {/* Social icons */}
            <div className="flex gap-3">
              {['twitter', 'github', 'linkedin'].map(social => (
                <a key={social} href="#" className="w-8 h-8 rounded-lg bg-dark-600 border border-blue-500/10 flex items-center justify-center text-slate-500 hover:text-accent-blue hover:border-accent-blue/30 transition-all">
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                    {social === 'twitter' && <path d="M23 3a10.9 10.9 0 01-3.14 1.53 4.48 4.48 0 00-7.86 3v1A10.66 10.66 0 013 4s-4 9 5 13a11.64 11.64 0 01-7 2c9 5 20 0 20-11.5 0-.28-.03-.56-.08-.83A7.72 7.72 0 0023 3z" />}
                    {social === 'github' && <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" />}
                    {social === 'linkedin' && <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />}
                  </svg>
                </a>
              ))}
            </div>
          </div>

          {/* Link columns */}
          {Object.entries(links).map(([title, items]) => (
            <div key={title}>
              <h4 className="text-sm font-semibold text-slate-200 mb-4 tracking-wider uppercase font-mono">{title}</h4>
              <ul className="space-y-2.5">
                {items.map(link => (
                  <li key={link.label}>
                    <Link to={link.to} className="text-sm text-slate-500 hover:text-accent-blue transition-colors">
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-10 pt-8 border-t border-blue-500/10 flex flex-col sm:flex-row justify-between items-center gap-4">
          <p className="text-xs text-slate-600 font-mono">
            &copy; 2026 SmartKart. All rights reserved.
          </p>
          <div className="flex items-center gap-2 text-xs text-slate-600">
            <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
            All systems operational
          </div>
        </div>
      </div>
    </footer>
  );
}
