import { createSlice, PayloadAction, createAsyncThunk } from '@reduxjs/toolkit';
import { createClient } from '@/utils/supabase/client';

export const fetchPlans = createAsyncThunk(
  'session/fetchPlans',
  async (_, { rejectWithValue }) => {
    const supabase = createClient();
    const { data, error } = await supabase
      .from('plans')
      .select(`
        *,
        members:members(
          *,
          user:profiles(*)
        ),
        activities:activities(*)
      `)
      .order('created_at', { ascending: false });

    if (error) return rejectWithValue(error.message);
    return data;
  }
);

export const createPlan = createAsyncThunk(
  'session/createPlan',
  async (planData: Partial<Plan>, { rejectWithValue }) => {
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) return rejectWithValue('Not authenticated');

    try {
      // Ensure profile exists (for users who signed up before trigger)
      const { data: profile } = await supabase
        .from('profiles')
        .select('id')
        .eq('id', user.id)
        .single();

      if (!profile) {
        console.log('Profile missing, creating one...');
        await supabase.from('profiles').insert({
          id: user.id,
          full_name: user.user_metadata?.full_name || user.email?.split('@')[0],
          email: user.email
        });
      }

      const { data, error } = await supabase
        .from('plans')
        .insert([{ ...planData, created_by: user.id }])
        .select()
        .single();

      if (error) {
        console.error('Supabase Plan Error Details:', {
          message: error.message,
          details: error.details,
          hint: error.hint,
          code: error.code
        });
        return rejectWithValue(error.message);
      }
      return data;
    } catch (err: any) {
      console.error('Create Plan Exception:', err);
      return rejectWithValue(err.message || 'An unknown error occurred');
    }
  }
);

export const createActivity = createAsyncThunk(
  'session/createActivity',
  async ({ planId, activityData }: { planId: string, activityData: Partial<Activity> }, { rejectWithValue }) => {
    const supabase = createClient();
    const { data, error } = await supabase
      .from('activities')
      .insert([{ ...activityData, plan_id: planId }])
      .select()
      .single();

    if (error) return rejectWithValue(error.message);
    return data;
  }
);

export const voteForActivity = createAsyncThunk(
  'session/voteForActivity',
  async ({ activityId, currentVotes }: { activityId: string, currentVotes: number }, { rejectWithValue }) => {
    const supabase = createClient();
    const { data, error } = await supabase
      .from('activities')
      .update({ votes: (currentVotes || 0) + 1 })
      .eq('id', activityId)
      .select()
      .single();

    if (error) return rejectWithValue(error.message);
    return data;
  }
);

export const toggleLike = createAsyncThunk(
  'session/toggleLike',
  async ({ targetId, targetType, isCurrentlyLiked }: { targetId: string, targetType: 'plan' | 'activity', isCurrentlyLiked: boolean }, { rejectWithValue }) => {
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return rejectWithValue('Not authenticated');

    if (isCurrentlyLiked) {
      const { error } = await supabase
        .from('likes')
        .delete()
        .eq('user_id', user.id)
        .eq('target_id', targetId);
      if (error) return rejectWithValue(error.message);
      return { targetId, targetType, liked: false };
    } else {
      const { error } = await supabase
        .from('likes')
        .insert({ user_id: user.id, target_id: targetId, target_type: targetType });
      
      if (error) {
        console.error('Like Error:', error);
        return rejectWithValue(error.message);
      }
      return { targetId, targetType, liked: true };
    }
  }
);

export const incrementView = createAsyncThunk(
  'session/incrementView',
  async ({ targetId, targetTable }: { targetId: string, targetTable: 'plans' | 'activities' }, { rejectWithValue }) => {
    const supabase = createClient();
    const { error } = await supabase.rpc('increment_view', { target_table: targetTable, row_id: targetId });
    
    if (error) {
      console.error('View Increment Error:', error);
      return rejectWithValue(error.message);
    }
    return { targetId, targetTable };
  }
);

export interface Member {
  id: string;
  name: string;
  avatar?: string;
  status: 'accepted' | 'available' | 'will_come' | 'not_coming';
  user_id?: string;
}

export interface Activity {
  id: string;
  plan_id: string;
  title: string;
  description: string;
  votes: number;
  likes: number;
  views: number;
  is_liked?: boolean;
  max_members?: number;
  location?: string;
  price?: string;
  instructions?: string;
  images?: string[];
  created_at: string;
  created_by?: string;
}

export interface Plan {
  id: string;
  title: string;
  description: string;
  location: string;
  category: string;
  members: Member[];
  activities: Activity[];
  status: 'active' | 'completed' | 'cancelled';
  views: number;
  likes: number;
  is_liked?: boolean;
  created_at: string;
  created_by: string;
}

interface SessionState {
  plans: Plan[];
  isLoading: boolean;
  error: string | null;
}

const initialState: SessionState = {
  plans: [],
  isLoading: false,
  error: null,
};

const sessionSlice = createSlice({
  name: 'session',
  initialState,
  reducers: {
    updatePlan: (state, action: PayloadAction<Plan>) => {
      const index = state.plans.findIndex(p => p.id === action.payload.id);
      if (index !== -1) {
        state.plans[index] = action.payload;
      }
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch Plans
      .addCase(fetchPlans.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchPlans.fulfilled, (state, action) => {
        state.plans = action.payload;
        state.isLoading = false;
      })
      .addCase(fetchPlans.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      // Create Plan
      .addCase(createPlan.fulfilled, (state, action) => {
        state.plans.unshift(action.payload);
      })
      // Create Activity
      .addCase(createActivity.fulfilled, (state, action) => {
        const plan = state.plans.find(p => p.id === action.payload.plan_id);
        if (plan) {
          if (!plan.activities) plan.activities = [];
          plan.activities.push(action.payload);
        }
      })
      // Vote for Activity
      .addCase(voteForActivity.fulfilled, (state, action) => {
        const updatedActivity = action.payload;
        state.plans.forEach(plan => {
          if (plan.activities) {
            const index = plan.activities.findIndex(a => a.id === updatedActivity.id);
            if (index !== -1) {
              plan.activities[index] = updatedActivity;
            }
          }
        });
      })
      // Toggle Like
      .addCase(toggleLike.fulfilled, (state, action) => {
        const { targetId, targetType, liked } = action.payload;
        if (targetType === 'plan') {
          const plan = state.plans.find(p => p.id === targetId);
          if (plan) {
            plan.is_liked = liked;
            plan.likes += liked ? 1 : -1;
          }
        } else {
          state.plans.forEach(plan => {
            if (plan.activities) {
              const activity = plan.activities.find(a => a.id === targetId);
              if (activity) {
                activity.is_liked = liked;
                activity.likes += liked ? 1 : -1;
              }
            }
          });
        }
      })
      // Increment View
      .addCase(incrementView.fulfilled, (state, action) => {
        const { targetId, targetTable } = action.payload;
        if (targetTable === 'plans') {
          const plan = state.plans.find(p => p.id === targetId);
          if (plan) plan.views += 1;
        } else {
          state.plans.forEach(plan => {
            if (plan.activities) {
              const activity = plan.activities.find(a => a.id === targetId);
              if (activity) activity.views += 1;
            }
          });
        }
      });
  },
});

export const { updatePlan } = sessionSlice.actions;
export default sessionSlice.reducer;
