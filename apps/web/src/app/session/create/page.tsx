'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useDispatch } from 'react-redux';
import { addPlan } from '@/store/slices/sessionSlice';
import { ArrowLeft, Plus, X, Check } from 'lucide-react';
import { Button } from '@/components/Button/Button';
import { Input } from '@/components/Input/Input';
import styles from './create.module.css';

export default function CreatePlanPage() {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [location, setLocation] = useState('');
  const [category, setCategory] = useState<'Birthday' | 'Couples Date' | 'Business' | 'Friend Gathering' | 'Other'>('Friend Gathering');
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
        location,
        category,
        status: 'active',
        members: [
          { id: 'me', name: 'John Doe (You)', status: 'accepted' }
        ],
        activities: activities.map((a, i) => ({
          id: `a-${i}`,
          title: a,
          votes: 0
        }))
      }));
      router.push('/home');
    }, 1500);
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
