import React, { useState } from "react";
import { useParams } from "react-router-dom";
import "../../assets/css/contest/contestContent.css";
import contestImg1 from "../../assets/images/Contest-2.jpg";
import contestImg2 from "../../assets/images/Contest-1.jpg";

// Sample Contest Data (Replace with actual API fetch later)
const contestData = [
    {
        id: 1,
        title: "Ultimate Fashion Design Challenge",
        creator: "John Doe",
        image: contestImg1,
        description: "Calling all creative minds! Showcase your talent, redefine fashion, and let your designs steal the spotlight.",
    },
    {
        id: 2,
        title: "Winter Fashion Contest",
        creator: "Jane Smith",
        image: contestImg2,
        description: "Design the ultimate winter outfit that blends fashion and comfort. Do you have what it takes to win?",
    },
];

export default function ContestContent() {
    const { id } = useParams(); // Get contest ID from URL
    const contest = contestData.find((c) => c.id === parseInt(id)); // Find contest by ID

    // File Upload State
    const [uploadedFile, setUploadedFile] = useState(null);

    if (!contest) {
        return <p>Contest not found.</p>; // Handle invalid contest ID
    }

    // Handle file upload
    const handleFileChange = (event) => {
        setUploadedFile(event.target.files[0]);
    };

    // Handle form submission
    const handleSubmit = () => {
        if (uploadedFile) {
            alert(`File "${uploadedFile.name}" submitted for Contest ${contest.id}!`);
            setUploadedFile(null); // Reset file after submission
        } else {
            alert("Please upload a file before submitting.");
        }
    };

    // Clear uploaded file
    const handleClear = () => {
        setUploadedFile(null);
    };

    return (
        <div className="contest-content">
            {/* Contest Banner */}
            <div className="contest-banner" style={{ backgroundImage: `url(${contest.image})` }}>
                <h1 className="contest-title">{contest.title}</h1>
                <p className="contest-creator">Created by: {contest.creator}</p>
            </div>

            {/* Contest Description */}
            <div className="contest-description">
                <p>{contest.description}</p>
            </div>

            {/* File Upload Section */}
            <div className="file-upload-section">
                <label className="file-label">Upload Your Design:</label>
                <input type="file" onChange={handleFileChange} className="file-input" />
                {uploadedFile && <p className="uploaded-file">Selected: {uploadedFile.name}</p>}
            </div>

            {/* Action Buttons */}
            <div className="button-container">
                <button className="btn create-btn">Create</button>
                <button className="btn submit-btn" onClick={handleSubmit}>Submit</button>
                <button className="btn clear-btn" onClick={handleClear}>Clear</button>
            </div>
        </div>
    );
}
