"use client"

import { useEffect, useRef, useState } from "react"
import { Search, Plus, Award, Loader } from "lucide-react"
import { Link } from "react-router-dom"
import "../../assets/css/contest/contest.css"
import ContestCards from "./ContestCard"

const Button = ({ children, className, onClick, icon: Icon }) => (
  <button className={`contest-button ${className}`} onClick={onClick}>
    {Icon && <Icon className="button-icon" size={18} />}
    <span>{children}</span>
  </button>
)

const DesignContestPage = () => {
  const [contests, setContests] = useState([])
  const [isBannerFixed, setIsBannerFixed] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [isLoading, setIsLoading] = useState(true)
  const contestCardsRef = useRef(null)
  const searchInputRef = useRef(null)

  const fetchContests = async (query = "") => {
    setIsLoading(true)
    try {
      const url = query ? `http://localhost:3000/contest/search?query=${query}` : "http://localhost:3000/contest"
      const response = await fetch(url)
      if (!response.ok) {
        throw new Error("Failed to fetch contests")
      }
      const data = await response.json()
      setContests(data)
    } catch (error) {
      console.error("Error fetching contests:", error)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchContests()
  }, [])

  useEffect(() => {
    const handleScroll = () => {
      if (contestCardsRef.current) {
        const rect = contestCardsRef.current.getBoundingClientRect()
        if (rect.top <= 0) {
          setIsBannerFixed(true)
        } else {
          setIsBannerFixed(false)
        }
      }
    }

    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  const handleSearchChange = (event) => {
    const query = event.target.value
    setSearchQuery(query)
    fetchContests(query)
  }

  const focusSearch = () => {
    if (searchInputRef.current) {
      searchInputRef.current.focus()
    }
  }

  return (
    <div className="contest-page">
      <div className={`contest-banner-container ${isBannerFixed ? "fixed" : ""}`}>
        <header className="contest-banner">
          <div className="contest-banner-content">
            <h1 className="contest-banner-title">DESIGN CONTEST</h1>
            <p className="contest-banner-subtitle">Unleash your creativity, design your legacy!</p>
            {!localStorage.getItem("authToken") && (
              <Button className="contest-signup-button" onClick={() => (window.location.href = "/register")}>
                SIGN UP
              </Button>
            )}
          </div>
          <div className="contest-banner-decoration">
            <Award size={120} className="contest-banner-icon" />
          </div>
        </header>
      </div>

      <div className="contest-controls">
        <div className="contest-search-container" onClick={focusSearch}>
          <Search className="contest-search-icon" />
          <input
            ref={searchInputRef}
            type="text"
            placeholder="Search for contests..."
            className="contest-search-input"
            value={searchQuery}
            onChange={handleSearchChange}
          />
          {searchQuery && (
            <button
              className="contest-search-clear"
              onClick={() => {
                setSearchQuery("")
                fetchContests("")
              }}
            >
              ×
            </button>
          )}
        </div>

        <Link to="/contest/add-contest" className="contest-add-button">
          <Plus size={18} />
          <span>Create Contest</span>
        </Link>
      </div>

      <div className="contest-content" ref={contestCardsRef}>
        {isLoading ? (
          <div className="contest-loading">
            <Loader className="contest-loading-icon" />
            <p>Loading contests...</p>
          </div>
        ) : (
          <ContestCards contests={contests} />
        )}
      </div>
    </div>
  )
}

export default DesignContestPage

