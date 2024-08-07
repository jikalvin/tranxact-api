const BannerModel = require('../models/bannerModel');

// Create a new banner
exports.createBanner = async (req, res) => {
  try {
    const { title, description, startDate, endDate } = req.body;
    const imageUrl = req.file.path; // Assuming 'req.file.path' contains the uploaded image path

    const newBanner = new BannerModel({
      title,
      description,
      imageUrl,
      startDate,
      endDate,
      active: true,
    });

    const savedBanner = await newBanner.save();
    res.status(201).json(savedBanner);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get all banners
exports.getAllBanners = async (req, res) => {
  try {
    const banners = await BannerModel.find();
    res.json(banners);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get a specific banner by ID
exports.getBannerById = async (req, res) => {
  try {
    const banner = await BannerModel.findById(req.params.id);
    if (!banner) {
      return res.status(404).json({ message: 'Banner not found' });
    }
    res.json(banner);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};
