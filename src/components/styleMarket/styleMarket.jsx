import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { setProducts } from "../../redux/productSlice.js";
import ProductCard from "./productCard.jsx";
import BuyNow from "./buyNow.jsx";
import "../../assets/css/StyleMarket/styleMarket.css";

const ITEMS_PER_PAGE = 8;

const StyleMarket = () => {
  const dispatch = useDispatch();
  const products = useSelector((state) => state.products.filteredProducts);
  
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedProduct, setSelectedProduct] = useState(null);

  // ✅ Fetch products from the backend when the component loads
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch("http://localhost:3000/shop"); // Replace with actual backend URL
        const data = await response.json();
        dispatch(setProducts(data)); // Store fetched data in Redux
      } catch (error) {
        console.error("Error fetching products:", error);
      }
    };

    fetchProducts();
  }, [dispatch]);

  const indexOfLastProduct = currentPage * ITEMS_PER_PAGE;
  const indexOfFirstProduct = indexOfLastProduct - ITEMS_PER_PAGE;
  const currentProducts = products.slice(indexOfFirstProduct, indexOfLastProduct);

  const handleExplore = (product) => {
    setSelectedProduct(product);
  };

  return (
    <div className="style-market-page">
      <div className="container">
        {selectedProduct ? (
          <BuyNow product={selectedProduct} onBack={() => setSelectedProduct(null)} />
        ) : (
          <>
            <h2>New Arrivals</h2>

            {/* Product Grid */}
            <div className="product-grid">
              {currentProducts.map((product) => (
                <ProductCard 
                  key={product.id} 
                  product={product} 
                  onExplore={() => handleExplore(product)} 
                />
              ))}
            </div>

            {/* Pagination */}
            <div className="pagination">
              <button 
                className="pagination-btn" 
                onClick={() => setCurrentPage(prev => prev - 1)}
                disabled={currentPage === 1}
              >
                ← Previous
              </button>
              
              <button 
                className="pagination-btn" 
                onClick={() => setCurrentPage(prev => prev + 1)}
                disabled={indexOfLastProduct >= products.length}
              >
                Next →
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default StyleMarket;
