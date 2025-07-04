import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

axios.defaults.baseURL = "http://localhost:5000/api";
axios.defaults.withCredentials = true;

export const addToWishlist = createAsyncThunk(
  "wishlist/addToWishlist",
  async ({ productId, status }, { rejectWithValue, getState }) => {
    try {
      const userId = getState().user.user?.existUser?._id;
      if (!userId) throw new Error("User not logged in");

      const existingItem = getState().wishlist.wishlist.find(
        (item) => item.productId === productId
      );

      if (existingItem) {
        if (existingItem.status === status) {
          await axios.delete(`/wishlist/remove/${existingItem._id}`);
          return { productId, status: "removed" };
        } else {
          await axios.put("/wishlist/update", {
            userId,
            productId: existingItem.productId, 
            status,
          });
          return { productId, status: "updated" }; 
        }
      } else {
        const response = await axios.post("/wishlist/add", {
          userId,
          productId,
          status,
        });
        return response.data; 
      }
    } catch (error) {
      return rejectWithValue(
        error.response?.data || "Error adding to wishlist"
      );
    }
  }
);


export const getUserWishlist = createAsyncThunk(
  "wishlist/getUserWishlist",
  async (_, { rejectWithValue, getState }) => {
    try {
      const userId = getState().user.user?.existUser?._id;
      if (!userId) throw new Error("User not logged in");

      const response = await axios.get(`/wishlist/${userId}`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || "Error fetching wishlist");
    }
  }
);

export const updateWishlistStatus = createAsyncThunk(
  "wishlist/updateWishlistStatus",
  async ({ userId, productId, status }, { rejectWithValue }) => {
    try {
      const response = await axios.put("/wishlist/update", {
        userId,
        productId, 
        status,
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data || "Error updating wishlist status"
      );
    }
  }
);


export const removeFromWishlist = createAsyncThunk(
  "wishlist/removeFromWishlist",
  async (wishlistId, { rejectWithValue }) => {
    try {
      await axios.delete(`/wishlist/remove/${wishlistId}`);
      return wishlistId;
    } catch (error) {
      return rejectWithValue(
        error.response?.data || "Error removing from wishlist"
      );
    }
  }
);

const wishlistSlice = createSlice({
  name: "wishlist",
  initialState: {
    wishlist: [],
    loading: false,
    error: null,
  },
  reducers: {
    clearWishlist: (state) => {
      state.wishlist = []; 
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(addToWishlist.pending, (state) => {
        state.loading = true;
      })
      .addCase(addToWishlist.fulfilled, (state, action) => {
        state.loading = false;
        state.wishlist.push(action.payload.wishlistItem); 
      })
      .addCase(addToWishlist.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      .addCase(getUserWishlist.pending, (state) => {
        state.loading = true;
      })
      .addCase(getUserWishlist.fulfilled, (state, action) => {
        state.loading = false;
        state.wishlist = action.payload;
      })
      .addCase(getUserWishlist.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      .addCase(updateWishlistStatus.pending, (state) => {
        state.loading = true;
      })
      .addCase(updateWishlistStatus.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.wishlist.findIndex(
          (item) => item._id === action.payload.wishlistItem._id
        );
        if (index !== -1) {
          state.wishlist[index] = action.payload.wishlistItem;
        }
      })
      .addCase(updateWishlistStatus.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      .addCase(removeFromWishlist.pending, (state) => {
        state.loading = true;
      })
      .addCase(removeFromWishlist.fulfilled, (state, action) => {
        state.loading = false;
        state.wishlist = state.wishlist.filter(
          (item) => item._id !== action.payload
        );
      })
      .addCase(removeFromWishlist.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearWishlist } = wishlistSlice.actions;
export default wishlistSlice;
