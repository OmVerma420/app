import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../api/axios';

const initialState = {
  student: null,
  status: 'idle',
  error: null,
};

export const login = createAsyncThunk(
  'auth/login',
  async ({ referenceId, studentName }, { rejectWithValue }) => {
    try {
      const resp = await api.post('/students/login', { referenceId, studentName });
      return resp.data?.data?.student ?? null;
    } catch (err) {
      const payload =
        err?.response?.data?.error || err?.response?.data?.message || err?.message || 'Login failed';
      return rejectWithValue(payload);
    }
  }
);

export const checkLoggedIn = createAsyncThunk(
  'auth/checkLoggedIn',
  async (_, { rejectWithValue }) => {
    try {
      const resp = await api.get('/students/me');
      return resp.data?.data ?? null;
    } catch (err) {
      return rejectWithValue(null);
    }
  }
);

export const logout = createAsyncThunk('auth/logout', async (_, { rejectWithValue }) => {
  try {
    await api.post('/students/logout');
    return null;
  } catch (err) {
    return rejectWithValue('Logout failed');
  }
});

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    clearAuthError: (state) => {
      state.error = null;
      state.status = 'idle';
    },
    resetAuth: (state) => {
      state.student = null;
      state.status = 'idle';
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(login.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.student = action.payload;
      })
      .addCase(login.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      })
      .addCase(checkLoggedIn.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(checkLoggedIn.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.student = action.payload;
        state.error = null;
      })
      .addCase(checkLoggedIn.rejected, (state) => {
        state.status = 'idle';
        state.student = null;
      })
      .addCase(logout.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(logout.fulfilled, (state) => {
        state.status = 'idle';
        state.student = null;
        state.error = null;
      })
      .addCase(logout.rejected, (state) => {
        state.status = 'idle';
        state.student = null;
      });
  },
});

export const { clearAuthError, resetAuth } = authSlice.actions;
export default authSlice.reducer;
