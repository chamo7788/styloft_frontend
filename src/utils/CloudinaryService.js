class CloudinaryService {
  constructor() {
    this.cloudName = 'ds0xdh85j';
    this.uploadPreset = 'Styloft';
    this.apiUrl = `https://api.cloudinary.com/v1_1/${this.cloudName}/image/upload`;
  }

  async uploadImage(file) {
    try {
      // Create form data
      const imageData = new FormData();
      imageData.append('file', file);
      imageData.append('upload_preset', this.uploadPreset);
      
      // Upload to Cloudinary
      const response = await fetch(this.apiUrl, {
        method: 'POST',
        body: imageData,
      });
      
      const data = await response.json();
      
      if (!data.secure_url) {
        throw new Error('Image upload failed');
      }
      
      return {
        url: data.secure_url,
        publicId: data.public_id,
        width: data.width,
        height: data.height,
        format: data.format
      };
    } catch (error) {
      console.error('Error uploading to Cloudinary:', error);
      throw error;
    }
  }
}

export default new CloudinaryService();