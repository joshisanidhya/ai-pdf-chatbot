/**
 * Landing Page — SAGE (Semantic Analysis & Guidance Engine)
 * Redesigned to match the Unizenlabs style: near-black, orange-red gradients, noise overlay, scrolling marquees
 */

import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion as motionBase } from 'framer-motion';
import {
  Brain, FileText, Zap, Shield, MessageSquare,
  ChevronRight, Search, Sparkles, BookOpen, Upload, Menu, X
} from 'lucide-react';

const fadeInUp = {
  initial: { opacity: 0, y: 24 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-100px" },
  transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] },
};

const stagger = {
  animate: { transition: { staggerChildren: 0.08 } },
};

const features = [
  {
    icon: Upload,
    title: 'Upload Knowledge to SAGE',
    description: 'Drag & drop research papers, legal contracts, textbooks, or manuals. SAGE processes them immediately.',
    color: 'from-[#FF6B2C] to-[#E63946]',
    bg: 'bg-[#FF6B2C]/10',
  },
  {
    icon: Brain,
    title: 'Semantic Intelligence',
    description: 'Advanced RAG-based context parsing extracts deep semantic meaning beyond mere keyword matching.',
    color: 'from-[#E63946] to-amber-500',
    bg: 'bg-[#E63946]/10',
  },
  {
    icon: MessageSquare,
    title: 'SAGE Intelligence Engine',
    description: 'Ask SAGE anything about your documents. Get accurate, structured responses with rich text formatting.',
    color: 'from-[#FF6B2C] to-amber-600',
    bg: 'bg-[#FF6B2C]/10',
  },
  {
    icon: Search,
    title: 'Context-Aware AI Retrieval',
    description: 'Every generated response references and links the exact source citation cards for complete transparency.',
    color: 'from-amber-500 to-[#FF6B2C]',
    bg: 'bg-amber-500/10',
  },
  {
    icon: Zap,
    title: 'Knowledge Beyond Search',
    description: 'Vector similarity search instantly retrieves the most relevant text chunks from dense documents in milliseconds.',
    color: 'from-[#E63946] to-amber-600',
    bg: 'bg-[#E63946]/10',
  },
  {
    icon: Shield,
    title: 'Private & Secure',
    description: 'Your documents stay securely isolated. Complete JWT session protection with encrypted database architecture.',
    color: 'from-[#FF6B2C] to-[#E63946]',
    bg: 'bg-[#FF6B2C]/10',
  },
];

const techStack = [
  { name: 'React SPA', icon: '⚛️' },
  { name: 'LangChain', icon: '🔗' },
  { name: 'HuggingFace', icon: '🤗' },
  { name: 'Vector DB', icon: '🗄️' },
  { name: 'Node.js', icon: '🟢' },
  { name: 'MongoDB', icon: '🍃' },
];

// Helper components for rich background elements
const NoiseOverlay = () => (
  <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg" className="absolute inset-0 w-full h-full opacity-[0.03] pointer-events-none mix-blend-overlay z-50">
    <filter id="noiseFilter">
      <feTurbulence type="fractalNoise" baseFrequency="0.8" numOctaves="4" stitchTiles="stitch" />
    </filter>
    <rect width="100%" height="100%" filter="url(#noiseFilter)" />
  </svg>
);

const StarsSprinkle = () => (
  <div className="absolute inset-0 opacity-[0.12] pointer-events-none z-0">
    <svg width="100%" height="100%" className="w-full h-full">
      <circle cx="8%" cy="12%" r="1" fill="#fff" />
      <circle cx="22%" cy="28%" r="1.5" fill="#fff" />
      <circle cx="43%" cy="8%" r="1" fill="#fff" />
      <circle cx="68%" cy="22%" r="1.5" fill="#fff" />
      <circle cx="88%" cy="14%" r="1" fill="#fff" />
      <circle cx="94%" cy="38%" r="2" fill="#fff" />
      <circle cx="4%" cy="58%" r="1.5" fill="#fff" />
      <circle cx="18%" cy="78%" r="1" fill="#fff" />
      <circle cx="38%" cy="68%" r="2" fill="#fff" />
      <circle cx="58%" cy="82%" r="1" fill="#fff" />
      <circle cx="78%" cy="62%" r="1.5" fill="#fff" />
      <circle cx="92%" cy="78%" r="1" fill="#fff" />
      <circle cx="48%" cy="48%" r="1.5" fill="#fff" />
    </svg>
  </div>
);

const AuroraBackground = () => (
  <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
    <motionBase.div
      animate={{
        x: [0, 50, -30, 0],
        y: [0, -40, 30, 0],
        scale: [1, 1.15, 0.9, 1],
      }}
      transition={{
        duration: 22,
        repeat: Infinity,
        ease: "easeInOut",
      }}
      className="absolute top-[-20%] right-[-10%] w-[80vw] h-[80vw] md:w-[60vw] md:h-[60vw] rounded-full bg-gradient-to-br from-[#FF6B2C] via-[#E63946] to-amber-600 blur-[130px] opacity-[0.14] mix-blend-screen"
    />
    <motionBase.div
      animate={{
        x: [0, -40, 50, 0],
        y: [0, 30, -40, 0],
        scale: [1, 0.9, 1.15, 1],
      }}
      transition={{
        duration: 26,
        repeat: Infinity,
        ease: "easeInOut",
      }}
      className="absolute bottom-[-20%] left-[-10%] w-[80vw] h-[80vw] md:w-[50vw] md:h-[50vw] rounded-full bg-gradient-to-tr from-amber-600 via-[#FF6B2C] to-[#E63946] blur-[120px] opacity-[0.12] mix-blend-screen"
    />
  </div>
);

export default function LandingPage() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="min-h-screen bg-[#0A0A0A] text-[#F5F5F0] overflow-x-hidden relative selection:bg-[#FF6B2C]/30">
      <NoiseOverlay />
      
      {/* ── Navbar ──────────────────────────────────────── */}
      <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled ? 'bg-[#0A0A0A]/85 backdrop-blur-md border-b border-white/5 py-4' : 'bg-transparent py-6'
      }`}>
        <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2.5 z-50">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#FF6B2C] to-[#E63946] flex items-center justify-center shadow-brand">
              <Brain className="w-5 h-5 text-white" />
            </div>
            <span className="font-bold text-xl text-[#F5F5F0] tracking-tight">
              SAGE
            </span>
          </Link>

          {/* Desktop Nav Links */}
          <div className="hidden md:flex items-center gap-8">
            <a href="#features" className="text-sm font-medium text-[#9A9A9A] hover:text-[#F5F5F0] transition-colors">Features</a>
            <a href="#tech" className="text-sm font-medium text-[#9A9A9A] hover:text-[#F5F5F0] transition-colors">Technology</a>
            <a href="#how-it-works" className="text-sm font-medium text-[#9A9A9A] hover:text-[#F5F5F0] transition-colors">How it works</a>
          </div>

          <div className="hidden md:flex items-center gap-4">
            <Link to="/login" className="text-sm font-medium text-[#9A9A9A] hover:text-[#F5F5F0] px-4 py-2 transition-colors">
              Sign in
            </Link>
            <Link to="/register" className="btn-primary group py-2 px-5">
              <span>Try SAGE</span>
              <span className="w-5 h-5 rounded-full bg-black flex items-center justify-center text-white transition-transform group-hover:translate-x-0.5 duration-200">
                <ChevronRight className="w-3 h-3" />
              </span>
            </Link>
          </div>

          {/* Mobile Hamburger Toggle */}
          <button 
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden z-50 p-2 text-[#9A9A9A] hover:text-[#F5F5F0] transition-colors"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Menu Overlay */}
        {mobileMenuOpen && (
          <motionBase.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed inset-x-0 top-0 bg-[#0A0A0A] border-b border-white/5 pt-24 pb-8 px-6 flex flex-col gap-6 md:hidden z-40 shadow-2xl"
          >
            <a 
              href="#features" 
              onClick={() => setMobileMenuOpen(false)}
              className="text-lg font-medium text-[#9A9A9A] hover:text-[#F5F5F0] transition-colors py-2 border-b border-white/5"
            >
              Features
            </a>
            <a 
              href="#tech" 
              onClick={() => setMobileMenuOpen(false)}
              className="text-lg font-medium text-[#9A9A9A] hover:text-[#F5F5F0] transition-colors py-2 border-b border-white/5"
            >
              Technology
            </a>
            <a 
              href="#how-it-works" 
              onClick={() => setMobileMenuOpen(false)}
              className="text-lg font-medium text-[#9A9A9A] hover:text-[#F5F5F0] transition-colors py-2 border-b border-white/5"
            >
              How it works
            </a>
            <div className="flex flex-col gap-4 mt-4">
              <Link 
                to="/login" 
                onClick={() => setMobileMenuOpen(false)}
                className="text-center text-base font-medium text-[#9A9A9A] hover:text-[#F5F5F0] py-2"
              >
                Sign in
              </Link>
              <Link 
                to="/register" 
                onClick={() => setMobileMenuOpen(false)}
                className="btn-primary py-3 justify-center"
              >
                <span>Try SAGE</span>
              </Link>
            </div>
          </motionBase.div>
        )}
      </nav>

      {/* ── Hero Section ─────────────────────────────────── */}
      <section className="relative min-h-[95vh] flex items-center justify-center pt-32 pb-24 px-6 overflow-hidden">
        <AuroraBackground />
        <StarsSprinkle />

        <div className="relative z-10 max-w-5xl mx-auto text-center flex flex-col items-center">
          {/* Badge */}
          <motionBase.div 
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="inline-flex items-center gap-2 bg-white/[0.03] border border-[#FF6B2C]/30 px-4 py-1.5 rounded-full text-xs text-[#FF824D] mb-8 shadow-[0_0_15px_rgba(255,107,44,0.05)]"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span className="font-semibold tracking-wide uppercase">✦ Built to Deliver</span>
          </motionBase.div>

          {/* Headline */}
          <motionBase.h1
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
            className="text-[2.75rem] sm:text-[4.25rem] md:text-[5.5rem] font-bold text-white mb-6 leading-[1.08] tracking-tight max-w-4xl"
          >
            Intelligent Document Understanding with <span className="gradient-text">SAGE</span>
          </motionBase.h1>

          {/* Subheadline */}
          <motionBase.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="text-base sm:text-lg md:text-xl text-[#9A9A9A] max-w-2xl mb-10 leading-relaxed font-normal"
          >
            Upload knowledge to SAGE and ask anything about your documents. Experience context-aware AI retrieval and rich, grounded conversations.
          </motionBase.p>

          {/* CTA Buttons */}
          <motionBase.div 
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.3 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16"
          >
            <Link
              to="/register"
              id="hero-cta-register"
              className="btn-primary group text-base px-8 py-3.5 shadow-brand-lg"
            >
              <span>Upload Knowledge to SAGE</span>
              <span className="w-6 h-6 rounded-full bg-black flex items-center justify-center text-white transition-transform group-hover:translate-x-1 duration-200">
                <ChevronRight className="w-4 h-4" />
              </span>
            </Link>
            <Link
              to="/login"
              id="hero-cta-login"
              className="btn-secondary text-base px-8 py-3.5"
            >
              View Demo
            </Link>
          </motionBase.div>

          {/* Trust Row */}
          <div className="flex items-center justify-center gap-3 animate-fade-in-up" style={{ animationDelay: '0.4s' }}>
            <div className="flex -space-x-2.5">
              <div className="w-8 h-8 rounded-full border-2 border-[#0A0A0A] bg-gradient-to-br from-orange-400 to-[#E63946] flex items-center justify-center text-[10px] font-bold text-white shadow-md">R</div>
              <div className="w-8 h-8 rounded-full border-2 border-[#0A0A0A] bg-gradient-to-br from-amber-400 to-red-500 flex items-center justify-center text-[10px] font-bold text-white shadow-md">S</div>
              <div className="w-8 h-8 rounded-full border-2 border-[#0A0A0A] bg-gradient-to-br from-[#FF6B2C] to-amber-500 flex items-center justify-center text-[10px] font-bold text-white shadow-md">A</div>
              <div className="w-8 h-8 rounded-full border-2 border-[#0A0A0A] bg-gradient-to-br from-red-500 to-purple-600 flex items-center justify-center text-[10px] font-bold text-white shadow-md">D</div>
              <div className="w-8 h-8 rounded-full border-2 border-[#0A0A0A] bg-gradient-to-br from-[#E63946] to-pink-500 flex items-center justify-center text-[10px] font-bold text-white shadow-md">M</div>
            </div>
            <p className="text-sm text-[#9A9A9A]">
              Trusted already by <span className="text-[#F5F5F0] font-medium">1,200+ Researchers & Developers</span>
            </p>
          </div>
        </div>
      </section>

      {/* ── Logo Carousel / Social Proof ─────────────────── */}
      <section id="tech" className="border-y border-white/5 bg-[#0B0B0D] py-10 relative overflow-hidden z-10">
        <div className="max-w-7xl mx-auto px-6">
          <p className="text-center text-xs font-semibold text-[#9A9A9A] uppercase tracking-widest mb-6">
            Trusted by top innovative teams & built with
          </p>

          <div className="relative w-full overflow-hidden py-2">
            {/* Fade masks */}
            <div className="absolute left-0 top-0 bottom-0 w-16 md:w-32 bg-gradient-to-r from-[#0B0B0D] to-transparent z-10 pointer-events-none" />
            <div className="absolute right-0 top-0 bottom-0 w-16 md:w-32 bg-gradient-to-l from-[#0B0B0D] to-transparent z-10 pointer-events-none" />
            
            <div className="flex gap-16 items-center w-max animate-marquee">
              {[...techStack, ...techStack, ...techStack].map((tech, index) => (
                <div key={index} className="flex items-center gap-3.5 grayscale opacity-45 hover:grayscale-0 hover:opacity-100 transition-all duration-300">
                  <span className="text-2xl">{tech.icon}</span>
                  <span className="text-[#F5F5F0] font-semibold tracking-tight text-base">{tech.name}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── Feature / Split Section ──────────────────────── */}
      <section id="how-it-works" className="relative z-10 max-w-7xl mx-auto px-6 py-28 md:py-36">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 items-center">
          
          {/* Left Column: Illustrative Interactive Widget */}
          <div className="relative flex items-center justify-center py-8">
            {/* Ambient Background Glow */}
            <div className="absolute w-72 h-72 bg-[#FF6B2C] rounded-full blur-[110px] opacity-[0.2] animate-pulse-slow pointer-events-none" />
            
            {/* Floating Slider Box */}
            <motionBase.div
              initial={{ y: 24, opacity: 0 }}
              whileInView={{ y: 0, opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              className="relative z-10 glass rounded-3xl p-7 border border-white/10 shadow-dark-lg max-w-sm w-full"
            >
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-[#FF6B2C]" />
                  <span className="text-xs uppercase tracking-wider text-[#9A9A9A] font-semibold">Semantic vs Keyword</span>
                </div>
                <span className="text-xs text-[#FF6B2C] bg-[#FF6B2C]/10 px-2.5 py-0.5 rounded-full font-medium">Active</span>
              </div>
              
              {/* Slider Track Widget */}
              <div className="bg-black/40 border border-white/5 rounded-2xl p-5 space-y-4">
                <div className="flex justify-between text-xs text-[#9A9A9A] font-semibold">
                  <span>Keywords</span>
                  <span className="text-[#FF6B2C]">Semantic RAG</span>
                </div>
                
                <div className="relative h-6 bg-white/5 rounded-full p-1 flex items-center">
                  <motionBase.div
                    animate={{ width: ["15%", "85%", "15%"] }}
                    transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
                    className="absolute left-1 top-1 bottom-1 bg-gradient-to-r from-[#FF6B2C] to-[#E63946] rounded-full"
                  />
                  <motionBase.div
                    animate={{ left: ["4px", "calc(100% - 24px)", "4px"] }}
                    transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
                    className="absolute w-5 h-5 rounded-full bg-white flex items-center justify-center shadow-lg"
                  >
                    <div className="w-2 h-2 rounded-full bg-[#E63946]" />
                  </motionBase.div>
                </div>
              </div>

              {/* Statistics metrics */}
              <div className="mt-5 pt-4 border-t border-white/5 flex justify-between items-center text-xs">
                <span className="text-[#9A9A9A]">Retrieval Accuracy</span>
                <motionBase.span
                  animate={{ opacity: [0.6, 1, 0.6] }}
                  transition={{ duration: 2.5, repeat: Infinity }}
                  className="font-mono text-[#F5F5F0] font-bold"
                >
                  98.4%
                </motionBase.span>
              </div>

              {/* Simulation tags */}
              <div className="mt-3 flex gap-2">
                <span className="text-[10px] bg-white/5 border border-white/5 text-[#9A9A9A] px-2 py-0.5 rounded-md">Sentence-Transformers</span>
                <span className="text-[10px] bg-[#FF6B2C]/5 border border-[#FF6B2C]/10 text-[#FF824D] px-2 py-0.5 rounded-md">Recursive Chunking</span>
              </div>
            </motionBase.div>
          </div>

          {/* Right Column: Copy & CTAs */}
          <motionBase.div 
            variants={fadeInUp}
            initial="initial"
            whileInView="whileInView"
            viewport={{ once: true }}
            className="flex flex-col items-start text-left"
          >
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-6 leading-tight tracking-tight">
              Unlock knowledge beyond basic keyword search
            </h2>
            <p className="text-base sm:text-lg text-[#9A9A9A] mb-8 leading-relaxed">
              Sage uses semantic vector databases to find the exact pages, paragraphs, and context within dense documents in milliseconds. Get answers that are completely grounded, structured, and cited.
            </p>
            
            <Link
              to="/register"
              className="btn-primary group text-base px-6 py-3.5 shadow-brand-lg"
            >
              <span>Learn More</span>
              <span className="w-6 h-6 rounded-full bg-black flex items-center justify-center text-white transition-transform group-hover:translate-x-1 duration-200">
                <ChevronRight className="w-4 h-4" />
              </span>
            </Link>
          </motionBase.div>
        </div>
      </section>

      {/* ── Features Grid ────────────────────────────────── */}
      <section id="features" className="relative z-10 max-w-7xl mx-auto px-6 py-20 md:py-28">
        <motionBase.div
          variants={fadeInUp}
          initial="initial"
          whileInView="whileInView"
          viewport={{ once: true }}
          className="text-center mb-20"
        >
          <span className="text-[#FF6B2C] text-xs font-semibold uppercase tracking-widest mb-3 block">
            Why SAGE?
          </span>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-5 tracking-tight">
            Everything you need for <span className="gradient-text">document understanding</span>
          </h2>
          <p className="text-[#9A9A9A] text-base sm:text-lg max-w-xl mx-auto leading-relaxed">
            A production-ready Semantic AI Generation Engine built for researchers, developers, and knowledge workers.
          </p>
        </motionBase.div>

        <motionBase.div
          variants={stagger}
          initial="initial"
          whileInView="animate"
          viewport={{ once: true }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {features.map((feature, i) => (
            <motionBase.div
              key={feature.title}
              variants={fadeInUp}
              className="card-hover group"
            >
              <div className={`w-12 h-12 rounded-2xl ${feature.bg} flex items-center justify-center mb-5 group-hover:scale-110 transition-transform duration-300`}>
                <feature.icon className="w-5 h-5 text-white" />
              </div>
              <h3 className="font-bold text-white text-lg mb-2">{feature.title}</h3>
              <p className="text-[#9A9A9A] text-sm leading-relaxed">{feature.description}</p>
            </motionBase.div>
          ))}
        </motionBase.div>
      </section>

      {/* ── Bottom CTA ───────────────────────────────────── */}
      <section className="relative z-10 max-w-5xl mx-auto px-6 py-20 md:py-28 text-center">
        <motionBase.div
          variants={fadeInUp}
          initial="initial"
          whileInView="whileInView"
          viewport={{ once: true }}
          className="glass rounded-3xl p-12 md:p-16 border border-[#FF6B2C]/20 relative overflow-hidden"
          style={{ background: 'radial-gradient(ellipse at 50% 0%, rgba(255,107,44,0.08) 0%, transparent 70%), rgba(18, 18, 20, 0.4)' }}
        >
          <Sparkles className="w-10 h-10 text-[#FF6B2C] mx-auto mb-5" />
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-4 tracking-tight">
            Ready to experience knowledge beyond search?
          </h2>
          <p className="text-[#9A9A9A] text-base sm:text-lg mb-10 max-w-lg mx-auto leading-relaxed">
            Join researchers, developers, and students who use SAGE to explore documents with intelligent RAG conversations.
          </p>
          <Link to="/register" className="btn-primary group text-base px-8 py-3.5 shadow-brand-lg">
            <span>Start for Free — No Credit Card Required</span>
            <span className="w-6 h-6 rounded-full bg-black flex items-center justify-center text-white transition-transform group-hover:translate-x-1 duration-200">
              <ChevronRight className="w-4 h-4" />
            </span>
          </Link>
        </motionBase.div>
      </section>

      {/* ── Footer ──────────────────────────────────────── */}
      <footer className="relative z-10 border-t border-white/5 py-10 bg-[#0B0B0D]">
        <div className="max-w-7xl mx-auto px-6 flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-[#FF6B2C] to-[#E63946] flex items-center justify-center">
              <Brain className="w-4 h-4 text-white" />
            </div>
            <span className="text-[#9A9A9A] text-sm font-semibold">SAGE © 2026</span>
          </div>
          <div className="flex items-center gap-8 text-sm text-[#9A9A9A]">
            <a href="#" className="hover:text-white transition-colors">Privacy</a>
            <a href="#" className="hover:text-white transition-colors">Terms</a>
            <a href="https://github.com/joshisanidhya/ai-pdf-chatbot" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">GitHub</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
