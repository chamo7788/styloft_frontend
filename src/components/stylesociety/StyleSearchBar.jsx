import React from "react";

import "../../assets/css/StyleSociety/styleSearchBar.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSearch } from "@fortawesome/free-solid-svg-icons";

export function StyleSearchBar() {
    return (
        <div className="stylesearch-container">
            <div className="stylesearch-bar">
                <input type="text" placeholder="Search Designers" />
                <button>
                    <FontAwesomeIcon icon={faSearch} />
                </button>
            </div>
            <h1 className="styletop-projects">Top projects you may like</h1>
            <p className="stylesubtitle">These projects are highly rated by other clients</p>
        </div>
    );
}
export default StyleSearchBar;