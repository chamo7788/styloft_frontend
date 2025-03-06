import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import "../../assets/css/contest/contestContent.css";
import { User } from "lucide-react";

export default function ContestContent() {
    const { id } = useParams();
    const [contest, setContest] = useState(null);
    const [imagePreview, setImagePreview] = useState(null);
    const [formData, setFormData] = useState({ image: "" });
    const [newMessage, setNewMessage] = useState("");
    const [timeLeft, setTimeLeft] = useState(null);
    const [isUploading, setUploading] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");
    const [submissions, setSubmissions] = useState([]);

    // Fetch contest details
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

    // Countdown timer
    useEffect(() => {
        if (!timeLeft) return;
        const timer = setInterval(() => {
            setTimeLeft(calculateTimeLeft(new Date(contest?.deadline)));
        }, 1000);
        return () => clearInterval(timer);
    }, [timeLeft, contest?.deadline]);

    // Fetch submissions
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

    // Handle image upload
    const handleImageUpload = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        const validTypes = ["image/jpeg", "image/png", "image/jpg"];
        if (!validTypes.includes(file.type)) {
            setErrorMessage("Invalid file type. Please upload a JPG or PNG image.");
            return;
        }

        setImagePreview(URL.createObjectURL(file));
        setUploading(true);

        const imageData = new FormData();
        imageData.append("file", file);
        imageData.append("upload_preset", "Styloft");

        try {
            const response = await fetch("https://api.cloudinary.com/v1_1/ds0xdh85j/image/upload", {
                method: "POST",
                body: imageData,
            });

            const data = await response.json();

            if (data.secure_url) {
                setFormData((prevData) => ({
                    ...prevData,
                    image: data.secure_url,
                }));
                setErrorMessage("");
            } else {
                setErrorMessage("Image upload failed. Try again.");
            }
        } catch (error) {
            setErrorMessage("Error uploading image. Check your network.");
        } finally {
            setUploading(false);
        }
    };

    // Handle form submission
    const handleSubmit = async () => {
        if (!formData.image) {
            alert(isUploading ? "File is still uploading. Please wait." : "Please upload a file before submitting.");
            return;
        }

        const user = JSON.parse(localStorage.getItem("currentUser"));
        if (!user) {
            alert("User not logged in. Please log in before submitting.");
            return;
        }

        const submissionData = {
            fileUrl: formData.image,
            contestId: id,
            userId: user.uid,
            userName: user.displayName,
            message: newMessage,
        };

        console.log("Submitting:", submissionData); // Debugging: Check data before sending

        try {
            const response = await fetch("http://localhost:3000/submission/submit", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(submissionData),
            });

            const result = await response.json();
            console.log("Server Response:", result); // Debugging: Log response from backend

            if (!response.ok) {
                throw new Error(result.message || "Failed to submit design");
            }

            alert("Design submitted successfully!");
            handleClearForm();
        } catch (error) {
            console.error("Error submitting design:", error);
            alert(error.message);
        }
    };

    // Clear form
    const handleClearForm = () => {
        setFormData({ image: "" });
        setNewMessage("");
        setImagePreview(null);
        document.getElementById("file-upload").value = "";
    };

    if (!contest) return <p>Loading...</p>;

    return (
        <div className="contest-content-page">
            <div className="contest-content-container">
                <div className="contest-left">
                    <img src={contest.image} alt="Contest Banner" className="contest-image" />
                    <h2 className="contest-title">{contest.title}</h2>
                    <p className="contest-description">{contest.description}</p>
                    <p className="contest-price">Prize Pool: ${contest.prize}</p>
                </div>
                <div className="contest-right">
                    <div className="upload-box">
                        <label htmlFor="file-upload" className="file-label">Upload File</label>
                        <input id="file-upload" type="file" onChange={handleImageUpload} className="file-input" />
                        {imagePreview && <img src={imagePreview} alt="Preview" className="submission-image-preview" />}
                        {isUploading && <p className="uploading-text">Uploading...</p>}
                        {errorMessage && <p className="error-text">{errorMessage}</p>}
                    </div>
                    <textarea className="message-input" value={newMessage} onChange={(e) => setNewMessage(e.target.value)} placeholder="Write your message..." />
                    <div className="button-group">
                        <button className="submit-btn" onClick={handleSubmit} disabled={isUploading}>Submit</button>
                        <button className="clear-btn" onClick={handleClearForm}>Clear Form</button>
                    </div>
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
