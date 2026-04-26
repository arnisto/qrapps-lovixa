'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useDispatch } from 'react-redux';
import { createPlan, createActivity } from '@/store/slices/sessionSlice';
import { AppDispatch } from '@/store/store';
import { ArrowLeft, Plus, X, Check } from 'lucide-react';
import { Button } from '@/components/Button/Button';
import { Input } from '@/components/Input/Input';
import styles from './create.module.css';

export default function CreatePlanPage() {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [location, setLocation] = useState('');
  const [category, setCategory] = useState('Friend Gathering');
  const [activityInput, setActivityInput] = useState('');
  const [activities, setActivities] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const router = useRouter();
  const dispatch = useDispatch<AppDispatch>();

  const addActivity = () => {
    if (activityInput.trim()) {
      setActivities([...activities, activityInput.trim()]);
      setActivityInput('');
    }
  };

  const handleCreate = async () => {
    if (!title) return;
    setIsLoading(true);
    setError(null);
    
    try {
      console.log('Creating plan...');
      // 1. Create Plan
      const planResult = await dispatch(createPlan({
        title,
        description,
        location,
        category,
        status: 'active'
      })).unwrap();

      console.log('Plan created:', planResult.id);

      // 2. Create Activities sequentially
      if (activities.length > 0) {
        for (const actTitle of activities) {
          await dispatch(createActivity({
            planId: planResult.id,
            activityData: {
              title: actTitle,
              votes: 0,
              likes: 0,
              views: 0
            }
          })).unwrap();
        }
      }

      router.push('/home');
    } catch (err: any) {
      console.error('Submission failed:', err);
      setError(typeof err === 'string' ? err : err.message || 'Failed to create plan. Make sure database tables are created.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className={styles.container}>
      <div className={styles.topNav}>
        <button onClick={() => router.back()} className={styles.backBtn}>
          <ArrowLeft size={18} style={{ marginRight: '8px' }} />
          Back
        </button>
      </div>

      <div className={`${styles.content} animate-slide-up`}>
        <header className={styles.header}>
          <h1 className="gradient-text">Create New Plan</h1>
          <p className={styles.subtitle}>Define your vision and let the group decide the rest.</p>
        </header>

        <div className={styles.formCard}>
          {error && <div className={styles.errorMessage}>{error}</div>}
          
          <section className={styles.section}>
            <Input 
              label="Plan Title"
              placeholder="e.g., Summer Yacht Party"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
            <div className={styles.spacer} />
            <Input 
              label="Location"
              placeholder="e.g., Monaco Harbor"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
            />
            <div className={styles.spacer} />
            <div className={styles.inputGroup}>
              <label className={styles.label}>Category</label>
              <select 
                className={styles.select}
                value={category}
                onChange={(e) => setCategory(e.target.value as any)}
              >
                <option value="Birthday">Birthday</option>
                <option value="Couples Date">Couples Date</option>
                <option value="Business">Business</option>
                <option value="Friend Gathering">Friend Gathering</option>
                <option value="Other">Other</option>
              </select>
            </div>
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
                onChange={(e) => setActivityInput(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && addActivity()}
              />
              <Button onClick={addActivity} variant="secondary" icon={<Plus size={18} />}>Add</Button>
            </div>

            <div className={styles.tagCloud}>
              {activities.map((act, i) => (
                <div key={i} className={styles.tag}>
                  {act}
                  <button 
                    className={styles.tagRemove}
                    onClick={() => setActivities(activities.filter((_, idx) => idx !== i))}
                  >
                    <X size={12} />
                  </button>
                </div>
              ))}
            </div>
          </section>

          <div className={styles.footer}>
            <Button variant="outline" onClick={() => router.back()} icon={<X size={18} />}>Cancel</Button>
            <Button onClick={handleCreate} isLoading={isLoading} disabled={!title} rightIcon={<Check size={18} />}>
              Create Plan
            </Button>
          </div>
        </div>
      </div>
    </main>
  );
}
