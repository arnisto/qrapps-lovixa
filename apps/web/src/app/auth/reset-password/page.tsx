'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/Button/Button';
import { Input } from '@/components/Input/Input';
import styles from './reset-password.module.css';

import { useDispatch, useSelector } from 'react-redux';
import { setError } from '@/store/slices/authSlice';
import { RootState } from '@/store/store';
import { createClient } from '@/utils/supabase/client';
import { KeyRound, Mail, CheckCircle2 } from 'lucide-react';

export default function ResetPasswordPage() {
  const supabase = createClient();
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  
  const dispatch = useDispatch();
  const { error } = useSelector((state: RootState) => state.auth);

  const handleResetRequest = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    dispatch(setError(null));

    const { error: authError } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: window.location.origin + '/auth/update-password',
    });

    if (authError) {
      dispatch(setError(authError.message));
      setIsLoading(false);
    } else {
      setIsSubmitted(true);
      setIsLoading(false);
    }
  };

  return (
    <main className={styles.container}>
      <div className={`${styles.card} animate-fade-in`}>
        {!isSubmitted ? (
          <>
            <div className={styles.header}>
              <div className={styles.logo}>
                <KeyRound size={24} color="white" />
              </div>
              <h1 className="gradient-text">Reset Password</h1>
              <p className={styles.subtitle}>Enter your email address and we'll send you a link to reset your password.</p>
            </div>

            {error && <div className={styles.errorMessage}>{error}</div>}

            <form className={styles.form} onSubmit={handleResetRequest}>
              <Input 
                label="Email Address"
                type="email"
                placeholder="name@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />

              <Button type="submit" fullWidth isLoading={isLoading} rightIcon={<Mail size={18} />}>
                Send Reset Link
              </Button>
            </form>

            <p className={styles.footer}>
              Remember your password? <Link href="/auth/login" className={styles.link}>Sign In</Link>
            </p>
          </>
        ) : (
          <div className={styles.successState}>
            <div className={styles.successIcon}>
              <CheckCircle2 size={48} color="#10b981" />
            </div>
            <h1 className="gradient-text">Check your email</h1>
            <p className={styles.subtitle}>
              We've sent a password reset link to <strong>{email}</strong>. 
              Please check your inbox and spam folder.
            </p>
            <Button variant="secondary" fullWidth onClick={() => {
              setIsSubmitted(false);
              dispatch(setError(null));
            }}>
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
