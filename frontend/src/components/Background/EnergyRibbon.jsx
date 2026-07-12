import React, { useRef, useEffect } from 'react';
import { useReducedMotion } from 'framer-motion';

export default function EnergyRibbon() {
  const canvasRef = useRef(null);
  const shouldReduceMotion = useReducedMotion();

  useEffect(() => {
    if (shouldReduceMotion) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    let mouseX = undefined;
    let mouseY = undefined;

    // Track mouse
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

    // Configuration for the two ribbons (Layer 4 & Layer 5)
    const ribbons = [
      {
        // Primary Orange/Red flowing hot energy (Layer 4)
        pointsCount: 8,
        yBase: height * 0.45,
        yAmplitude: 45,
        speed: 0.0018,
        colorStart: 'rgba(255, 107, 44, 0.45)',
        colorEnd: 'rgba(230, 57, 70, 0.1)',
        glowColor: '#FF6B2C',
        glowWidth: 35,
        lineWidths: [6, 12, 18],
        yDriftAmplitude: 30,
        yDriftSpeed: 0.0006,
        phaseDiff: 0.7,
      },
      {
        // Secondary Gold/Amber slow flowing ribbon for depth (Layer 5)
        pointsCount: 6,
        yBase: height * 0.55,
        yAmplitude: 30,
        speed: 0.0012,
        colorStart: 'rgba(245, 158, 11, 0.3)',
        colorEnd: 'rgba(251, 191, 36, 0.02)',
        glowColor: '#F59E0B',
        glowWidth: 20,
        lineWidths: [4, 8],
        yDriftAmplitude: 20,
        yDriftSpeed: 0.0004,
        phaseDiff: 1.2,
      }
    ];

    let time = 0;
    let active = true;

    const drawCurve = (points, color, glowColor, glowWidth, lineWidth) => {
      ctx.save();
      ctx.globalCompositeOperation = 'screen';
      
      // Setup plasma glow
      ctx.shadowBlur = glowWidth;
      ctx.shadowColor = glowColor;
      
      // Create horizontal gradient for the plasma flow
      const grad = ctx.createLinearGradient(0, 0, width, 0);
      grad.addColorStop(0, 'rgba(0,0,0,0)');
      grad.addColorStop(0.2, color);
      grad.addColorStop(0.8, color);
      grad.addColorStop(1, 'rgba(0,0,0,0)');
      
      ctx.strokeStyle = grad;
      ctx.lineWidth = lineWidth;
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';
      
      ctx.beginPath();
      ctx.moveTo(points[0].x, points[0].y);

      // Bezier curve interpolation through points
      for (let i = 0; i < points.length - 1; i++) {
        const xc = (points[i].x + points[i + 1].x) / 2;
        const yc = (points[i].y + points[i + 1].y) / 2;
        ctx.quadraticCurveTo(points[i].x, points[i].y, xc, yc);
      }
      ctx.lineTo(points[points.length - 1].x, points[points.length - 1].y);
      ctx.stroke();
      ctx.restore();
    };

    const render = () => {
      if (!active) return;
      ctx.clearRect(0, 0, width, height);

      time += 1;

      ribbons.forEach((ribbon) => {
        const points = [];
        const segmentWidth = width / (ribbon.pointsCount - 1);
        
        // Slow vertical drift of the ribbon base Y
        const currentYBase = ribbon.yBase + Math.sin(time * ribbon.yDriftSpeed) * ribbon.yDriftAmplitude;

        for (let i = 0; i < ribbon.pointsCount; i++) {
          const x = i * segmentWidth;
          
          // Basic wave formula
          let y = currentYBase + 
            Math.sin(time * ribbon.speed + i * ribbon.phaseDiff) * ribbon.yAmplitude +
            Math.cos(time * ribbon.speed * 1.5 + i * 0.5) * (ribbon.yAmplitude * 0.4);

          // Cursor interaction (slight attract/repel)
          if (mouseX !== undefined && mouseY !== undefined) {
            const dx = x - mouseX;
            const dy = y - mouseY;
            const dist = Math.sqrt(dx * dx + dy * dy);
            if (dist < 220) {
              const influence = (220 - dist) / 220;
              // Pull vertically towards the mouse
              y += (mouseY - y) * influence * 0.25;
            }
          }

          points.push({ x, y });
        }

        // Draw multiple layers of different widths to create volumetric plasma thickness
        ribbon.lineWidths.forEach((lw, idx) => {
          // Dynamic thickness oscillation
          const thicknessOsc = Math.sin(time * 0.005 + idx) * (lw * 0.25);
          drawCurve(
            points, 
            ribbon.colorStart, 
            ribbon.glowColor, 
            ribbon.glowWidth + (idx * 5), 
            lw + thicknessOsc
          );
        });
      });

      animId = requestAnimationFrame(render);
    };

    const handleVisibility = () => {
      if (document.hidden) {
        active = false;
      } else {
        active = true;
        render();
      }
    };

    document.addEventListener('visibilitychange', handleVisibility);
    render();

    return () => {
      active = false;
      cancelAnimationFrame(animId);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('resize', handleResize);
      document.removeEventListener('visibilitychange', handleVisibility);
    };
  }, [shouldReduceMotion]);

  if (shouldReduceMotion) return null;

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full pointer-events-none z-10 opacity-[0.45]"
    />
  );
}
