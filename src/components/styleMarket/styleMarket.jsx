import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { setProducts, sortProducts } from "../../redux/productSlice.js";
import ProductCard from "./productCard.jsx";
import BuyNow from "./buyNow.jsx";
import productsData from "../../data/products.json";
import "../../assets/css/StyleMarket/styleMarket.css";

const ITEMS_PER_PAGE = 8;

const StyleMarket = () => {
  const dispatch = useDispatch();
  const products = useSelector((state) => state.products.filteredProducts);
  
  
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedProduct, setSelectedProduct] = useState(null);

  useEffect(() => {
    dispatch(setProducts(productsData));
  }, [dispatch]);

  const indexOfLastProduct = currentPage * ITEMS_PER_PAGE;
  const indexOfFirstProduct = indexOfLastProduct - ITEMS_PER_PAGE;
  const currentProducts = products.slice(indexOfFirstProduct, indexOfLastProduct);

  
  const handleExplore = (product) => {
    setSelectedProduct(product);
  };

  // Go back to product list
  const handleBack = () => {
    setSelectedProduct(null);
  };

  return (
    <div className="style-market-page">
      <div className="container">
        {selectedProduct ? (
          // Show BuyNow page when a product is selected
          <BuyNow product={selectedProduct} onBack={handleBack} />
        ) : (
          // Show Product List when no product is selected
          <>
            <h2>New Arrivals</h2>

            {/* Sorting Section */}
            <div className="sort-section">
              <span className="sort-label">
                <span className="filter-icon">⚙</span> Sort By:
              </span>
              <div className="sort-buttons">
                <button className="sort-btn" onClick={() => dispatch(sortProducts("top"))}>Top</button>
                <button className="sort-btn" onClick={() => dispatch(sortProducts("low_price"))}>Low Price</button>
              </div>
            </div>

            {/* Product Grid */}
            <div className="product-grid">
              {currentProducts.map((product) => (
                <ProductCard 
                  key={product.id} 
                  product={product} 
                  onExplore={() => handleExplore(product)} // Pass handleExplore to ProductCard
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
