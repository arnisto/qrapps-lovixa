'use client';

import React from 'react';
import Link from 'next/link';
import { useSelector } from 'react-redux';
import { RootState } from '@/store/store';
import { Button } from '@/components/Button/Button';
import styles from './home.module.css';

export default function HomePage() {
  const { user } = useSelector((state: RootState) => state.auth);
  const { plans } = useSelector((state: RootState) => state.session);

  return (
    <main className={styles.container}>
      <nav className={styles.sidebar}>
        <div className={styles.sidebarHeader}>
          <div className={styles.logo}>L</div>
          <span>Lovixa</span>
        </div>
        
        <div className={styles.menu}>
          <div className={`${styles.menuItem} ${styles.active}`}>
            <span>🏠</span> Dashboard
          </div>
          <div className={styles.menuItem}>
            <span>📅</span> Calendar
          </div>
          <div className={styles.menuItem}>
            <span>👥</span> Groups
          </div>
          <div className={styles.menuItem}>
            <span>⚙️</span> Settings
          </div>
        </div>

        <div className={styles.sidebarFooter}>
          <div className={styles.userCard}>
            <div className={styles.avatar}>{user?.name?.[0] || 'U'}</div>
            <div className={styles.userInfo}>
              <p className={styles.userName}>{user?.name || 'Guest'}</p>
              <p className={styles.userEmail}>{user?.email || 'guest@example.com'}</p>
            </div>
          </div>
        </div>
      </nav>

      <div className={styles.content}>
        <header className={styles.header}>
          <div>
            <h1>Good morning, {user?.name?.split(' ')[0] || 'Friend'}!</h1>
            <p className={styles.subtitle}>You have {plans.filter(p => p.status === 'active').length} active sessions today.</p>
          </div>
          <Link href="/session/create">
            <Button>+ New Plan</Button>
          </Link>
        </header>

        <section className={styles.statsGrid}>
          <div className={styles.statCard}>
            <p className={styles.statLabel}>Total Plans</p>
            <p className={styles.statValue}>{plans.length}</p>
          </div>
          <div className={styles.statCard}>
            <p className={styles.statLabel}>Success Rate</p>
            <p className={styles.statValue}>94%</p>
          </div>
          <div className={styles.statCard}>
            <p className={styles.statLabel}>Group Size</p>
            <p className={styles.statValue}>Avg. 6</p>
          </div>
        </section>

        <section className={styles.plansSection}>
          <div className={styles.sectionHeader}>
            <h2>Active Sessions</h2>
            <Link href="#" className={styles.seeAll}>See all</Link>
          </div>

          <div className={styles.planGrid}>
            {plans.map((plan) => (
              <div key={plan.id} className={styles.planCard}>
                <div className={styles.planStatus}>
                  <span className={`${styles.dot} ${plan.status === 'active' ? styles.active : styles.completed}`} />
                  {plan.status === 'active' ? 'Live Now' : 'Finished'}
                </div>
                <h3 className={styles.planTitle}>{plan.title}</h3>
                <p className={styles.planDesc}>{plan.description}</p>
                
                <div className={styles.activityList}>
                  {plan.activities.map((act, i) => (
                    <span key={i} className={styles.activityTag}>{act}</span>
                  ))}
                </div>

                <div className={styles.planFooter}>
                  <div className={styles.groupAvatars}>
                    <div className={styles.miniAvatar}>+4</div>
                  </div>
                  <Button variant="ghost" size="small">View Detail</Button>
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>
    </main>
  );
}
