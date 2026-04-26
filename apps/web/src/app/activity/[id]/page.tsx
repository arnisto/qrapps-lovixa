'use client';

import React, { use } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '@/store/store';
import { 
  MapPin, 
  Users, 
  Clock, 
  Tag, 
  ChevronLeft, 
  Heart, 
  Info,
  Banknote,
  Navigation,
  Eye
} from 'lucide-react';
import { Button } from '@/components/Button/Button';
import Link from 'next/link';
import styles from './activity.module.css';

export default function ActivityDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const { plans } = useSelector((state: RootState) => state.session);
  
  // Find the activity across all plans
  let activity = null;
  let parentPlanId = null;
  
  for (const plan of plans) {
    const found = plan.activities.find(a => a.id === id);
    if (found) {
      activity = found;
      parentPlanId = plan.id;
      break;
    }
  }

  if (!activity) {
    return (
      <div className={styles.container}>
        <p>Activity not found.</p>
        <Link href="/home">
          <Button>Back to Dashboard</Button>
        </Link>
      </div>
    );
  }

  return (
    <main className={styles.container}>
      <nav className={styles.topNav}>
        <Link href={`/plan/${parentPlanId}`} className={styles.backLink}>
          <ChevronLeft size={20} />
          <span>Back to Plan</span>
        </Link>
        <div className={styles.navActions}>
          <div className={styles.socialStats}>
            <span><Eye size={18} /> {activity.views} Views</span>
            <span><Heart size={18} /> {activity.likes} Likes</span>
          </div>
          <div className={styles.votesCount}>
            <Heart size={18} fill="var(--error)" color="var(--error)" />
            <span>{activity.votes} Votes</span>
          </div>
        </div>
      </nav>

      <div className={styles.layout}>
        <div className={styles.mainContent}>
          <div className={styles.imageGallery}>
            {activity.images && activity.images.length > 0 ? (
              activity.images.map((img, i) => <img key={i} src={img} alt={activity.title} />)
            ) : (
              <div className={styles.imagePlaceholder}>
                <Tag size={48} color="rgba(255,255,255,0.3)" />
              </div>
            )}
          </div>

          <header className={styles.header}>
            <h1 className={styles.title}>{activity.title}</h1>
            <p className={styles.description}>{activity.description}</p>
          </header>

          <section className={styles.infoGrid}>
            <div className={styles.infoCard}>
              <MapPin size={24} className={styles.icon} />
              <div className={styles.infoText}>
                <label>Location</label>
                <p>{activity.location || 'Not specified'}</p>
              </div>
            </div>
            <div className={styles.infoCard}>
              <Banknote size={24} className={styles.icon} />
              <div className={styles.infoText}>
                <label>Estimated Price</label>
                <p>{activity.price || 'Free'}</p>
              </div>
            </div>
            <div className={styles.infoCard}>
              <Users size={24} className={styles.icon} />
              <div className={styles.infoText}>
                <label>Max Members</label>
                <p>{activity.membersCount || 'Unlimited'}</p>
              </div>
            </div>
            <div className={styles.infoCard}>
              <Clock size={24} className={styles.icon} />
              <div className={styles.infoText}>
                <label>Proposed On</label>
                <p>{new Date(activity.createdAt).toLocaleDateString()}</p>
              </div>
            </div>
          </section>

          {activity.instructions && (
            <section className={styles.section}>
              <h2 className={styles.sectionTitle}>
                <Info size={20} />
                Instructions
              </h2>
              <div className={styles.instructionsBox}>
                {activity.instructions}
              </div>
            </section>
          )}
        </div>

        <aside className={styles.sidebar}>
          <div className={styles.votePanel}>
            <h2>Love this idea?</h2>
            <p>Vote for this activity to help it win the top spot in the plan!</p>
            <Button fullWidth size="large" icon={<Heart size={20} fill="currentColor" />}>
              VOTE FOR ACTIVITY
            </Button>
          </div>

          <div className={styles.locationAction}>
            <Button fullWidth variant="secondary" icon={<Navigation size={18} />}>
              Open in Maps
            </Button>
          </div>
        </aside>
      </div>
    </main>
  );
}
