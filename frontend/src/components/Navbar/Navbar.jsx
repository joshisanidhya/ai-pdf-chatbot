import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Brain, Menu, X, ChevronRight } from 'lucide-react';

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 40);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { label: 'Home', href: '#' },
    { label: 'Capabilities', href: '#capabilities' },
    { label: 'Why SAGE?', href: '#why' },
    { label: 'FAQ', href: '#faq' }
  ];

  return (
    <nav className={`fixed top-0 inset-x-0 z-50 transition-all duration-500 ${
      scrolled 
        ? 'bg-[#050505]/75 backdrop-blur-lg border-b border-white/[0.08] py-3.5 shadow-lg shadow-black/25' 
        : 'bg-[#050505]/20 backdrop-blur-md border-b border-white/[0.02] py-5.5'
    }`}>
      <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
        {/* Logo Left */}
        <Link to="/" className="flex items-center gap-2.5 group">
          <div className="w-8.5 h-8.5 rounded-xl bg-gradient-to-br from-[#FF6B2C] to-[#E63946] flex items-center justify-center transition-transform group-hover:scale-105 duration-300">
            <Brain className="w-4.5 h-4.5 text-white" />
          </div>
          <span className="font-bold text-lg text-[#F5F5F0] tracking-tight">SAGE</span>
        </Link>

        {/* Navigation Center */}
        <div className="hidden md:flex items-center gap-8 text-sm">
          {navLinks.map((link) => (
            <a 
              key={link.label}
              href={link.href} 
              className="text-[#9A9A9A] hover:text-[#F5F5F0] transition-colors duration-200"
            >
              {link.label}
            </a>
          ))}
        </div>

        {/* CTA Right */}
        <div className="hidden md:flex items-center gap-4">
          <Link 
            to="/login" 
            className="text-sm font-medium text-[#9A9A9A] hover:text-[#F5F5F0] px-4 py-2 transition-colors duration-200"
          >
            Sign in
          </Link>
          <Link 
            to="/register" 
            className="btn-primary text-xs py-2 px-4.5 gap-2"
          >
            <span>Try SAGE</span>
            <span className="w-4.5 h-4.5 rounded-full bg-black flex items-center justify-center text-white">
              <ChevronRight className="w-3 h-3" />
            </span>
          </Link>
        </div>

        {/* Mobile Toggle */}
        <button 
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="md:hidden p-2 text-[#9A9A9A] hover:text-[#F5F5F0] transition-colors"
        >
          {mobileMenuOpen ? <X className="w-5.5 h-5.5" /> : <Menu className="w-5.5 h-5.5" />}
        </button>
      </div>

      {/* Mobile Menu Overlay */}
      {mobileMenuOpen && (
        <div className="md:hidden fixed inset-x-0 top-[52px] bg-[#0A0A0A] border-b border-white/[0.08] px-6 py-6 flex flex-col gap-4 shadow-2xl">
          {navLinks.map((link) => (
            <a 
              key={link.label}
              href={link.href} 
              onClick={() => setMobileMenuOpen(false)}
              className="text-base font-medium text-[#9A9A9A] hover:text-[#F5F5F0] py-1.5 transition-colors border-b border-white/5 last:border-0"
            >
              {link.label}
            </a>
          ))}
          <div className="flex flex-col gap-3 mt-2">
            <Link 
              to="/login" 
              onClick={() => setMobileMenuOpen(false)}
              className="text-center text-sm font-medium text-[#9A9A9A] hover:text-[#F5F5F0] py-2"
            >
              Sign in
            </Link>
            <Link 
              to="/register" 
              onClick={() => setMobileMenuOpen(false)}
              className="btn-primary py-2.5 justify-center text-sm"
            >
              <span>Try SAGE</span>
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
}
