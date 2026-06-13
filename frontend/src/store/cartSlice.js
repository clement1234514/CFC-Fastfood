'use client';
import { createSlice } from '@reduxjs/toolkit';

const loadCart = () => {
  if (typeof window !== 'undefined') {
    const saved = localStorage.getItem('cfc_cart');
    return saved ? JSON.parse(saved) : [];
  }
  return [];
};

const initialState = { items: loadCart(), restaurant: 'CFC' };

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    addItem(state, action) {
      const existing = state.items.find(i => i.product_id === action.payload.product_id && i.customization === action.payload.customization);
      if (existing) {
        existing.quantity += action.payload.quantity || 1;
      } else {
        state.items.push({ ...action.payload, quantity: action.payload.quantity || 1 });
      }
      if (typeof window !== 'undefined') localStorage.setItem('cfc_cart', JSON.stringify(state.items));
    },
    removeItem(state, action) {
      state.items = state.items.filter(i => i.product_id !== action.payload.product_id || i.customization !== action.payload.customization);
      if (typeof window !== 'undefined') localStorage.setItem('cfc_cart', JSON.stringify(state.items));
    },
    updateQuantity(state, action) {
      const item = state.items.find(i => i.product_id === action.payload.product_id && i.customization === action.payload.customization);
      if (item) {
        item.quantity = action.payload.quantity;
        if (item.quantity <= 0) {
          state.items = state.items.filter(i => i !== item);
        }
      }
      if (typeof window !== 'undefined') localStorage.setItem('cfc_cart', JSON.stringify(state.items));
    },
    clearCart(state) {
      state.items = [];
      if (typeof window !== 'undefined') localStorage.removeItem('cfc_cart');
    },
  },
});

export const { addItem, removeItem, updateQuantity, clearCart } = cartSlice.actions;
export const selectCartTotal = (state) => state.cart.items.reduce((sum, i) => sum + i.price * i.quantity, 0);
export const selectCartCount = (state) => state.cart.items.reduce((sum, i) => sum + i.quantity, 0);
export default cartSlice.reducer;
