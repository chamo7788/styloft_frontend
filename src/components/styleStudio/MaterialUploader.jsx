import PropTypes from 'prop-types';

const MaterialUploader = ({ onMaterialUpload }) => {
    const handleFileChange = (event) => {
        const file = event.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (e) => {
                onMaterialUpload(e.target.result);
            };
            reader.readAsDataURL(file);
        }
    };

    return (
        <input type="file" accept="image/*" onChange={handleFileChange} />
    );
};

MaterialUploader.propTypes = {
    onMaterialUpload: PropTypes.func.isRequired,
};

export default MaterialUploader;