import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

const baseURL = "http://localhost:5000/api/products";
const initialState = {
  products: [],
  allProducts: [],
};

export const getProducts = createAsyncThunk("product/getProducts", async () => {
  const { data } = await axios.get(baseURL);
  return data;
});

export const addProduct = createAsyncThunk(
  "product/addProduct",
  async (product, { rejectWithValue }) => {
    try {
      const { data } = await axios.post(baseURL, product, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      return data;
    } catch (error) {
      console.error("Error adding product:", error.response?.data);
      return rejectWithValue(error.response?.data || "Xəta baş verdi");
    }
  }
);

export const deleteProduct = createAsyncThunk(
  "product/deleteProduct",
  async (id) => {
    await axios.delete(`${baseURL}/${id}`);
    return id;
  }
);

export const searchProduct = createAsyncThunk(
  "product/searchProduct",
  async (search, { getState }) => {
    if (search === "") {
      return getState().products.allProducts;
    }
    const { data } = await axios.get(`${baseURL}/search/${search}`);
    return data;
  }
);

export const updateProduct = createAsyncThunk(
  "product/updateProduct",
  async ({ id, updatedData }, { rejectWithValue }) => {
    try {
      const { data } = await axios.put(`${baseURL}/${id}`, updatedData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      return data;
    } catch (error) {
      console.error("Error updating product:", error.response?.data);
      return rejectWithValue(error.response?.data || "Xəta baş verdi");
    }
  }
);

export const productSlice = createSlice({
  name: "product",
  initialState,
  reducers: {
    sortProductAZ: (state) => {
      state.products = state.products.sort((a, b) =>
        a.title.localeCompare(b.title)
      );
    },
    sortProductZA: (state) => {
      state.products = state.products.sort((a, b) =>
        b.title.localeCompare(a.title)
      );
    },
  },
  extraReducers: (builder) => {
    builder.addCase(getProducts.fulfilled, (state, action) => {
      state.products = action.payload;
      state.allProducts = action.payload;
    });
    builder.addCase(addProduct.fulfilled, (state, action) => {
      state.products.push(action.payload);
    });
    builder.addCase(deleteProduct.fulfilled, (state, action) => {
      state.products = state.products.filter(
        (item) => item._id !== action.payload
      );
    });
    builder.addCase(searchProduct.fulfilled, (state, action) => {
      state.products = action.payload;
    });
    builder.addCase(updateProduct.fulfilled, (state, action) => {
      const index = state.products.findIndex(
        (product) => product._id === action.payload._id
      );
      if (index !== -1) {
        state.products[index] = action.payload;
      }
    });
  },
});

export const { sortProductAZ, sortProductZA } = productSlice.actions;

export default productSlice.reducer;
