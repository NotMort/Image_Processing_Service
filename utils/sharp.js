const sharp = require('sharp');
const path = require('path');
const fs = require('fs');

exports.transformImage = async (filePath, transformations) => {
  const {
    resize, crop, rotate, format, filters, flip, flop, compress, watermark
  } = transformations;

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

  let outputBuffer = await transformer.toBuffer();

  if (watermark) {
    const watermarkPath = path.join(__dirname, '../assets/watermark.png');
    const watermarkImg = await sharp(watermarkPath).resize(100).png().toBuffer();

    const baseImg = sharp(outputBuffer);
    const { width, height } = await baseImg.metadata();

    outputBuffer = await baseImg
      .composite([{ input: watermarkImg, gravity: watermark.gravity || 'southeast' }])
      .toBuffer();
  }

  const finalSharp = sharp(outputBuffer);
  if (compress && ['jpg', 'jpeg'].includes(ext)) {
    finalSharp.jpeg({ quality: compress.quality || 80 });
  } else if (compress && ext === 'webp') {
    finalSharp.webp({ quality: compress.quality || 80 });
  }

  await finalSharp.toFile(newPath);
  return newPath;
};
