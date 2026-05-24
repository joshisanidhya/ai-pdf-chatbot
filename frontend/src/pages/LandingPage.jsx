/**
 * Landing Page — SAGE (Semantic Analysis & Guidance Engine)
 * Hero section, feature showcase, and CTA
 */

import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'react-motion'; // Wait, let's make sure we import from 'framer-motion'
import { motion as motionBase } from 'framer-motion';
import {
  Brain, FileText, Zap, Shield, MessageSquare,
  ChevronRight, Search, Sparkles, BookOpen, Upload
} from 'lucide-react';

const fadeInUp = {
  initial: { opacity: 0, y: 30 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] },
};

const stagger = {
  animate: { transition: { staggerChildren: 0.1 } },
};

const features = [
  {
    icon: Upload,
    title: 'Upload Knowledge to SAGE',
    description: 'Drag & drop research papers, legal contracts, textbooks, or manuals. SAGE processes them immediately.',
    color: 'from-blue-500 to-cyan-500',
    bg: 'bg-blue-500/10',
  },
  {
    icon: Brain,
    title: 'Semantic Intelligence',
    description: 'Advanced RAG-based context parsing extracts deep semantic meaning beyond mere keyword matching.',
    color: 'from-purple-500 to-pink-500',
    bg: 'bg-purple-500/10',
  },
  {
    icon: MessageSquare,
    title: 'SAGE Intelligence Engine',
    description: 'Ask SAGE anything about your documents. Get accurate, structured responses with rich text formatting.',
    color: 'from-emerald-500 to-teal-500',
    bg: 'bg-emerald-500/10',
  },
  {
    icon: Search,
    title: 'Context-Aware AI Retrieval',
    description: 'Every generated response references and links the exact source citation cards for complete transparency.',
    color: 'from-amber-500 to-orange-500',
    bg: 'bg-amber-500/10',
  },
  {
    icon: Zap,
    title: 'Knowledge Beyond Search',
    description: 'Vector similarity search instantly retrieves the most relevant text chunks from dense documents in milliseconds.',
    color: 'from-yellow-500 to-amber-500',
    bg: 'bg-yellow-500/10',
  },
  {
    icon: Shield,
    title: 'Private & Secure',
    description: 'Your documents stay securely isolated. Complete JWT session protection with encrypted database architecture.',
    color: 'from-rose-500 to-red-500',
    bg: 'bg-rose-500/10',
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

export default function LandingPage() {
  return (
    <div className="min-h-screen hero-bg overflow-hidden">
      {/* ── Background Orbs ─────────────────────────────── */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="bg-orb-brand w-[600px] h-[600px] -top-48 -left-24 opacity-15" />
        <div className="bg-orb-purple w-[500px] h-[500px] top-1/2 -right-32 opacity-10" />
        <div className="bg-orb bg-cyan-600 w-[400px] h-[400px] bottom-0 left-1/3 opacity-10" />
      </div>

      {/* ── Navbar ──────────────────────────────────────── */}
      <nav className="relative z-10 flex items-center justify-between px-6 py-5 max-w-7xl mx-auto">
        <motionBase.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="flex items-center gap-2.5"
        >
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-brand-500 to-purple-600 flex items-center justify-center shadow-brand">
            <Brain className="w-5 h-5 text-white" />
          </div>
          <span className="font-bold text-xl text-white tracking-tight">
            SAGE
          </span>
        </motionBase.div>

        <motionBase.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="flex items-center gap-3"
        >
          <Link to="/login" className="btn-ghost text-sm px-4 py-2">
            Sign in
          </Link>
          <Link to="/register" className="btn-primary text-sm">
            Get Started Free
          </Link>
        </motionBase.div>
      </nav>

      {/* ── Hero Section ─────────────────────────────────── */}
      <section className="relative z-10 max-w-7xl mx-auto px-6 pt-24 pb-32 text-center">
        <motionBase.div variants={stagger} initial="initial" animate="animate">
          {/* Badge */}
          <motionBase.div variants={fadeInUp} className="inline-flex items-center gap-2 glass px-4 py-1.5 rounded-full text-sm text-brand-300 mb-8 border border-brand-500/30">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Powered by Semantic Intelligence & Context-Aware Retrieval</span>
          </motionBase.div>

          {/* Headline */}
          <motionBase.h1
            variants={fadeInUp}
            className="text-5xl md:text-7xl font-black text-white mb-6 leading-tight tracking-tight"
          >
            Intelligent Document
            <br />
            Understanding with{' '}
            <span className="relative">
              <span className="gradient-text">SAGE</span>
              <motionBase.div
                className="absolute -bottom-2 left-0 right-0 h-px bg-gradient-to-r from-transparent via-brand-500 to-transparent"
                initial={{ scaleX: 0 }}
                animate={{ scaleX: 1 }}
                transition={{ delay: 0.8, duration: 0.8 }}
              />
            </span>
          </motionBase.h1>

          {/* Subheadline */}
          <motionBase.p
            variants={fadeInUp}
            className="text-xl text-slate-400 max-w-2xl mx-auto mb-10 leading-relaxed font-light"
          >
            Upload knowledge to SAGE and ask anything about your documents. Experience context-aware AI retrieval and rich, grounded conversations.
          </motionBase.p>

          {/* CTA Buttons */}
          <motionBase.div variants={fadeInUp} className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16">
            <Link
              to="/register"
              id="hero-cta-register"
              className="btn-primary text-base px-8 py-3.5 gap-2.5 shadow-brand-lg"
            >
              <Upload className="w-4.5 h-4.5" />
              Upload Knowledge to SAGE
              <ChevronRight className="w-4 h-4" />
            </Link>
            <Link
              to="/login"
              id="hero-cta-login"
              className="btn-secondary text-base px-8 py-3.5"
            >
              <BookOpen className="w-4.5 h-4.5" />
              View Demo
            </Link>
          </motionBase.div>

          {/* Hero Terminal Preview */}
          <motionBase.div
            variants={fadeInUp}
            className="relative max-w-4xl mx-auto glass rounded-2xl border border-white/10 overflow-hidden shadow-dark-lg"
          >
            {/* Window bar */}
            <div className="flex items-center gap-2 px-4 py-3 border-b border-white/5 bg-white/[0.02]">
              <div className="w-3 h-3 rounded-full bg-red-500/60" />
              <div className="w-3 h-3 rounded-full bg-amber-500/60" />
              <div className="w-3 h-3 rounded-full bg-emerald-500/60" />
              <span className="ml-2 text-xs text-slate-500 font-mono">sage-ai — chat</span>
            </div>

            {/* Mock chat UI */}
            <div className="p-6 space-y-4 text-left">
              {/* User message */}
              <div className="flex items-start gap-3 justify-end">
                <div className="glass-strong px-4 py-3 rounded-2xl rounded-br-sm max-w-sm">
                  <p className="text-sm text-slate-200">How does SAGE handle context-aware retrieval?</p>
                </div>
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-brand-500 to-purple-600 flex items-center justify-center flex-shrink-0 text-xs font-bold">
                  U
                </div>
              </div>

              {/* AI message */}
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center flex-shrink-0">
                  <Brain className="w-4 h-4 text-white" />
                </div>
                <div className="flex-1 space-y-3">
                  <div className="glass px-4 py-3 rounded-2xl rounded-bl-sm max-w-2xl">
                    <p className="text-sm text-slate-200 leading-relaxed font-light">
                      SAGE handles context-aware retrieval using an advanced semantic pipeline:
                    </p>
                    <ul className="mt-2 space-y-1 text-sm text-slate-300">
                      <li className="flex items-center gap-2"><span className="text-brand-400">▸</span> Tokenizes & chunks PDFs recursively to preserve semantic boundaries</li>
                      <li className="flex items-center gap-2"><span className="text-brand-400">▸</span> Embeds chunks into a high-dimensional vector space</li>
                      <li className="flex items-center gap-2"><span className="text-brand-400">▸</span> Performs similarity search to inject top-k relevant references directly into the context window</li>
                    </ul>
                  </div>
                  {/* Source citation */}
                  <div className="flex items-center gap-2 text-xs text-slate-500">
                    <FileText className="w-3.5 h-3.5 text-brand-500" />
                    <span>Source: sage-architecture.pdf · Page 3 · Powered by semantic intelligence</span>
                  </div>
                </div>
              </div>
            </div>
          </motionBase.div>
        </motionBase.div>
      </section>

      {/* ── Features Grid ────────────────────────────────── */}
      <section className="relative z-10 max-w-7xl mx-auto px-6 py-24">
        <motionBase.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <span className="text-brand-400 text-sm font-semibold uppercase tracking-widest mb-3 block">
            Why SAGE?
          </span>
          <h2 className="text-4xl font-bold text-white mb-4">
            Everything you need for
            <span className="gradient-text"> document understanding</span>
          </h2>
          <p className="text-slate-400 text-lg max-w-xl mx-auto">
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
              transition={{ delay: i * 0.05 }}
              className="card-hover group"
            >
              <div className={`w-12 h-12 rounded-xl ${feature.bg} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300`}>
                <feature.icon className="w-6 h-6 text-white" />
              </div>
              <h3 className="font-semibold text-white text-lg mb-2">{feature.title}</h3>
              <p className="text-slate-400 text-sm leading-relaxed">{feature.description}</p>
            </motionBase.div>
          ))}
        </motionBase.div>
      </section>

      {/* ── Tech Stack Section ───────────────────────────── */}
      <section className="relative z-10 max-w-7xl mx-auto px-6 py-16">
        <motionBase.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="text-center"
        >
          <p className="text-slate-500 text-sm mb-8 uppercase tracking-widest">Built with production-grade tools</p>
          <div className="flex flex-wrap items-center justify-center gap-4">
            {techStack.map((tech) => (
              <div key={tech.name} className="glass px-4 py-2.5 rounded-xl flex items-center gap-2 hover:bg-white/[0.08] transition-colors">
                <span className="text-lg">{tech.icon}</span>
                <span className="text-slate-300 text-sm font-medium">{tech.name}</span>
              </div>
            ))}
          </div>
        </motionBase.div>
      </section>

      {/* ── Bottom CTA ───────────────────────────────────── */}
      <section className="relative z-10 max-w-4xl mx-auto px-6 py-24 text-center">
        <motionBase.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="glass rounded-3xl p-12 border border-brand-500/20"
          style={{ background: 'radial-gradient(ellipse at 50% 0%, rgba(99,102,241,0.15) 0%, transparent 70%)' }}
        >
          <Sparkles className="w-10 h-10 text-brand-400 mx-auto mb-4" />
          <h2 className="text-4xl font-bold text-white mb-4">
            Ready to experience knowledge beyond search?
          </h2>
          <p className="text-slate-400 text-lg mb-8 max-w-lg mx-auto">
            Join researchers, developers, and students who use SAGE to explore documents with intelligent RAG conversations.
          </p>
          <Link to="/register" className="btn-primary text-base px-10 py-4 shadow-brand-lg">
            Start for Free — No Credit Card Required
            <ChevronRight className="w-4 h-4" />
          </Link>
        </motionBase.div>
      </section>

      {/* ── Footer ──────────────────────────────────────── */}
      <footer className="relative z-10 border-t border-white/5 py-8">
        <div className="max-w-7xl mx-auto px-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <Brain className="w-5 h-5 text-brand-500" />
            <span className="text-slate-400 text-sm">SAGE © 2026</span>
          </div>
          <div className="flex items-center gap-6 text-sm text-slate-500">
            <a href="#" className="hover:text-slate-300 transition-colors">Privacy</a>
            <a href="#" className="hover:text-slate-300 transition-colors">Terms</a>
            <a href="https://github.com/joshisanidhya/ai-pdf-chatbot" className="hover:text-slate-300 transition-colors">GitHub</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
