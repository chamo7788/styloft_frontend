import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import "../../assets/css/contest/contestContent.css";

export default function ContestContent() {
    const { id } = useParams();
    const [contest, setContest] = useState(null);
    const [uploadedFile, setUploadedFile] = useState(null);

    useEffect(() => {
        const fetchContest = async () => {
            try {
                const response = await fetch(`http://localhost:3000/contest/${id}`);
                if (!response.ok) throw new Error("Failed to fetch contest");
                const data = await response.json();
                setContest(data);
            } catch (error) {
                console.error("Error fetching contest:", error);
            }
        };
        fetchContest();
    }, [id]);

    const handleFileChange = (event) => {
        setUploadedFile(event.target.files[0]);
    };

    const handleSubmit = async () => {
        if (!uploadedFile) {
            alert("Please upload a file before submitting.");
            return;
        }

        const formData = new FormData();
        formData.append("file", uploadedFile);
        formData.append("contestId", id);
        formData.append("userId", localStorage.getItem("userId")); // Assuming user ID is stored

        try {
            const response = await fetch("http://localhost:3000/contest/submit", {
                method: "POST",
                body: formData,
            });

            if (!response.ok) throw new Error("Failed to submit design");
            alert("Design submitted successfully!");
            setUploadedFile(null);
        } catch (error) {
            console.error("Error submitting design:", error);
        }
    };

    if (!contest) return <p>Loading...</p>;

    return (
        <div className="contest-content">
            <div className="contest-banner" style={{ backgroundImage: `url(${contest.image})` }}>
                <h1 className="contest-title">{contest.title}</h1>
                <p className="contest-creator">Created by: {contest.createdBy}</p>
            </div>

            <div className="contest-description">
                <p>{contest.description}</p>
            </div>

            <div className="file-upload-section">
                <label className="file-label">Upload Your Design:</label>
                <input type="file" onChange={handleFileChange} className="file-input" />
                {uploadedFile && <p className="uploaded-file">Selected: {uploadedFile.name}</p>}
            </div>

            <div className="button-container">
                <button className="btn submit-btn" onClick={handleSubmit}>Submit</button>
            </div>
        </div>
    );
}
