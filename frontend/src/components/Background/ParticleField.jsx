import React, { useRef, useEffect } from 'react';
import { useReducedMotion } from 'framer-motion';

export default function ParticleField() {
  const canvasRef = useRef(null);
  const shouldReduceMotion = useReducedMotion();

  useEffect(() => {
    if (shouldReduceMotion) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    class EnergyStreak {
      constructor() {
        this.reset(true);
      }

      reset(init = false) {
        // Spawn randomly across the canvas initially, but from top/right borders afterwards
        this.x = Math.random() * width;
        this.y = init ? Math.random() * height : -30;
        if (!init && Math.random() > 0.5) {
          this.x = width + 30;
          this.y = Math.random() * height;
        }

        // Flow angle: diagonal path from top-right to bottom-left (135 degrees = 3/4 PI) plus variance
        this.angle = Math.PI * 0.75 + (Math.random() * 0.35 - 0.175);

        // Speeds are increased ~2x: range from 0.6px to 3.2px per frame (some slow drift, some fast streak)
        this.speed = Math.random() * 2.6 + 0.6;
        this.speedX = Math.cos(this.angle) * this.speed;
        this.speedY = Math.sin(this.angle) * this.speed;

        // Randomized dimensions
        this.length = Math.random() * 32 + 8;
        this.thickness = Math.random() * 1.4 + 0.4;

        // Lifetime parameters
        this.life = 0;
        this.maxLife = Math.random() * 180 + 90;
        this.baseOpacity = Math.random() * 0.4 + 0.12;
        this.opacity = 0;
      }

      update(mX, mY) {
        this.life++;
        if (this.life >= this.maxLife) {
          this.reset();
          return;
        }

        // Fade in (first 15% of lifetime) and Fade out (last 20%)
        const progress = this.life / this.maxLife;
        if (progress < 0.15) {
          this.opacity = (progress / 0.15) * this.baseOpacity;
        } else if (progress > 0.8) {
          this.opacity = ((1 - progress) / 0.2) * this.baseOpacity;
        } else {
          this.opacity = this.baseOpacity;
        }

        // Scale animation: dynamic thickness breathing
        this.currentThickness = this.thickness * (1 + Math.sin(this.life * 0.06) * 0.2);

        // Apply constant velocity translation
        this.x += this.speedX;
        this.y += this.speedY;

        // Wrap around boundary check
        if (this.x < -50 || this.x > width + 50 || this.y < -50 || this.y > height + 50) {
          this.reset();
        }

        // Cursor deflection field (push away slightly)
        if (mX !== undefined && mY !== undefined) {
          const dx = this.x - mX;
          const dy = this.y - mY;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 150) {
            const force = (150 - dist) / 150;
            this.x += (dx / dist) * force * 5;
            this.y += (dy / dist) * force * 5;
          }
        }
      }

      draw() {
        ctx.save();
        ctx.globalCompositeOperation = 'screen';

        // Calculate tail coordinate for linear streak representation
        const tailX = this.x - Math.cos(this.angle) * this.length;
        const tailY = this.y - Math.sin(this.angle) * this.length;

        // Head-to-tail linear gradient for tail fade
        const grad = ctx.createLinearGradient(this.x, this.y, tailX, tailY);
        grad.addColorStop(0, `rgba(255, 255, 255, ${this.opacity})`);
        grad.addColorStop(0.35, `rgba(255, 125, 55, ${this.opacity * 0.8})`);
        grad.addColorStop(1, 'rgba(255, 125, 55, 0)');

        ctx.strokeStyle = grad;
        ctx.lineWidth = this.currentThickness;
        ctx.lineCap = 'round';

        // Motion blur simulation via canvas shadows
        ctx.shadowBlur = 4.5;
        ctx.shadowColor = 'rgba(255, 107, 44, 0.45)';

        ctx.beginPath();
        ctx.moveTo(this.x, this.y);
        ctx.lineTo(tailX, tailY);
        ctx.stroke();

        ctx.restore();
      }
    }

    // Limit particle count for optimal rendering performance (locked 60 FPS)
    const densityFactor = Math.min(90, Math.floor((width * height) / 16000));
    const streaks = Array.from({ length: densityFactor }, () => new EnergyStreak());

    let mouseX = undefined;
    let mouseY = undefined;

    const handleMouseMove = (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
    };

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('resize', handleResize);

    let active = true;
    const tick = () => {
      if (!active) return;
      ctx.clearRect(0, 0, width, height);

      streaks.forEach((streak) => {
        streak.update(mouseX, mouseY);
        streak.draw();
      });

      animationFrameId = requestAnimationFrame(tick);
    };

    const handleVisibility = () => {
      if (document.hidden) {
        active = false;
      } else {
        active = true;
        tick();
      }
    };

    document.addEventListener('visibilitychange', handleVisibility);
    tick();

    return () => {
      active = false;
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('resize', handleResize);
      document.removeEventListener('visibilitychange', handleVisibility);
    };
  }, [shouldReduceMotion]);

  if (shouldReduceMotion) return null;

  return (
    <canvas 
      ref={canvasRef} 
      className="absolute inset-0 w-full h-full pointer-events-none z-10"
    />
  );
}
