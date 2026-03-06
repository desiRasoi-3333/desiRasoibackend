const Region = require('../models/Region');

// @desc    Get all regions
// @route   GET /api/regions
// @access  Public
exports.getRegions = async (req, res) => {
  try {
    const regions = await Region.find({ isActive: true })
      .sort({ priority: -1, recipesCount: -1 });

    res.status(200).json({
      success: true,
      data: regions
    });
  } catch (error) {
    console.error('Get regions error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

// @desc    Get region by coordinates
// @route   GET /api/regions/coordinates
// @access  Public
exports.getRegionByCoordinates = async (req, res) => {
  try {
    const { lat, lng } = req.query;

    if (!lat || !lng) {
      return res.status(400).json({
        success: false,
        message: 'Latitude and longitude are required'
      });
    }

    const region = await Region.findByCoordinates(
      parseFloat(lat), 
      parseFloat(lng)
    );

    if (!region) {
      return res.status(404).json({
        success: false,
        message: 'No region found for these coordinates'
      });
    }

    res.status(200).json({
      success: true,
      data: region
    });
  } catch (error) {
    console.error('Get region by coordinates error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};