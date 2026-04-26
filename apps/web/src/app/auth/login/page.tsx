'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useDispatch } from 'react-redux';
import { login, setError } from '@/store/slices/authSlice';
import { createClient } from '@/utils/supabase/client';
import { Sparkles, LogIn, Mail } from 'lucide-react';
import { Button } from '@/components/Button/Button';
import { Input } from '@/components/Input/Input';
import styles from './login.module.css';
import { useSelector } from 'react-redux';
import { RootState } from '@/store/store';

export default function LoginPage() {
  const supabase = createClient();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const dispatch = useDispatch();
  const { error } = useSelector((state: RootState) => state.auth);

  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    dispatch(setError(null));

    const { data, error: authError } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (authError) {
      dispatch(setError(authError.message));
      setIsLoading(false);
    } else if (data.user) {
      router.push('/home');
    }
  };

  const handleGoogleLogin = async () => {
    dispatch(setError(null));
    const { error: authError } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: window.location.origin + '/home'
      }
    });

    if (authError) {
      dispatch(setError(authError.message));
    }
  };

  return (
    <main className={styles.container}>
      <div className={`${styles.card} animate-slide-up`}>
        <div className={styles.header}>
          <div className={styles.logo}>
            <Sparkles size={24} color="white" />
          </div>
          <h1 className="gradient-text">Welcome back</h1>
          <p className={styles.subtitle}>Enter your details to access your group plans.</p>
        </div>

        {error && <div className={styles.errorMessage}>{error}</div>}

        <form className={styles.form} onSubmit={handleEmailLogin}>
          <Input 
            label="Email"
            type="email"
            placeholder="example@gmail.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <Input 
            label="Password"
            type="password"
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          
          <Link href="/auth/reset-password" className={styles.forgotPassword}>
            Forgot password?
          </Link>

          <Button fullWidth isLoading={isLoading} type="submit" rightIcon={<LogIn size={18} />}>
            Sign In
          </Button>
        </form>

        <div className={styles.divider}>
          <span>OR</span>
        </div>

        <Button variant="outline" fullWidth onClick={handleGoogleLogin} icon={<Mail size={18} />}>
          Continue with Google
        </Button>

        <p className={styles.footer}>
          New to Lovixa? <Link href="/auth/signup" className={styles.link}>Create account</Link>
        </p>
      </div>
    </main>
  );
}
