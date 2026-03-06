const mongoose = require('mongoose');

const recipeSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Recipe title is required'],
    trim: true,
    maxlength: [100, 'Title cannot exceed 100 characters']
  },
  description: {
    type: String,
    required: [true, 'Recipe description is required'],
    maxlength: [500, 'Description cannot exceed 500 characters']
  },
  ingredients: [{
    name: {
      type: String,
      required: true,
      trim: true
    },
    quantity: {
      type: String,
      required: true,
      trim: true
    },
    unit: {
      type: String,
      trim: true
    },
    category: {
      type: String,
      trim: true,
      enum: ['Main', 'Spices', 'Vegetables', 'Dairy', 'Protein', 'Herbs', 'Others'],
      default: 'Main'
    }
  }],
  instructions: [{
    step: {
      type: Number,
      required: true
    },
    title: {
      type: String,
      trim: true
    },
    description: {
      type: String,
      required: true,
      maxlength: [500, 'Step description cannot exceed 500 characters']
    },
    time: {
      type: String,
      trim: true
    },
    tips: {
      type: String,
      trim: true,
      maxlength: [200, 'Tips cannot exceed 200 characters']
    }
  }],
  region: {
    state: {
      type: String,
      required: [true, 'State is required'],
      trim: true
    },
    city: {
      type: String,
      trim: true
    },
    coordinates: {
      latitude: Number,
      longitude: Number
    }
  },
  image: {
    public_id: String,
    url: {
      type: String,
      required: [true, 'Recipe image is required']
    }
  },
  cookingTime: {
    prep: {
      type: Number,
      required: [true, 'Prep time is required'],
      min: [1, 'Prep time must be at least 1 minute']
    },
    cook: {
      type: Number,
      required: [true, 'Cook time is required'],
      min: [1, 'Cook time must be at least 1 minute']
    }
  },
  difficulty: {
    type: String,
    enum: ['Easy', 'Medium', 'Hard'],
    default: 'Medium'
  },
  servings: {
    type: Number,
    required: [true, 'Number of servings is required'],
    min: [1, 'Servings must be at least 1']
  },
  dietaryInfo: {
    isVegetarian: {
      type: Boolean,
      default: true
    },
    isVegan: {
      type: Boolean,
      default: false
    },
    isGlutenFree: {
      type: Boolean,
      default: false
    },
    spiceLevel: {
      type: String,
      enum: ['Mild', 'Medium', 'Hot', 'Very Hot'],
      default: 'Medium'
    },
    allergens: [{
      type: String,
      trim: true
    }]
  },
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  likes: [{
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    createdAt: {
      type: Date,
      default: Date.now
    }
  }],
  comments: [{
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    text: {
      type: String,
      required: true,
      maxlength: [300, 'Comment cannot exceed 300 characters']
    },
    rating: {
      type: Number,
      min: 1,
      max: 5
    },
    createdAt: {
      type: Date,
      default: Date.now
    }
  }],
  averageRating: {
    type: Number,
    default: 0,
    min: 0,
    max: 5
  },
  totalRatings: {
    type: Number,
    default: 0
  },
  views: {
    type: Number,
    default: 0
  },
  isApproved: {
    type: Boolean,
    default: true
  },
  isFeatured: {
    type: Boolean,
    default: false
  },
  tags: [{
    type: String,
    trim: true,
    lowercase: true
  }],
  nutritionInfo: {
    calories: {
      type: Number,
      min: 0
    },
    protein: {
      type: Number,
      min: 0
    },
    carbs: {
      type: Number,
      min: 0
    },
    fat: {
      type: Number,
      min: 0
    }
  }
}, {
  timestamps: true
});

// Indexes for better query performance
recipeSchema.index({ 'region.state': 1 });
recipeSchema.index({ 'dietaryInfo.isVegetarian': 1 });
recipeSchema.index({ author: 1 });
recipeSchema.index({ averageRating: -1 });
recipeSchema.index({ views: -1 });
recipeSchema.index({ createdAt: -1 });
recipeSchema.index({ tags: 1 });
recipeSchema.index({ title: 'text', description: 'text', tags: 'text' });

// Virtual for total cooking time
recipeSchema.virtual('totalTime').get(function() {
  return this.cookingTime.prep + this.cookingTime.cook;
});

// Virtual for likes count
recipeSchema.virtual('likesCount').get(function() {
  return this.likes.length;
});

// Virtual for comments count
recipeSchema.virtual('commentsCount').get(function() {
  return this.comments.length;
});

// Method to calculate average rating
recipeSchema.methods.calculateAverageRating = function() {
  const ratings = this.comments.filter(comment => comment.rating);
  if (ratings.length === 0) {
    this.averageRating = 0;
    this.totalRatings = 0;
  } else {
    const sum = ratings.reduce((acc, comment) => acc + comment.rating, 0);
    this.averageRating = Math.round((sum / ratings.length) * 10) / 10;
    this.totalRatings = ratings.length;
  }
};

// Method to increment views
recipeSchema.methods.incrementViews = async function() {
  this.views += 1;
  await this.save();
};

// Pre-save middleware to calculate rating
recipeSchema.pre('save', function(next) {
  if (this.isModified('comments')) {
    this.calculateAverageRating();
  }
  next();
});

// Transform output
recipeSchema.set('toJSON', { virtuals: true });
recipeSchema.set('toObject', { virtuals: true });

module.exports = mongoose.model('Recipe', recipeSchema);