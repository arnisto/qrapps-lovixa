'use client';

import React, { useState } from 'react';
import { SwipeStack } from '@/components/SwipeStack/SwipeStack';
import { Users } from 'lucide-react';
import styles from './vote.module.css';

const DUMMY_CARDS = [
  { id: '1', title: 'Rooftop Bar', description: 'Great city views and craft cocktails.' },
  { id: '2', title: 'Arcade City', description: 'Retro games and neon lights.' },
  { id: '3', title: 'Secret Garden', description: 'Hidden oasis with live jazz.' },
];

export default function VotePage() {
  const [completed, setCompleted] = useState(false);

  const handleSwipe = (cardId: string, direction: 'left' | 'right') => {
    console.log(`Swiped ${direction} on ${cardId}`);
  };

  const handleAllSwiped = () => {
    setCompleted(true);
  };

  return (
    <main className={styles.container}>
      <header className={styles.header}>
        <div className={styles.participantBadge}>
          <Users size={12} style={{ marginRight: '6px' }} />
          4 Active Friends
        </div>
        <h1 className="gradient-text">Make Your Choice</h1>
        <p className={styles.subtitle}>Swipe right if you're in, left if you're not.</p>
      </header>

      {!completed ? (
        <div className={styles.stackWrapper}>
          <SwipeStack 
            cards={DUMMY_CARDS} 
            onSwipe={handleSwipe} 
            onAllSwiped={handleAllSwiped} 
          />
        </div>
      ) : (
        <div className={styles.waitingState}>
          <div className={styles.loader} />
          <h2>Waiting for Consensus...</h2>
          <p>The rest of the group is still voting.</p>
        </div>
      )}
    </main>
  );
}
