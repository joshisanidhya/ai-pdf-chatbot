import React, { useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Sparkles, ChevronRight } from 'lucide-react';
import MouseParallax from '../Background/MouseParallax';

// Magnetic Button wrapper utilizing spring physics
function MagneticButton({ children, className, to, id }) {
  const btnRef = useRef(null);
  const [coords, setCoords] = useState({ x: 0, y: 0 });

  const handleMouseMove = (e) => {
    if (!btnRef.current) return;
    const { clientX, clientY } = e;
    const { left, top, width, height } = btnRef.current.getBoundingClientRect();
    
    // Calculate vector offset from center of button
    const x = clientX - (left + width / 2);
    const y = clientY - (top + height / 2);
    
    // Smooth magnetic attraction force (28%)
    setCoords({ x: x * 0.28, y: y * 0.28 });
  };

  const handleMouseLeave = () => {
    setCoords({ x: 0, y: 0 });
  };

  return (
    <motion.div
      ref={btnRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      animate={{ x: coords.x, y: coords.y }}
      transition={{ type: 'spring', stiffness: 180, damping: 14, mass: 0.1 }}
      className="w-full h-full flex items-center justify-center"
    >
      <Link to={to} id={id} className={className}>
        {children}
      </Link>
    </motion.div>
  );
}

export default function Hero() {
  // Split headline into composed lines to guarantee perfect layout across screen sizes
  const lines = [
    "Cognitive Semantic Grounding",
    "for Complex Knowledge"
  ];

  // Clip mask translate transitions
  const lineVariants = {
    hidden: { y: '100%', opacity: 0 },
    visible: (i) => ({
      y: 0,
      opacity: 1,
      transition: {
        delay: i * 0.16,
        duration: 0.8,
        ease: [0.16, 1, 0.3, 1],
      },
    }),
  };

  return (
    <section className="relative h-[100dvh] min-h-[650px] w-full flex flex-col justify-between items-center overflow-hidden z-20 pt-28 pb-8 select-none">
      
      {/* Subtle top spacer to offset the floating navbar height */}
      <div className="h-4" />

      {/* Main Centered Content block */}
      <div className="max-w-4xl mx-auto px-6 text-center flex flex-col items-center justify-center flex-grow">
        
        {/* Parallax elements */}
        <MouseParallax factor={8} className="flex flex-col items-center w-full">
          {/* Eyebrow badge */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, ease: 'easeOut' }}
            className="inline-flex items-center gap-2 border border-[#FF6B2C]/30 bg-[#FF6B2C]/5 px-4 py-1 rounded-full text-xs text-[#FF824D] mb-6"
          >
            <Sparkles className="w-3 h-3 text-[#FF6B2C]" />
            <span className="font-semibold tracking-widest uppercase text-[10px]">✦ Grounded In Truth</span>
          </motion.div>

          {/* Heading - composed in overflow-masked lines to prevent text distortions */}
          <h1 className="text-[2.25rem] sm:text-[3.25rem] md:text-[4.25rem] font-bold text-[#F5F5F0] leading-[1.12] tracking-tight mb-6 max-w-4xl text-center w-full">
            {lines.map((line, i) => (
              <div key={i} className="overflow-hidden py-1 w-full flex justify-center">
                <motion.span
                  custom={i}
                  variants={lineVariants}
                  initial="hidden"
                  animate="visible"
                  className="block w-full text-center"
                >
                  {line === "for Complex Knowledge" ? (
                    <>
                      for Complex <span className="gradient-text">Knowledge</span>
                    </>
                  ) : (
                    line
                  )}
                </motion.span>
              </div>
            ))}
          </h1>

          {/* Subtitle with generous line height and margin */}
          <motion.p
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.5, ease: 'easeOut' }}
            className="text-xs sm:text-sm md:text-base text-[#9A9A9A] max-w-xl mb-10 leading-relaxed"
          >
            Transform dense PDFs into living, responsive intelligence. Ask questions in natural language and receive grounded AI responses with precision citations.
          </motion.p>
        </MouseParallax>

        {/* Action Button - Single Prominent CTA with Breathing Glow */}
        <MouseParallax factor={12} className="relative">
          <motion.div 
            animate={{
              scale: [1, 1.1, 0.96, 1.05, 1],
              opacity: [0.12, 0.20, 0.10, 0.16, 0.12]
            }}
            transition={{
              duration: 7,
              repeat: Infinity,
              ease: 'easeInOut'
            }}
            className="absolute inset-x-0 -inset-y-3 bg-[#FF6B2C] rounded-full blur-[45px] pointer-events-none -z-10 w-[130%] h-[140%] -left-[15%] -top-[20%]"
          />

          <MagneticButton 
            to="/register" 
            id="hero-cta-register" 
            className="btn-primary text-xs px-8 py-3.5 gap-2 shadow-brand-lg h-12 w-52 overflow-hidden"
          >
            <span className="flex items-center gap-2 font-medium tracking-tight">
              Start Chatting
              <span className="w-5 h-5 rounded-full bg-black flex items-center justify-center text-white">
                <ChevronRight className="w-3 h-3" />
              </span>
            </span>
          </MagneticButton>
        </MouseParallax>
      </div>

      {/* Social Tagline Row - Anchored exactly at the bottom of the viewport */}
      <motion.div 
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.7 }}
        className="flex items-center gap-2 z-30"
      >
        <div className="w-1.5 h-1.5 rounded-full bg-[#FF6B2C]" />
        <p className="text-[11px] sm:text-xs text-[#9A9A9A]">
          Built for <span className="text-[#F5F5F0] font-semibold">engineers, students, and researchers</span>
        </p>
      </motion.div>

    </section>
  );
}
