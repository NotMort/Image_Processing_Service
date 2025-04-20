const { Queue } = require('bullmq');
const redis = require('../utils/redis');

const imageQueue = new Queue('image-transform', { connection: redis });

module.exports = imageQueue;
