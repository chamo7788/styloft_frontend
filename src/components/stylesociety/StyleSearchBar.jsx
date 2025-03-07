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
            <div className="stylesearch-bar">
                <input 
                    type="text" 
                    placeholder="Search Designers"  
                    className="Style" 
                    value={searchQuery} 
                    onChange={handleSearchChange}
                />
                <Search className="sty" />
            </div>
            <h1 className="styletop-projects">Top projects you may like</h1>
            <p className="stylesubtitle">These projects are highly rated by other clients</p>
        </div>
    );
}

export default StyleSearchBar;
