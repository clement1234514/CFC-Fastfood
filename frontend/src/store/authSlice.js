'use client';
import { createSlice } from '@reduxjs/toolkit';

const initialState = { user: null, token: null, loading: false };

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    loginSuccess(state, action) {
      state.user = action.payload.user;
      state.token = action.payload.token;
      if (typeof window !== 'undefined') {
        localStorage.setItem('cfc_token', action.payload.token);
        localStorage.setItem('cfc_user', JSON.stringify(action.payload.user));
      }
    },
    logout(state) {
      state.user = null;
      state.token = null;
      if (typeof window !== 'undefined') {
        localStorage.removeItem('cfc_token');
        localStorage.removeItem('cfc_user');
      }
    },
    hydrate(state) {
      if (typeof window !== 'undefined') {
        const token = localStorage.getItem('cfc_token');
        const user = localStorage.getItem('cfc_user');
        if (token && user) {
          try {
            state.token = token;
            state.user = JSON.parse(user);
          } catch (e) {}
        }
      }
    },
  },
});

export const { loginSuccess, logout, hydrate } = authSlice.actions;
export default authSlice.reducer;
