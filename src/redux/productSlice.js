import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  allProducts: [],
  filteredProducts: [],
  selectedProduct: null,
};

const productSlice = createSlice({
  name: "products",
  initialState,
  reducers: {
    setProducts: (state, action) => {
      state.allProducts = action.payload;
      state.filteredProducts = action.payload;
    },
    addProduct: (state, action) => {
      state.allProducts.push(action.payload);
      state.filteredProducts.push(action.payload);
    },
    sortProducts: (state, action) => {
      if (action.payload === "top") {
        state.filteredProducts.sort((a, b) => b.rating - a.rating);
      } else if (action.payload === "low_price") {
        state.filteredProducts.sort((a, b) => a.price - b.price);
      }
    },
    selectProduct: (state, action) => {
      state.selectedProduct = action.payload;
    },
  },
});

// ✅ Export all actions, including `addProduct`
export const { setProducts, addProduct, sortProducts, selectProduct } = productSlice.actions;
export default productSlice.reducer;
