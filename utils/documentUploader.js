const multer = require('multer');
const path = require('path');

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  }
});

const upload = multer({ storage: storage });

const uploadDocument = (file) => {
  return new Promise((resolve, reject) => {
    upload.single('document')(file, null, (err) => {
      if (err) {
        reject(err);
      } else {
        resolve({
          url: `/uploads/${file.filename}`,
          originalName: file.originalname
        });
      }
    });
  });
};

module.exports = { uploadDocument };