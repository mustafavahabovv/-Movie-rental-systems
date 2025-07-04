import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

const storedUser = localStorage.getItem("user")
  ? JSON.parse(localStorage.getItem("user"))
  : null;

const initialState = {
  user: storedUser,
  users: [], 
  loading: false,
  error: null,
};

export const getAllUsers = createAsyncThunk(
  "user/getAllUsers",
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await axios.get("http://localhost:5000/api/users");
      return data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

export const setAdmin = createAsyncThunk(
  "user/setAdmin",
  async (userId, { rejectWithValue }) => {
    try {
      const { data } = await axios.post(`http://localhost:5000/api/users/admin/${userId}`);
      return { userId, updatedUser: data.user };
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

export const deleteUser = createAsyncThunk(
  "user/deleteUser",
  async (userId, { rejectWithValue }) => {
    try {
      await axios.delete(`http://localhost:5000/api/users/${userId}`);
      return userId;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

export const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setUser: (state, action) => {
      state.user = action.payload;
      localStorage.setItem("user", JSON.stringify(action.payload));
    },
    setLogout: (state) => {
      state.user = null;
      localStorage.removeItem("user");
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getAllUsers.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getAllUsers.fulfilled, (state, action) => {
        state.loading = false;
        state.users = action.payload;
      })
      .addCase(getAllUsers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      .addCase(setAdmin.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(setAdmin.fulfilled, (state, action) => {
        state.loading = false;
        const { userId, updatedUser } = action.payload;

        if (state.users.users) {
          const index = state.users.users.findIndex((user) => user._id === userId);
          if (index !== -1) {
            state.users.users[index] = updatedUser;
          }
        }
      })
      .addCase(setAdmin.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      .addCase(deleteUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteUser.fulfilled, (state, action) => {
        state.loading = false;
        const deletedUserId = action.payload;

        if (state.users.users) {
          state.users.users = state.users.users.filter((user) => user._id !== deletedUserId);
        }
      })
      .addCase(deleteUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { setUser, setLogout } = userSlice.actions;
export default userSlice;
