/**
 * Document Slice - Document Management State Management
 */

import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const API_BASE_URL = 'http://localhost:5000/api';

// Async Thunks
export const fetchDocuments = createAsyncThunk(
  'documents/fetchDocuments',
  async (_, { rejectWithValue, getState }) => {
    try {
      const { auth } = getState();
      const response = await axios.get(`${API_BASE_URL}/documents`, {
        headers: {
          Authorization: `Bearer ${auth.token}`,
        },
      });

      return response.data.documents;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch documents');
    }
  }
);

export const uploadDocument = createAsyncThunk(
  'documents/uploadDocument',
  async ({ documentType, file }, { rejectWithValue, getState }) => {
    try {
      const { auth } = getState();
      const formData = new FormData();
      formData.append('document', file);
      formData.append('documentType', documentType);

      const response = await axios.post(
        `${API_BASE_URL}/documents/upload`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${auth.token}`,
            'Content-Type': 'multipart/form-data',
          },
        }
      );

      return response.data.document;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to upload document');
    }
  }
);

export const deleteDocument = createAsyncThunk(
  'documents/deleteDocument',
  async (documentId, { rejectWithValue, getState }) => {
    try {
      const { auth } = getState();
      await axios.delete(`${API_BASE_URL}/documents/${documentId}`, {
        headers: {
          Authorization: `Bearer ${auth.token}`,
        },
      });

      return documentId;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to delete document');
    }
  }
);

export const connectDigiLocker = createAsyncThunk(
  'documents/connectDigiLocker',
  async (digilockerId, { rejectWithValue, getState }) => {
    try {
      const { auth } = getState();
      const response = await axios.post(
        `${API_BASE_URL}/documents/digilocker/connect`,
        { digilockerId },
        {
          headers: {
            Authorization: `Bearer ${auth.token}`,
          },
        }
      );

      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to connect DigiLocker');
    }
  }
);

// Initial State
const initialState = {
  documents: [],
  loading: false,
  uploading: false,
  error: null,
  digilockerConnected: false,
};

// Slice
const documentSlice = createSlice({
  name: 'documents',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch Documents
      .addCase(fetchDocuments.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchDocuments.fulfilled, (state, action) => {
        state.loading = false;
        state.documents = action.payload;
      })
      .addCase(fetchDocuments.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Upload Document
      .addCase(uploadDocument.pending, (state) => {
        state.uploading = true;
        state.error = null;
      })
      .addCase(uploadDocument.fulfilled, (state, action) => {
        state.uploading = false;
        state.documents.push(action.payload);
      })
      .addCase(uploadDocument.rejected, (state, action) => {
        state.uploading = false;
        state.error = action.payload;
      })
      // Delete Document
      .addCase(deleteDocument.fulfilled, (state, action) => {
        state.documents = state.documents.filter(
          (doc) => doc._id !== action.payload
        );
      })
      // Connect DigiLocker
      .addCase(connectDigiLocker.fulfilled, (state) => {
        state.digilockerConnected = true;
      });
  },
});

export const { clearError } = documentSlice.actions;
export default documentSlice.reducer;
