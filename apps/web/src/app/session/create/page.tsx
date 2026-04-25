'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useDispatch } from 'react-redux';
import { addPlan } from '@/store/slices/sessionSlice';
import { Button } from '@/components/Button/Button';
import { Input } from '@/components/Input/Input';
import styles from './create.module.css';

export default function CreatePlanPage() {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [activityInput, setActivityInput] = useState('');
  const [activities, setActivities] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  
  const router = useRouter();
  const dispatch = useDispatch();

  const addActivity = () => {
    if (activityInput.trim()) {
      setActivities([...activities, activityInput.trim()]);
      setActivityInput('');
    }
  };

  const handleCreate = () => {
    setIsLoading(true);
    setTimeout(() => {
      dispatch(addPlan({
        id: Math.random().toString(36).substr(2, 9),
        title,
        description,
        activities,
        status: 'active'
      }));
      router.push('/home');
    }, 1500);
  };

  return (
    <main className={styles.container}>
      <div className={styles.topNav}>
        <button onClick={() => router.back()} className={styles.backBtn}>
          ← Back
        </button>
      </div>

      <div className={`${styles.content} animate-slide-up`}>
        <header className={styles.header}>
          <h1>Create New Plan</h1>
          <p className={styles.subtitle}>Define your vision and let the group decide the rest.</p>
        </header>

        <div className={styles.formCard}>
          <section className={styles.section}>
            <Input 
              label="Plan Title"
              placeholder="e.g., Summer Yacht Party"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
            <div className={styles.spacer} />
            <Input 
              label="Description"
              placeholder="Give your group some context..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </section>

          <section className={styles.section}>
            <label className={styles.label}>Activities</label>
            <div className={styles.activityInputRow}>
              <Input 
                placeholder="Add an activity..."
                value={activityInput}
                onChange={(e) => activityInput === '' ? setActivityInput(e.target.value) : setActivityInput(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && addActivity()}
              />
              <Button onClick={addActivity} variant="secondary">Add</Button>
            </div>

            <div className={styles.tagCloud}>
              {activities.map((act, i) => (
                <div key={i} className={styles.tag}>
                  {act}
                  <button onClick={() => setActivities(activities.filter((_, idx) => idx !== i))}>×</button>
                </div>
              ))}
            </div>
          </section>

          <div className={styles.footer}>
            <Button variant="outline" onClick={() => router.back()}>Cancel</Button>
            <Button onClick={handleCreate} isLoading={isLoading} disabled={!title}>Create Plan</Button>
          </div>
        </div>
      </div>
    </main>
  );
}
