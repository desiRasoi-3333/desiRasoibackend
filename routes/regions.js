const express = require('express');
const { getRegions, getRegionByCoordinates } = require('../controllers/regionController');

const router = express.Router();

// Get all regions
router.get('/', getRegions);

// Get region by coordinates
router.get('/coordinates', getRegionByCoordinates);

module.exports = router;