const cloudinary = require('cloudinary').v2;

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

// Upload image to Cloudinary
const uploadImage = async (buffer, folder = 'desi-rasoi') => {
  try {
    return new Promise((resolve, reject) => {
      cloudinary.uploader.upload_stream(
        {
          resource_type: 'image',
          folder: folder,
          transformation: [
            { width: 800, height: 600, crop: 'limit' },
            { quality: 'auto' },
            { format: 'auto' }
          ]
        },
        (error, result) => {
          if (error) {
            reject(error);
          } else {
            resolve({
              public_id: result.public_id,
              url: result.secure_url
            });
          }
        }
      ).end(buffer);
    });
  } catch (error) {
    throw new Error('Image upload failed');
  }
};

// Delete image from Cloudinary
const deleteImage = async (publicId) => {
  try {
    const result = await cloudinary.uploader.destroy(publicId);
    return result;
  } catch (error) {
    throw new Error('Image deletion failed');
  }
};

// Upload avatar image
const uploadAvatar = async (buffer) => {
  return uploadImage(buffer, 'desi-rasoi/avatars');
};

// Upload recipe image
const uploadRecipeImage = async (buffer) => {
  return uploadImage(buffer, 'desi-rasoi/recipes');
};

// Upload region image
const uploadRegionImage = async (buffer) => {
  return uploadImage(buffer, 'desi-rasoi/regions');
};

module.exports = {
  cloudinary,
  uploadImage,
  deleteImage,
  uploadAvatar,
  uploadRecipeImage,
  uploadRegionImage
};