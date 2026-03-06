const mongoose = require('mongoose');
const User = require('./models/User');
const Recipe = require('./models/Recipe');
require('dotenv').config();

const sampleUsers = [
  {
    name: 'Admin User',
    email: 'admin@desirasoi.com',
    password: 'admin123',
    role: 'admin'
  },
  {
    name: 'Priya Sharma',
    email: 'priya@example.com',
    password: 'password123',
    role: 'user',
    bio: 'Home cook from Punjab, loves sharing traditional recipes'
  }
];

const sampleRecipes = [
  {
    title: 'Butter Chicken',
    description: 'Creamy and rich chicken curry from Punjab',
    ingredients: [
      { name: 'Chicken', quantity: '500', unit: 'grams' },
      { name: 'Butter', quantity: '2', unit: 'tbsp' },
      { name: 'Cream', quantity: '1/2', unit: 'cup' }
    ],
    instructions: [
      { step: 1, description: 'Marinate chicken with spices' },
      { step: 2, description: 'Cook chicken until tender' },
      { step: 3, description: 'Add cream and simmer' }
    ],
    region: { state: 'Punjab', city: 'Amritsar' },
    cookingTime: { prep: 30, cook: 45 },
    servings: 4,
    difficulty: 'Medium',
    dietaryInfo: {
      isVegetarian: false,
      spiceLevel: 'Medium'
    },
    tags: ['punjabi', 'chicken', 'curry', 'popular']
  }
];

const seedDatabase = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    // Clear existing data
    await User.deleteMany({});
    await Recipe.deleteMany({});

    // Create users
    const users = await User.create(sampleUsers);
    console.log('Sample users created');

    // Create recipes with user references
    const recipesWithAuthors = sampleRecipes.map(recipe => ({
      ...recipe,
      author: users[1]._id, // Assign to regular user
      image: {
        url: 'https://via.placeholder.com/400x300?text=Recipe+Image'
      }
    }));

    await Recipe.create(recipesWithAuthors);
    console.log('Sample recipes created');

    console.log('Database seeded successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Seeding failed:', error);
    process.exit(1);
  }
};

seedDatabase();