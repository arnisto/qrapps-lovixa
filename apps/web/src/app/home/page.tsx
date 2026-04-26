'use client';

import React from 'react';
import Link from 'next/link';
import { 
  Sparkles, 
  LayoutDashboard, 
  Calendar, 
  Users, 
  Settings, 
  Plus, 
  ChevronRight,
  Eye,
  Heart,
  Bell,
  MessageCircle,
  Menu,
  X
} from 'lucide-react';
import { useSelector } from 'react-redux';
import { RootState } from '@/store/store';
import { Button } from '@/components/Button/Button';
import styles from './home.module.css';

export default function HomePage() {
  const { user } = useSelector((state: RootState) => state.auth);
  const { plans } = useSelector((state: RootState) => state.session);
  const [isSidebarOpen, setIsSidebarOpen] = React.useState(false);

  return (
    <main className={styles.container}>
      {/* Mobile Overlay */}
      <div 
        className={`${styles.overlay} ${isSidebarOpen ? styles.show : ''}`} 
        onClick={() => setIsSidebarOpen(false)}
      />

      <nav className={`${styles.sidebar} ${isSidebarOpen ? styles.open : ''}`}>
        <div className={styles.sidebarHeader}>
          <div className={styles.logo}>
            <Sparkles size={20} color="white" />
          </div>
          <span>Lovixa</span>
          <button className={styles.closeSidebar} onClick={() => setIsSidebarOpen(false)}>
            <X size={20} />
          </button>
        </div>
        
        <div className={styles.menu}>
          <div className={`${styles.menuItem} ${styles.active}`}>
            <LayoutDashboard size={18} /> Dashboard
          </div>
          <div className={styles.menuItem}>
            <Calendar size={18} /> Calendar
          </div>
          <div className={styles.menuItem}>
            <Users size={18} /> Groups
          </div>
          <div className={styles.menuItem}>
            <Settings size={18} /> Settings
          </div>
        </div>

        <div className={styles.sidebarFooter}>
          <div className={styles.userCard}>
            <div className={styles.avatar}>{user?.name?.[0] || 'U'}</div>
            <div className={styles.userInfo}>
              <p className={styles.userName}>{user?.name || 'Guest'}</p>
              <p className={styles.userEmail}>{user?.email || 'guest@example.com'}</p>
            </div>
          </div>
        </div>
      </nav>

      <div className={styles.content}>
        <header className={styles.header}>
          <div className={styles.headerInfo}>
            <button className={styles.menuToggle} onClick={() => setIsSidebarOpen(true)}>
              <Menu size={24} />
            </button>
            <div>
              <h1>Good morning, {user?.name?.split(' ')[0] || 'Friend'}!</h1>
              <p className={styles.subtitle}>You have {plans.filter(p => p.status === 'active').length} active sessions today.</p>
            </div>
          </div>
          <div className={styles.headerActions}>
            <button className={styles.actionBtn}>
              <MessageCircle size={22} />
            </button>
            <button className={styles.actionBtn}>
              <Bell size={22} />
              <span className={styles.badge}>3</span>
            </button>
            <Link href="/profile" className={styles.avatarLink}>
              <div className={styles.headerAvatar}>
                {user?.name?.[0] || 'U'}
              </div>
            </Link>
            <Link href="/session/create">
              <Button icon={<Plus size={18} />}>New Plan</Button>
            </Link>
          </div>
        </header>

        <section className={styles.statsGrid}>
          <div className={styles.statCard}>
            <p className={styles.statLabel}>Total Plans</p>
            <p className={styles.statValue}>{plans.length}</p>
          </div>
          <div className={styles.statCard}>
            <p className={styles.statLabel}>Success Rate</p>
            <p className={styles.statValue}>94%</p>
          </div>
          <div className={styles.statCard}>
            <p className={styles.statLabel}>Group Size</p>
            <p className={styles.statValue}>Avg. 6</p>
          </div>
        </section>

        <section className={styles.plansSection}>
          <div className={styles.sectionHeader}>
            <h2>Active Sessions</h2>
            <Link href="#" className={styles.seeAll}>See all</Link>
          </div>

          <div className={styles.planGrid}>
            {plans.map((plan) => (
              <div key={plan.id} className={styles.planCard}>
                <div className={styles.planStatus}>
                  <span className={`${styles.dot} ${plan.status === 'active' ? styles.active : styles.completed}`} />
                  {plan.status === 'active' ? 'Live Now' : 'Finished'}
                  <div className={styles.socialStats}>
                    <span><Eye size={12} /> {plan.views}</span>
                    <span><Heart size={12} /> {plan.likes}</span>
                  </div>
                </div>
                <h3 className={styles.planTitle}>{plan.title}</h3>
                <p className={styles.planDesc}>{plan.description}</p>
                
                <div className={styles.activityList}>
                  {plan.activities.map((act, i) => (
                    <span key={i} className={styles.activityTag}>{act.title}</span>
                  ))}
                </div>

                  <div className={styles.planFooter}>
                    <div className={styles.groupAvatars}>
                      <div className={styles.miniAvatar}>+4</div>
                    </div>
                    <Link href={`/plan/${plan.id}`}>
                      <Button variant="ghost" size="small" rightIcon={<ChevronRight size={14} />}>View Detail</Button>
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </section>
      </div>
    </main>
  );
}
