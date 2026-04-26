import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { createClient } from '@/utils/supabase/client';
import { login, logout, setLoading } from '@/store/slices/authSlice';
import { fetchPlans } from '@/store/slices/sessionSlice';
import { fetchNotifications, addNotification } from '@/store/slices/notificationSlice';

export function useAuth() {
  const dispatch = useDispatch();
  const supabase = createClient();

  useEffect(() => {
    const handleLogin = (user: any) => {
      dispatch(login({
        id: user.id,
        email: user.email || '',
        name: user.user_metadata?.full_name || user.email?.split('@')[0] || 'User',
        avatar: user.user_metadata?.avatar_url
      }));
      dispatch(fetchPlans());
      dispatch(fetchNotifications());

      // Real-time notifications listener
      const channel = supabase
        .channel(`notifications:${user.id}`)
        .on('postgres_changes', {
          event: 'INSERT',
          schema: 'public',
          table: 'notifications',
          filter: `user_id=eq.${user.id}`
        }, (payload) => {
          dispatch(addNotification(payload.new as any));
        })
        .subscribe();

      return channel;
    };

    let notificationChannel: any;

    const checkUser = async () => {
      dispatch(setLoading(true));
      const { data: { session } } = await supabase.auth.getSession();
      
      if (session?.user) {
        notificationChannel = handleLogin(session.user);
      } else {
        dispatch(logout());
      }
      dispatch(setLoading(false));
    };

    checkUser();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (notificationChannel) supabase.removeChannel(notificationChannel);
      
      if (session?.user) {
        notificationChannel = handleLogin(session.user);
      } else {
        dispatch(logout());
      }
    });

    return () => {
      subscription.unsubscribe();
      if (notificationChannel) supabase.removeChannel(notificationChannel);
    };
  }, [dispatch, supabase]);
}
