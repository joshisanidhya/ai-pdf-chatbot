import { useEffect } from 'react';
import { useMotionValue, useSpring } from 'framer-motion';

export function useMousePosition() {
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  // Configuration for buttery-smooth spring interpolation
  const springConfig = { damping: 40, stiffness: 90, mass: 1 };
  const smoothX = useSpring(mouseX, springConfig);
  const smoothY = useSpring(mouseY, springConfig);

  useEffect(() => {
    const handleMouseMove = (e) => {
      const { clientX, clientY } = e;
      const { innerWidth, innerHeight } = window;
      
      // Normalize values between -0.5 and 0.5
      const nx = (clientX / innerWidth) - 0.5;
      const ny = (clientY / innerHeight) - 0.5;
      
      mouseX.set(nx);
      mouseY.set(ny);
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [mouseX, mouseY]);

  return { x: smoothX, y: smoothY };
}
