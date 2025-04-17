const Image = require('../models/image');

exports.uploadImage = async (req, res) => {
  try {
    const file = req.file;
    const image = await Image.create({
      user: req.user._id,
      filename: file.filename,
      path: file.path,
      originalName: file.originalname,
      mimeType: file.mimetype,
      size: file.size,
    });

    res.status(201).json({ image });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Image upload failed' });
  }
};
