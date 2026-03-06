const mongoose = require('mongoose');

const regionSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Region name is required'],
    unique: true,
    trim: true
  },
  state: {
    type: String,
    required: [true, 'State is required'],
    trim: true
  },
  coordinates: {
    latitude: {
      type: Number,
      required: true
    },
    longitude: {
      type: Number,
      required: true
    }
  },
  boundaries: {
    type: {
      type: String,
      enum: ['Polygon'],
      default: 'Polygon'
    },
    coordinates: {
      type: [[[Number]]], // GeoJSON Polygon format
      required: true
    }
  },
  description: {
    type: String,
    maxlength: [500, 'Description cannot exceed 500 characters']
  },
  popularDishes: [{
    type: String,
    trim: true
  }],
  cuisine: {
    type: String,
    trim: true
  },
  specialties: [{
    type: String,
    trim: true
  }],
  image: {
    public_id: String,
    url: String
  },
  recipesCount: {
    type: Number,
    default: 0
  },
  isActive: {
    type: Boolean,
    default: true
  },
  priority: {
    type: Number,
    default: 0 // Higher number = higher priority for display
  }
}, {
  timestamps: true
});

// Create 2dsphere index for geospatial queries
regionSchema.index({ boundaries: '2dsphere' });
regionSchema.index({ coordinates: '2dsphere' });
regionSchema.index({ state: 1 });
regionSchema.index({ priority: -1 });

// Method to update recipes count
regionSchema.methods.updateRecipesCount = async function() {
  const Recipe = mongoose.model('Recipe');
  this.recipesCount = await Recipe.countDocuments({ 
    'region.state': this.state,
    isApproved: true 
  });
  await this.save();
};

// Static method to find region by coordinates
regionSchema.statics.findByCoordinates = function(lat, lng) {
  return this.findOne({
    boundaries: {
      $geoIntersects: {
        $geometry: {
          type: 'Point',
          coordinates: [lng, lat]
        }
      }
    },
    isActive: true
  });
};

// Static method to get popular regions
regionSchema.statics.getPopularRegions = function(limit = 10) {
  return this.find({ isActive: true })
    .sort({ recipesCount: -1, priority: -1 })
    .limit(limit);
};

module.exports = mongoose.model('Region', regionSchema);