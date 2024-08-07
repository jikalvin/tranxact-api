const express = require('express');
const router = express.Router();
const BannerController = require('../controllers/bannerController');
const authMiddleware = require('../middlewares/authMiddleware');
const upload = require('../utils/uploadBanner'); // Assuming 'uploadBanner' utility is added

// Route to create a new banner
router.post('/', authMiddleware, upload.single('banner'), BannerController.createBanner);

// Route to get all banners
router.get('/', BannerController.getAllBanners);

// Route to get a specific banner by ID
router.get('/:id', BannerController.getBannerById);

module.exports = router;
