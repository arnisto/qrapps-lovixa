'use client';

import React, { use } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '@/store/store';
import { 
  MapPin, 
  Users, 
  Calendar, 
  ChevronLeft, 
  Share2, 
  Plus, 
  Heart,
  CheckCircle2,
  Clock,
  UserCheck,
  UserX,
  ListFilter,
  Eye
} from 'lucide-react';
import { Button } from '@/components/Button/Button';
import Link from 'next/link';
import styles from './plan.module.css';

export default function PlanDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const { plans } = useSelector((state: RootState) => state.session);
  const plan = plans.find(p => p.id === id);
  const [sortBy, setSortBy] = React.useState<'votes' | 'newest'>('votes');

  if (!plan) {
    return (
      <div className={styles.container}>
        <p>Plan not found.</p>
        <Link href="/home">
          <Button>Back to Dashboard</Button>
        </Link>
      </div>
    );
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'accepted': return <CheckCircle2 size={16} className={styles.statusAccepted} />;
      case 'will_come': return <UserCheck size={16} className={styles.statusWillCome} />;
      case 'available': return <Clock size={16} className={styles.statusAvailable} />;
      case 'not_coming': return <UserX size={16} className={styles.statusNotComing} />;
      default: return null;
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'Birthday': return '#f59e0b';
      case 'Couples Date': return '#ec4899';
      case 'Business': return '#3b82f6';
      case 'Friend Gathering': return '#7c3aed';
      default: return '#64748b';
    }
  };

  return (
    <main className={styles.container}>
      <nav className={styles.topNav}>
        <Link href="/home" className={styles.backLink}>
          <ChevronLeft size={20} />
          <span>Back to Dashboard</span>
        </Link>
        <Button variant="outline" size="small" icon={<Share2 size={16} />}>Share Plan</Button>
      </nav>

      <div className={styles.layout}>
        <div className={styles.mainContent}>
          <header className={styles.header}>
            <div className={styles.headerTop}>
              <span 
                className={styles.categoryBadge} 
                style={{ backgroundColor: `${getCategoryColor(plan.category)}20`, color: getCategoryColor(plan.category) }}
              >
                {plan.category}
              </span>
              <span className={`${styles.statusBadge} ${plan.status === 'active' ? styles.live : styles.done}`}>
                {plan.status === 'active' ? 'Live Now' : 'Completed'}
              </span>
            </div>
            <h1 className={styles.title}>{plan.title}</h1>
            <div className={styles.metaRow}>
              <div className={styles.metaItem}>
                <MapPin size={18} />
                <span>{plan.location}</span>
              </div>
              <div className={styles.metaItem}>
                <Calendar size={18} />
                <span>Today, 8:00 PM</span>
              </div>
              <div className={styles.metaStats}>
                <span><Eye size={16} /> {plan.views}</span>
                <span><Heart size={16} /> {plan.likes}</span>
              </div>
            </div>
          </header>

          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>About this Plan</h2>
            <p className={styles.description}>{plan.description}</p>
          </section>

          <section className={styles.section}>
            <div className={styles.sectionHeader}>
              <h2 className={styles.sectionTitle}>Proposed Activities</h2>
              <div className={styles.sortContainer}>
                <ListFilter size={16} color="var(--text-muted)" />
                <select 
                  className={styles.sortSelect} 
                  value={sortBy} 
                  onChange={(e) => setSortBy(e.target.value as any)}
                >
                  <option value="votes">Best Loved</option>
                  <option value="newest">Newest First</option>
                </select>
              </div>
            </div>
            <div className={styles.activityList}>
              {[...plan.activities]
                .sort((a, b) => {
                  if (sortBy === 'votes') return b.votes - a.votes;
                  return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
                })
                .map((activity) => (
                  <div key={activity.id} className={styles.activityCard}>
                    <Link href={`/activity/${activity.id}`} className={styles.activityInfo}>
                      <h3>{activity.title}</h3>
                      <div className={styles.activityStats}>
                        <span><Heart size={12} fill="var(--error)" color="var(--error)" /> {activity.votes}</span>
                        <span><Eye size={12} /> {activity.views}</span>
                        <span><Heart size={12} /> {activity.likes}</span>
                      </div>
                    </Link>
                    <Button variant="outline" size="small" icon={<Heart size={16} />}>
                      Vote
                    </Button>
                  </div>
                ))}
              <Link href={`/plan/${plan.id}/activity/create`} className={styles.addActivityBtn}>
                <Plus size={20} />
                <span>Suggest an Activity</span>
              </Link>
            </div>
          </section>
        </div>

        <aside className={styles.sidebar}>
          <section className={styles.section}>
            <div className={styles.sectionHeader}>
              <h2 className={styles.sectionTitle}>Members</h2>
              <span className={styles.badge}>{plan.members.length}</span>
            </div>
            <div className={styles.memberList}>
              {plan.members.map((member) => (
                <div key={member.id} className={styles.memberItem}>
                  <div className={styles.memberAvatar}>
                    {member.avatar ? <img src={member.avatar} alt={member.name} /> : member.name[0]}
                  </div>
                  <div className={styles.memberInfo}>
                    <p className={styles.memberName}>{member.name}</p>
                    <div className={styles.memberStatus}>
                      {getStatusIcon(member.status)}
                      <span className={styles[member.status]}>
                        {member.status.replace('_', ' ')}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
              <Button fullWidth variant="secondary" icon={<Plus size={18} />}>Invite Friends</Button>
            </div>
          </section>

          <div className={styles.planVoting}>
            <h3>Vote for this Plan?</h3>
            <p>If you prefer this plan over others in the group.</p>
            <div className={styles.voteActions}>
              <Button fullWidth icon={<Heart size={18} />}>YES, I WANT THIS</Button>
            </div>
          </div>
        </aside>
      </div>
    </main>
  );
}
