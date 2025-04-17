const express = require('express');
const router = express.Router();
const auth = require('../middleware/authMiddleware');
const upload = require('../middleware/uploadMiddleware');
const { uploadImage } = require('../controllers/imageController');

router.post('/images', auth, upload.single('image'), uploadImage);

module.exports = router;
