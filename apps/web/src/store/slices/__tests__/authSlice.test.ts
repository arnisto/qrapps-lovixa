import { describe, it, expect } from 'vitest';
import authReducer, { login, logout, setError } from '../authSlice';

describe('authSlice reducer', () => {
  const initialState = {
    user: null,
    isAuthenticated: false,
    isLoading: false,
    error: null,
  };

  it('should handle initial state', () => {
    expect(authReducer(undefined, { type: 'unknown' })).toEqual(initialState);
  });

  it('should handle login', () => {
    const user = { id: '1', email: 'test@example.com', name: 'Test User' };
    const actual = authReducer(initialState, login(user));
    expect(actual.user).toEqual(user);
    expect(actual.isAuthenticated).toBe(true);
  });

  it('should handle logout', () => {
    const loggedInState = {
      user: { id: '1', email: 'test@example.com', name: 'Test User' },
      isAuthenticated: true,
      isLoading: false,
      error: null,
    };
    const actual = authReducer(loggedInState, logout());
    expect(actual.user).toBeNull();
    expect(actual.isAuthenticated).toBe(false);
  });

  it('should handle setError', () => {
    const actual = authReducer(initialState, setError('Something went wrong'));
    expect(actual.error).toBe('Something went wrong');
  });
});
