// notificationSlice.js
import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  unreadCount: 0,
  notifications: [],
  loading: false,
  error: null
};

const notificationSlice = createSlice({
  name: 'notifications',
  initialState,
  reducers: {
    setUnreadCount: (state, action) => {
      state.unreadCount = action.payload;
    },
    incrementUnreadCount: (state) => {
      state.unreadCount += 1;
    },
    decrementUnreadCount: (state) => {
      state.unreadCount = Math.max(0, state.unreadCount - 1);
    },
    resetUnreadCount: (state) => {
      state.unreadCount = 0;
    },
    addNotification: (state, action) => {
      state.notifications.unshift(action.payload);
    },
    markAsRead: (state, action) => {
      const notification = state.notifications.find(
        n => n._id === action.payload
      );
      if (notification && !notification.read) {
        notification.read = true;
        state.unreadCount -= 1;
      }
    },
    deleteNotification: (state, action) => {
      const index = state.notifications.findIndex(
        n => n._id === action.payload
      );
      if (index !== -1) {
        if (!state.notifications[index].read) {
          state.unreadCount -= 1;
        }
        state.notifications.splice(index, 1);
      }
    },
    setNotifications: (state, action) => {
      state.notifications = action.payload;
      state.unreadCount = action.payload.filter(n => !n.read).length;
    }
  }
});

export const {
  setUnreadCount,
  incrementUnreadCount,
  decrementUnreadCount,
  resetUnreadCount,
  addNotification,
  markAsRead,
  deleteNotification,
  setNotifications
} = notificationSlice.actions;

export default notificationSlice.reducer;