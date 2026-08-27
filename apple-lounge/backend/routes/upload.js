const express = require('express');
const router = express.Router();
const { authenticate, authorize } = require('../middleware/auth');
const { uploadImage } = require('../controllers/uploadController');

router.post('/', authenticate, authorize('admin'), uploadImage);

module.exports = router;
