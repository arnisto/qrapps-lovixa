import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface Member {
  id: string;
  name: string;
  avatar?: string;
  status: 'accepted' | 'available' | 'will_come' | 'not_coming';
}

export interface Activity {
  id: string;
  title: string;
  description: string;
  votes: number;
  likes: number;
  views: number;
  membersCount?: number;
  location?: string;
  price?: string;
  instructions?: string;
  images?: string[];
  createdAt: string;
}

export interface Plan {
  id: string;
  title: string;
  description: string;
  location: string;
  category: 'Birthday' | 'Couples Date' | 'Business' | 'Friend Gathering' | 'Other';
  members: Member[];
  activities: Activity[];
  status: 'active' | 'completed';
  views: number;
  likes: number;
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
      location: 'Paris, France',
      category: 'Couples Date',
      status: 'active',
      views: 1250,
      likes: 450,
      members: [
        { id: 'u1', name: 'John Doe', status: 'accepted' },
        { id: 'u2', name: 'Jane Smith', status: 'will_come' },
        { id: 'u3', name: 'Mike Ross', status: 'available' },
      ],
      activities: [
        { 
          id: 'a1', 
          title: 'Eiffel Tower Visit', 
          description: 'A trip to the iconic iron lattice tower on the Champ de Mars.',
          votes: 5, 
          likes: 120,
          views: 800,
          location: 'Champ de Mars, 5 Avenue Anatole France, 75007 Paris',
          price: '€25',
          createdAt: new Date().toISOString()
        },
        { 
          id: 'a2', 
          title: 'Louvre Museum', 
          description: 'Explore the world\'s largest art museum and a historic monument in Paris.',
          votes: 3, 
          likes: 85,
          views: 650,
          location: 'Rue de Rivoli, 75001 Paris',
          price: '€17',
          createdAt: new Date(Date.now() - 86400000).toISOString()
        },
        { 
          id: 'a3', 
          title: 'Seine River Cruise', 
          description: 'A relaxing boat tour along the river Seine with dinner.',
          votes: 8, 
          likes: 210,
          views: 1200,
          location: 'Port de la Bourdonnais, 75007 Paris',
          price: '€50',
          createdAt: new Date(Date.now() - 43200000).toISOString()
        },
      ]
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
