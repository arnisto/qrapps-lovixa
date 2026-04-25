'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/Button/Button';
import { Input } from '@/components/Input/Input';
import styles from './reset-password.module.css';

export default function ResetPasswordPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
      setIsSubmitted(true);
    }, 1500);
  };

  return (
    <main className={styles.container}>
      <div className={`${styles.card} animate-fade-in`}>
        {!isSubmitted ? (
          <>
            <div className={styles.header}>
              <h1 className="gradient-text">Reset Password</h1>
              <p className={styles.subtitle}>Enter your email address and we'll send you a link to reset your password.</p>
            </div>

            <form className={styles.form} onSubmit={handleSubmit}>
              <Input 
                label="Email Address"
                type="email"
                placeholder="name@example.com"
                required
              />

              <Button type="submit" fullWidth isLoading={isLoading}>
                Send Reset Link
              </Button>
            </form>

            <p className={styles.footer}>
              Remember your password? <Link href="/auth/login" className={styles.link}>Sign In</Link>
            </p>
          </>
        ) : (
          <div className={styles.successState}>
            <div className={styles.successIcon}>✓</div>
            <h1 className="gradient-text">Check your email</h1>
            <p className={styles.subtitle}>
              We've sent a password reset link to your email address. 
              Please check your inbox (and spam folder).
            </p>
            <Button variant="secondary" fullWidth onClick={() => setIsSubmitted(false)}>
              Try another email
            </Button>
            <p className={styles.footer}>
              Back to <Link href="/auth/login" className={styles.link}>Sign In</Link>
            </p>
          </div>
        )}
      </div>
    </main>
  );
}
