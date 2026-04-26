'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useDispatch, useSelector } from 'react-redux';
import { setError } from '@/store/slices/authSlice';
import { RootState } from '@/store/store';
import { createClient } from '@/utils/supabase/client';
import { Sparkles, UserPlus, Mail, Apple } from 'lucide-react';
import { Button } from '@/components/Button/Button';
import { Input } from '@/components/Input/Input';
import styles from './signup.module.css';

import Link from 'next/link';

export default function SignupPage() {
  const supabase = createClient();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  
  const router = useRouter();
  const dispatch = useDispatch();
  const { error } = useSelector((state: RootState) => state.auth);

  const validatePassword = (pass: string) => {
    const requirements = [
      { regex: /.{8,}/, text: 'At least 8 characters' },
      { regex: /[A-Z]/, text: 'One uppercase letter' },
      { regex: /[a-z]/, text: 'One lowercase letter' },
      { regex: /[0-9]/, text: 'One number' },
      { regex: /[^A-Za-z0-9]/, text: 'One special character' },
    ];

    return requirements.every(req => req.regex.test(pass));
  };

  const handleEmailSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validatePassword(password)) {
      dispatch(setError('Please use a stronger password (8+ chars, uppercase, lowercase, number, and special char).'));
      return;
    }

    setIsLoading(true);
    dispatch(setError(null));

    const { data, error: authError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: name,
        },
        emailRedirectTo: window.location.origin + '/auth/login'
      }
    });

    if (authError) {
      dispatch(setError(authError.message));
      setIsLoading(false);
    } else {
      setIsSuccess(true);
      setIsLoading(false);
    }
  };

  const handleGoogleSignup = async () => {
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

  if (isSuccess) {
    return (
      <main className={styles.container}>
        <div className={`${styles.card} animate-slide-up`}>
          <div className={styles.header}>
            <div className={styles.logo} style={{ background: '#10b981' }}>
              <UserPlus size={24} color="white" />
            </div>
            <h1 className="gradient-text">Verify your email</h1>
            <p className={styles.subtitle}>We've sent a magic link to <strong>{email}</strong>. Please check your inbox to complete your registration.</p>
          </div>
          <Link href="/auth/login" className={styles.backToLogin}>
            <Button fullWidth variant="secondary">Back to Login</Button>
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className={styles.container}>
      <div className={`${styles.card} animate-fade-in`}>
        <div className={styles.header}>
          <div className={styles.logo}>
            <Sparkles size={24} color="white" />
          </div>
          <h1 className="gradient-text">Create Account</h1>
          <p className={styles.subtitle}>Join Lovixa and start making group decisions without the fatigue.</p>
        </div>

        {error && <div className={styles.errorMessage}>{error}</div>}

        <form className={styles.form} onSubmit={handleEmailSignup}>
          <Input 
            label="Full Name"
            type="text"
            placeholder="John Doe"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
          <Input 
            label="Email Address"
            type="email"
            placeholder="name@example.com"
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

          <div className={styles.passwordRequirements}>
            <p className={styles.reqTitle}>Password must contain:</p>
            <div className={styles.reqGrid}>
              <span className={password.length >= 8 ? styles.met : styles.unmet}>
                {password.length >= 8 ? '✓' : '•'} 8+ characters
              </span>
              <span className={/[A-Z]/.test(password) ? styles.met : styles.unmet}>
                {/[A-Z]/.test(password) ? '✓' : '•'} Uppercase
              </span>
              <span className={/[a-z]/.test(password) ? styles.met : styles.unmet}>
                {/[a-z]/.test(password) ? '✓' : '•'} Lowercase
              </span>
              <span className={/[0-9]/.test(password) ? styles.met : styles.unmet}>
                {/[0-9]/.test(password) ? '✓' : '•'} Number
              </span>
              <span className={/[^A-Za-z0-9]/.test(password) ? styles.met : styles.unmet}>
                {/[^A-Za-z0-9]/.test(password) ? '✓' : '•'} Special char
              </span>
            </div>
          </div>

          <Button type="submit" fullWidth isLoading={isLoading} rightIcon={<UserPlus size={18} />}>
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
          <Button variant="secondary" fullWidth onClick={handleGoogleSignup} icon={<Mail size={18} />}>
            Google
          </Button>
          <Button variant="secondary" fullWidth icon={<Apple size={18} />}>
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
