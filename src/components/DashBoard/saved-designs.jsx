import "../../assets/css/DashBoard/saved-designs.css";

export default function SavedDesigns() {
  const designs = [
    {
      id: 1,
      title: "Vintage Inspired Blouse",
      designer: "Emma Thompson",
      image: "/placeholder.svg?height=80&width=80",
      saved: "Mar 15, 2023",
      liked: true,
    },
    {
      id: 2,
      title: "Contemporary Denim Collection",
      designer: "Marcus Lee",
      image: "/placeholder.svg?height=80&width=80",
      saved: "Mar 10, 2023",
      liked: false,
    },
    {
      id: 3,
      title: "Sustainable Activewear Set",
      designer: "Olivia Green",
      image: "/placeholder.svg?height=80&width=80",
      saved: "Mar 5, 2023",
      liked: true,
    },
  ];

  return (
    <div className="saved-design">
      <div className="card">
        <div className="cardHeader">
          <h3 className="cardTitle">Saved Designs</h3>
          <button className="viewAllBtn">
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
        <div className="cardContent">
          <div className="designList">
            {designs.map((design) => (
              <div key={design.id} className="designItem">
                <div className="designImage">
                  <img
                    src={design.image || "/placeholder.svg"}
                    alt={design.title}
                    className="image"
                  />
                </div>
                <div className="designDetails">
                  <h4 className="designTitle">{design.title}</h4>
                  <p className="designerName">by {design.designer}</p>
                  <div className="designInfo">
                    <div className="savedInfo">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="12"
                        height="12"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"></path>
                      </svg>
                      <span>Saved {design.saved}</span>
                    </div>
                    <button
                      className={`likeBtn ${design.liked ? "liked" : ""}`}
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="16"
                        height="16"
                        viewBox="0 0 24 24"
                        fill={design.liked ? "currentColor" : "none"}
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
                      </svg>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
