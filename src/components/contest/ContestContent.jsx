import React from "react";
import { useParams } from "react-router-dom";

export default function ContestContent() {
    const { id } = useParams(); // Get contest ID from URL

    return (
        <div className="contest-content">
            <h1>Contest {id} Details</h1>
            <p>More details about contest {id} will be shown here.</p>
        </div>
    );
}
