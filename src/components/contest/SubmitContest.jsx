import { useState } from "react";
import { Upload, X, CheckCircle, MessageSquare, Clock } from "lucide-react";

export default function SubmitContest({
  contest,
  isCreator,
  isSubmitted,
  isDragging,
  isUploading,
  imagePreview,
  errorMessage,
  newMessage,
  isDeadlinePassed,
  handleDragEnter,
  handleDragLeave,
  handleDragOver,
  handleDrop,
  handleImageUpload,
  handleClearForm,
  handleSubmit,
  setNewMessage,
}) {
  const [updatedContest, setUpdatedContest] = useState({
    title: contest.title,
    description: contest.description,
    prize: contest.prize,
    deadline: new Date(contest.deadline).toISOString().split("T")[0],
  });
  const [isSaving, setIsSaving] = useState(false);
  const [editErrorMessage, setEditErrorMessage] = useState("");

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUpdatedContest((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSaveChanges = async (e) => {
    e.preventDefault();
    setIsSaving(true);
    setEditErrorMessage("");

    try {
      const response = await fetch(`http://localhost:3000/contest/update/${contest.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updatedContest),
      });

      if (!response.ok) {
        throw new Error("Failed to save changes. Please try again.");
      }

      const result = await response.json();
      console.log("Contest updated successfully:", result);
      alert("Contest updated successfully!");
    } catch (error) {
      console.error("Error updating contest:", error);
      setEditErrorMessage(error.message || "An error occurred while saving changes.");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="contest-right">
      {isCreator ? (
        <div className="contest-edit">
          <h2>Edit Contest</h2>
          <form onSubmit={handleSaveChanges}>
            <label>
              Title:
              <input
                type="text"
                name="title"
                value={updatedContest.title}
                onChange={handleInputChange}
              />
            </label>
            <label>
              Description:
              <textarea
                name="description"
                value={updatedContest.description}
                onChange={handleInputChange}
              ></textarea>
            </label>
            <label>
              Prize:
              <input
                type="number"
                name="prize"
                value={updatedContest.prize}
                onChange={handleInputChange}
              />
            </label>
            <label>
              Deadline:
              <input
                type="date"
                name="deadline"
                value={updatedContest.deadline}
                onChange={handleInputChange}
              />
            </label>
            <button type="submit" disabled={isSaving}>
              {isSaving ? "Saving..." : "Save Changes"}
            </button>
            {editErrorMessage && <p className="error-message">{editErrorMessage}</p>}
          </form>
        </div>
      ) : (
        <>
          {isSubmitted ? (
            <div className="submission-success">
              <CheckCircle size={48} className="success-icon" />
              <h3>Submission Successful!</h3>
              <p>Your design has been submitted to the contest.</p>
            </div>
          ) : (
            <>
              <h2 className="submission-title">Submit Your Design</h2>

              <div
                className={`upload-box ${isDragging ? "dragging" : ""} ${errorMessage ? "error" : ""}`}
                onDragEnter={handleDragEnter}
                onDragLeave={handleDragLeave}
                onDragOver={handleDragOver}
                onDrop={handleDrop}
              >
                <input
                  id="file-upload"
                  type="file"
                  onChange={handleImageUpload}
                  className="file-input"
                  accept="image/jpeg,image/png,image/jpg"
                />

                {imagePreview ? (
                  <div className="image-preview-container">
                    <img
                      src={imagePreview || "/placeholder.svg"}
                      alt="Preview"
                      className="submission-image-preview"
                    />
                    <button
                      className="remove-image-btn"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleClearForm();
                      }}
                    >
                      <X size={16} />
                    </button>
                  </div>
                ) : (
                  <div className="upload-placeholder">
                    <div className="upload-icon-container">
                      <Upload size={24} className="upload-icon" />
                    </div>
                    <p className="upload-text">Drag and drop your design here</p>
                    <p className="upload-subtext">or click to browse files</p>
                    <p className="upload-formats">Supported formats: JPG, PNG</p>
                  </div>
                )}

                {isUploading && (
                  <div className="upload-overlay">
                    <div className="upload-spinner"></div>
                    <p>Uploading...</p>
                  </div>
                )}
              </div>

              {errorMessage && (
                <div className="error-message">
                  <X size={16} />
                  <span>{errorMessage}</span>
                </div>
              )}

              <div className="message-container">
                <label htmlFor="message" className="message-label">
                  <MessageSquare size={16} />
                  <span>Add a message with your submission</span>
                </label>
                <textarea
                  id="message"
                  className="message-input"
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  placeholder="Describe your design or add any notes for the contest creator..."
                />
              </div>

              <div className="button-group">
                <button className="submit-btn" onClick={handleSubmit} disabled={isUploading || isDeadlinePassed}>
                  {isUploading ? "Uploading..." : "Submit Design"}
                </button>
                <button className="clear-btn" onClick={handleClearForm}>
                  Clear Form
                </button>
              </div>

              {isDeadlinePassed && (
                <div className="deadline-passed-message">
                  <Clock size={16} />
                  <span>This contest has ended and is no longer accepting submissions.</span>
                </div>
              )}
            </>
          )}
        </>
      )}
    </div>
  );
}