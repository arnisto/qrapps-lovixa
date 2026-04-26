'use client';

import React from 'react';
import Link from 'next/link';
import { 
  Sparkles, 
  Layers, 
  Camera, 
  Trash2, 
  Save, 
  RotateCcw, 
  Key, 
  ShieldCheck, 
  UserX 
} from 'lucide-react';
import { Button } from '@/components/Button/Button';
import { Input } from '@/components/Input/Input';
import styles from './profile.module.css';

export default function ProfilePage() {
  return (
    <main className={styles.container}>
      <nav className={styles.nav}>
        <Link href="/" className={styles.logo}>
          <Sparkles size={20} className={styles.logoIcon} />
          <span className="gradient-text">Lovixa</span>
        </Link>
        <div className={styles.navActions}>
          <Button variant="ghost" icon={<Layers size={18} />}>My Sessions</Button>
          <div className={styles.avatarMini}>JD</div>
        </div>
      </nav>

      <div className={`${styles.content} animate-fade-in`}>
        <header className={styles.header}>
          <h1 className="gradient-text">Profile Settings</h1>
          <p className={styles.subtitle}>Manage your personal information and account preferences.</p>
        </header>

        <section className={styles.section}>
          <div className={styles.profileHero}>
            <div className={styles.avatarLarge}>JD</div>
            <div className={styles.heroActions}>
              <Button size="small" icon={<Camera size={14} />}>Change Avatar</Button>
              <Button variant="ghost" size="small" icon={<Trash2 size={14} />}>Remove</Button>
            </div>
          </div>

          <div className={styles.formGrid}>
            <Input 
              label="Full Name"
              defaultValue="John Doe"
            />
            <Input 
              label="Email Address"
              defaultValue="john@example.com"
              disabled
            />
            <div className={styles.fullWidth}>
              <Input 
                label="Bio"
                placeholder="Tell your group a bit about yourself..."
                defaultValue="I'm always down for a good rooftop bar or a cozy coffee spot."
              />
            </div>
          </div>

          <div className={styles.actions}>
            <Button icon={<Save size={18} />}>Save Changes</Button>
            <Button variant="outline" icon={<RotateCcw size={18} />}>Discard</Button>
          </div>
        </section>

        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>Account Security</h2>
          <div className={styles.securityRow}>
            <div>
              <p className={styles.securityLabel}>Password</p>
              <p className={styles.securityValue}>Last changed 3 months ago</p>
            </div>
            <Button variant="secondary" icon={<Key size={18} />}>Change Password</Button>
          </div>
          <div className={styles.securityRow}>
            <div>
              <p className={styles.securityLabel}>Two-Factor Authentication</p>
              <p className={styles.securityValue}>Disabled</p>
            </div>
            <Button variant="secondary" icon={<ShieldCheck size={18} />}>Enable 2FA</Button>
          </div>
        </section>

        <footer className={styles.dangerZone}>
          <h2 className={styles.dangerTitle}>Danger Zone</h2>
          <p className={styles.dangerText}>Once you delete your account, there is no going back. Please be certain.</p>
          <Button variant="outline" className={styles.deleteButton} icon={<UserX size={18} />}>Delete Account</Button>
        </footer>
      </div>
    </main>
  );
}
