const fs = require('fs');
const path = require('path');
const Image = require('../models/Image');
const { transformImage } = require('../utils/sharp');

exports.transformImageController = async (req, res) => {
  try {
    const image = await Image.findById(req.params.id);
    if (!image || image.user.toString() !== req.user._id.toString()) {
      return res.status(404).json({ error: 'Image not found or access denied' });
    }

    const transformedPath = await transformImage(image.path, req.body.transformations);
    const fileName = path.basename(transformedPath);

    const transformedImage = await Image.create({
      user: req.user._id,
      filename: fileName,
      path: transformedPath,
      originalName: `transformed-${image.originalName}`,
      mimeType: path.extname(fileName).slice(1),
      size: fs.statSync(transformedPath).size,
      transformations: req.body.transformations,
    });

    res.status(200).json({ image: transformedImage });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Transformation failed' });
  }
};
