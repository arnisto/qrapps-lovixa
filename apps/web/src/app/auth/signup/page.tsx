'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/Button/Button';
import { Input } from '@/components/Input/Input';
import styles from './signup.module.css';

export default function SignupPage() {
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    // Simulate API call
    setTimeout(() => setIsLoading(false), 2000);
  };

  return (
    <main className={styles.container}>
      <div className={`${styles.card} animate-fade-in`}>
        <div className={styles.header}>
          <h1 className="gradient-text">Create Account</h1>
          <p className={styles.subtitle}>Join Lovixa and start making group decisions without the fatigue.</p>
        </div>

        <form className={styles.form} onSubmit={handleSubmit}>
          <Input 
            label="Full Name"
            type="text"
            placeholder="John Doe"
            required
          />
          <Input 
            label="Email Address"
            type="email"
            placeholder="name@example.com"
            required
          />
          <Input 
            label="Password"
            type="password"
            placeholder="••••••••"
            required
          />

          <Button type="submit" fullWidth isLoading={isLoading}>
            Get Started
          </Button>
        </form>

        <p className={styles.terms}>
          By signing up, you agree to our <Link href="/terms" className={styles.link}>Terms</Link> and <Link href="/privacy" className={styles.link}>Privacy Policy</Link>.
        </p>

        <div className={styles.divider}>
          <span>or join with</span>
        </div>

        <div className={styles.socialGaps}>
          <Button variant="secondary" fullWidth>
            Google
          </Button>
          <Button variant="secondary" fullWidth>
            Apple
          </Button>
        </div>

        <p className={styles.footer}>
          Already have an account? <Link href="/auth/login" className={styles.link}>Sign In</Link>
        </p>
      </div>
    </main>
  );
}
