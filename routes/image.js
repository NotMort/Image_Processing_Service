const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const upload = require('../middleware/upload');
const { uploadImage } = require('../controllers/image');
const { transformImageController } = require('../controllers/image');
const {
    getImageById,
    downloadImage,
    listUserImages
  } = require('../controllers/image');
  
router.post('/images', auth, upload.single('image'), uploadImage);
router.post('/images/:id/transform', auth, transformImageController);
module.exports = router;

  router.get('/images/:id', auth, getImageById);        
  router.get('/images/:id/file', auth, downloadImage); 
  router.get('/images', auth, listUserImages);          
  