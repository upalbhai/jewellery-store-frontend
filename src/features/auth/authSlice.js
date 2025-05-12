import { createSlice } from '@reduxjs/toolkit';

const authSlice = createSlice({
  name: 'auth',
  initialState: {
    user: null, // To store user data
    cart: [],   // To store items added to the cart
  },
  reducers: {
    setAuthData: (state, action) => {
      state.user = action.payload;
    },
    clearAuthData: (state) => {
      state.user = null;
      state.cart = [];
    },
    logout: (state) => {
      state.user = null;
      state.cart = [];
    },

    setCartData: (state, action) => {
      state.cart = action.payload; // ✅ Save cart items
    },
    removeFromCart: (state, action) => {
      const productId = action.payload;
      state.cart = state.cart.filter(item => item._id !== productId);
    },
  },
});

export const { setAuthData, clearAuthData, setCartData, logout, addToCart, removeFromCart } = authSlice.actions;
export default authSlice.reducer;
