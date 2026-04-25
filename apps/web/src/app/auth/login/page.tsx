'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/Button/Button';
import { Input } from '@/components/Input/Input';
import styles from './login.module.css';

export default function LoginPage() {
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
          <h1 className="gradient-text">Welcome Back</h1>
          <p className={styles.subtitle}>Log in to Lovixa to continue coordinating with your group.</p>
        </div>

        <form className={styles.form} onSubmit={handleSubmit}>
          <Input 
            label="Email Address"
            type="email"
            placeholder="name@example.com"
            required
          />
          
          <div className={styles.passwordWrapper}>
            <Input 
              label="Password"
              type="password"
              placeholder="••••••••"
              required
            />
            <Link href="/auth/reset-password" className={styles.forgotPassword}>
              Forgot password?
            </Link>
          </div>

          <Button type="submit" fullWidth isLoading={isLoading}>
            Sign In
          </Button>
        </form>

        <div className={styles.divider}>
          <span>or continue with</span>
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
          Don't have an account? <Link href="/auth/signup" className={styles.link}>Create one</Link>
        </p>
      </div>
    </main>
  );
}
