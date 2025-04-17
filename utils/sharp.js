const sharp = require('sharp');
const path = require('path');
const fs = require('fs');

exports.transformImage = async (filePath, transformations) => {
  const { resize, crop, rotate, format, filters, flip, flop } = transformations;
  let transformer = sharp(filePath);

  if (resize) transformer = transformer.resize(resize.width, resize.height);
  if (crop) transformer = transformer.extract({
    width: crop.width,
    height: crop.height,
    left: crop.x,
    top: crop.y,
  });
  if (rotate) transformer = transformer.rotate(rotate);
  if (flip) transformer = transformer.flip();
  if (flop) transformer = transformer.flop();
  if (filters?.grayscale) transformer = transformer.grayscale();
  if (filters?.sepia) {
    transformer = transformer.modulate({ saturation: 0.3 }).tint('#704214');
  }

 
  const ext = format || path.extname(filePath).slice(1);
  const newPath = filePath.replace(/(\.\w+)$/, `-transformed.${ext}`);

  if (format) transformer = transformer.toFormat(format);

  await transformer.toFile(newPath);
  return newPath;
};
