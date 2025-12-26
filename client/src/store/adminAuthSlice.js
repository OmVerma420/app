import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../api/axios";

const initialState = {
  admin: null,

  // auth-related
  status: "idle",   // <- only used for login/session
  error: null,

  // stats-related
  stats: null,
  statsStatus: "idle",
};

/* ================================
 ✅ ASYNC THUNKS
================================= */

// ✅ LOGIN ADMIN
export const adminLogin = createAsyncThunk(
  "admin/login",
  async ({ email, password }, { rejectWithValue }) => {
    try {
      const res = await api.post("/admin/login", { email, password });
      return res.data?.data?.admin ?? null;
    } catch (err) {
      return rejectWithValue(
        err?.response?.data?.error ||
          err?.response?.data?.message ||
          "Login failed"
      );
    }
  }
);

// ✅ CHECK IF ADMIN IS LOGGED IN
export const checkAdminLoggedIn = createAsyncThunk(
  "admin/checkLoggedIn",
  async (_, { rejectWithValue }) => {
    try {
      const res = await api.get("/admin/me");
      return res.data?.data ?? null;
    } catch (err) {
      return rejectWithValue(null);
    }
  }
);

// ✅ LOGOUT
export const adminLogout = createAsyncThunk(
  "admin/logout",
  async (_, { rejectWithValue }) => {
    try {
      await api.post("/admin/logout");
      return null;
    } catch {
      return rejectWithValue("Logout failed");
    }
  }
);

// ✅ CLC STATS (SEPARATE STATE)
export const getCLCStats = createAsyncThunk(
  "admin/getCLCStats",
  async (_, { rejectWithValue }) => {
    try {
      const res = await api.get("/admin/clc/stats");
      return res.data?.data;
    } catch (err) {
      return rejectWithValue(
        err?.response?.data?.error || "Failed to fetch stats"
      );
    }
  }
);

/* ================================
 ✅ SLICE
================================= */
const adminSlice = createSlice({
  name: "adminAuth",
  initialState,
  reducers: {
    clearAdminError: (state) => {
      state.error = null;
      state.status = "idle";
    },
    resetAdmin: (state) => {
      state.admin = null;
      state.status = "idle";
      state.error = null;
      state.stats = null;
      state.statsStatus = "idle";
    },
  },
  extraReducers: (builder) =>
    builder
      /* ✅ LOGIN */
      .addCase(adminLogin.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(adminLogin.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.admin = action.payload;
      })
      .addCase(adminLogin.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      })

      /* ✅ CHECK ADMIN EXISTS */
      .addCase(checkAdminLoggedIn.pending, (state) => {
        state.status = "loading";
      })
      .addCase(checkAdminLoggedIn.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.admin = action.payload;
      })
      .addCase(checkAdminLoggedIn.rejected, (state) => {
        state.status = "failed";
        state.admin = null;
      })

      /* ✅ LOGOUT */
      .addCase(adminLogout.pending, (state) => {
        state.status = "loading";
      })
      .addCase(adminLogout.fulfilled, (state) => {
        state.status = "idle";
        state.admin = null;
      })

      /* ✅ CLC STATS */
      .addCase(getCLCStats.pending, (state) => {
        state.statsStatus = "loading";
      })
      .addCase(getCLCStats.fulfilled, (state, action) => {
        state.statsStatus = "succeeded";
        state.stats = action.payload;
      })
      .addCase(getCLCStats.rejected, (state, action) => {
        state.statsStatus = "failed";
        state.error = action.payload;
      }),
});

export const { clearAdminError, resetAdmin } = adminSlice.actions;

export default adminSlice.reducer;
