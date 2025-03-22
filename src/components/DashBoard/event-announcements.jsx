import "/src/assets/css/DashBoard/event-announcements.css";

export default function EventAnnouncements() {
  const events = [
    {
      id: 1,
      title: "Styloft Summer Fashion Week",
      description: "Join us for a week of runway shows, designer meetups, and exclusive collection launches.",
      date: "Jun 15-22, 2023",
      location: "New York, NY",
      image: "/placeholder.svg?height=120&width=200",
      type: "Fashion Week",
    },
    {
      id: 2,
      title: "Sustainable Fashion Summit",
      description:
        "Connect with eco-conscious designers and learn about the latest innovations in sustainable fashion.",
      date: "May 10, 2023",
      location: "Virtual Event",
      image: "/placeholder.svg?height=120&width=200",
      type: "Summit",
    },
    {
      id: 3,
      title: "Spring Collection Sale",
      description: "Enjoy up to 40% off on selected items from our spring collection. Limited time only!",
      date: "Apr 5-15, 2023",
      location: "Online",
      image: "/placeholder.svg?height=120&width=200",
      type: "Sale",
    },
  ];

  return (
    <div className="event-card">
      <div className="event-cardHeader">
        <h3 className="event-cardTitle">Event Announcements</h3>
        <button className="event-viewAllBtn">
          View All
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <line x1="7" y1="17" x2="17" y2="7"></line>
            <polyline points="7 7 17 7 17 17"></polyline>
          </svg>
        </button>
      </div>
      <div className="event-cardContent">
        <div className="event-eventList">
          {events.map((event) => (
            <div key={event.id} className="event-eventItem">
              <div className="event-eventImage">
                <img src={event.image || "/placeholder.svg"} alt={event.title} className="event-image" />
                <span className="event-eventType">{event.type}</span>
              </div>
              <div className="event-eventDetails">
                <h4 className="event-eventTitle">{event.title}</h4>
                <p className="event-eventDescription">{event.description}</p>
                <div className="event-eventInfo">
                  <div className="event-eventDate">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                      <line x1="16" y1="2" x2="16" y2="6"></line>
                      <line x1="8" y1="2" x2="8" y2="6"></line>
                      <line x1="3" y1="10" x2="21" y2="10"></line>
                    </svg>
                    <span>{event.date}</span>
                  </div>
                  <div className="event-eventLocation">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
                      <circle cx="12" cy="10" r="3"></circle>
                    </svg>
                    <span>{event.location}</span>
                  </div>
                </div>
                <button className="event-eventBtn">Learn More</button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
