'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence, useMotionValue, useTransform } from 'framer-motion';
import { X, Heart } from 'lucide-react';
import styles from './SwipeStack.module.css';

interface Card {
  id: string;
  title: string;
  description: string;
  image?: string;
}

interface SwipeStackProps {
  cards: Card[];
  onSwipe: (cardId: string, direction: 'left' | 'right') => void;
  onAllSwiped: () => void;
}

export const SwipeStack: React.FC<SwipeStackProps> = ({ cards, onSwipe, onAllSwiped }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const x = useMotionValue(0);
  const rotate = useTransform(x, [-200, 200], [-25, 25]);
  const opacity = useTransform(x, [-200, -150, 0, 150, 200], [0, 1, 1, 1, 0]);
  
  const currentCard = cards[currentIndex];

  const handleDragEnd = (_: any, info: any) => {
    if (info.offset.x > 100) {
      handleSwipe('right');
    } else if (info.offset.x < -100) {
      handleSwipe('left');
    }
  };

  const handleSwipe = (direction: 'left' | 'right') => {
    onSwipe(currentCard.id, direction);
    if (currentIndex < cards.length - 1) {
      setCurrentIndex(currentIndex + 1);
    } else {
      onAllSwiped();
    }
  };

  if (!currentCard) return null;

  return (
    <div className={styles.container}>
      <AnimatePresence mode="popLayout">
        <motion.div
          key={currentCard.id}
          className={styles.card}
          style={{ x, rotate }}
          drag="x"
          dragConstraints={{ left: 0, right: 0 }}
          onDragEnd={handleDragEnd}
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ 
            x: x.get() > 0 ? 500 : -500, 
            opacity: 0, 
            transition: { duration: 0.3 } 
          }}
        >
          <div className={styles.imagePlaceholder}>
            {directionIndicator(x)}
          </div>
          <div className={styles.content}>
            <h2 className={styles.title}>{currentCard.title}</h2>
            <p className={styles.description}>{currentCard.description}</p>
          </div>
        </motion.div>
      </AnimatePresence>

      <div className={styles.controls}>
        <button 
          className={`${styles.btn} ${styles.btnNo}`} 
          onClick={() => handleSwipe('left')}
        >
          <X size={24} />
        </button>
        <button 
          className={`${styles.btn} ${styles.btnYes}`} 
          onClick={() => handleSwipe('right')}
        >
          <Heart size={24} fill="currentColor" />
        </button>
      </div>
    </div>
  );
};

const directionIndicator = (x: any) => {
  const opacityRight = useTransform(x, [50, 150], [0, 1]);
  const opacityLeft = useTransform(x, [-50, -150], [0, 1]);

  return (
    <>
      <motion.div style={{ opacity: opacityRight }} className={`${styles.indicator} ${styles.right}`}>
        YES
      </motion.div>
      <motion.div style={{ opacity: opacityLeft }} className={`${styles.indicator} ${styles.left}`}>
        NO
      </motion.div>
    </>
  );
};
