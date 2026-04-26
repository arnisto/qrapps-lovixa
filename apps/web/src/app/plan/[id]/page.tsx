'use client';

import React, { use, useState, useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { RootState, AppDispatch } from '@/store/store';
import { voteForActivity, incrementView, toggleLike } from '@/store/slices/sessionSlice';
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
import styles from './plan.module.css';

export default function PlanDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();
  const dispatch = useDispatch<AppDispatch>();
  const { plans } = useSelector((state: RootState) => state.session);
  const plan = plans.find(p => p.id === id);
  const [sortBy, setSortBy] = useState<'votes' | 'newest'>('votes');
  const viewRecorded = useRef(false);

  useEffect(() => {
    if (plan && !viewRecorded.current) {
      dispatch(incrementView({ targetId: plan.id, targetTable: 'plans' }));
      viewRecorded.current = true;
    }
  }, [plan, dispatch]);

  const handleVote = (activityId: string, currentVotes: number) => {
    dispatch(voteForActivity({ activityId, currentVotes }));
  };

  const handleToggleLike = () => {
    if (plan) {
      dispatch(toggleLike({ 
        targetId: plan.id, 
        targetType: 'plan', 
        isCurrentlyLiked: !!plan.is_liked 
      }));
    }
  };

  const handleToggleLikeActivity = (activityId: string, isCurrentlyLiked: boolean) => {
    dispatch(toggleLike({ 
      targetId: activityId, 
      targetType: 'activity', 
      isCurrentlyLiked 
    }));
  };

  const handleRecordViewActivity = (activityId: string) => {
    dispatch(incrementView({ targetId: activityId, targetTable: 'activities' }));
  };

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
              <div className={styles.navActions}>
                <div className={styles.socialStats}>
                  <span><Eye size={18} /> {plan.views || 0} Views</span>
                  <button 
                    className={`${styles.statBtn} ${plan.is_liked ? styles.liked : ''}`}
                    onClick={handleToggleLike}
                  >
                    <Heart size={18} fill={plan.is_liked ? 'var(--error)' : 'none'} color={plan.is_liked ? 'var(--error)' : 'currentColor'} /> 
                    {plan.likes || 0} Likes
                  </button>
                </div>
                <Button variant="secondary" size="small" icon={<Share2 size={18} />}>Share</Button>
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
              {plan.activities && [...plan.activities]
                .sort((a, b) => {
                  if (sortBy === 'votes') return (b.votes || 0) - (a.votes || 0);
                  return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
                })
                .map((activity) => (
                  <div key={activity.id} className={styles.activityCard}>
                      <Link 
                        href={`/activity/${activity.id}`} 
                        className={styles.activityInfo}
                        onClick={() => handleRecordViewActivity(activity.id)}
                      >
                        <h3>{activity.title}</h3>
                        <div className={styles.activityStats}>
                          <span title="Votes"><CheckCircle2 size={12} color="var(--primary)" /> {activity.votes || 0}</span>
                          <span title="Views"><Eye size={12} /> {activity.views || 0}</span>
                          <button 
                            className={`${styles.miniLikeBtn} ${activity.is_liked ? styles.liked : ''}`}
                            onClick={(e) => {
                              e.preventDefault();
                              e.stopPropagation();
                              handleToggleLikeActivity(activity.id, !!activity.is_liked);
                            }}
                          >
                            <Heart 
                              size={12} 
                              fill={activity.is_liked ? 'var(--error)' : 'none'} 
                              color={activity.is_liked ? 'var(--error)' : 'currentColor'} 
                            /> 
                            {activity.likes || 0}
                          </button>
                        </div>
                      </Link>
                    <Button 
                      variant="outline" 
                      size="small" 
                      icon={<Heart size={16} />}
                      onClick={() => handleVote(activity.id, activity.votes || 0)}
                    >
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
              {plan.members?.map((member: any) => (
                <div key={member.id} className={styles.memberItem}>
                  <div className={styles.memberAvatar}>
                    {member.user?.avatar_url ? <img src={member.user.avatar_url} alt={member.user.full_name} /> : (member.user?.full_name?.[0] || 'U')}
                  </div>
                  <div className={styles.memberInfo}>
                    <p className={styles.memberName}>{member.user?.full_name || 'Anonymous'}</p>
                    <div className={styles.memberStatus}>
                      {getStatusIcon(member.status)}
                      <span className={styles[member.status]}>
                        {member.status?.replace('_', ' ')}
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
