'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useDispatch } from 'react-redux';
import { login } from '@/store/slices/authSlice';
import { Sparkles, LogIn, Mail } from 'lucide-react';
import { Button } from '@/components/Button/Button';
import { Input } from '@/components/Input/Input';
import styles from './login.module.css';

export default function LoginPage() {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const dispatch = useDispatch();

  const handleFakeLogin = () => {
    setIsLoading(true);
    setTimeout(() => {
      dispatch(login({
        id: 'fake-id',
        name: 'John Doe',
        email: 'john@example.com',
        avatar: 'https://i.pravatar.cc/150?u=fake'
      }));
      router.push('/home');
    }, 1000);
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

        <form className={styles.form} onSubmit={(e) => e.preventDefault()}>
          <Input 
            label="Email"
            type="email"
            placeholder="example@gmail.com"
          />
          <Input 
            label="Password"
            type="password"
            placeholder="••••••••"
          />
          
          <Link href="/auth/reset-password" className={styles.forgotPassword}>
            Forgot password?
          </Link>

          <Button fullWidth isLoading={isLoading} onClick={handleFakeLogin} rightIcon={<LogIn size={18} />}>
            Sign In
          </Button>
        </form>

        <div className={styles.divider}>
          <span>OR</span>
        </div>

        <Button variant="outline" fullWidth onClick={handleFakeLogin} icon={<Mail size={18} />}>
          Continue with Google
        </Button>

        <p className={styles.footer}>
          New to Lovixa? <Link href="/auth/signup" className={styles.link}>Create account</Link>
        </p>
      </div>
    </main>
  );
}
