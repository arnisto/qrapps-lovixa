'use client';

import React from 'react';
import Link from 'next/link';
import { Rocket, Sparkles, ArrowRight, Plus, LogIn } from 'lucide-react';
import { Button } from '@/components/Button/Button';
import styles from './page.module.css';

export default function LandingPage() {
  return (
    <main className={styles.container}>
      <nav className={styles.nav}>
        <div className={styles.logoRow}>
          <div className={styles.logo}>
            <Sparkles size={20} color="white" />
          </div>
          <span>Lovixa</span>
        </div>
        <div className={styles.navLinks}>
          <Link href="/auth/login">Login</Link>
          <Link href="/auth/signup">
            <Button size="small" rightIcon={<ArrowRight size={14} />}>Get Started</Button>
          </Link>
        </div>
      </nav>

      <section className={styles.hero}>
        <div className={styles.badge}>
          <Rocket size={14} style={{ marginRight: '6px' }} />
          v1.0 is now live
        </div>
        <h1 className={styles.title}>
          Group decisions, <br />
          <span className="gradient-text">minus the fatigue.</span>
        </h1>
        <p className={styles.subtitle}>
          The coordination layer for groups. Create plans, invite friends, and reach consensus with zero friction.
        </p>
        
        <div className={styles.ctaRow}>
          <Link href="/auth/signup">
            <Button size="large" icon={<Plus size={20} />}>Create Your First Plan</Button>
          </Link>
          <Link href="/auth/login">
            <Button variant="outline" size="large" icon={<LogIn size={20} />}>Sign In</Button>
          </Link>
        </div>
      </section>

      <section className={styles.preview}>
        <div className={styles.previewCard}>
          <div className={styles.previewHeader}>
            <div className={styles.previewDot} />
            <div className={styles.previewDot} />
            <div className={styles.previewDot} />
          </div>
          <div className={styles.previewBody}>
            <div className={styles.skeletonLine} style={{ width: '40%' }} />
            <div className={styles.skeletonGrid}>
              <div className={styles.skeletonBox} />
              <div className={styles.skeletonBox} />
              <div className={styles.skeletonBox} />
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
