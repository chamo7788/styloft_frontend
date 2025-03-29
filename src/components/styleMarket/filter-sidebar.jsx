import React, { useState, useEffect } from "react"
import { Search, X } from "lucide-react"

const FilterSidebar = ({
  onFilterChange,
  categories,
  onSearch,
  isMobileOpen,
  onMobileClose,
}) => {
  const [filters, setFilters] = useState({
    categories: [],
    priceRange: { min: 0, max: 1000 },
  })
  const [searchTerm, setSearchTerm] = useState("")
  const [priceMin, setPriceMin] = useState("0")
  const [priceMax, setPriceMax] = useState("1000")

  const handleCategoryChange = (category) => {
    const newCategories = filters.categories.includes(category)
      ? filters.categories.filter((c) => c !== category)
      : [...filters.categories, category]

    setFilters({
      ...filters,
      categories: newCategories,
    })
  }

  const handlePriceChange = () => {
    const min = Number.parseInt(priceMin) || 0
    const max = Number.parseInt(priceMax) || 1000

    setFilters({
      ...filters,
      priceRange: { min, max },
    })
  }

  const handleSearch = (e) => {
    e.preventDefault()
    onSearch(searchTerm)
  }

  const clearFilters = () => {
    setFilters({
      categories: [],
      priceRange: { min: 0, max: 1000 },
    })
    setPriceMin("0")
    setPriceMax("1000")
    setSearchTerm("")
    onSearch("")
  }

  useEffect(() => {
    onFilterChange(filters)
  }, [filters, onFilterChange])

  const sidebarClasses = `filter-sidebar ${isMobileOpen ? "mobile-open" : ""}`

  return (
    <div className={sidebarClasses}>
      <div className="filter-header">
        <h3>Filters</h3>
        <button className="clear-filters" onClick={clearFilters}>
          Clear All
        </button>
        <button className="mobile-close" onClick={onMobileClose}>
          <X size={20} />
        </button>
      </div>

      <div className="search-container">
        <form onSubmit={handleSearch}>
          <div className="search-input-wrapper">
            <input
              type="text"
              placeholder="Search products..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="search-input"
            />
            <button type="submit" className="search-button">
              <Search size={18} />
            </button>
          </div>
        </form>
      </div>

      <div className="filter-section">
        <h4>Categories</h4>
        <div className="category-options">
          {categories.map((category) => (
            <label key={category} className="category-checkbox">
              <input
                type="checkbox"
                checked={filters.categories.includes(category)}
                onChange={() => handleCategoryChange(category)}
              />
              <span className="checkbox-label">{category}</span>
            </label>
          ))}
        </div>
      </div>

      <div className="filter-section">
        <h4>Price Range</h4>
        <div className="price-inputs">
          <div className="price-input-group">
            <span className="currency">$</span>
            <input
              type="number"
              placeholder="Min"
              value={priceMin}
              onChange={(e) => setPriceMin(e.target.value)}
              min="0"
            />
          </div>
          <span className="price-separator">-</span>
          <div className="price-input-group">
            <span className="currency">$</span>
            <input
              type="number"
              placeholder="Max"
              value={priceMax}
              onChange={(e) => setPriceMax(e.target.value)}
              min="0"
            />
          </div>
          <button className="apply-price" onClick={handlePriceChange}>
            Apply
          </button>
        </div>
      </div>
    </div>
  )
}

export default FilterSidebar