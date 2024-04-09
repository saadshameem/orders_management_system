const multer = require('multer');

// Define storage configuration for multer
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'public3/uploads/'); // Specify the directory where uploaded files will be stored
  },
  filename: function (req, file, cb) {
    // Use the original file name for the uploaded file
    cb(null, file.originalname);
  }
});

// Create multer instance with the storage configuration
const upload = multer({ storage: storage ,
limits:1024*1024*3});

module.exports = upload;
