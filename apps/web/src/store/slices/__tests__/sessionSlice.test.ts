import { describe, it, expect, vi } from 'vitest';
import sessionReducer, { updatePlan } from '../sessionSlice';

describe('sessionSlice reducer', () => {
  const initialState = {
    plans: [],
    isLoading: false,
    error: null,
  };

  it('should handle initial state', () => {
    expect(sessionReducer(undefined, { type: 'unknown' })).toEqual(initialState);
  });

  it('should handle updatePlan', () => {
    const plan = { 
      id: '1', 
      title: 'Test Plan', 
      description: 'Desc', 
      location: 'Loc', 
      category: 'Other', 
      status: 'active', 
      views: 0, 
      likes: 0, 
      created_at: '', 
      created_by: '',
      members: [],
      activities: []
    };
    const state = { ...initialState, plans: [plan] };
    const updatedPlan = { ...plan, title: 'Updated Plan' };
    const actual = sessionReducer(state, updatePlan(updatedPlan as any));
    expect(actual.plans[0].title).toBe('Updated Plan');
  });
});
