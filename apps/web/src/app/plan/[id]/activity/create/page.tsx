'use client';

import React, { useState, use } from 'react';
import { useRouter } from 'next/navigation';
import { useDispatch } from 'react-redux';
import { 
  ArrowLeft, 
  Plus, 
  X, 
  Check, 
  MapPin, 
  Banknote, 
  Users, 
  Info,
  Tag
} from 'lucide-react';
import { Button } from '@/components/Button/Button';
import { Input } from '@/components/Input/Input';
import styles from './create-activity.module.css';

export default function CreateActivityPage({ params }: { params: Promise<{ id: string }> }) {
  const { id: planId } = use(params);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [location, setLocation] = useState('');
  const [price, setPrice] = useState('');
  const [membersCount, setMembersCount] = useState('');
  const [instructions, setInstructions] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  const router = useRouter();
  const dispatch = useDispatch();

  const handleCreate = () => {
    setIsLoading(true);
    // In a real app, we'd dispatch an action to add activity to a specific plan
    // For now, we'll simulate the success and go back
    setTimeout(() => {
      console.log('Activity Created:', {
        title,
        description,
        location,
        price,
        membersCount,
        instructions,
        planId
      });
      router.push(`/plan/${planId}`);
    }, 1500);
  };

  return (
    <main className={styles.container}>
      <div className={styles.topNav}>
        <button onClick={() => router.back()} className={styles.backBtn}>
          <ArrowLeft size={18} style={{ marginRight: '8px' }} />
          Back to Plan
        </button>
      </div>

      <div className={`${styles.content} animate-slide-up`}>
        <header className={styles.header}>
          <div className={styles.iconBadge}>
            <Tag size={24} />
          </div>
          <h1 className="gradient-text">Suggest an Activity</h1>
          <p className={styles.subtitle}>Pitch your idea to the group and get those votes!</p>
        </header>

        <div className={styles.formCard}>
          <section className={styles.section}>
            <Input 
              label="Activity Title"
              placeholder="e.g., Wine Tasting at Chateau X"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
            <div className={styles.spacer} />
            <Input 
              label="Description"
              placeholder="What makes this activity awesome?"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </section>

          <section className={styles.gridSection}>
            <div className={styles.inputItem}>
              <label className={styles.label}>
                <MapPin size={14} /> Location
              </label>
              <Input 
                placeholder="Where is it?"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
              />
            </div>
            <div className={styles.inputItem}>
              <label className={styles.label}>
                <Banknote size={14} /> Est. Price
              </label>
              <Input 
                placeholder="e.g., €30 / free"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
              />
            </div>
            <div className={styles.inputItem}>
              <label className={styles.label}>
                <Users size={14} /> Max Members
              </label>
              <Input 
                type="number"
                placeholder="No limit"
                value={membersCount}
                onChange={(e) => setMembersCount(e.target.value)}
              />
            </div>
          </section>

          <section className={styles.section}>
            <label className={styles.label}>
              <Info size={14} /> Special Instructions
            </label>
            <textarea 
              className={styles.textarea}
              placeholder="e.g., Dress code: Smart Casual, Bring your own bottle..."
              value={instructions}
              onChange={(e) => setInstructions(e.target.value)}
            />
          </section>

          <div className={styles.footer}>
            <Button variant="outline" onClick={() => router.back()} icon={<X size={18} />}>Cancel</Button>
            <Button onClick={handleCreate} isLoading={isLoading} disabled={!title} rightIcon={<Check size={18} />}>
              Post Suggestion
            </Button>
          </div>
        </div>
      </div>
    </main>
  );
}
