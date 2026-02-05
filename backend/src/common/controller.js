const { uploadImageToMinIO } = require('../services/minio');

const uploadImage = async (req, res) => {
  try {
    const { type } = req.body;

    if (!type) {
      return res.status(400).json({ message: 'Type is missing' });
    }

    if (!req.file) {
      return res.status(400).json({ message: 'Image file is missing' });
    }

    const fileName = `${Date.now()}_${req.file.originalname}`;

    const imageUrl = await uploadImageToMinIO({
      folder: type,
      fileName,
      fileBuffer: req.file.buffer,
      mimeType: req.file.mimetype,
    });

    return res.status(200).json({ message: 'Image successfully uploaded', data: { image_url: imageUrl } });
  } catch (err) {
    console.error('Image upload error:', err);
    return res.status(500).json({ message: 'Internal server error' });
  }
};

module.exports = {    
  uploadImage,
};
