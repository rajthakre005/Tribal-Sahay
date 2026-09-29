/**
 * Redux Store Configuration
 */

import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import applicationReducer from './slices/applicationSlice';
import scholarshipReducer from './slices/scholarshipSlice';
import documentReducer from './slices/documentSlice';
import notificationReducer from './slices/notificationSlice';

const store = configureStore({
  reducer: {
    auth: authReducer,
    applications: applicationReducer,
    scholarships: scholarshipReducer,
    documents: documentReducer,
    notifications: notificationReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ['persist/PERSIST'],
      },
    }),
});

export default store;
