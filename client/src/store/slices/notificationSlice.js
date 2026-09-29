/**
 * Notification Slice - Notifications State Management
 */

import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const API_BASE_URL = 'http://localhost:5000/api';

// Async Thunks
export const fetchNotifications = createAsyncThunk(
  'notifications/fetchNotifications',
  async ({ unreadOnly = false } = {}, { rejectWithValue, getState }) => {
    try {
      const { auth } = getState();
      const response = await axios.get(`${API_BASE_URL}/notifications`, {
        headers: {
          Authorization: `Bearer ${auth.token}`,
        },
        params: { unreadOnly },
      });

      return response.data.notifications;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch notifications');
    }
  }
);

export const markAsRead = createAsyncThunk(
  'notifications/markAsRead',
  async (notificationId, { rejectWithValue, getState }) => {
    try {
      const { auth } = getState();
      await axios.put(
        `${API_BASE_URL}/notifications/${notificationId}/read`,
        {},
        {
          headers: {
            Authorization: `Bearer ${auth.token}`,
          },
        }
      );

      return notificationId;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to mark as read');
    }
  }
);

export const markAllAsRead = createAsyncThunk(
  'notifications/markAllAsRead',
  async (_, { rejectWithValue, getState }) => {
    try {
      const { auth } = getState();
      await axios.put(
        `${API_BASE_URL}/notifications/read-all`,
        {},
        {
          headers: {
            Authorization: `Bearer ${auth.token}`,
          },
        }
      );

      return true;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to mark all as read');
    }
  }
);

// Initial State
const initialState = {
  notifications: [],
  unreadCount: 0,
  loading: false,
  error: null,
};

// Slice
const notificationSlice = createSlice({
  name: 'notifications',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    addNotification: (state, action) => {
      state.notifications.unshift(action.payload);
      state.unreadCount += 1;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch Notifications
      .addCase(fetchNotifications.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchNotifications.fulfilled, (state, action) => {
        state.loading = false;
        state.notifications = action.payload;
        state.unreadCount = action.payload.filter((n) => !n.read).length;
      })
      .addCase(fetchNotifications.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Mark As Read
      .addCase(markAsRead.fulfilled, (state, action) => {
        const notification = state.notifications.find(
          (n) => n._id === action.payload
        );
        if (notification && !notification.read) {
          notification.read = true;
          state.unreadCount = Math.max(0, state.unreadCount - 1);
        }
      })
      // Mark All As Read
      .addCase(markAllAsRead.fulfilled, (state) => {
        state.notifications.forEach((n) => {
          n.read = true;
        });
        state.unreadCount = 0;
      });
  },
});

export const { clearError, addNotification } = notificationSlice.actions;
export default notificationSlice.reducer;
