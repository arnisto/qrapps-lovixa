import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface Plan {
  id: string;
  title: string;
  description: string;
  activities: string[];
  status: 'active' | 'completed';
}

interface SessionState {
  plans: Plan[];
}

const initialState: SessionState = {
  plans: [
    { 
      id: '1', 
      title: 'Weekend in Paris', 
      description: 'A quick getaway to the city of lights.', 
      activities: ['Eiffel Tower', 'Louvre', 'Seine Cruise'],
      status: 'active'
    },
    { 
      id: '2', 
      title: 'Summer Beach Party', 
      description: 'Sun, sand, and music.', 
      activities: ['Surfing', 'Volleyball', 'Bonfire'],
      status: 'completed'
    },
  ],
};

const sessionSlice = createSlice({
  name: 'session',
  initialState,
  reducers: {
    addPlan: (state, action: PayloadAction<Plan>) => {
      state.plans.unshift(action.payload);
    },
  },
});

export const { addPlan } = sessionSlice.actions;
export default sessionSlice.reducer;
