import React from "react";
import { Upload, X, MessageSquare, CheckCircle, Clock } from "lucide-react";

const SubmissionForm = ({
  isSubmitted,
  isDragging,
  errorMessage,
  imagePreview,
  isUploading,
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
}) => {
  return (
    <div>
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
            onClick={() => document.getElementById("file-upload").click()}
          >
            <input
              id="file-upload"
              type="file"
              onChange={handleImageUpload}
              className="file-input"
              accept="image/jpeg,image/png,image/jpg"
              style={{ display: "none" }}
            />

            {imagePreview ? (
              <div className="image-preview-container">
                <img src={imagePreview || "/placeholder.svg"} alt="Preview" className="submission-image-preview" />
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
    </div>
  );
};

export default SubmissionForm;