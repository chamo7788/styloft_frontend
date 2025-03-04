import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import "../../assets/css/contest/contestContent.css";

export default function ContestContent() {
    const { id } = useParams();
    const [contest, setContest] = useState(null);
    const [uploadedFile, setUploadedFile] = useState(null);
    const [fileUrl, setFileUrl] = useState("");
    const [newMessage, setNewMessage] = useState("");
    const [timeLeft, setTimeLeft] = useState(null);
    const [isSubmitted, setIsSubmitted] = useState(false);
    const [isUploading, setIsUploading] = useState(false);
    const [submissions, setSubmissions] = useState([]);

    useEffect(() => {
        const fetchContest = async () => {
            try {
                const response = await fetch(`http://localhost:3000/contest/${id}`);
                if (!response.ok) throw new Error("Failed to fetch contest");
                const data = await response.json();
                setContest(data);
                setTimeLeft(calculateTimeLeft(new Date(data.deadline)));
            } catch (error) {
                console.error("Error fetching contest:", error);
            }
        };
        fetchContest();
    }, [id]);

    useEffect(() => {
        if (!timeLeft) return;
        const timer = setInterval(() => {
            setTimeLeft(calculateTimeLeft(new Date(contest?.deadline)));
        }, 1000);
        return () => clearInterval(timer);
    }, [timeLeft, contest]);

    useEffect(() => {
        const fetchSubmissions = async () => {
            try {
                const response = await fetch(`http://localhost:3000/submission/contest/${id}`);
                if (!response.ok) throw new Error("Failed to fetch submissions");
                const data = await response.json();
                setSubmissions(data);
            } catch (error) {
                console.error("Error fetching submissions:", error);
            }
        };
        fetchSubmissions();
    }, [id]);

    const calculateTimeLeft = (deadline) => {
        const now = new Date();
        const difference = deadline - now;
        if (difference <= 0) return { days: 0, hours: 0, minutes: 0, seconds: 0 };
        return {
            days: Math.floor(difference / (1000 * 60 * 60 * 24)),
            hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
            minutes: Math.floor((difference / 1000 / 60) % 60),
            seconds: Math.floor((difference / 1000) % 60),
        };
    };

    const handleFileChange = async (event) => {
        const file = event.target.files[0];
        if (!file) return;

        setUploadedFile(file);
        setIsUploading(true);

        const formData = new FormData();
        formData.append("file", file);
        formData.append("upload_preset", "Styloft");

        try {
            const response = await fetch("https://api.cloudinary.com/v1_1/dkonpzste/image/upload", {
                method: "POST",
                body: formData,
            });

            const data = await response.json();
            if (data.secure_url) {
                setFileUrl(data.secure_url);
            } else {
                alert("File upload failed. Please try again.");
            }
        } catch (error) {
            alert("Error uploading file. Please try again.");
        } finally {
            setIsUploading(false);
        }
    };

    const handleSubmit = async () => {
        if (!fileUrl) {
            alert(isUploading ? "File is still uploading. Please wait." : "Please upload a file before submitting.");
            return;
        }

        const submissionData = {
            fileUrl,
            contestId: id,
            userId: localStorage.getItem("userId"),
            message: newMessage,
        };

        try {
            const response = await fetch("http://localhost:3000/submission/submit", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(submissionData),
            });

            if (!response.ok) throw new Error("Failed to submit design");

            alert("Design submitted successfully!");
            setIsSubmitted(true);
        } catch (error) {
            console.error("Error submitting design:", error);
        }
    };

    if (!contest) return <p>Loading...</p>;

    return (
        <div className="contest-content-page">
            <div className="contest-content-container">
                <div className="contest-left">
                    <img src={contest.image} alt="Contest Banner" className="contest-image" />
                    <h2 className="contest-title">{contest.title}</h2>
                    <p className="contest-description">{contest.description}</p>
                    <p className="contest-price">Price Pool: ${contest.prize}</p>
                </div>
                <div className="contest-right">
                    <div className="upload-box">
                        <label htmlFor="file-upload" className="file-label">Upload File</label>
                        <input id="file-upload" type="file" onChange={handleFileChange} className="file-input" />
                        {uploadedFile && <p className="file-name">{uploadedFile.name}</p>}
                        {isUploading && <p className="uploading-text">Uploading...</p>}
                    </div>
                    <textarea className="message-input" value={newMessage} onChange={(e) => setNewMessage(e.target.value)} placeholder="Write your message..." />
                    <button className="submit-btn" onClick={handleSubmit} disabled={isUploading}>Submit</button>
                    <div className="countdown">
                        <span>{String(timeLeft?.days).padStart(2, "0")} : </span>
                        <span>{String(timeLeft?.hours).padStart(2, "0")} : </span>
                        <span>{String(timeLeft?.minutes).padStart(2, "0")} : </span>
                        <span>{String(timeLeft?.seconds).padStart(2, "0")}</span>
                    </div>
                </div>
            </div>
            <div className="submission-gallery">
                <h3>Submissions</h3>
                <div className="submission-cards">
                    {submissions.map((submission) => (
                        <div key={submission.id} className="submission-card">
                            <img src={submission.fileUrl} alt="Submission" className="submission-image" />
                            <p>Submitted by: {submission.userId}</p>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
