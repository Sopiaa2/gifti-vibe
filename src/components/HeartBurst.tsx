import { motion, AnimatePresence } from 'framer-motion';
import { useEffect, useState } from 'react';

interface HeartBurstProps {
  trigger: number; // increment to trigger
}

const HEARTS = ['💛', '🧡', '❤️', '💛', '🧡'];

export default function HeartBurst({ trigger }: HeartBurstProps) {
  const [particles, setParticles] = useState<{ id: number; emoji: string; x: number; delay: number }[]>([]);

  useEffect(() => {
    if (trigger === 0) return;
    const newParticles = HEARTS.map((emoji, i) => ({
      id: Date.now() + i,
      emoji,
      x: (i - 2) * 30 + (Math.random() - 0.5) * 20,
      delay: i * 0.08,
    }));
    setParticles(newParticles);
    const timer = setTimeout(() => setParticles([]), 1600);
    return () => clearTimeout(timer);
  }, [trigger]);

  return (
    <div className="fixed inset-0 pointer-events-none z-50 flex items-end justify-center">
      <AnimatePresence>
        {particles.map((p) => (
          <motion.span
            key={p.id}
            initial={{ opacity: 1, y: 0, x: p.x, scale: 0.5 }}
            animate={{
              opacity: [1, 1, 0],
              y: [0, -200, -320],
              scale: [0.5, 1.6, 0.8],
            }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1.3, delay: p.delay, ease: 'easeOut' }}
            className="absolute bottom-[40%] text-3xl"
          >
            {p.emoji}
          </motion.span>
        ))}
      </AnimatePresence>
    </div>
  );
}
