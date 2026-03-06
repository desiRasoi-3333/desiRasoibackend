const express = require('express');
const { body } = require('express-validator');
const {
  getRecipes,
  getRecipe,
  createRecipe,
  updateRecipe,
  deleteRecipe,
  likeRecipe,
  addComment,
  deleteComment,
  getRecipesByRegion,
  searchRecipes,
  getFeaturedRecipes,
  getPopularRecipes
} = require('../controllers/recipeController');

const { protect, optionalAuth } = require('../middleware/auth');
const { upload, handleMulterError } = require('../middleware/upload');

const router = express.Router();

/* =========================
   🔥 JSON PARSE MIDDLEWARE
========================= */

const parseJsonFields = (req, res, next) => {
  try {
    const jsonFields = [
      'ingredients',
      'instructions',
      'region',
      'cookingTime',
      'dietaryInfo',
      'tags',
      'nutritionInfo'
    ];

    jsonFields.forEach(field => {
      if (req.body[field] && typeof req.body[field] === 'string') {
        req.body[field] = JSON.parse(req.body[field]);
      }
    });

    // convert servings to number
    if (req.body.servings) {
      req.body.servings = parseInt(req.body.servings);
    }

    next();
  } catch (err) {
    return res.status(400).json({
      success: false,
      message: 'Invalid JSON format'
    });
  }
};


/* =========================
   🔥 VALIDATION RULES
========================= */

const recipeValidation = [
  body('title')
    .trim()
    .isLength({ min: 3, max: 100 })
    .withMessage('Title must be between 3 and 100 characters'),

  body('description')
    .trim()
    .isLength({ min: 10, max: 500 })
    .withMessage('Description must be between 10 and 500 characters'),

  body('ingredients')
    .isArray({ min: 1 })
    .withMessage('At least one ingredient is required'),

  body('instructions')
    .isArray({ min: 1 })
    .withMessage('At least one instruction step is required'),

  body('region.state')
    .notEmpty()
    .withMessage('State is required'),

  body('cookingTime.prep')
    .isInt({ min: 1 })
    .withMessage('Prep time must be at least 1 minute'),

  body('cookingTime.cook')
    .isInt({ min: 1 })
    .withMessage('Cook time must be at least 1 minute'),

  body('servings')
    .isInt({ min: 1 })
    .withMessage('Servings must be at least 1')
];


/* =========================
   🔥 COMMENT VALIDATION
========================= */

const commentValidation = [
  body('text')
    .trim()
    .isLength({ min: 1, max: 300 })
    .withMessage('Comment must be between 1 and 300 characters'),

  body('rating')
    .optional()
    .isInt({ min: 1, max: 5 })
    .withMessage('Rating must be between 1 and 5')
];


/* =========================
   🔥 PUBLIC ROUTES
========================= */

router.get('/', optionalAuth, getRecipes);
router.get('/featured', getFeaturedRecipes);
router.get('/popular', getPopularRecipes);
router.get('/search', searchRecipes);
router.get('/region/:state', getRecipesByRegion);
router.get('/:id', optionalAuth, getRecipe);


/* =========================
   🔥 PROTECTED ROUTES
========================= */

router.post(
  '/',
  protect,
  upload.single('image'),
  handleMulterError,
  parseJsonFields,   // 🔥 IMPORTANT
  recipeValidation,
  createRecipe
);

router.put(
  '/:id',
  protect,
  upload.single('image'),
  handleMulterError,
  parseJsonFields,   // 🔥 IMPORTANT
  recipeValidation,
  updateRecipe
);

router.delete('/:id', protect, deleteRecipe);
router.post('/:id/like', protect, likeRecipe);
router.post('/:id/comments', protect, commentValidation, addComment);
router.delete('/:id/comments/:commentId', protect, deleteComment);

module.exports = router;
