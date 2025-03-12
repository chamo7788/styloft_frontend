import React, { useState } from "react";
import { Search } from "lucide-react";
import "../../assets/css/StyleSociety/styleSearchBar.css";

// Importing images correctly
import trend1 from "../../assets/images/avatar1.jpg";
import trend2 from "../../assets/images/avatar2.jpg";
import trend3 from "../../assets/images/avatar3.jpg";

const trendCards = [
    { id: 1, image: trend1, title: "Unlimited" },
    { id: 2, image: trend2, title: "Exclusive Offer" },
    { id: 3, image: trend3, title: "Limited Time Deal" },
];

export function StyleSearchBar() {
    const [searchQuery, setSearchQuery] = useState("");

    const handleSearchChange = (event) => {
        setSearchQuery(event.target.value);
    };

    return (
        <div className="stylesearch-container">
            {/* Search Bar */}
            <div className="stylesearch-bar">
                <input 
                    type="text" 
                    placeholder="Search Designers"  
                    className="stylesearch-input" 
                    value={searchQuery} 
                    onChange={handleSearchChange}
                    aria-label="Search Designers"
                />
                <Search className="stylesearch-icon" />
            </div>

//             {/* Section Title */}
//             <h1 className="styletop-projects">Top Projects You May Like</h1>
//             <p className="stylesubtitle">These projects are highly rated by other clients</p>

//             {/* Trend Cards */}
//             <div className="trend-card-container">
//                 {trendCards.map((card) => (
//                     <div key={card.id} className="trend-card">
//                         <img src={card.image} alt={card.title} className="trend-card-image" />
//                         <div className="trend-card-content">
//                             <h3>{card.title}</h3>
//                             <p className="discount">{card.discount}</p>
//                             <span className="brand">{card.brand}</span>
                            
//                         </div>
//                     </div>
//                 ))}
//             </div>
        </div>
    );
}

export default StyleSearchBar;