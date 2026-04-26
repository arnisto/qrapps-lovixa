'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useDispatch, useSelector } from 'react-redux';
import { setError } from '@/store/slices/authSlice';
import { RootState } from '@/store/store';
import { createClient } from '@/utils/supabase/client';
import { KeyRound, Lock, CheckCircle2 } from 'lucide-react';
import { Button } from '@/components/Button/Button';
import { Input } from '@/components/Input/Input';
import styles from './update-password.module.css';

export default function UpdatePasswordPage() {
  const supabase = createClient();
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  
  const router = useRouter();
  const dispatch = useDispatch();
  const { error } = useSelector((state: RootState) => state.auth);

  const handleUpdatePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (password !== confirmPassword) {
      dispatch(setError('Passwords do not match.'));
      return;
    }

    setIsLoading(true);
    dispatch(setError(null));

    const { error: authError } = await supabase.auth.updateUser({
      password: password
    });

    if (authError) {
      dispatch(setError(authError.message));
      setIsLoading(false);
    } else {
      setIsSuccess(true);
      setIsLoading(false);
      setTimeout(() => {
        router.push('/auth/login');
      }, 3000);
    }
  };

  return (
    <main className={styles.container}>
      <div className={`${styles.card} animate-fade-in`}>
        {!isSuccess ? (
          <>
            <div className={styles.header}>
              <div className={styles.logo}>
                <Lock size={24} color="white" />
              </div>
              <h1 className="gradient-text">New Password</h1>
              <p className={styles.subtitle}>Please enter your new password below to regain access to your account.</p>
            </div>

            {error && <div className={styles.errorMessage}>{error}</div>}

            <form className={styles.form} onSubmit={handleUpdatePassword}>
              <Input 
                label="New Password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <Input 
                label="Confirm New Password"
                type="password"
                placeholder="••••••••"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
              />

              <Button type="submit" fullWidth isLoading={isLoading} rightIcon={<KeyRound size={18} />}>
                Update Password
              </Button>
            </form>
          </>
        ) : (
          <div className={styles.successState}>
            <div className={styles.successIcon}>
              <CheckCircle2 size={48} color="#10b981" />
            </div>
            <h1 className="gradient-text">Password Updated</h1>
            <p className={styles.subtitle}>
              Your password has been successfully changed. 
              Redirecting you to the login page...
            </p>
          </div>
        )}
      </div>
    </main>
  );
}
