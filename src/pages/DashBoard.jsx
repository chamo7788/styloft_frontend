import { useState } from "react"
import { 
  DashBoardProfile, 
  CollaborationRequests, 
  DesignOutfit, 
  OngoingChallenges, 
  PurchaseHistory, 
  SavedDesigns 
} from "../components/DashBoard"
import { AddShopForm } from "../components/styleMarket"
import "../assets/css/DashBoard/dashboard.css"

export default function DashBoard() {
  const [showAddShopForm, setShowAddShopForm] = useState(false)

  const handleAddMarketplaceItem = () => {
    setShowAddShopForm(true)
  }

  const handleBackToDashboard = () => {
    setShowAddShopForm(false)
  }

  if (showAddShopForm) {
    return (
      <div className="add-shop-page">
        <button onClick={handleBackToDashboard} className="back-button">
          ← Back to Dashboard
        </button>
        <AddShopForm />
      </div>
    )
  }

  return (
    <div className="dashboard-container">
     

      {/* Main Content Grid */}
      <div className="dashboard-content">
        {/* Left Column - Profile and Design Tools */}
        <div className="dashboard-column main-column">
          <div className="dashboard-section">
            <DashBoardProfile />
            <div className="profile-action-container">
              <button onClick={handleAddMarketplaceItem} className="add-marketplace-button">
                Add Item in Marketplace
              </button>
            </div>
          </div>
          <div className="dashboard-section">
            <DesignOutfit />
          </div>
        </div>

        {/* Middle Column - Activity and Challenges */}
        <div className="dashboard-column">
          <div className="dashboard-section challenges-section">
            <OngoingChallenges />
          </div>
          <div className="dashboard-section">
            <CollaborationRequests />
          </div>
        </div>

        {/* Right Column - History and Events */}
        <div className="dashboard-column">
          <div className="dashboard-section">
            <PurchaseHistory />
          </div>
          <div className="dashboard-section">
            <SavedDesigns />
          </div>
        
        </div>
      </div>
    </div>
  )
}

