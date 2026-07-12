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
  const headline = "Cognitive Semantic Grounding for Complex Knowledge";
  const words = headline.split(" ");

  // Stagger entry configurations
  const wordVariants = {
    hidden: { opacity: 0, y: 25, filter: 'blur(8px)' },
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
    <section className="relative min-h-screen w-full flex flex-col justify-center items-center overflow-hidden z-20 pt-36 md:pt-40 pb-24">
      <div className="max-w-4xl mx-auto px-6 text-center flex flex-col items-center select-none">
        
        {/* Parallax elements */}
        <MouseParallax factor={10} className="flex flex-col items-center">
          {/* Eyebrow badge (spatially independent, ~100px from top navbar) */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, ease: 'easeOut' }}
            className="inline-flex items-center gap-2 border border-[#FF6B2C]/30 bg-[#FF6B2C]/5 px-4.5 py-1.5 rounded-full text-xs text-[#FF824D] mb-11"
          >
            <Sparkles className="w-3.5 h-3.5 text-[#FF6B2C]" />
            <span className="font-semibold tracking-widest uppercase">✦ Grounded In Truth</span>
          </motion.div>

          {/* Staggered text assembly with balanced maximum width */}
          <h1 className="text-[2.6rem] sm:text-[4.2rem] md:text-[5.2rem] font-bold text-white leading-[1.12] tracking-tight mb-9 max-w-3xl text-balance">
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

          {/* Subtitle with generous line height and margin */}
          <motion.p
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6, ease: 'easeOut' }}
            className="text-base sm:text-lg md:text-xl text-[#9A9A9A] max-w-2xl mb-14 leading-relaxed"
          >
            Transform dense PDFs into living, responsive intelligence. Ask questions in natural language and receive grounded AI responses with precision citations.
          </motion.p>
        </MouseParallax>

        {/* Action Button - Single Prominent CTA with Breathing Glow */}
        <MouseParallax factor={14} className="relative mb-20">
          {/* Low-intensity, highly-diffused slow breathing glow ring */}
          <motion.div 
            animate={{
              scale: [1, 1.14, 0.95, 1.07, 1],
              opacity: [0.16, 0.24, 0.14, 0.20, 0.16]
            }}
            transition={{
              duration: 7,
              repeat: Infinity,
              ease: 'easeInOut'
            }}
            className="absolute inset-x-0 -inset-y-3 bg-[#FF6B2C] rounded-full blur-[55px] pointer-events-none -z-10 w-[130%] h-[140%] -left-[15%] -top-[20%]"
          />

          <MagneticButton 
            to="/register" 
            id="hero-cta-register" 
            className="btn-primary text-base px-10 py-4.5 gap-2 shadow-brand-lg h-14 w-60 overflow-hidden"
          >
            <span className="flex items-center gap-2.5 font-medium tracking-tight">
              Start Chatting
              <span className="w-5.5 h-5.5 rounded-full bg-black flex items-center justify-center text-white">
                <ChevronRight className="w-3.5 h-3.5" />
              </span>
            </span>
          </MagneticButton>
        </MouseParallax>

        {/* Social Proof */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.8 }}
          className="flex items-center gap-3.5"
        >
          <div className="flex -space-x-2">
            {['U', 'N', 'I', 'Z'].map((char, index) => (
              <div 
                key={index} 
                className="w-8 h-8 rounded-full border-2 border-[#0A0A0A] bg-gradient-to-br from-[#FF6B2C] to-[#E63946] flex items-center justify-center text-[10px] font-bold text-white shadow-md shadow-black/30"
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
