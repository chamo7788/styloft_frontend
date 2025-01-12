import PropTypes from 'prop-types';

const LogoUploader = ({ onLogoUpload }) => {
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
        <input type="file" accept="image/*" onChange={handleFileChange} />
    );
};

LogoUploader.propTypes = {
    onLogoUpload: PropTypes.func.isRequired,
};

export default LogoUploader;