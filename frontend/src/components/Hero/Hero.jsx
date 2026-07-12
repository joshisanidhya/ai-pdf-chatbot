import React, { useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Sparkles, ChevronRight, Github } from 'lucide-react';
import MouseParallax from '../Background/MouseParallax';

// Magnetic Button implementation using spring physics
function MagneticButton({ children, className, to, id, href }) {
  const btnRef = useRef(null);
  const [coords, setCoords] = useState({ x: 0, y: 0 });

  const handleMouseMove = (e) => {
    if (!btnRef.current) return;
    const { clientX, clientY } = e;
    const { left, top, width, height } = btnRef.current.getBoundingClientRect();
    
    // Calculate distance from center of the button
    const x = clientX - (left + width / 2);
    const y = clientY - (top + height / 2);
    
    // Magnetic pull coefficient (30%)
    setCoords({ x: x * 0.30, y: y * 0.30 });
  };

  const handleMouseLeave = () => {
    setCoords({ x: 0, y: 0 });
  };

  const innerContent = (
    <motion.div
      ref={btnRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      animate={{ x: coords.x, y: coords.y }}
      transition={{ type: 'spring', stiffness: 180, damping: 14, mass: 0.1 }}
      className="w-full h-full flex items-center justify-center"
    >
      {children}
    </motion.div>
  );

  if (href) {
    return (
      <a href={href} target="_blank" rel="noopener noreferrer" className={className}>
        {innerContent}
      </a>
    );
  }

  return (
    <Link to={to} id={id} className={className}>
      {innerContent}
    </Link>
  );
}

export default function Hero() {
  const headline = "Cognitive Semantic Grounding for Complex Knowledge";
  const words = headline.split(" ");

  // Stagger entry configurations
  const wordVariants = {
    hidden: { opacity: 0, y: 28, filter: 'blur(10px)' },
    visible: (i) => ({
      opacity: 1,
      y: 0,
      filter: 'blur(0px)',
      transition: {
        delay: i * 0.08,
        duration: 0.8,
        ease: [0.16, 1, 0.3, 1],
      },
    }),
  };

  return (
    <section className="relative h-screen w-full flex items-center justify-center overflow-hidden z-20">
      <div className="max-w-5xl mx-auto px-6 text-center flex flex-col items-center select-none">
        
        {/* Parallax elements */}
        <MouseParallax factor={10} className="flex flex-col items-center">
          {/* Eyebrow badge */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, ease: 'easeOut' }}
            className="inline-flex items-center gap-2 border border-[#FF6B2C]/30 bg-[#FF6B2C]/5 px-4 py-1.5 rounded-full text-xs text-[#FF824D] mb-8"
          >
            <Sparkles className="w-3.5 h-3.5 text-[#FF6B2C]" />
            <span className="font-semibold tracking-widest uppercase">✦ Grounded In Truth</span>
          </motion.div>

          {/* Staggered text assembly */}
          <h1 className="text-[2.6rem] sm:text-[4.2rem] md:text-[5.5rem] font-bold text-white leading-[1.04] tracking-tight mb-6 max-w-4xl text-balance">
            {words.map((word, i) => (
              <React.Fragment key={i}>
                {word === 'Complex' || word === 'Knowledge' ? (
                  <motion.span
                    custom={i}
                    variants={wordVariants}
                    initial="hidden"
                    animate="visible"
                    className="gradient-text inline-block"
                  >
                    {word}
                  </motion.span>
                ) : (
                  <motion.span
                    custom={i}
                    variants={wordVariants}
                    initial="hidden"
                    animate="visible"
                    className="inline-block text-[#F5F5F0]"
                  >
                    {word}
                  </motion.span>
                )}
                {' '}
              </React.Fragment>
            ))}
          </h1>

          {/* Subtitle fading upwards */}
          <motion.p
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6, ease: 'easeOut' }}
            className="text-base sm:text-lg md:text-xl text-[#9A9A9A] max-w-2xl mb-12 leading-relaxed"
          >
            Transform dense PDFs into living, responsive intelligence. Ask anything and get completely context-grounded AI answers with precision citations.
          </motion.p>
        </MouseParallax>

        {/* Action Buttons wrapped in secondary parallax layer */}
        <MouseParallax factor={14} className="flex flex-col sm:flex-row items-center gap-5 mb-16">
          <MagneticButton 
            to="/register" 
            id="hero-cta-register" 
            className="btn-primary text-sm px-8 py-3.5 gap-2 shadow-brand-lg h-12 w-52 overflow-hidden"
          >
            <span className="flex items-center gap-2">
              Start Chatting
              <span className="w-5 h-5 rounded-full bg-black flex items-center justify-center text-white">
                <ChevronRight className="w-3.5 h-3.5" />
              </span>
            </span>
          </MagneticButton>
          
          <MagneticButton 
            href="https://github.com/joshisanidhya/ai-pdf-chatbot" 
            className="btn-secondary text-sm px-8 py-3.5 h-12 w-48 overflow-hidden"
          >
            <span className="flex items-center gap-2">
              <Github className="w-4 h-4" />
              View GitHub
            </span>
          </MagneticButton>
        </MouseParallax>

        {/* Social Proof */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.8 }}
          className="flex items-center gap-3"
        >
          <div className="flex -space-x-2">
            {['U', 'N', 'I', 'Z'].map((char, index) => (
              <div 
                key={index} 
                className="w-7.5 h-7.5 rounded-full border-2 border-[#0A0A0A] bg-gradient-to-br from-[#FF6B2C] to-[#E63946] flex items-center justify-center text-[10px] font-bold text-white"
              >
                {char}
              </div>
            ))}
          </div>
          <p className="text-xs sm:text-sm text-[#9A9A9A]">
            Trusted already by <span className="text-[#F5F5F0] font-semibold">1,200+ Researchers &amp; Developers</span>
          </p>
        </motion.div>

      </div>
    </section>
  );
}
