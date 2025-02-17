import React from "react";

import "../../assets/css/StyleSociety/searchBar.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSearch } from "@fortawesome/free-solid-svg-icons";

export function SearchBar() {
    return (
        <div className="search-container">
            <div className="search-bar">
                <input type="text" placeholder="Search Designers" />
                <button>
                    <FontAwesomeIcon icon={faSearch} />
                </button>
            </div>
            <h1 className="top-projects">Top projects you may like</h1>
            <p className="subtitle">These projects are highly rated by other clients</p>
        </div>
    );
}
export default SearchBar;