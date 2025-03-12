import React, { useState } from "react";
import { Search } from "lucide-react";
import "../../assets/css/StyleSociety/styleSearchBar.css";

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
        </div>
    );
}

export default StyleSearchBar;
