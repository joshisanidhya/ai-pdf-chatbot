import React from 'react';
import { motion, useTransform } from 'framer-motion';
import { useMousePosition } from '../../hooks/useMousePosition';

export default function MouseParallax({ children, factor = 15, className = "" }) {
  const { x, y } = useMousePosition();
  
  // Transform spring-interpolated coordinates to absolute pixel movement
  const translateX = useTransform(x, [-0.5, 0.5], [-factor, factor]);
  const translateY = useTransform(y, [-0.5, 0.5], [-factor, factor]);

  return (
    <motion.div 
      style={{ x: translateX, y: translateY }} 
      className={`will-change-transform ${className}`}
    >
      {children}
    </motion.div>
  );
}
