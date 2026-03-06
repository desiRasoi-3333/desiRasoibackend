const express = require('express');
const { protect, authorize } = require('../middleware/auth');
const User = require('../models/User');
const Recipe = require('../models/Recipe');

const router = express.Router();

// All admin routes require authentication and admin role
router.use(protect);
router.use(authorize('admin'));

// Get admin dashboard stats
router.get('/dashboard', async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const totalRecipes = await Recipe.countDocuments();
    const pendingRecipes = await Recipe.countDocuments({ isApproved: false });
    const totalViews = await Recipe.aggregate([
      { $group: { _id: null, totalViews: { $sum: '$views' } } }
    ]);

    // Get recent users (last 7 days)
    const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
    const recentUsers = await User.countDocuments({ createdAt: { $gte: sevenDaysAgo } });

    // Get recent recipes (last 7 days)
    const recentRecipes = await Recipe.countDocuments({ createdAt: { $gte: sevenDaysAgo } });

    // Get top contributors
    const topContributors = await Recipe.aggregate([
      { $group: { _id: '$author', recipeCount: { $sum: 1 } } },
      { $sort: { recipeCount: -1 } },
      { $limit: 5 },
      { $lookup: { from: 'users', localField: '_id', foreignField: '_id', as: 'user' } },
      { $unwind: '$user' },
      { $project: { name: '$user.name', email: '$user.email', recipeCount: 1 } }
    ]);

    res.json({
      success: true,
      data: {
        totalUsers,
        totalRecipes,
        pendingRecipes,
        totalViews: totalViews[0]?.totalViews || 0,
        recentUsers,
        recentRecipes,
        topContributors
      }
    });
  } catch (error) {
    console.error('Admin dashboard error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// Get all users with pagination
router.get('/users', async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const users = await User.find()
      .select('-password')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const total = await User.countDocuments();

    res.json({
      success: true,
      data: users,
      pagination: {
        currentPage: page,
        totalPages: Math.ceil(total / limit),
        totalUsers: total
      }
    });
  } catch (error) {
    console.error('Get users error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// Get all recipes with pagination
router.get('/recipes', async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const recipes = await Recipe.find()
      .populate('author', 'name email')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const total = await Recipe.countDocuments();

    res.json({
      success: true,
      data: recipes,
      pagination: {
        currentPage: page,
        totalPages: Math.ceil(total / limit),
        totalRecipes: total
      }
    });
  } catch (error) {
    console.error('Get recipes error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// Approve/reject recipe
router.patch('/recipes/:id/approve', async (req, res) => {
  try {
    const { isApproved } = req.body;
    
    const recipe = await Recipe.findByIdAndUpdate(
      req.params.id,
      { isApproved },
      { new: true }
    ).populate('author', 'name email');

    if (!recipe) {
      return res.status(404).json({
        success: false,
        message: 'Recipe not found'
      });
    }

    res.json({
      success: true,
      message: `Recipe ${isApproved ? 'approved' : 'rejected'} successfully`,
      data: recipe
    });
  } catch (error) {
    console.error('Approve recipe error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// Feature/unfeature recipe
router.patch('/recipes/:id/feature', async (req, res) => {
  try {
    const { isFeatured } = req.body;
    
    const recipe = await Recipe.findByIdAndUpdate(
      req.params.id,
      { isFeatured },
      { new: true }
    ).populate('author', 'name email');

    if (!recipe) {
      return res.status(404).json({
        success: false,
        message: 'Recipe not found'
      });
    }

    res.json({
      success: true,
      message: `Recipe ${isFeatured ? 'featured' : 'unfeatured'} successfully`,
      data: recipe
    });
  } catch (error) {
    console.error('Feature recipe error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// Delete recipe
router.delete('/recipes/:id', async (req, res) => {
  try {
    const recipe = await Recipe.findByIdAndDelete(req.params.id);

    if (!recipe) {
      return res.status(404).json({
        success: false,
        message: 'Recipe not found'
      });
    }

    res.json({
      success: true,
      message: 'Recipe deleted successfully'
    });
  } catch (error) {
    console.error('Delete recipe error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// Update user role
router.patch('/users/:id/role', async (req, res) => {
  try {
    const { role } = req.body;
    
    if (!['user', 'admin'].includes(role)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid role'
      });
    }

    const user = await User.findByIdAndUpdate(
      req.params.id,
      { role },
      { new: true }
    ).select('-password');

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    res.json({
      success: true,
      message: 'User role updated successfully',
      data: user
    });
  } catch (error) {
    console.error('Update user role error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// Deactivate/activate user
router.patch('/users/:id/status', async (req, res) => {
  try {
    const { isActive } = req.body;
    
    const user = await User.findByIdAndUpdate(
      req.params.id,
      { isActive },
      { new: true }
    ).select('-password');

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    res.json({
      success: true,
      message: `User ${isActive ? 'activated' : 'deactivated'} successfully`,
      data: user
    });
  } catch (error) {
    console.error('Update user status error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

module.exports = router;