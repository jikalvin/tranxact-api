const multer = require('multer');
const path = require('path');

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/banners/'); // Specify the upload directory
  },
  filename: function (req, file, cb) {
    cb(null, `${Date.now()}-${file.originalname}`); // Generate a unique filename
  },
});

const fileFilter = (req, file, cb) => {
  const allowedTypes = ['image/jpeg', 'image/png', 'image/gif']; // Allowed file types
  cb(null, allowedTypes.includes(file.mimetype)); // Filter files based on type
};

const upload = multer({ storage, fileFilter });
module.exports = upload;
