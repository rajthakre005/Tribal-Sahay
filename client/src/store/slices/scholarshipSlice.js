/**
 * Scholarship Slice - Scholarship Schemes State Management
 */

import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const API_BASE_URL = 'http://localhost:5000/api';

// Async Thunks
export const fetchScholarships = createAsyncThunk(
  'scholarships/fetchScholarships',
  async (_, { rejectWithValue, getState }) => {
    try {
      const { auth } = getState();
      const response = await axios.get(`${API_BASE_URL}/scholarships`, {
        headers: {
          Authorization: `Bearer ${auth.token}`,
        },
      });

      return response.data.schemes;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch scholarships');
    }
  }
);

export const fetchScholarshipDetail = createAsyncThunk(
  'scholarships/fetchScholarshipDetail',
  async (scholarshipId, { rejectWithValue, getState }) => {
    try {
      const { auth } = getState();
      const response = await axios.get(`${API_BASE_URL}/scholarships/${scholarshipId}`, {
        headers: {
          Authorization: `Bearer ${auth.token}`,
        },
      });

      return response.data.scheme;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch scholarship');
    }
  }
);

// Initial State
const initialState = {
  scholarships: [],
  currentScholarship: null,
  loading: false,
  error: null,
};

// Slice
const scholarshipSlice = createSlice({
  name: 'scholarships',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch Scholarships
      .addCase(fetchScholarships.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchScholarships.fulfilled, (state, action) => {
        state.loading = false;
        state.scholarships = action.payload;
      })
      .addCase(fetchScholarships.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Fetch Scholarship Detail
      .addCase(fetchScholarshipDetail.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchScholarshipDetail.fulfilled, (state, action) => {
        state.loading = false;
        state.currentScholarship = action.payload;
      })
      .addCase(fetchScholarshipDetail.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearError } = scholarshipSlice.actions;
export default scholarshipSlice.reducer;
