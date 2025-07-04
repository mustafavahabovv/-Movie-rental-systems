// redux/store/Store.js

import { configureStore } from "@reduxjs/toolkit";
import { persistStore, persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage";

import productSlice from "../features/ProductSlice";
import basketSlice from "../features/BasketSlice";
import userSlice from "../features/userSlice";
import wishlistSlice from "../features/WishlistSlice";
import loadingSlice from "../features/LoadingSlice"; // ✅ Əlavə etdik

const persistProductConfig = {
  key: "product",
  storage,
};

const persistBasketConfig = {
  key: "basket",
  storage,
};

const persistWishlistConfig = {
  key: "wishlist",
  storage,
};

// Persisted reducerlər
const persistedProductReducer = persistReducer(
  persistProductConfig,
  productSlice
);

const persistedWishlistReducer = persistReducer(
  persistWishlistConfig,
  wishlistSlice.reducer
);

const persistedBasketReducer = persistReducer(
  persistBasketConfig,
  basketSlice
);

export const store = configureStore({
  reducer: {
    products: persistedProductReducer,
    basket: persistedBasketReducer,
    wishlist: persistedWishlistReducer,
    user: userSlice.reducer,
    loading: loadingSlice, // ✅ Yeni reducer əlavə edildi
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});

export const persistor = persistStore(store);
