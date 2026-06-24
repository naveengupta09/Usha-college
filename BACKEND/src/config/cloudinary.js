import { v2 as cloudinary } from 'cloudinary';
import { CloudinaryStorage } from 'multer-storage-cloudinary';
import multer from 'multer';
import { ENV } from './env.js';

cloudinary.config({
  cloud_name: ENV.CLOUDINARY_CLOUD_NAME,
  api_key: ENV.CLOUDINARY_API_KEY,
  api_secret: ENV.CLOUDINARY_API_SECRET,
});

// Factory function to create folder-specific storage
export const createStorage = (folder, allowedFormats = ['jpg', 'jpeg', 'png', 'webp']) => {
  return new CloudinaryStorage({
    cloudinary,
    params: {
      folder: `uipe/${folder}`,
      allowed_formats: allowedFormats,
      transformation: [{ quality: 'auto', fetch_format: 'auto' }],
    },
  });
};

// Multer upload instances
export const uploadFaculty = multer({
  storage: createStorage('faculty'),
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
});

export const uploadGallery = multer({
  storage: createStorage('gallery'),
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB
});

export const uploadCourse = multer({
  storage: createStorage('courses'),
  limits: { fileSize: 5 * 1024 * 1024 },
});

export const uploadGeneral = multer({
  storage: createStorage('general'),
  limits: { fileSize: 10 * 1024 * 1024 },
});

// Delete image from Cloudinary
export const deleteImage = async (publicId) => {
  try {
    const result = await cloudinary.uploader.destroy(publicId);
    return result;
  } catch (error) {
    console.error('Cloudinary delete error:', error);
    throw error;
  }
};

export default cloudinary;
