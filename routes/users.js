const express = require('express');
const { getUserProfile, getUserRecipes } = require('../controllers/userController');
const { protect } = require('../middleware/auth');

const router = express.Router();

// Get user profile
router.get('/:id', getUserProfile);

// Get user's recipes
router.get('/:id/recipes', getUserRecipes);

module.exports = router;