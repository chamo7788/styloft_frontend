import { useEffect, useState } from "react"
import { useSelector, useDispatch } from "react-redux"
import { setProducts } from "../../redux/productSlice.js"
import ProductCard from "./productCard.jsx"
import BuyNow from "./buyNow.jsx"
import FilterSidebar from "./filter-sidebar.jsx"
import ShoppingCart from "./shopping-cart.jsx"
import WishlistButton from "./WishlistButton.jsx"
import ProductGallery from "./product-gallery.jsx"
import ProductReviews from "./product-reviews.jsx"
import "../../assets/css/StyleMarket/styleMarket.css"
import "../../assets/css/StyleMarket/enhanced-features.css"
import { ChevronLeft, ChevronRight, Loader2, SlidersHorizontal, ShoppingBag } from 'lucide-react'
import { TrendingCard } from "../stylesociety/TrendingCard.jsx";

const ITEMS_PER_PAGE = 8

const StyleMarket = () => {
  const dispatch = useDispatch()
  const products = useSelector((state) => state.products.filteredProducts)
  const allProducts = useSelector((state) => state.products.products)

  const [currentPage, setCurrentPage] = useState(1)
  const [selectedProduct, setSelectedProduct] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isAnimating, setIsAnimating] = useState(false)
  // New state variables for enhanced features
  const [searchTerm, setSearchTerm] = useState("")
  const [activeFilters, setActiveFilters] = useState({
    categories: [],
    priceRange: { min: 0, max: 1000 },
  })
  const [isCartOpen, setIsCartOpen] = useState(false)
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false)
  const [sortOption, setSortOption] = useState("newest")

  // Extract unique categories from products
  const categories = allProducts ? [...new Set(allProducts.map((product) => product.category))].filter(Boolean) : []

  // Updated fetch function that includes filters
  const fetchProducts = async (filters = {}, searchTerm = '', sortOption = 'newest') => {
    setIsLoading(true)
    try {
      // Build query parameters
      const params = new URLSearchParams()
      
      // Add categories if selected
      if (filters.categories && filters.categories.length > 0) {
        params.append('categories', filters.categories.join(','))
      }
      
      // Add price range if set
      if (filters.priceRange) {
        params.append('minPrice', filters.priceRange.min.toString())
        params.append('maxPrice', filters.priceRange.max.toString())
      }
      
      // Add search term if provided
      if (searchTerm) {
        params.append('search', searchTerm)
      }
      
      // Add sorting option
      params.append('sort', sortOption)
      
      // Make the fetch request with params
      const response = await fetch(`https://styloftbackendnew-production.up.railway.app/shop?${params.toString()}`)
      const data = await response.json()
      dispatch(setProducts(data))
    } catch (error) {
      console.error("Error fetching products:", error)
    } finally {
      setIsLoading(false)
    }
  }

  // Call fetchProducts with initial empty filters on component mount
  useEffect(() => {
    fetchProducts()
  }, []) // Empty dependency array to run only once on mount

  // Update products when filters, search term, or sort option changes
  useEffect(() => {
    fetchProducts(activeFilters, searchTerm, sortOption)
  }, [activeFilters, searchTerm, sortOption]) // Re-run when these dependencies change

  const indexOfLastProduct = currentPage * ITEMS_PER_PAGE
  const indexOfFirstProduct = indexOfLastProduct - ITEMS_PER_PAGE
  const currentProducts = products.slice(indexOfFirstProduct, indexOfLastProduct)
  const totalPages = Math.ceil(products.length / ITEMS_PER_PAGE)

  const handleExplore = (product) => {
    setSelectedProduct(product)
    // Scroll to top when product is selected
    window.scrollTo({ top: 0, behavior: "smooth" })
  }

  const handlePageChange = (newPage) => {
    if (newPage === currentPage) return

    setIsAnimating(true)
    setTimeout(() => {
      setCurrentPage(newPage)
      setIsAnimating(false)
    }, 300)

    // Scroll to top of product grid
    const productGrid = document.querySelector(".product-grid")
    if (productGrid) {
      productGrid.scrollIntoView({ behavior: "smooth" })
    }
  }

  const handleBackClick = () => {
    setSelectedProduct(null)
  }

  // New handlers for enhanced features
  const handleFilterChange = (filters) => {
    setActiveFilters(filters)
    // No need to call fetchProducts here as the useEffect will handle it
  }

  const handleSearch = (term) => {
    setSearchTerm(term)
    // No need to call fetchProducts here as the useEffect will handle it
  }

  const handleSortChange = (e) => {
    setSortOption(e.target.value)
    // No need to call fetchProducts here as the useEffect will handle it
  }

  const handleAddToCart = (product, size = "M", quantity = 1) => {
    // Get current cart
    const cart = JSON.parse(localStorage.getItem("shoppingCart") || "[]")

    // Check if product already in cart
    const existingItemIndex = cart.findIndex((item) => item.id === product.id && item.size === size)

    if (existingItemIndex >= 0) {
      // Update quantity if product already in cart
      cart[existingItemIndex].quantity += quantity
    } else {
      // Add new item to cart
      cart.push({
        id: product.id,
        name: product.name,
        description: product.description,
        price: product.price,
        image: product.image,
        size,
        quantity,
      })
    }

    // Save updated cart
    localStorage.setItem("shoppingCart", JSON.stringify(cart))

    // Open cart
    setIsCartOpen(true)
  }

  const toggleMobileFilter = () => {
    setIsMobileFilterOpen(!isMobileFilterOpen)
  }

  // Mock reviews data for demo
  const mockReviews = [
    {
      id: 1,
      userId: 101,
      userName: "John D.",
      rating: 5,
      date: "2023-12-15",
      comment:
        "Absolutely love this product! The quality is exceptional and it fits perfectly. Would definitely recommend to anyone looking for a stylish and comfortable option.",
      helpful: 12,
    },
    {
      id: 2,
      userId: 102,
      userName: "Sarah M.",
      rating: 4,
      date: "2023-11-28",
      comment:
        "Great product overall. The material is high quality and the design is beautiful. Took off one star because the color was slightly different than pictured.",
      helpful: 5,
    },
  ]

  return (
    <div className="style-market-page">
      {/* Only show TrendingCard when no product is selected */}
      {!selectedProduct && <TrendingCard />}
      
      <div className="container">
        {selectedProduct ? (
          <div className="product-detail-view">
            <button className="back-button" onClick={handleBackClick}>
              <ChevronLeft size={18} /> Back to Products
            </button>

            <div className="product-detail-grid">    
              <div className="product-info-container">
                <div className="product-header">

                  <div className="product-actions">
                    <button 
                      className="add-to-cart-button" 
                      onClick={() => handleAddToCart(selectedProduct)}
                    >
                      <ShoppingBag size={18} /> Add to Cart
                    </button>
                  </div>
                </div>

                <BuyNow product={selectedProduct} onBack={handleBackClick} />

                {/* Product Reviews */}
                <ProductReviews
                  productId={selectedProduct.id}
                  reviews={mockReviews}
                  averageRating={4.5}
                  totalReviews={2}
                />
              </div>
            </div>
          </div>
        ) : (
          <>
            <div className="market-header">
              <h2>New Arrivals</h2>

              <div className="market-controls">
                <button className="filter-toggle" onClick={toggleMobileFilter}>
                  <SlidersHorizontal size={18} /> Filters
                </button>

                <div className="sort-container">
                  <select className="sort-select" value={sortOption} onChange={handleSortChange}>
                    <option value="newest">Newest</option>
                    <option value="price-low">Price: Low to High</option>
                    <option value="price-high">Price: High to Low</option>
                  </select>
                </div>

                <button className="cart-button" onClick={() => setIsCartOpen(true)}>
                  <ShoppingBag size={20} />
                </button>
              </div>
            </div>

            <div className="market-content">
              <div className="market-sidebar">
                <FilterSidebar
                  onFilterChange={handleFilterChange}
                  categories={categories}
                  onSearch={handleSearch}
                  isMobileOpen={isMobileFilterOpen}
                  onMobileClose={() => setIsMobileFilterOpen(false)}
                />
              </div>

              <div className="market-main">
                {isLoading ? (
                  <div className="loading-container">
                    <Loader2 className="loading-spinner" />
                    <p>Loading products...</p>
                  </div>
                ) : (
                  <>
                    {products.length === 0 ? (
                      <div className="no-results">
                        <p>No products found matching your criteria.</p>
                        <button
                          onClick={() => {
                            setActiveFilters({
                              categories: [],
                              priceRange: { min: 0, max: 1000 },
                            })
                            setSearchTerm("")
                          }}
                          className="clear-filters-button"
                        >
                          Clear Filters
                        </button>
                      </div>
                    ) : (
                      <>
                        {/* Product Grid */}
                        <div className={`product-grid ${isAnimating ? "fade-out" : "fade-in"}`}>
                          {currentProducts.map((product) => (
                            <div key={product.id} className="product-card-wrapper">
                              <ProductCard product={product} onExplore={() => handleExplore(product)} />
                            </div>
                          ))}
                        </div>

                        {/* Pagination */}
                        {products.length > ITEMS_PER_PAGE && (
                          <div className="pagination">
                            <button
                              className="pagination-btn"
                              onClick={() => handlePageChange(currentPage - 1)}
                              disabled={currentPage === 1}
                              aria-label="Previous page"
                            >
                              <ChevronLeft size={18} />
                              <span>Previous</span>
                            </button>

                            <div className="pagination-info">
                              <span>
                                Page {currentPage} of {totalPages}
                              </span>
                            </div>

                            <button
                              className="pagination-btn"
                              onClick={() => handlePageChange(currentPage + 1)}
                              disabled={indexOfLastProduct >= products.length}
                              aria-label="Next page"
                            >
                              <span>Next</span>
                              <ChevronRight size={18} />
                            </button>
                          </div>
                        )}
                      </>
                    )}
                  </>
                )}
              </div>
            </div>
          </>
        )}
      </div>

      {/* Shopping Cart Sidebar */}
      <ShoppingCart
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        onCheckout={() => {
          setIsCartOpen(false)
          // Redirect to checkout or show checkout form
          alert("Proceeding to checkout...")
        }}
      />
    </div>
  )
}

export default StyleMarket
