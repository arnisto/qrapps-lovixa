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
import { useSelector, useDispatch } from 'react-redux';
import { RootState, AppDispatch } from '@/store/store';
import { fetchPlans } from '@/store/slices/sessionSlice';
import { Button } from '@/components/Button/Button';
import styles from './home.module.css';

export default function HomePage() {
  const dispatch = useDispatch<AppDispatch>();
  const { user } = useSelector((state: RootState) => state.auth);
  const { plans, isLoading, error } = useSelector((state: RootState) => state.session);
  const [isSidebarOpen, setIsSidebarOpen] = React.useState(false);

  React.useEffect(() => {
    dispatch(fetchPlans());
  }, [dispatch]);

  const handleToggleLike = (planId: string, isCurrentlyLiked: boolean) => {
    dispatch(toggleLike({ targetId: planId, targetType: 'plan', isCurrentlyLiked }));
  };

  const handleRecordView = (planId: string) => {
    dispatch(incrementView({ targetId: planId, targetTable: 'plans' }));
  };

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
            {isLoading && [1,2,3].map(i => (
              <div key={i} className={`${styles.planCard} ${styles.skeleton}`} style={{ height: '200px' }} />
            ))}

            {!isLoading && plans.length === 0 && (
              <div className={styles.emptyState}>
                <Sparkles size={48} color="var(--border)" />
                <h3>No sessions yet</h3>
                <p>Create your first plan to start collaborating with friends.</p>
                <Link href="/session/create">
                  <Button variant="secondary" icon={<Plus size={18} />}>Create Plan</Button>
                </Link>
              </div>
            )}

            {!isLoading && plans.map((plan) => (
              <div key={plan.id} className={styles.planCard}>
                <div className={styles.planStatus}>
                  <span className={`${styles.dot} ${plan.status === 'active' ? styles.active : styles.completed}`} />
                  {plan.status === 'active' ? 'Live Now' : 'Finished'}
                  <div className={styles.socialStats}>
                    <span><Eye size={12} /> {plan.views || 0}</span>
                    <button 
                      className={`${styles.miniLikeBtn} ${plan.is_liked ? styles.liked : ''}`}
                      onClick={(e) => {
                        e.preventDefault();
                        handleToggleLike(plan.id, !!plan.is_liked);
                      }}
                    >
                      <Heart 
                        size={12} 
                        fill={plan.is_liked ? 'var(--error)' : 'none'} 
                        color={plan.is_liked ? 'var(--error)' : 'currentColor'} 
                      /> 
                      {plan.likes || 0}
                    </button>
                  </div>
                </div>
                <h3 className={styles.planTitle}>{plan.title}</h3>
                <p className={styles.planDesc}>{plan.description}</p>
                
                <div className={styles.activityList}>
                  {plan.activities?.slice(0, 3).map((act, i) => (
                    <span key={i} className={styles.activityTag}>{act.title}</span>
                  ))}
                  {(plan.activities?.length || 0) > 3 && (
                    <span className={styles.moreCount}>+{(plan.activities?.length || 0) - 3} more</span>
                  )}
                </div>
 
                <div className={styles.planFooter}>
                  <div className={styles.groupAvatars}>
                    {plan.members?.slice(0, 3).map((member, i) => (
                      <div key={i} className={styles.miniAvatar} title={member.name}>
                        {member.name?.[0] || 'U'}
                      </div>
                    ))}
                    {(plan.members?.length || 0) > 3 && (
                      <div className={styles.miniAvatar}>+{(plan.members?.length || 0) - 3}</div>
                    )}
                    {(plan.members?.length || 0) === 0 && (
                      <div className={styles.noMembers}>No members yet</div>
                    )}
                  </div>
                  <Link href={`/plan/${plan.id}`} onClick={() => handleRecordView(plan.id)}>
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
