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

exports.getImageById = async (req, res) => {
  try {
    const image = await Image.findById(req.params.id);
    if (!image || image.user.toString() !== req.user._id.toString()) {
      return res.status(404).json({ error: 'Image not found or access denied' });
    }

    res.json({ image });
  } catch (err) {
    res.status(500).json({ error: 'Failed to retrieve image' });
  }
};

exports.downloadImage = async (req, res) => {
  try {
    const image = await Image.findById(req.params.id);
    if (!image || image.user.toString() !== req.user._id.toString()) {
      return res.status(404).json({ error: 'Image not found or access denied' });
    }

    res.sendFile(path.resolve(image.path));
  } catch (err) {
    res.status(500).json({ error: 'Failed to serve image file' });
  }
};

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
exports.listUserImages = async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;

  try {
    const images = await Image.find({ user: req.user._id })
      .skip((page - 1) * limit)
      .limit(limit)
      .sort({ createdAt: -1 });

    const total = await Image.countDocuments({ user: req.user._id });

    res.json({
      images,
      total,
      page,
      totalPages: Math.ceil(total / limit)
    });
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch images' });
  }
};
const imageQueue = require('../queues/image');

exports.transformImageController = async (req, res) => {
  try {
    const image = await Image.findById(req.params.id);
    if (!image || image.user.toString() !== req.user._id.toString()) {
      return res.status(404).json({ error: 'Image not found or access denied' });
    }

    await imageQueue.add('transform', {
      userId: req.user._id,
      imageId: image._id,
      path: image.path,
      transformations: req.body.transformations,
    });

    res.status(202).json({ message: 'Transformation queued and will be processed soon.' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to queue transformation' });
  }
};
exports.transformImageController = async (req, res) => {
  try {
    const image = await Image.findById(req.params.id);
    if (!image || image.user.toString() !== req.user._id.toString()) {
      return res.status(404).json({ error: 'Image not found or access denied' });
    }
    const placeholder = await Image.create({
      user: req.user._id,
      filename: 'pending',
      path: '',
      originalName: `transformed-${image.originalName}`,
      mimeType: '',
      size: 0,
      transformations: req.body.transformations,
      status: 'pending'
    });
    await imageQueue.add('transform', {
      userId: req.user._id,
      imageId: image._id,
      placeholderId: placeholder._id,
      path: image.path,
      transformations: req.body.transformations
    });

    res.status(202).json({ message: 'Transformation queued', image: placeholder });
  } catch (err) {
    res.status(500).json({ error: 'Failed to queue transformation' });
  }
};
