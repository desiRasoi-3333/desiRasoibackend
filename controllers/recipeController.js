const { validationResult } = require('express-validator');
const Recipe = require('../models/Recipe');
const User = require('../models/User');
const { uploadRecipeImage, deleteImage } = require('../utils/cloudinary');

// @desc    Get all recipes with filters and pagination
// @route   GET /api/recipes
// @access  Public
exports.getRecipes = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 12;
    const skip = (page - 1) * limit;

    // Build filter object
    const filter = { isApproved: true };
    
    if (req.query.state) {
      filter['region.state'] = new RegExp(req.query.state, 'i');
    }
    
    if (req.query.vegetarian === 'true') {
      filter['dietaryInfo.isVegetarian'] = true;
    }
    
    if (req.query.difficulty) {
      filter.difficulty = req.query.difficulty;
    }
    
    if (req.query.spiceLevel) {
      filter['dietaryInfo.spiceLevel'] = req.query.spiceLevel;
    }

    // Build sort object
    let sort = { createdAt: -1 };
    if (req.query.sort === 'popular') {
      sort = { views: -1, averageRating: -1 };
    } else if (req.query.sort === 'rating') {
      sort = { averageRating: -1, totalRatings: -1 };
    } else if (req.query.sort === 'newest') {
      sort = { createdAt: -1 };
    }

    const recipes = await Recipe.find(filter)
      .populate('author', 'name avatar')
      .sort(sort)
      .skip(skip)
      .limit(limit)
      .lean();

    const total = await Recipe.countDocuments(filter);
    const totalPages = Math.ceil(total / limit);

    res.status(200).json({
      success: true,
      data: recipes,
      pagination: {
        currentPage: page,
        totalPages,
        totalRecipes: total,
        hasNext: page < totalPages,
        hasPrev: page > 1
      }
    });
  } catch (error) {
    console.error('Get recipes error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

// @desc    Get single recipe
// @route   GET /api/recipes/:id
// @access  Public
exports.getRecipe = async (req, res) => {
  try {
    const recipe = await Recipe.findById(req.params.id)
      .populate('author', 'name avatar bio location')
      .populate('comments.user', 'name avatar');

    if (!recipe) {
      return res.status(404).json({
        success: false,
        message: 'Recipe not found'
      });
    }

    // Increment views (only if not the author)
    if (!req.user || req.user.id !== recipe.author._id.toString()) {
      await recipe.incrementViews();
    }

    res.status(200).json({
      success: true,
      data: recipe
    });
  } catch (error) {
    console.error('Get recipe error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

// @desc    Create new recipe
// @route   POST /api/recipes
// @access  Private
exports.createRecipe = async (req, res) => {
  try {

    

    // ✅ Validation AFTER parsing
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: "Validation failed",
        errors: errors.array()
      });
    }

    // Default image
    let imageData = {
      public_id: "test-image",
      url: "https://via.placeholder.com/400x300?text=Recipe+Image"
    };

    if (req.file) {
      const imageResult = await uploadRecipeImage(req.file.buffer);
      imageData = {
        public_id: imageResult.public_id,
        url: imageResult.url
      };
    }

    const recipeData = {
      ...req.body,
      author: req.user.id,
      image: imageData
    };

    const recipe = await Recipe.create(recipeData);

    await req.user.updateRecipesCount();

    await recipe.populate("author", "name avatar");

    return res.status(201).json({
      success: true,
      message: "Recipe created successfully",
      data: recipe
    });

  } catch (error) {

    console.error("Create recipe error:", error);

    return res.status(500).json({
      success: false,
      message: "Server error during recipe creation"
    });
  }
};

// @desc    Update recipe
// @route   PUT /api/recipes/:id
// @access  Private
exports.updateRecipe = async (req, res) => {
  try {
    // Check validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    const recipe = await Recipe.findById(req.params.id);

    if (!recipe) {
      return res.status(404).json({
        success: false,
        message: 'Recipe not found'
      });
    }

    // Check if user owns the recipe or is admin
    if (recipe.author.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to update this recipe'
      });
    }

    let updateData = { ...req.body };

    // Handle image upload if new image provided
    if (req.file) {
      // Delete old image
      if (recipe.image.public_id) {
        await deleteImage(recipe.image.public_id);
      }
      
      // Upload new image
      const imageResult = await uploadRecipeImage(req.file.buffer);
      updateData.image = {
        public_id: imageResult.public_id,
        url: imageResult.url
      };
    }

    // Parse JSON fields
    if (typeof updateData.ingredients === 'string') {
      updateData.ingredients = JSON.parse(updateData.ingredients);
    }
    if (typeof updateData.instructions === 'string') {
      updateData.instructions = JSON.parse(updateData.instructions);
    }
    if (typeof updateData.region === 'string') {
      updateData.region = JSON.parse(updateData.region);
    }
    if (typeof updateData.cookingTime === 'string') {
      updateData.cookingTime = JSON.parse(updateData.cookingTime);
    }
    if (typeof updateData.dietaryInfo === 'string') {
      updateData.dietaryInfo = JSON.parse(updateData.dietaryInfo);
    }
    if (typeof updateData.tags === 'string') {
      updateData.tags = JSON.parse(updateData.tags);
    }

    const updatedRecipe = await Recipe.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true, runValidators: true }
    ).populate('author', 'name avatar');

    res.status(200).json({
      success: true,
      message: 'Recipe updated successfully',
      data: updatedRecipe
    });
  } catch (error) {
    console.error('Update recipe error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error during recipe update'
    });
  }
};

// @desc    Delete recipe
// @route   DELETE /api/recipes/:id
// @access  Private
exports.deleteRecipe = async (req, res) => {
  try {
    const recipe = await Recipe.findById(req.params.id);

    if (!recipe) {
      return res.status(404).json({
        success: false,
        message: 'Recipe not found'
      });
    }

    // Check if user owns the recipe or is admin
    if (recipe.author.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to delete this recipe'
      });
    }

    // Delete image from Cloudinary
    if (recipe.image.public_id) {
      await deleteImage(recipe.image.public_id);
    }

    await Recipe.findByIdAndDelete(req.params.id);

    // Update user's recipe count
    const user = await User.findById(recipe.author);
    if (user) {
      await user.updateRecipesCount();
    }

    res.status(200).json({
      success: true,
      message: 'Recipe deleted successfully'
    });
  } catch (error) {
    console.error('Delete recipe error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error during recipe deletion'
    });
  }
};

// @desc    Like/Unlike recipe
// @route   POST /api/recipes/:id/like
// @access  Private
exports.likeRecipe = async (req, res) => {
  try {
    const recipe = await Recipe.findById(req.params.id);

    if (!recipe) {
      return res.status(404).json({
        success: false,
        message: 'Recipe not found'
      });
    }

    const likeIndex = recipe.likes.findIndex(
      like => like.user.toString() === req.user.id
    );

    if (likeIndex > -1) {
      // Unlike recipe
      recipe.likes.splice(likeIndex, 1);
    } else {
      // Like recipe
      recipe.likes.push({ user: req.user.id });
    }

    await recipe.save();

    res.status(200).json({
      success: true,
      message: likeIndex > -1 ? 'Recipe unliked' : 'Recipe liked',
      likesCount: recipe.likes.length,
      isLiked: likeIndex === -1
    });
  } catch (error) {
    console.error('Like recipe error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

// @desc    Add comment to recipe
// @route   POST /api/recipes/:id/comments
// @access  Private
exports.addComment = async (req, res) => {
  try {
    // Check validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    const recipe = await Recipe.findById(req.params.id);

    if (!recipe) {
      return res.status(404).json({
        success: false,
        message: 'Recipe not found'
      });
    }

    const comment = {
      user: req.user.id,
      text: req.body.text,
      rating: req.body.rating
    };

    recipe.comments.push(comment);
    await recipe.save();

    // Populate the new comment
    await recipe.populate('comments.user', 'name avatar');

    const newComment = recipe.comments[recipe.comments.length - 1];

    res.status(201).json({
      success: true,
      message: 'Comment added successfully',
      data: newComment
    });
  } catch (error) {
    console.error('Add comment error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

// @desc    Delete comment
// @route   DELETE /api/recipes/:id/comments/:commentId
// @access  Private
exports.deleteComment = async (req, res) => {
  try {
    const recipe = await Recipe.findById(req.params.id);

    if (!recipe) {
      return res.status(404).json({
        success: false,
        message: 'Recipe not found'
      });
    }

    const comment = recipe.comments.id(req.params.commentId);

    if (!comment) {
      return res.status(404).json({
        success: false,
        message: 'Comment not found'
      });
    }

    // Check if user owns the comment or is admin
    if (comment.user.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to delete this comment'
      });
    }

    recipe.comments.pull(req.params.commentId);
    await recipe.save();

    res.status(200).json({
      success: true,
      message: 'Comment deleted successfully'
    });
  } catch (error) {
    console.error('Delete comment error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

// @desc    Get recipes by region
// @route   GET /api/recipes/region/:state
// @access  Public
exports.getRecipesByRegion = async (req, res) => {
  try {
    const { state } = req.params;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 12;
    const skip = (page - 1) * limit;

    const recipes = await Recipe.find({
      'region.state': new RegExp(state, 'i'),
      isApproved: true
    })
      .populate('author', 'name avatar')
      .sort({ views: -1, averageRating: -1 })
      .skip(skip)
      .limit(limit)
      .lean();

    const total = await Recipe.countDocuments({
      'region.state': new RegExp(state, 'i'),
      isApproved: true
    });

    res.status(200).json({
      success: true,
      data: recipes,
      pagination: {
        currentPage: page,
        totalPages: Math.ceil(total / limit),
        totalRecipes: total
      }
    });
  } catch (error) {
    console.error('Get recipes by region error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

// @desc    Search recipes
// @route   GET /api/recipes/search
// @access  Public
exports.searchRecipes = async (req, res) => {
  try {
    const { q, page = 1, limit = 12 } = req.query;
    
    if (!q) {
      return res.status(400).json({
        success: false,
        message: 'Search query is required'
      });
    }

    const skip = (page - 1) * limit;

    const recipes = await Recipe.find({
      $and: [
        { isApproved: true },
        {
          $or: [
            { title: { $regex: q, $options: 'i' } },
            { description: { $regex: q, $options: 'i' } },
            { tags: { $in: [new RegExp(q, 'i')] } },
            { 'region.state': { $regex: q, $options: 'i' } }
          ]
        }
      ]
    })
      .populate('author', 'name avatar')
      .sort({ averageRating: -1, views: -1 })
      .skip(skip)
      .limit(parseInt(limit))
      .lean();

    const total = await Recipe.countDocuments({
      $and: [
        { isApproved: true },
        {
          $or: [
            { title: { $regex: q, $options: 'i' } },
            { description: { $regex: q, $options: 'i' } },
            { tags: { $in: [new RegExp(q, 'i')] } },
            { 'region.state': { $regex: q, $options: 'i' } }
          ]
        }
      ]
    });

    res.status(200).json({
      success: true,
      data: recipes,
      pagination: {
        currentPage: parseInt(page),
        totalPages: Math.ceil(total / limit),
        totalRecipes: total
      }
    });
  } catch (error) {
    console.error('Search recipes error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

// @desc    Get featured recipes
// @route   GET /api/recipes/featured
// @access  Public
exports.getFeaturedRecipes = async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 6;

    const recipes = await Recipe.find({
      isApproved: true,
      isFeatured: true
    })
      .populate('author', 'name avatar')
      .sort({ createdAt: -1 })
      .limit(limit)
      .lean();

    res.status(200).json({
      success: true,
      data: recipes
    });
  } catch (error) {
    console.error('Get featured recipes error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

// @desc    Get popular recipes
// @route   GET /api/recipes/popular
// @access  Public
exports.getPopularRecipes = async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 8;

    const recipes = await Recipe.find({ isApproved: true })
      .populate('author', 'name avatar')
      .sort({ views: -1, averageRating: -1 })
      .limit(limit)
      .lean();

    res.status(200).json({
      success: true,
      data: recipes
    });
  } catch (error) {
    console.error('Get popular recipes error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};