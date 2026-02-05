const express = require('express'); // Import express
const router = express.Router();
const { uploadImage } = require('./controller');
const { upload } = require('../middlewares/uploadFile');

// Route to add new page meta data
router.post(
  '/upload-image',
  //Auth.authenticateUser,
  upload.single('image'),
  //validate(validationArray.validateImageUpload),
  uploadImage,
);

module.exports = router;
