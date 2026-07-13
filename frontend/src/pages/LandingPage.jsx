import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Brain, Upload, MessageSquare, Search, Zap, Shield,
  ChevronRight, Sparkles, Plus, ArrowUpRight
} from 'lucide-react';

// Import Custom Background Components
import NoiseOverlay from '../components/Background/NoiseOverlay';
import HeroGlow from '../components/Background/HeroGlow';
import FloatingGradient from '../components/Background/FloatingGradient';
import AnimatedGrid from '../components/Background/AnimatedGrid';
import EnergyRibbon from '../components/Background/EnergyRibbon';
import ParticleField from '../components/Background/ParticleField';
import GlowBlob from '../components/Background/GlowBlob';
import MouseParallax from '../components/Background/MouseParallax';

// Import Navbar & Hero
import Navbar from '../components/Navbar/Navbar';
import Hero from '../components/Hero/Hero';

// Marquee Tech Stack List
const techStack = [
  { name: 'React 18', logo: '⚛️' },
  { name: 'Vite', logo: '⚡' },
  { name: 'Tailwind CSS', logo: '🎨' },
  { name: 'LangChain', logo: '🔗' },
  { name: 'OpenRouter', logo: '🤖' },
  { name: 'MongoDB', logo: '🍃' },
  { name: 'Xenova', logo: '🤗' },
  { name: 'JWT Auth', logo: '🔑' }
];

// Capabilities List
const capabilities = [
  {
    icon: Upload,
    title: 'Instant PDF Ingestion',
    desc: 'Drag and drop any PDF manual, contract, or textbook. SAGE extracts and processes raw text instantly.',
    stat: 96,
    label: 'Extraction Accuracy'
  },
  {
    icon: Brain,
    title: 'Local Semantic Indexing',
    desc: 'Generate high-fidelity vector embeddings locally using sentence-transformers, completely free.',
    stat: 98,
    label: 'Similarity Threshold'
  },
  {
    icon: MessageSquare,
    title: 'Cited AI Conversations',
    desc: 'Interact with your documents using natural dialogue. SAGE synthesizes verified responses instantly.',
    stat: 99,
    label: 'Grounding Rate'
  },
  {
    icon: Search,
    title: 'Source Footnotes',
    desc: 'No hallucinations. Every answer includes specific citation cards linking back to the source text.',
    stat: 100,
    label: 'Verification Rate'
  },
  {
    icon: Zap,
    title: 'Sub-Second Retrieval',
    desc: 'Query thousands of vector nodes in milliseconds. SAGE returns key document sections immediately.',
    stat: 92,
    label: 'Speed Index'
  },
  {
    icon: Shield,
    title: 'Isolated Data Sandbox',
    desc: 'Your documents never train external models. Secure user sessions are enforced with JWT boundaries.',
    stat: 100,
    label: 'Privacy Isolation'
  },
];

// Why choose us statements
const benefits = [
  'Zero Hallucinations via strict RAG vector grounding',
  'Local embedding processing for 100% data confidentiality',
  'Interactive source citation links with page annotations',
  'Extensible backend supporting open and frontier models'
];

// FAQs List
const faqs = [
  ['What is SAGE?', 'SAGE (Semantic Analysis & Guidance Engine) is a production-ready RAG platform that allows users to upload PDF documents, generate vector embeddings locally, and chat with the document contents without sending raw data to external indexers.'],
  ['How does the retrieval system work?', 'When a document is uploaded, it is parsed, chunked, and embedded locally using the Xenova transformers model all-MiniLM-L6-v2. During chat queries, similarity scoring (cosine distance) identifies the most relevant passages to build the grounded prompt context.'],
  ['Which AI models does SAGE use?', 'By default, the LLM service integrates with OpenRouter, routing questions to stable free-tier frontier models like Llama 3. The service abstraction can easily target OpenAI, Anthropic, or local Ollama servers.'],
  ['Is my document private?', 'Yes. SAGE runs local embeddings on your node backend, meaning document parsing and vector calculations happen fully on your hardware. JWT tokens isolate documents and conversations specifically to your authenticated user account.'],
  ['What file types are supported?', 'Currently, SAGE is highly optimized for parsing rich, dense PDF files (including manuals, contracts, academic papers, and textbooks). Support for docx, txt, and html ingestion is planned on the roadmap.']
];

// Staggered reveal parent configuration
const containerVariants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.05
    }
  }
};

// Fluid scroll entry animation for child elements
const itemVariants = {
  hidden: { opacity: 0, y: 30, filter: 'blur(7px)' },
  visible: {
    opacity: 1,
    y: 0,
    filter: 'blur(0px)',
    transition: {
      duration: 0.8,
      ease: [0.16, 1, 0.3, 1]
    }
  }
};

// Animated Accordion Item for FAQ
function FAQItem({ q, a, variants }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <motion.div variants={variants} className="border-b border-white/[0.08] py-5">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between text-left gap-4 py-2 group cursor-pointer focus:outline-none"
      >
        <span className="text-[#F5F5F0] font-medium text-sm sm:text-base group-hover:text-white transition-colors duration-200">
          {q}
        </span>
        <motion.span
          animate={{ rotate: isOpen ? 45 : 0 }}
          transition={{ type: 'spring', stiffness: 180, damping: 14 }}
          className="flex-shrink-0 text-[#FF6B2C]"
        >
          <Plus className="w-5 h-5" />
        </motion.span>
      </button>

      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
            className="overflow-hidden"
          >
            <div className="pt-2 pb-4 text-[#9A9A9A] text-sm leading-relaxed">
              {a}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-[#050505] text-[#F5F5F0] overflow-x-hidden relative">

      {/* ── Background & Effects Layer (Full bleed background) ───────────────────── */}
      <HeroGlow />
      <FloatingGradient />
      <AnimatedGrid />
      <EnergyRibbon />
      <ParticleField />
      <NoiseOverlay />

      {/* Extra floating blobs for structural depth */}
      <GlowBlob color="from-amber-600 to-[#FF6B2C]" size="w-[30vw] h-[30vw]" position="top-[120vh] right-[10%]" delay={2} />
      <GlowBlob color="from-[#E63946] to-amber-700" size="w-[35vw] h-[35vw]" position="top-[250vh] left-[5%]" delay={5} />

      {/* ── Sticky Navigation ────────────────────────────── */}
      <Navbar />

      {/* ── Centered Grid Layout Frame ─────────────────────────────────────────── */}
      <div className="max-w-7xl mx-auto border-l border-r border-white/[0.06] relative bg-[#050505]/30 min-h-screen z-20">

        {/* Top visual divider for the navbar region alignment */}
        <div className="absolute top-0 left-0 right-0 h-px bg-white/[0.06] z-30" />

        {/* Hero Section Container */}
        <div className="relative border-b border-white/[0.06]">
          <Hero />
          {/* Intersection crosses */}
          <div className="absolute -left-[6px] -bottom-[9px] text-[12px] text-white/20 select-none font-mono font-medium z-30">+</div>
          <div className="absolute -right-[6px] -bottom-[9px] text-[12px] text-white/20 select-none font-mono font-medium z-30">+</div>
        </div>

        {/* Partner Marquee Section */}
        <section className="border-b border-white/[0.06] bg-[#0A0A0C]/20 py-8 relative overflow-hidden z-20">
          <div className="px-6 sm:px-10 md:px-16">
            <p className="text-center text-[10px] font-semibold text-[#9A9A9A] uppercase tracking-[0.25em] mb-6">
              Semantic RAG engine built with
            </p>

            <div className="relative w-full overflow-hidden py-2">
              {/* Edge fade gradients */}
              <div className="absolute left-0 top-0 bottom-0 w-20 md:w-36 bg-gradient-to-r from-[#050505]/95 to-transparent z-10 pointer-events-none" />
              <div className="absolute right-0 top-0 bottom-0 w-20 md:w-36 bg-gradient-to-l from-[#050505]/95 to-transparent z-10 pointer-events-none" />

              <div className="flex gap-16 items-center w-max animate-marquee">
                {[...techStack, ...techStack].map((tech, index) => (
                  <div
                    key={index}
                    className="flex items-center gap-3.5 grayscale opacity-35 hover:grayscale-0 hover:opacity-100 transition-all duration-300 cursor-pointer"
                  >
                    <span className="text-xl">{tech.logo}</span>
                    <span className="text-[#F5F5F0] font-semibold text-sm tracking-tight">{tech.name}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
          {/* Intersection crosses */}
          <div className="absolute -left-[6px] -bottom-[9px] text-[12px] text-white/20 select-none font-mono font-medium z-30">+</div>
          <div className="absolute -right-[6px] -bottom-[9px] text-[12px] text-white/20 select-none font-mono font-medium z-30">+</div>
        </section>

        {/* Split Feature Section */}
        <motion.section
          id="how-it-works"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-120px" }}
          variants={containerVariants}
          className="px-6 sm:px-10 md:px-16 py-28 md:py-36 relative z-20 border-b border-white/[0.06]"
        >
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 items-center">

            {/* Left Column: Visual widget with mouse parallax */}
            <motion.div variants={itemVariants} className="flex items-center justify-center relative py-6">
              <div className="absolute w-64 h-64 bg-[#FF6B2C] rounded-full blur-[100px] opacity-[0.14] pointer-events-none" />

              {/* Keyframes for the glowing moving white orb/highlight */}
              <style>{`
                @keyframes orb-slide-keyframes {
                  0% { transform: translateX(-100%); }
                  100% { transform: translateX(0%); }
                }
                @keyframes orb-slide-slow-keyframes {
                  0% { transform: translateX(-100%); }
                  100% { transform: translateX(0%); }
                }
                .animate-orb-slide {
                  animation: orb-slide-keyframes 3.5s ease-in-out infinite alternate;
                }
                .animate-orb-slide-slow {
                  animation: orb-slide-slow-keyframes 5.5s ease-in-out infinite alternate;
                }
                @media (prefers-reduced-motion: reduce) {
                  .animate-orb-slide, .animate-orb-slide-slow {
                    animation: none !important;
                    transform: translateX(0%) !important;
                  }
                }
              `}</style>

              <MouseParallax factor={12} className="w-full max-w-sm">
                <div className="glass rounded-3xl p-7 border border-white/[0.08] shadow-dark-lg relative overflow-hidden group hover:border-[#FF6B2C]/20 transition-all duration-300">
                  <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-2">
                      <Sparkles className="w-4 h-4 text-[#FF6B2C]" />
                      <span className="text-[10px] uppercase tracking-wider text-[#9A9A9A] font-semibold">Semantic Match Score</span>
                    </div>
                    <span className="text-[10px] text-[#FF6B2C] bg-[#FF6B2C]/10 px-2.5 py-0.5 rounded-full font-medium">Active</span>
                  </div>

                  <div className="bg-black/30 border border-white/5 rounded-2xl p-5 space-y-4 mb-3">
                    {[['Keyword Search', 28], ['Semantic RAG', 98]].map(([label, score]) => (
                      <div key={label} className="relative">
                        <div className="flex justify-between text-xs text-[#9A9A9A] mb-1.5 font-medium">
                          <span>{label}</span>
                          <span className={score > 50 ? 'text-[#FF824D]' : ''}>{score}%</span>
                        </div>
                        <div className="relative h-1.5 flex items-center">
                          {/* Track background */}
                          <div className="absolute inset-x-0 h-1.5 bg-white/[0.04] rounded-full overflow-hidden">
                            <motion.div
                              initial={{ width: 0 }}
                              whileInView={{ width: `${score}%` }}
                              viewport={{ once: true }}
                              transition={{ duration: 1.2, ease: 'easeOut' }}
                              className={`h-full rounded-full ${score > 50 ? 'bg-gradient-to-r from-[#FF6B2C] to-[#E63946]' : 'bg-white/20'
                                }`}
                            />
                          </div>

                          {/* Glowing Animated Orb (Semantic RAG) */}
                          {score > 50 && (
                            <div
                              className="absolute left-0 top-0 bottom-0 pointer-events-none z-10 overflow-visible"
                              style={{ width: `${score}%` }}
                            >
                              <div className="w-full h-full relative animate-orb-slide overflow-visible">
                                <div className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-1/2 flex items-center justify-center w-0 h-0">
                                  {/* Motion trail */}
                                  <div className="absolute right-[4px] h-[2px] w-[24px] bg-gradient-to-r from-transparent to-[#FF6B2C]/40 blur-[1px]" />
                                  {/* Outer glow */}
                                  <div className="absolute w-[44px] h-[44px] rounded-full blur-[8px] bg-[#FF6B2C]/50 mix-blend-screen" />
                                  {/* Middle glow */}
                                  <div className="absolute w-[20px] h-[20px] rounded-full blur-[3px] bg-white/25" />
                                  {/* Inner solid white core */}
                                  <div className="w-[10px] h-[10px] rounded-full bg-white shadow-[0_0_6px_#ffffff]" />
                                </div>
                              </div>
                            </div>
                          )}

                          {/* Dimmer racing dot (Keyword Search) */}
                          {score <= 50 && (
                            <div
                              className="absolute left-0 top-0 bottom-0 pointer-events-none z-10 overflow-visible"
                              style={{ width: `${score}%` }}
                            >
                              <div className="w-full h-full relative animate-orb-slide-slow overflow-visible">
                                <div className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-1/2 flex items-center justify-center w-0 h-0 opacity-25">
                                  <div className="w-[6px] h-[6px] rounded-full bg-white shadow-[0_0_4px_#ffffff]" />
                                </div>
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="flex gap-2 flex-wrap mt-4">
                    <span className="text-[9px] bg-white/5 border border-white/5 text-[#9A9A9A] px-2 py-0.5 rounded">all-MiniLM-L6-v2</span>
                    <span className="text-[9px] bg-[#FF6B2C]/5 border border-[#FF6B2C]/15 text-[#FF824D] px-2 py-0.5 rounded">Local Embedder</span>
                  </div>
                </div>
              </MouseParallax>
            </motion.div>

            {/* Right Column: Copy & Actions */}
            <motion.div variants={itemVariants} className="flex flex-col items-start">
              <span className="text-[#FF6B2C] text-xs font-semibold uppercase tracking-widest mb-4">Intelligence With Purpose</span>
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-6 leading-tight tracking-tight">
                Unlock Knowledge Beyond Basic Search
              </h2>
              <p className="text-base text-[#9A9A9A] mb-8 leading-relaxed">
                SAGE leverages semantic vector spaces to locate exact context segments within long, complex manuals or academic books in milliseconds. Ask questions in plain language and receive cited answers instantly.
              </p>
              <Link
                to="/register"
                className="btn-primary text-xs py-3 px-6 gap-2"
              >
                <span>Learn More</span>
                <span className="w-5 h-5 rounded-full bg-black flex items-center justify-center text-white">
                  <ChevronRight className="w-3.5 h-3.5" />
                </span>
              </Link>
            </motion.div>
          </div>
          {/* Intersection crosses */}
          <div className="absolute -left-[6px] -bottom-[9px] text-[12px] text-white/20 select-none font-mono font-medium z-30">+</div>
          <div className="absolute -right-[6px] -bottom-[9px] text-[12px] text-white/20 select-none font-mono font-medium z-30">+</div>
        </motion.section>

        {/* ── Capabilities Section (Redesigned as Hub-and-Spoke Grid) ───────────────────── */}
        <motion.section
          id="capabilities"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={containerVariants}
          className="px-6 sm:px-10 md:px-16 py-24 md:py-32 relative z-20 border-b border-white/[0.06]"
        >
          <motion.div variants={itemVariants} className="text-center mb-16">
            <span className="text-[#FF6B2C] text-xs font-semibold uppercase tracking-widest mb-3 block">Capabilities</span>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-4 tracking-tight">
              Built for Enterprise Intelligence
            </h2>
            <p className="text-[#9A9A9A] text-sm sm:text-base max-w-lg mx-auto">
              A production-ready Semantic AI Retrieval engine designed for local, grounded document search.
            </p>
          </motion.div>

          {/* Desktop Version: High-Fidelity Hub-and-Spoke Grid (lg:block hidden) */}
          <div className="relative w-full h-[650px] max-w-5xl mx-auto hidden lg:block select-none">
            {/* Style Block for Pulsing Beams */}
            <style>{`
              @keyframes beam-pulse {
                0%, 100% { opacity: 0.35; stroke-width: 1.5px; }
                50% { opacity: 0.8; stroke-width: 2.5px; }
              }
              .animate-beam-pulse-1 { animation: beam-pulse 3.5s ease-in-out infinite; }
              .animate-beam-pulse-2 { animation: beam-pulse 4.2s ease-in-out infinite; animation-delay: 0.6s; }
              .animate-beam-pulse-3 { animation: beam-pulse 3.8s ease-in-out infinite; animation-delay: 1.2s; }
              .animate-beam-pulse-4 { animation: beam-pulse 4.5s ease-in-out infinite; animation-delay: 1.8s; }
            `}</style>

            {/* Faint crosshair decorative lines */}
            <div className="absolute inset-0 pointer-events-none z-0">
              <div className="absolute left-1/2 top-0 bottom-0 w-px bg-white/[0.06] -translate-x-1/2" />
              <div className="absolute left-0 right-0 top-1/2 h-px bg-white/[0.06] -translate-y-1/2" />
            </div>

            {/* SVG Radiating Light Beams */}
            <svg className="absolute inset-0 w-full h-full pointer-events-none z-0" xmlns="http://www.w3.org/2000/svg">
              <defs>
                <linearGradient id="beam-top-left" x1="1" y1="1" x2="0" y2="0">
                  <stop offset="0%" stopColor="#FF6B2C" stopOpacity="0.65" />
                  <stop offset="100%" stopColor="#FF6B2C" stopOpacity="0" />
                </linearGradient>
                <linearGradient id="beam-top-center" x1="0" y1="1" x2="0" y2="0">
                  <stop offset="0%" stopColor="#FF6B2C" stopOpacity="0.65" />
                  <stop offset="100%" stopColor="#FF6B2C" stopOpacity="0" />
                </linearGradient>
                <linearGradient id="beam-top-right" x1="0" y1="1" x2="1" y2="0">
                  <stop offset="0%" stopColor="#FF6B2C" stopOpacity="0.65" />
                  <stop offset="100%" stopColor="#FF6B2C" stopOpacity="0" />
                </linearGradient>
                <linearGradient id="beam-bottom" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#FF6B2C" stopOpacity="0.65" />
                  <stop offset="100%" stopColor="#FF6B2C" stopOpacity="0" />
                </linearGradient>
              </defs>

              {/* Coordinates connecting Hub Center (50%, 50%) to respective spokes */}
              <line x1="50%" y1="50%" x2="16.66%" y2="12%" stroke="url(#beam-top-left)" strokeWidth="2" className="animate-beam-pulse-1" />
              <line x1="50%" y1="50%" x2="50%" y2="12%" stroke="url(#beam-top-center)" strokeWidth="2" className="animate-beam-pulse-2" />
              <line x1="50%" y1="50%" x2="83.33%" y2="12%" stroke="url(#beam-top-right)" strokeWidth="2" className="animate-beam-pulse-3" />
              <line x1="50%" y1="50%" x2="50%" y2="88%" stroke="url(#beam-bottom)" strokeWidth="2" className="animate-beam-pulse-4" />
            </svg>

            <div className="relative z-10 w-full h-full flex flex-col justify-between items-center py-6">
              {/* Row 1: Top 3 Items */}
              <div className="grid grid-cols-3 w-full gap-8">
                {/* Top Left */}
                <motion.div variants={itemVariants} className="flex flex-col items-center text-center px-4">
                  <div className="w-[56px] h-[56px] rounded-[12px] border border-[#FF6B2C]/40 bg-[#0A0A0A] flex items-center justify-center mb-4">
                    <Upload className="w-5 h-5 text-white" />
                  </div>
                  <p className="text-[#9A9A9A] text-[13px] leading-relaxed max-w-[260px] mx-auto">
                    <span className="text-[#F5F5F0] font-semibold block mb-1">Instant PDF Ingestion</span>
                    Extract text structures, tables, and sections from long PDF manuals instantly.
                  </p>
                </motion.div>

                {/* Top Center */}
                <motion.div variants={itemVariants} className="flex flex-col items-center text-center px-4">
                  <div className="w-[56px] h-[56px] rounded-[12px] border border-[#FF6B2C]/40 bg-[#0A0A0A] flex items-center justify-center mb-4">
                    <Brain className="w-5 h-5 text-white" />
                  </div>
                  <p className="text-[#9A9A9A] text-[13px] leading-relaxed max-w-[260px] mx-auto">
                    <span className="text-[#F5F5F0] font-semibold block mb-1">Local Semantic Indexing</span>
                    Generate high-fidelity vector nodes locally using sentence-transformers.
                  </p>
                </motion.div>

                {/* Top Right */}
                <motion.div variants={itemVariants} className="flex flex-col items-center text-center px-4">
                  <div className="w-[56px] h-[56px] rounded-[12px] border border-[#FF6B2C]/40 bg-[#0A0A0A] flex items-center justify-center mb-4">
                    <Shield className="w-5 h-5 text-white" />
                  </div>
                  <p className="text-[#9A9A9A] text-[13px] leading-relaxed max-w-[260px] mx-auto">
                    <span className="text-[#F5F5F0] font-semibold block mb-1">Isolated Data Sandbox</span>
                    Complete containment. User scopes are strictly guarded with JWT parameters.
                  </p>
                </motion.div>
              </div>

              {/* Row 2: Center Hub */}
              <div className="relative w-full h-[180px] flex items-center justify-center">
                <div className="relative w-[180px] h-[180px] flex items-center justify-center">
                  {/* Outer glow ring */}
                  <div
                    className="absolute w-[180px] h-[180px] rounded-full blur-[25px] opacity-[0.16] pointer-events-none"
                    style={{ background: 'radial-gradient(circle, #FF6B2C 0%, transparent 70%)' }}
                  />
                  {/* Middle ring */}
                  <div className="absolute w-[110px] h-[110px] rounded-full border border-[#FF6B2C]/30 bg-black/50 backdrop-blur-md" />
                  {/* Inner badge */}
                  <div className="absolute w-[50px] h-[50px] rounded-xl bg-gradient-to-br from-[#FF6B2C] to-[#E63946] flex items-center justify-center shadow-lg shadow-[#FF6B2C]/20">
                    <Sparkles className="w-5 h-5 text-white animate-pulse" />
                  </div>
                </div>
              </div>

              {/* Row 3: Bottom 1 Item */}
              <div className="w-full flex justify-center">
                <motion.div variants={itemVariants} className="flex flex-col items-center text-center px-4">
                  <div className="w-[56px] h-[56px] rounded-[12px] border border-[#FF6B2C]/40 bg-[#0A0A0A] flex items-center justify-center mb-4">
                    <Search className="w-5 h-5 text-white" />
                  </div>
                  <p className="text-[#9A9A9A] text-[13px] leading-relaxed max-w-[260px] mx-auto">
                    <span className="text-[#F5F5F0] font-semibold block mb-1">Cited Footnotes &amp; Context</span>
                    Verify answers instantly with source text highlights and page numbers.
                  </p>
                </motion.div>
              </div>
            </div>
          </div>

          {/* Mobile/Tablet Version: Responsive Grid (lg:hidden block) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 lg:hidden max-w-2xl mx-auto">
            {[
              { icon: Upload, title: 'Instant PDF Ingestion', desc: 'Extract text structures, tables, and sections from long PDF manuals instantly.' },
              { icon: Brain, title: 'Local Semantic Indexing', desc: 'Generate high-fidelity vector nodes locally using sentence-transformers.' },
              { icon: Shield, title: 'Isolated Data Sandbox', desc: 'Complete containment. User scopes are strictly guarded with JWT parameters.' },
              { icon: Search, title: 'Cited Footnotes & Context', desc: 'Verify answers instantly with source text highlights and page numbers.' }
            ].map((cap, i) => (
              <motion.div
                key={cap.title}
                variants={itemVariants}
                className="bg-[#0A0A0C] border border-white/[0.08] rounded-2xl p-6 flex flex-col items-center text-center hover:border-[#FF6B2C]/30 transition-all duration-300"
              >
                <div className="w-12 h-12 rounded-xl border border-white/[0.08] bg-black flex items-center justify-center mb-4 text-[#FF6B2C]">
                  <cap.icon className="w-5 h-5" />
                </div>
                <h3 className="font-bold text-[#F5F5F0] text-sm mb-2">{cap.title}</h3>
                <p className="text-[#9A9A9A] text-xs leading-relaxed">{cap.desc}</p>
              </motion.div>
            ))}
          </div>
          {/* Intersection crosses */}
          <div className="absolute -left-[6px] -bottom-[9px] text-[12px] text-white/20 select-none font-mono font-medium z-30">+</div>
          <div className="absolute -right-[6px] -bottom-[9px] text-[12px] text-white/20 select-none font-mono font-medium z-30">+</div>
        </motion.section>

        {/* Why Choose Us Section */}
        <motion.section
          id="why"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-120px" }}
          variants={containerVariants}
          className="px-6 sm:px-10 md:px-16 py-20 md:py-28 relative z-20 border-b border-white/[0.06]"
        >
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 items-center">

            {/* Left Column: Benefit List */}
            <motion.div variants={itemVariants}>
              <span className="text-[#FF6B2C] text-xs font-semibold uppercase tracking-widest mb-4 block">Why SAGE?</span>
              <h2 className="text-3xl sm:text-4xl font-bold text-white mb-6 leading-tight tracking-tight">
                The Smartest Way to Ask Questions
              </h2>
              <p className="text-base text-[#9A9A9A] mb-10 leading-relaxed">
                SAGE anchors each generated answer directly back to your document vectors. Check sources, review context nodes, and chat completely free of hallucinations.
              </p>
              <div className="space-y-4">
                {benefits.map((b, i) => (
                  <motion.div
                    key={i}
                    variants={itemVariants}
                    className="flex items-start gap-3"
                  >
                    <div className="w-5 h-5 rounded-full bg-[#FF6B2C]/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <div className="w-1.5 h-1.5 rounded-full bg-[#FF6B2C]" />
                    </div>
                    <span className="text-[#F5F5F0] text-sm leading-relaxed">{b}</span>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            {/* Right Column: Dynamic Mockup Container */}
            <motion.div variants={itemVariants} className="relative">
              <div className="absolute inset-0 bg-[#FF6B2C] blur-[120px] opacity-[0.06] rounded-3xl pointer-events-none" />

              <MouseParallax factor={8}>
                <div className="glass rounded-3xl p-6.5 border border-white/[0.08] shadow-dark-lg">
                  <div className="flex items-center gap-3 mb-5 pb-4 border-b border-white/[0.05]">
                    <div className="w-8.5 h-8.5 rounded-xl bg-gradient-to-br from-[#FF6B2C] to-[#E63946] flex items-center justify-center">
                      <Brain className="w-4 h-4 text-white" />
                    </div>
                    <div>
                      <p className="text-white font-semibold text-xs leading-none mb-1">SAGE Intelligent Node</p>
                      <p className="text-[#9A9A9A] text-[10px] leading-none">Context extraction block</p>
                    </div>
                    <span className="ml-auto text-[10px] bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-2 py-0.5 rounded-full font-medium">Verified</span>
                  </div>

                  <p className="text-[#9A9A9A] text-[11px] italic mb-3">User: "What is the security boundary of this RAG workspace?"</p>
                  <p className="text-[#F5F5F0] text-sm leading-relaxed mb-6">
                    SAGE ensures complete containment by generating and indexing document vectors locally on your server database. User contexts are strictly isolated using JWT boundary signatures...
                  </p>

                  <div className="space-y-2">
                    {['Source: architecture_spec.pdf — Page 8, §4.2', 'Confidence: 98.6% • local-MiniLM model'].map((t, idx) => (
                      <div
                        key={idx}
                        className="flex items-center gap-2 text-xs text-[#9A9A9A] bg-white/[0.02] border border-white/[0.04] rounded-lg px-3 py-2"
                      >
                        <div className="w-1.5 h-1.5 rounded-full bg-[#FF6B2C]" />
                        {t}
                      </div>
                    ))}
                  </div>
                </div>
              </MouseParallax>
            </motion.div>
          </div>
          {/* Intersection crosses */}
          <div className="absolute -left-[6px] -bottom-[9px] text-[12px] text-white/20 select-none font-mono font-medium z-30">+</div>
          <div className="absolute -right-[6px] -bottom-[9px] text-[12px] text-white/20 select-none font-mono font-medium z-30">+</div>
        </motion.section>

        {/* FAQ Accordion Section */}
        <motion.section
          id="faq"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-120px" }}
          variants={containerVariants}
          className="px-6 sm:px-10 md:px-16 py-20 md:py-28 relative z-20 border-b border-white/[0.06]"
        >
          <div className="max-w-3xl mx-auto">
            <motion.div variants={itemVariants} className="text-center mb-14">
              <span className="text-[#FF6B2C] text-xs font-semibold uppercase tracking-widest mb-3 block">Future Answers</span>
              <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4 tracking-tight">Frequently Asked Questions</h2>
              <p className="text-[#9A9A9A] text-sm sm:text-base">Everything you need to know about SAGE and local document retrieval.</p>
            </motion.div>

            <motion.div
              variants={containerVariants}
              className="border-t border-white/[0.08]"
            >
              {faqs.map(([q, a]) => (
                <FAQItem key={q} q={q} a={a} variants={itemVariants} />
              ))}
            </motion.div>
          </div>
          {/* Intersection crosses */}
          <div className="absolute -left-[6px] -bottom-[9px] text-[12px] text-white/20 select-none font-mono font-medium z-30">+</div>
          <div className="absolute -right-[6px] -bottom-[9px] text-[12px] text-white/20 select-none font-mono font-medium z-30">+</div>
        </motion.section>

        {/* Final CTA Section — bold sunset glow matching unizenlabs.com reference */}
        <motion.section
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-120px" }}
          variants={containerVariants}
          className="px-6 sm:px-10 md:px-16 py-20 md:py-28 text-center relative z-20 border-b border-white/[0.06]"
        >
          <div className="max-w-4xl mx-auto">
            <motion.div
              variants={itemVariants}
              className="rounded-3xl pt-20 pb-16 px-10 md:pt-28 md:pb-20 md:px-16 relative overflow-hidden"
              style={{
                background: 'radial-gradient(ellipse 100% 90% at 50% 100%, #FF8A3D 0%, #FF6B2C 18%, #E63946 34%, rgba(150, 45, 22, 0.85) 52%, rgba(24, 11, 8, 0.98) 74%, #0A0A0A 92%)'
              }}
            >
              {/* Subtle grain texture on top of the glow so it doesn't look flat */}
              <div
                className="absolute inset-0 opacity-[0.06] mix-blend-overlay pointer-events-none"
                style={{
                  backgroundImage: "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='120' height='120'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")"
                }}
              />

              <Sparkles className="w-8 h-8 text-white mx-auto mb-5 relative z-10 drop-shadow-[0_0_10px_rgba(255,255,255,0.5)] animate-pulse" />
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-4 tracking-tight leading-tight relative z-10 drop-shadow-[0_2px_12px_rgba(0,0,0,0.35)]">
                Build the Future with SAGE
              </h2>
              <p className="text-white/85 text-sm sm:text-base mb-10 max-w-md mx-auto relative z-10 drop-shadow-[0_1px_6px_rgba(0,0,0,0.35)]">
                Ready to experience semantic intelligence? Upload your first PDF and query it naturally.
              </p>

              <div className="flex justify-center relative z-10">
                <Link
                  to="/register"
                  className="btn-primary text-xs py-3.5 px-8 gap-2 shadow-brand-lg cursor-pointer"
                >
                  <span>Get Started Free</span>
                  <span className="w-5 h-5 rounded-full bg-black flex items-center justify-center text-white">
                    <ChevronRight className="w-3.5 h-3.5" />
                  </span>
                </Link>
              </div>
            </motion.div>
          </div>
          {/* Intersection crosses */}
          <div className="absolute -left-[6px] -bottom-[9px] text-[12px] text-white/20 select-none font-mono font-medium z-30">+</div>
          <div className="absolute -right-[6px] -bottom-[9px] text-[12px] text-white/20 select-none font-mono font-medium z-30">+</div>
        </motion.section>

        {/* Footer */}
        <footer className="px-6 sm:px-10 md:px-16 py-12 relative z-20 bg-[#0A0A0C]/30">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-5">
            <div className="flex items-center gap-2.5">
              <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-[#FF6B2C] to-[#E63946] flex items-center justify-center">
                <Brain className="w-3.5 h-3.5 text-white" />
              </div>
              <span className="text-[#9A9A9A] text-xs font-semibold tracking-wide">SAGE © 2026</span>
            </div>
            <div className="flex items-center gap-6 text-xs text-[#9A9A9A]">
              <a href="#capabilities" className="hover:text-[#F5F5F0] transition-colors duration-200">Capabilities</a>
              <a href="#why" className="hover:text-[#F5F5F0] transition-colors duration-200">Why SAGE?</a>
              <a href="#faq" className="hover:text-[#F5F5F0] transition-colors duration-200">FAQ</a>
              <a
                href="https://github.com/joshisanidhya/ai-pdf-chatbot"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-[#F5F5F0] transition-colors duration-200"
              >
                GitHub
              </a>
            </div>
          </div>
        </footer>

      </div>

    </div>
  );
}