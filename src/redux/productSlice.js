import { createSlice } from "@reduxjs/toolkit";
import productsData from "../data/products.json";

const productSlice = createSlice({
  name: "products",
  initialState: {
    allProducts: [],
    filteredProducts: [],
  },
  reducers: {
    setProducts: (state, action) => {
      state.allProducts = action.payload;
      state.filteredProducts = action.payload;
    },
    sortProducts: (state, action) => {
      const order = action.payload;
      if (order === "low_price") {
        state.filteredProducts = [...state.filteredProducts].sort((a, b) => a.price - b.price);
      } else if (order === "top") {
        state.filteredProducts = [...state.filteredProducts].sort((a, b) => b.price - a.price);
      }
    },
  },
});

export const { setProducts, sortProducts } = productSlice.actions;
export default productSlice.reducer;
