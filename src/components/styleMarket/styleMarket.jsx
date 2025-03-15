import { useEffect, useState } from "react"
import { useSelector, useDispatch } from "react-redux"
import { setProducts } from "../../redux/productSlice.js"
import ProductCard from "./productCard.jsx"
import BuyNow from "./buyNow.jsx"
import "../../assets/css/StyleMarket/styleMarket.css"
import { ChevronLeft, ChevronRight, Loader2 } from 'lucide-react'

const ITEMS_PER_PAGE = 8

const StyleMarket = () => {
  const dispatch = useDispatch()
  const products = useSelector((state) => state.products.filteredProducts)

  const [currentPage, setCurrentPage] = useState(1)
  const [selectedProduct, setSelectedProduct] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isAnimating, setIsAnimating] = useState(false)

  // Fetch products from the backend when the component loads
  useEffect(() => {
    const fetchProducts = async () => {
      setIsLoading(true)
      try {
        const response = await fetch("http://localhost:3000/shop") // Replace with actual backend URL
        const data = await response.json()
        dispatch(setProducts(data)) // Store fetched data in Redux
      } catch (error) {
        console.error("Error fetching products:", error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchProducts()
  }, [dispatch])

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

  return (
    <div className="style-market-page">
      <div className="container">
        {selectedProduct ? (
          <BuyNow product={selectedProduct} onBack={() => setSelectedProduct(null)} />
        ) : (
          <>
            <h2>New Arrivals</h2>

            {isLoading ? (
              <div className="loading-container">
                <Loader2 className="loading-spinner" />
                <p>Loading products...</p>
              </div>
            ) : (
              <>
                {/* Product Grid */}
                <div className={`product-grid ${isAnimating ? "fade-out" : "fade-in"}`}>
                  {currentProducts.map((product) => (
                    <ProductCard key={product.id} product={product} onExplore={() => handleExplore(product)} />
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
  )
}

export default StyleMarket
