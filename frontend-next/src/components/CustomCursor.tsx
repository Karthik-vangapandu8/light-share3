'use client';

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function CustomCursor() {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isPointer, setIsPointer] = useState(false);

  useEffect(() => {
    const updateMousePosition = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });

      // Check if the cursor is over a clickable element
      const target = e.target as HTMLElement;
      setIsPointer(
        window.getComputedStyle(target).cursor === 'pointer' ||
        target.tagName === 'BUTTON' ||
        target.tagName === 'A'
      );
    };

    window.addEventListener('mousemove', updateMousePosition);

    return () => {
      window.removeEventListener('mousemove', updateMousePosition);
    };
  }, []);

  return (
    <AnimatePresence mode="wait">
      <motion.div
        className="fixed top-0 left-0 pointer-events-none z-50 mix-blend-difference"
        animate={{
          x: mousePosition.x - (isPointer ? 32 : 8),
          y: mousePosition.y - (isPointer ? 32 : 8),
          scale: isPointer ? 2.5 : 1,
          opacity: 1
        }}
        transition={{
          type: "spring",
          stiffness: 150,
          damping: 15,
          mass: 0.1
        }}
      >
        {/* Main cursor */}
        <motion.div
          className="w-4 h-4 bg-white rounded-full relative"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
        >
          {/* Glowing trail effect */}
          <motion.div
            className="absolute inset-0 bg-white rounded-full filter blur-md"
            initial={{ scale: 1 }}
            animate={{ 
              scale: [1, 1.2, 1],
              opacity: [0.3, 0.1, 0.3]
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "linear"
            }}
          />
        </motion.div>

        {/* Cursor trails */}
        {Array.from({ length: 6 }).map((_, i) => (
          <motion.div
            key={i}
            className="w-4 h-4 bg-white/30 rounded-full absolute top-0 left-0"
            initial={{ scale: 0 }}
            animate={{
              scale: 1 - (i * 0.1),
              opacity: 0.3 - (i * 0.05),
              x: -i * 2,
              y: -i * 2
            }}
            transition={{
              delay: i * 0.05,
              duration: 0.5,
              ease: "easeOut"
            }}
          />
        ))}
      </motion.div>
    </AnimatePresence>
  );
}
