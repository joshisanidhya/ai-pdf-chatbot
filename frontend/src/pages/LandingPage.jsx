/**
 * Landing Page — DocuMind AI
 * Hero section, feature showcase, and CTA
 */

import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
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
    title: 'Upload Any PDF',
    description: 'Drag & drop your documents. Research papers, contracts, textbooks — anything.',
    color: 'from-blue-500 to-cyan-500',
    bg: 'bg-blue-500/10',
  },
  {
    icon: Brain,
    title: 'Semantic Understanding',
    description: 'Advanced RAG pipeline extracts deep meaning, not just keywords.',
    color: 'from-purple-500 to-pink-500',
    bg: 'bg-purple-500/10',
  },
  {
    icon: MessageSquare,
    title: 'Natural Chat Interface',
    description: 'Ask questions in plain English. Get accurate, cited AI responses.',
    color: 'from-emerald-500 to-teal-500',
    bg: 'bg-emerald-500/10',
  },
  {
    icon: Search,
    title: 'Source Citations',
    description: 'Every answer references the exact document section it came from.',
    color: 'from-amber-500 to-orange-500',
    bg: 'bg-amber-500/10',
  },
  {
    icon: Zap,
    title: 'Lightning Fast',
    description: 'Vector similarity search retrieves relevant content in milliseconds.',
    color: 'from-yellow-500 to-amber-500',
    bg: 'bg-yellow-500/10',
  },
  {
    icon: Shield,
    title: 'Private & Secure',
    description: 'Your documents stay yours. JWT authentication and encrypted storage.',
    color: 'from-rose-500 to-red-500',
    bg: 'bg-rose-500/10',
  },
];

const techStack = [
  { name: 'React', icon: '⚛️' },
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
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="flex items-center gap-2.5"
        >
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-brand-500 to-purple-600 flex items-center justify-center shadow-brand">
            <Brain className="w-5 h-5 text-white" />
          </div>
          <span className="font-bold text-xl text-white tracking-tight">
            Docu<span className="gradient-text">Mind</span> AI
          </span>
        </motion.div>

        <motion.div
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
        </motion.div>
      </nav>

      {/* ── Hero Section ─────────────────────────────────── */}
      <section className="relative z-10 max-w-7xl mx-auto px-6 pt-24 pb-32 text-center">
        <motion.div variants={stagger} initial="initial" animate="animate">
          {/* Badge */}
          <motion.div variants={fadeInUp} className="inline-flex items-center gap-2 glass px-4 py-1.5 rounded-full text-sm text-brand-300 mb-8 border border-brand-500/30">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Powered by LangChain & HuggingFace Embeddings</span>
          </motion.div>

          {/* Headline */}
          <motion.h1
            variants={fadeInUp}
            className="text-5xl md:text-7xl font-black text-white mb-6 leading-tight tracking-tight"
          >
            Chat with your{' '}
            <span className="gradient-text">PDFs</span>
            <br />
            using{' '}
            <span className="relative">
              <span className="gradient-text">AI intelligence</span>
              <motion.div
                className="absolute -bottom-2 left-0 right-0 h-px bg-gradient-to-r from-transparent via-brand-500 to-transparent"
                initial={{ scaleX: 0 }}
                animate={{ scaleX: 1 }}
                transition={{ delay: 0.8, duration: 0.8 }}
              />
            </span>
          </motion.h1>

          {/* Subheadline */}
          <motion.p
            variants={fadeInUp}
            className="text-xl text-slate-400 max-w-2xl mx-auto mb-10 leading-relaxed"
          >
            Upload any PDF document and have natural conversations powered by a
            production-grade RAG pipeline. Get instant, cited answers grounded in your content.
          </motion.p>

          {/* CTA Buttons */}
          <motion.div variants={fadeInUp} className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16">
            <Link
              to="/register"
              id="hero-cta-register"
              className="btn-primary text-base px-8 py-3.5 gap-2.5 shadow-brand-lg"
            >
              <Upload className="w-4.5 h-4.5" />
              Upload Your First PDF
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
          </motion.div>

          {/* Hero Terminal Preview */}
          <motion.div
            variants={fadeInUp}
            className="relative max-w-4xl mx-auto glass rounded-2xl border border-white/10 overflow-hidden shadow-dark-lg"
          >
            {/* Window bar */}
            <div className="flex items-center gap-2 px-4 py-3 border-b border-white/5 bg-white/[0.02]">
              <div className="w-3 h-3 rounded-full bg-red-500/60" />
              <div className="w-3 h-3 rounded-full bg-amber-500/60" />
              <div className="w-3 h-3 rounded-full bg-emerald-500/60" />
              <span className="ml-2 text-xs text-slate-500 font-mono">documind-ai — chat</span>
            </div>

            {/* Mock chat UI */}
            <div className="p-6 space-y-4 text-left">
              {/* User message */}
              <div className="flex items-start gap-3 justify-end">
                <div className="glass-strong px-4 py-3 rounded-2xl rounded-br-sm max-w-sm">
                  <p className="text-sm text-slate-200">What are the key findings in Chapter 3?</p>
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
                    <p className="text-sm text-slate-200 leading-relaxed">
                      Based on Chapter 3 of your document, the key findings include:
                    </p>
                    <ul className="mt-2 space-y-1 text-sm text-slate-300">
                      <li className="flex items-center gap-2"><span className="text-brand-400">▸</span> Neural network architecture improves accuracy by 23%</li>
                      <li className="flex items-center gap-2"><span className="text-brand-400">▸</span> Dataset preprocessing reduces training time significantly</li>
                      <li className="flex items-center gap-2"><span className="text-brand-400">▸</span> Cross-validation shows robust generalization</li>
                    </ul>
                  </div>
                  {/* Source citation */}
                  <div className="flex items-center gap-2 text-xs text-slate-500">
                    <FileText className="w-3.5 h-3.5 text-brand-500" />
                    <span>Source: research-paper.pdf · Chapter 3, Page 47</span>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </section>

      {/* ── Features Grid ────────────────────────────────── */}
      <section className="relative z-10 max-w-7xl mx-auto px-6 py-24">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <span className="text-brand-400 text-sm font-semibold uppercase tracking-widest mb-3 block">
            Why DocuMind AI?
          </span>
          <h2 className="text-4xl font-bold text-white mb-4">
            Everything you need for
            <span className="gradient-text"> document intelligence</span>
          </h2>
          <p className="text-slate-400 text-lg max-w-xl mx-auto">
            A production-grade RAG pipeline built for developers, researchers, and power users.
          </p>
        </motion.div>

        <motion.div
          variants={stagger}
          initial="initial"
          whileInView="animate"
          viewport={{ once: true }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {features.map((feature, i) => (
            <motion.div
              key={feature.title}
              variants={fadeInUp}
              transition={{ delay: i * 0.05 }}
              className="card-hover group"
            >
              <div className={`w-12 h-12 rounded-xl ${feature.bg} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300`}>
                <feature.icon className={`w-6 h-6 bg-gradient-to-br ${feature.color} bg-clip-text`} style={{ color: 'transparent', fill: 'url(#gradient)' }} />
                <feature.icon className={`w-6 h-6 text-white absolute opacity-0 group-hover:opacity-0`} />
              </div>
              <div className={`w-12 h-12 rounded-xl ${feature.bg} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300 -mt-16`}>
                <feature.icon className="w-6 h-6 text-white" />
              </div>
              <h3 className="font-semibold text-white text-lg mb-2">{feature.title}</h3>
              <p className="text-slate-400 text-sm leading-relaxed">{feature.description}</p>
            </motion.div>
          ))}
        </motion.div>
      </section>

      {/* ── Tech Stack Section ───────────────────────────── */}
      <section className="relative z-10 max-w-7xl mx-auto px-6 py-16">
        <motion.div
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
        </motion.div>
      </section>

      {/* ── Bottom CTA ───────────────────────────────────── */}
      <section className="relative z-10 max-w-4xl mx-auto px-6 py-24 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="glass rounded-3xl p-12 border border-brand-500/20"
          style={{ background: 'radial-gradient(ellipse at 50% 0%, rgba(99,102,241,0.15) 0%, transparent 70%)' }}
        >
          <Sparkles className="w-10 h-10 text-brand-400 mx-auto mb-4" />
          <h2 className="text-4xl font-bold text-white mb-4">
            Ready to talk to your documents?
          </h2>
          <p className="text-slate-400 text-lg mb-8 max-w-lg mx-auto">
            Join researchers, students, and professionals who use DocuMind AI to extract insights from PDFs instantly.
          </p>
          <Link to="/register" className="btn-primary text-base px-10 py-4 shadow-brand-lg">
            Start for Free — No Credit Card Required
            <ChevronRight className="w-4 h-4" />
          </Link>
        </motion.div>
      </section>

      {/* ── Footer ──────────────────────────────────────── */}
      <footer className="relative z-10 border-t border-white/5 py-8">
        <div className="max-w-7xl mx-auto px-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <Brain className="w-5 h-5 text-brand-500" />
            <span className="text-slate-400 text-sm">DocuMind AI © 2024</span>
          </div>
          <div className="flex items-center gap-6 text-sm text-slate-500">
            <a href="#" className="hover:text-slate-300 transition-colors">Privacy</a>
            <a href="#" className="hover:text-slate-300 transition-colors">Terms</a>
            <a href="https://github.com" className="hover:text-slate-300 transition-colors">GitHub</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
