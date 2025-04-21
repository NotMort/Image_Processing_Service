const Image = require('../models/Image');

const worker = new Worker('image-transform', async job => {
  const { userId, imageId, path: filePath, transformations, placeholderId } = job.data;

  await Image.findByIdAndUpdate(placeholderId, { status: 'processing' });

  try {
    const newPath = await transformImage(filePath, transformations);
    const filename = path.basename(newPath);

    await Image.findByIdAndUpdate(placeholderId, {
      filename,
      path: newPath,
      mimeType: path.extname(filename).slice(1),
      size: fs.statSync(newPath).size,
      status: 'completed'
    });

    console.log(`✅ Image transformed and saved as: ${filename}`);
  } catch (err) {
    console.error('❌ Transformation failed:', err.message);
    await Image.findByIdAndUpdate(placeholderId, { status: 'failed' });
  }
}, { connection: redis });
