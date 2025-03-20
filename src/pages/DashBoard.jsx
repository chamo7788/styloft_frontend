import DashBoardProfile from "../components/DashBoard/DashBoardProfile";
import CollaborationRequests from "../components/DashBoard/collaboration-requests";
import DesignOutfit from "../components/DashBoard/DesignOutfit";
import EventAnnouncements from "../components/DashBoard/event-announcements";
import OngoingChallenges from "../components/DashBoard/ongoing-challenges";
import PastSubmissions from "../components/DashBoard/past-submissions";
import PurchaseHistory from "../components/DashBoard/purchase-history";
import SavedDesigns from "../components/DashBoard/saved-designs";


export default function DashBoard() {
  return (
    <>
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
