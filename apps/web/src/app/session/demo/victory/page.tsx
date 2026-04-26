'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Trophy, Share2, Rocket, MapPin } from 'lucide-react';
import confetti from 'canvas-confetti';
import { Button } from '@/components/Button/Button';
import styles from './victory.module.css';

export default function VictoryPage() {
  React.useEffect(() => {
    const duration = 3 * 1000;
    const animationEnd = Date.now() + duration;
    const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 0 };

    const randomInRange = (min: number, max: number) => Math.random() * (max - min) + min;

    const interval: any = setInterval(function() {
      const timeLeft = animationEnd - Date.now();

      if (timeLeft <= 0) {
        return clearInterval(interval);
      }

      const particleCount = 50 * (timeLeft / duration);
      confetti({ ...defaults, particleCount, origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 } });
      confetti({ ...defaults, particleCount, origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 } });
    }, 250);

    return () => clearInterval(interval);
  }, []);

  const winner = {
    title: 'Secret Garden',
    description: 'Hidden oasis with live jazz.',
    percentage: 75,
    totalVotes: 4
  };

  return (
    <main className={styles.container}>
      <motion.div 
        className={styles.confetti}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
      >
        {/* Placeholder for actual confetti animation */}
      </motion.div>

      <div className={`${styles.card} animate-fade-in`}>
        <header className={styles.header}>
          <div className={styles.badge}>
            <Trophy size={14} style={{ marginRight: '6px' }} />
            MATCH FOUND
          </div>
          <h1 className="gradient-text">It's a Vibe!</h1>
          <p className={styles.subtitle}>The group has spoken. Here's your choice:</p>
        </header>

        <div className={styles.winnerCard}>
          <div className={styles.imagePlaceholder}>
            <div className={styles.percentageBadge}>{winner.percentage}% Match</div>
          </div>
          <div className={styles.winnerContent}>
            <h2>{winner.title}</h2>
            <p>{winner.description}</p>
          </div>
        </div>

        <div className={styles.stats}>
          <p>{winner.totalVotes} friends voted in this session</p>
        </div>

        <div className={styles.actions}>
          <Button fullWidth icon={<MapPin size={18} />}>Let's Go!</Button>
          <Button variant="secondary" fullWidth icon={<Share2 size={18} />}>Share Location</Button>
          <Button variant="ghost" fullWidth icon={<Rocket size={18} />}>Start New Session</Button>
        </div>
      </div>
    </main>
  );
}
