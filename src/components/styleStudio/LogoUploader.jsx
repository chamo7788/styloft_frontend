import PropTypes from 'prop-types';
import { useRef } from 'react';

const LogoUploader = ({ onLogoUpload, preview }) => {
    const fileInputRef = useRef(null);

    const handleFileChange = (event) => {
        const file = event.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (e) => {
                onLogoUpload(e.target.result);
            };
            reader.readAsDataURL(file);
        }
    };

    return (
        <div className="file-uploader">
            <label className="file-label">Upload Logo</label>
            <div className="file-controls">
                <button className="file-button" onClick={() => fileInputRef.current.click()}>
                    Choose File
                </button>
                <input ref={fileInputRef} type="file" accept="image/*" onChange={handleFileChange} className="hidden-input" />
                {preview && (
                    <div className="file-preview">
                        <img src={preview || "/placeholder.svg"} alt="Preview" className="preview-image" />
                    </div>
                )}
            </div>
        </div>
    );
};

LogoUploader.propTypes = {
    onLogoUpload: PropTypes.func.isRequired,
    preview: PropTypes.string,
};

export default LogoUploader;