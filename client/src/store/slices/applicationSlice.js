/**
 * Application Slice - Scholarship Applications State Management
 */

import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const API_BASE_URL = 'http://localhost:5000/api';

// Async Thunks
export const fetchApplications = createAsyncThunk(
  'applications/fetchApplications',
  async (_, { rejectWithValue, getState }) => {
    try {
      const { auth } = getState();
      const response = await axios.get(`${API_BASE_URL}/applications`, {
        headers: {
          Authorization: `Bearer ${auth.token}`,
        },
      });

      return response.data.applications;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch applications');
    }
  }
);

export const fetchApplicationDetail = createAsyncThunk(
  'applications/fetchApplicationDetail',
  async (applicationId, { rejectWithValue, getState }) => {
    try {
      const { auth } = getState();
      const response = await axios.get(`${API_BASE_URL}/applications/${applicationId}`, {
        headers: {
          Authorization: `Bearer ${auth.token}`,
        },
      });

      return response.data.application;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch application');
    }
  }
);

export const createApplication = createAsyncThunk(
  'applications/createApplication',
  async (applicationData, { rejectWithValue, getState }) => {
    try {
      const { auth } = getState();
      const response = await axios.post(
        `${API_BASE_URL}/applications`,
        applicationData,
        {
          headers: {
            Authorization: `Bearer ${auth.token}`,
          },
        }
      );

      return response.data.application;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to create application');
    }
  }
);

export const submitApplication = createAsyncThunk(
  'applications/submitApplication',
  async (applicationId, { rejectWithValue, getState }) => {
    try {
      const { auth } = getState();
      const response = await axios.post(
        `${API_BASE_URL}/applications/${applicationId}/submit`,
        {},
        {
          headers: {
            Authorization: `Bearer ${auth.token}`,
          },
        }
      );

      return response.data.application;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to submit application');
    }
  }
);

export const fetchApplicationStatus = createAsyncThunk(
  'applications/fetchApplicationStatus',
  async (applicationId, { rejectWithValue, getState }) => {
    try {
      const { auth } = getState();
      const response = await axios.get(
        `${API_BASE_URL}/applications/${applicationId}/status`,
        {
          headers: {
            Authorization: `Bearer ${auth.token}`,
          },
        }
      );

      return response.data.statusTimeline;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch status');
    }
  }
);

// Initial State
const initialState = {
  applications: [],
  currentApplication: null,
  statusTimeline: null,
  loading: false,
  error: null,
};

// Slice
const applicationSlice = createSlice({
  name: 'applications',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    clearCurrentApplication: (state) => {
      state.currentApplication = null;
      state.statusTimeline = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch Applications
      .addCase(fetchApplications.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchApplications.fulfilled, (state, action) => {
        state.loading = false;
        state.applications = action.payload;
      })
      .addCase(fetchApplications.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Fetch Application Detail
      .addCase(fetchApplicationDetail.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchApplicationDetail.fulfilled, (state, action) => {
        state.loading = false;
        state.currentApplication = action.payload;
      })
      .addCase(fetchApplicationDetail.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Create Application
      .addCase(createApplication.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createApplication.fulfilled, (state, action) => {
        state.loading = false;
        state.applications.push(action.payload);
      })
      .addCase(createApplication.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Submit Application
      .addCase(submitApplication.pending, (state) => {
        state.loading = true;
      })
      .addCase(submitApplication.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.applications.findIndex(
          (app) => app._id === action.payload._id
        );
        if (index !== -1) {
          state.applications[index] = action.payload;
        }
      })
      .addCase(submitApplication.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Fetch Application Status
      .addCase(fetchApplicationStatus.fulfilled, (state, action) => {
        state.statusTimeline = action.payload;
      });
  },
});

export const { clearError, clearCurrentApplication } = applicationSlice.actions;
export default applicationSlice.reducer;
