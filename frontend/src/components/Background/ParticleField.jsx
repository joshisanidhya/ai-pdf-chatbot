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

    class Particle {
      constructor() {
        this.reset();
      }

      reset() {
        this.x = Math.random() * width;
        this.y = Math.random() * height;
        this.size = Math.random() * 1.6 + 0.4;
        this.speedX = Math.random() * 0.15 - 0.075;
        this.speedY = Math.random() * 0.15 - 0.075;
        this.opacity = Math.random() * 0.45 + 0.1;
        this.fadeSpeed = Math.random() * 0.004 + 0.001;
        this.fadeDir = Math.random() > 0.5 ? 1 : -1;
        
        // Virtual centers for orbital rotation behavior
        this.centerX = this.x + Math.random() * 80 - 40;
        this.centerY = this.y + Math.random() * 80 - 40;
        this.angle = Math.random() * Math.PI * 2;
        this.rotationSpeed = Math.random() * 0.0015 - 0.00075;
        this.radius = Math.random() * 30 + 10;
      }

      update(mX, mY) {
        // Twinkle effect (sine oscillation representation)
        this.opacity += this.fadeSpeed * this.fadeDir;
        if (this.opacity >= 0.65) {
          this.opacity = 0.65;
          this.fadeDir = -1;
        } else if (this.opacity <= 0.1) {
          this.opacity = 0.1;
          this.fadeDir = 1;
        }

        // Orbit around center
        this.angle += this.rotationSpeed;
        this.x = this.centerX + Math.cos(this.angle) * this.radius;
        this.y = this.centerY + Math.sin(this.angle) * this.radius;

        // Slow horizontal/vertical translation
        this.centerX += this.speedX;
        this.centerY += this.speedY;

        // Wrap around borders
        if (this.x < -10 || this.x > width + 10 || this.y < -10 || this.y > height + 10) {
          this.reset();
        }

        // Cursor repulsion force field
        if (mX !== undefined && mY !== undefined) {
          const dx = this.x - mX;
          const dy = this.y - mY;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 180) {
            const force = (180 - dist) / 180;
            this.x += (dx / dist) * force * 15;
            this.y += (dy / dist) * force * 15;
          }
        }
      }

      draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(245, 245, 240, ${this.opacity})`;
        ctx.fill();
      }
    }

    const densityFactor = Math.min(160, Math.floor((width * height) / 9000));
    const particles = Array.from({ length: densityFactor }, () => new Particle());

    let mouseX = width / 2;
    let mouseY = height / 2;

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

      particles.forEach((p) => {
        p.update(mouseX, mouseY);
        p.draw();
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
