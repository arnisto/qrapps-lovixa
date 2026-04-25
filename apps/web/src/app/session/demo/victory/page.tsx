'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/Button/Button';
import styles from './victory.module.css';

export default function VictoryPage() {
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
          <div className={styles.badge}>MATCH FOUND 🎉</div>
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
          <Button fullWidth>Let's Go!</Button>
          <Button variant="secondary" fullWidth>Share Location</Button>
          <Button variant="ghost" fullWidth>Start New Session</Button>
        </div>
      </div>
    </main>
  );
}
