import Link from 'next/link';
import { Button } from '@/components/Button/Button';
import styles from './page.module.css';

export default function Home() {
  return (
    <main className={styles.main}>
      <div className={styles.hero}>
        <h1 className="gradient-text">Lovixa</h1>
        <p className={styles.tagline}>Decide faster. Hang out more.</p>
        
        <div className={styles.ctaGrid}>
          <Link href="/auth/login">
            <Button fullWidth>Sign In</Button>
          </Link>
          <Link href="/auth/signup">
            <Button variant="secondary" fullWidth>Create Account</Button>
          </Link>
          <Link href="/profile">
            <Button variant="outline" fullWidth>View Profile</Button>
          </Link>
          <Link href="/session/create">
            <Button variant="outline" fullWidth>New Session</Button>
          </Link>
          <Link href="/session/demo/vote">
            <Button variant="outline" fullWidth>Vote Demo</Button>
          </Link>
          <Link href="/session/demo/victory">
            <Button variant="outline" fullWidth>Victory Demo</Button>
          </Link>
        </div>
      </div>

      <div className={styles.features}>
        <div className="card">
          <h3>Ghost Vote</h3>
          <p>No login required for friends. Just swipe and decide.</p>
        </div>
        <div className="card">
          <h3>Real-time Sync</h3>
          <p>See results as they happen across all devices.</p>
        </div>
        <div className="card">
          <h3>Consensus Engine</h3>
          <p>Smart math to find the perfect choice for the group.</p>
        </div>
      </div>
    </main>
  );
}
