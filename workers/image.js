const { Worker } = require('bullmq');
const fs = require('fs');
const path = require('path');
const redis = require('../utils/redis');
const Image = require('../models/Image');
const { transformImage } = require('../utils/sharp');

const worker = new Worker('image-transform', async job => {
  const { userId, imageId, path: filePath, transformations } = job.data;

  const newPath = await transformImage(filePath, transformations);
  const filename = path.basename(newPath);

  await Image.create({
    user: userId,
    filename,
    path: newPath,
    originalName: `transformed-${imageId}`,
    mimeType: path.extname(filename).slice(1),
    size: fs.statSync(newPath).size,
    transformations,
  });

  console.log(`✅ Transformed image saved: ${filename}`);
}, { connection: redis });

worker.on('failed', (job, err) => {
  console.error(`❌ Job failed ${job.id}: ${err.message}`);
});
