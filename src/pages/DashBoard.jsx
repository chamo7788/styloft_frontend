import { useState } from "react";
import DashBoardProfile from "../components/DashBoard/DashBoardProfile";
import CollaborationRequests from "../components/DashBoard/collaboration-requests";
import DesignOutfit from "../components/DashBoard/DesignOutfit";
import EventAnnouncements from "../components/DashBoard/event-announcements";
import OngoingChallenges from "../components/DashBoard/ongoing-challenges";
import PastSubmissions from "../components/DashBoard/past-submissions";
import PurchaseHistory from "../components/DashBoard/purchase-history";
import SavedDesigns from "../components/DashBoard/saved-designs";
import { AddShopForm } from "../components/styleMarket/AddShopForm";


export default function DashBoard() {
  const [showAddShopForm, setShowAddShopForm] = useState(false);

  const handleAddMarketplaceItem = () => {
    setShowAddShopForm(true);
  };

  const handleBackToDashboard = () => {
    setShowAddShopForm(false);
  };

  if (showAddShopForm) {
    return (
      <div className="add-shop-page">
        <button 
          onClick={handleBackToDashboard} 
          className="back-button"
        >
          ← Back to Dashboard
        </button>
        <AddShopForm />
      </div>
    );
  }

  return (
    <>
      <div className="add-marketplace-button-container">
        <button 
          onClick={handleAddMarketplaceItem}
          className="add-marketplace-button"
        >
          Add Item in Marketplace
        </button>
      </div>
      <DashBoardProfile />
      <CollaborationRequests />
      <DesignOutfit />
      <EventAnnouncements />
      <OngoingChallenges />
      <PastSubmissions />
      <PurchaseHistory />
      <SavedDesigns />
    </>
  );
}
