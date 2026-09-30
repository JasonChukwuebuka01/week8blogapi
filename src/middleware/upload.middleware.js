const multer = require('multer');
const cloudinary = require('../config/cloudinary');
const { CloudinaryStorage } = require('multer-storage-cloudinary');


  const storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
        folder: 'blog-images',
        allowed_formats: ['jpg', 'jpeg', 'png'],
    },
  });

const upload = multer({
    storage: storage,
    limits: 3 * 1024 * 1024
})


module.exports = upload;