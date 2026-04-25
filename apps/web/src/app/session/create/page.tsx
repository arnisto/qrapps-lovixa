'use client';

import React, { useState } from 'react';
import { Button } from '@/components/Button/Button';
import { Input } from '@/components/Input/Input';
import styles from './create-session.module.css';

interface CardDraft {
  title: string;
  description: string;
  image: string;
}

export default function CreateSessionPage() {
  const [sessionTitle, setSessionTitle] = useState('');
  const [cards, setCards] = useState<CardDraft[]>([
    { title: '', description: '', image: '' },
    { title: '', description: '', image: '' },
    { title: '', description: '', image: '' },
  ]);
  const [isCreating, setIsCreating] = useState(false);

  const updateCard = (index: number, field: keyof CardDraft, value: string) => {
    const newCards = [...cards];
    newCards[index][field] = value;
    setCards(newCards);
  };

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    setIsCreating(true);
    // Simulate API call
    setTimeout(() => setIsCreating(false), 2000);
  };

  return (
    <main className={styles.container}>
      <header className={styles.header}>
        <h1 className="gradient-text">Create Live Session</h1>
        <p className={styles.subtitle}>Define the vibe and select 3 cards for your group to vote on.</p>
      </header>

      <form className={styles.form} onSubmit={handleCreate}>
        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>1. Session Info</h2>
          <Input 
            label="What are we deciding?"
            placeholder="e.g., Saturday Night Vibe"
            value={sessionTitle}
            onChange={(e) => setSessionTitle(e.target.value)}
            required
          />
        </section>

        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>2. Vibe Cards (Select 3)</h2>
          <div className={styles.cardGrid}>
            {cards.map((card, index) => (
              <div key={index} className={styles.cardForm}>
                <div className={styles.cardBadge}>Card {index + 1}</div>
                <Input 
                  placeholder="Venue or Activity Title"
                  value={card.title}
                  onChange={(e) => updateCard(index, 'title', e.target.value)}
                  required
                />
                <textarea 
                  className={styles.textarea}
                  placeholder="Brief description (optional)"
                  value={card.description}
                  onChange={(e) => updateCard(index, 'description', e.target.value)}
                />
                <div className={styles.imagePlaceholder}>
                  <span>+ Add Image</span>
                </div>
              </div>
            ))}
          </div>
        </section>

        <div className={styles.actions}>
          <Button type="submit" isLoading={isCreating} fullWidth>
            Launch Live Session
          </Button>
          <p className={styles.disclaimer}>
            A shareable link will be generated instantly.
          </p>
        </div>
      </form>
    </main>
  );
}
