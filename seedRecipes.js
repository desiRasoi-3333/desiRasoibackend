const mongoose = require('mongoose');
const Recipe = require('./models/Recipe');
const User = require('./models/User');
require('dotenv').config();

const sampleRecipes = [
  {
    title: 'Butter Chicken',
    description: 'Creamy and rich North Indian curry with tender chicken pieces in a tomato-based sauce',
    region: { state: 'Punjab', city: 'Amritsar' },
    cookingTime: { prep: 20, cook: 40 },
    servings: 4,
    difficulty: 'Medium',
    dietaryInfo: { 
      isVegetarian: false, 
      isVegan: false,
      spiceLevel: 'Medium',
      allergens: ['Dairy', 'Nuts']
    },
    ingredients: [
      { name: 'Chicken (boneless)', quantity: '500g', category: 'Protein' },
      { name: 'Butter', quantity: '3 tbsp', category: 'Dairy' },
      { name: 'Heavy cream', quantity: '1/2 cup', category: 'Dairy' },
      { name: 'Tomato puree', quantity: '1 cup', category: 'Vegetables' },
      { name: 'Onion (large)', quantity: '1', category: 'Vegetables' },
      { name: 'Garlic cloves', quantity: '4', category: 'Aromatics' },
      { name: 'Ginger', quantity: '1 inch piece', category: 'Aromatics' },
      { name: 'Garam masala', quantity: '1 tsp', category: 'Spices' },
      { name: 'Cumin powder', quantity: '1 tsp', category: 'Spices' },
      { name: 'Coriander powder', quantity: '1 tsp', category: 'Spices' },
      { name: 'Red chili powder', quantity: '1/2 tsp', category: 'Spices' },
      { name: 'Turmeric powder', quantity: '1/4 tsp', category: 'Spices' },
      { name: 'Salt', quantity: 'to taste', category: 'Seasoning' },
      { name: 'Fresh cilantro', quantity: '2 tbsp', category: 'Herbs' }
    ],
    instructions: [
      {
        step: 1,
        title: 'Marinate the chicken',
        description: 'Cut chicken into bite-sized pieces. Marinate with salt, turmeric, and half the ginger-garlic paste for 15 minutes.',
        time: 15,
        tips: 'Marinating helps the chicken absorb flavors better'
      },
      {
        step: 2,
        title: 'Prepare the base',
        description: 'Heat butter in a heavy-bottomed pan. Add remaining ginger-garlic paste and sauté until fragrant.',
        time: 3,
        tips: 'Don\'t let the garlic burn as it will make the dish bitter'
      },
      {
        step: 3,
        title: 'Cook the chicken',
        description: 'Add marinated chicken pieces and cook until they turn white and are 80% cooked.',
        time: 8,
        tips: 'Don\'t overcook at this stage as chicken will cook more in the sauce'
      },
      {
        step: 4,
        title: 'Add tomatoes and spices',
        description: 'Add tomato puree, all the spice powders, and salt. Cook until the oil separates from the mixture.',
        time: 10,
        tips: 'This step is crucial for developing the rich flavor base'
      },
      {
        step: 5,
        title: 'Simmer and finish',
        description: 'Add heavy cream and simmer for 5-7 minutes. Garnish with fresh cilantro and serve hot.',
        time: 7,
        tips: 'Add cream gradually to prevent curdling'
      }
    ],
    tags: ['North Indian', 'Curry', 'Chicken', 'Creamy', 'Restaurant Style'],
    image: {
      url: 'https://images.unsplash.com/photo-1588166524941-3bf61a9c41db?w=800',
      public_id: 'sample_butter_chicken'
    },
    isApproved: true,
    isFeatured: true,
    views: 1250,
    averageRating: 4.5,
    totalRatings: 128
  },
  {
    title: 'Masala Dosa',
    description: 'Crispy South Indian crepe filled with spiced potato mixture, served with coconut chutney and sambar',
    region: { state: 'Tamil Nadu', city: 'Chennai' },
    cookingTime: { prep: 30, cook: 20 },
    servings: 2,
    difficulty: 'Hard',
    dietaryInfo: { 
      isVegetarian: true, 
      isVegan: true,
      spiceLevel: 'Mild',
      allergens: []
    },
    ingredients: [
      { name: 'Dosa batter', quantity: '2 cups', category: 'Main' },
      { name: 'Potatoes', quantity: '4 medium', category: 'Vegetables' },
      { name: 'Onions', quantity: '2 medium', category: 'Vegetables' },
      { name: 'Green chilies', quantity: '3', category: 'Spices' },
      { name: 'Mustard seeds', quantity: '1 tsp', category: 'Spices' },
      { name: 'Cumin seeds', quantity: '1 tsp', category: 'Spices' },
      { name: 'Curry leaves', quantity: '10-12', category: 'Herbs' },
      { name: 'Turmeric powder', quantity: '1/2 tsp', category: 'Spices' },
      { name: 'Oil', quantity: '3 tbsp', category: 'Others' },
      { name: 'Salt', quantity: 'to taste', category: 'Seasoning' }
    ],
    instructions: [
      {
        step: 1,
        title: 'Prepare potato filling',
        description: 'Boil potatoes until tender, peel and mash roughly. Heat oil, add mustard seeds, cumin seeds, and curry leaves.',
        time: 15,
        tips: 'Don\'t mash potatoes completely smooth - some texture is good'
      },
      {
        step: 2,
        title: 'Make the masala',
        description: 'Add chopped onions and green chilies. Sauté until onions are translucent. Add turmeric and mashed potatoes.',
        time: 8,
        tips: 'Cook until the mixture is well combined and aromatic'
      },
      {
        step: 3,
        title: 'Prepare dosa',
        description: 'Heat a non-stick pan, pour dosa batter and spread thin. Cook until golden and crispy.',
        time: 5,
        tips: 'The pan should be hot but not smoking'
      },
      {
        step: 4,
        title: 'Fill and serve',
        description: 'Place potato filling on one side of dosa, fold and serve hot with coconut chutney and sambar.',
        time: 2,
        tips: 'Serve immediately for best taste and texture'
      }
    ],
    tags: ['South Indian', 'Breakfast', 'Vegetarian', 'Crispy', 'Traditional'],
    image: {
      url: 'https://images.unsplash.com/photo-1567188040759-fb8a883dc6d8?w=800',
      public_id: 'sample_masala_dosa'
    },
    isApproved: true,
    isFeatured: true,
    views: 890,
    averageRating: 4.8,
    totalRatings: 95
  },
  {
    title: 'Dal Baati Churma',
    description: 'Traditional Rajasthani dish with lentil curry, baked wheat balls, and sweet crumble',
    region: { state: 'Rajasthan', city: 'Jaipur' },
    cookingTime: { prep: 45, cook: 90 },
    servings: 6,
    difficulty: 'Hard',
    dietaryInfo: { 
      isVegetarian: true, 
      isVegan: false,
      spiceLevel: 'Medium',
      allergens: ['Dairy']
    },
    ingredients: [
      { name: 'Whole wheat flour', quantity: '2 cups', category: 'Main' },
      { name: 'Mixed dal (lentils)', quantity: '1 cup', category: 'Protein' },
      { name: 'Ghee', quantity: '1/2 cup', category: 'Dairy' },
      { name: 'Jaggery', quantity: '1/2 cup', category: 'Others' },
      { name: 'Almonds', quantity: '1/4 cup', category: 'Nuts' },
      { name: 'Cardamom powder', quantity: '1 tsp', category: 'Spices' },
      { name: 'Ginger-garlic paste', quantity: '2 tbsp', category: 'Aromatics' },
      { name: 'Red chili powder', quantity: '1 tsp', category: 'Spices' },
      { name: 'Turmeric powder', quantity: '1/2 tsp', category: 'Spices' },
      { name: 'Asafoetida', quantity: '1/4 tsp', category: 'Spices' }
    ],
    instructions: [
      {
        step: 1,
        title: 'Prepare baati dough',
        description: 'Mix wheat flour with ghee and water to form a stiff dough. Make small balls and bake in oven at 180°C.',
        time: 30,
        tips: 'The dough should be firm, not soft like roti dough'
      },
      {
        step: 2,
        title: 'Cook dal',
        description: 'Pressure cook mixed dal with turmeric. In a pan, heat ghee and add spices, then cooked dal.',
        time: 25,
        tips: 'Dal should be thick, not watery'
      },
      {
        step: 3,
        title: 'Make churma',
        description: 'Crush baked baati, mix with ghee, jaggery, cardamom powder, and chopped almonds.',
        time: 15,
        tips: 'Churma should be sweet and crumbly'
      },
      {
        step: 4,
        title: 'Serve together',
        description: 'Serve hot baati with dal and churma. Break baati and pour dal over it.',
        time: 5,
        tips: 'This is traditionally eaten with hands'
      }
    ],
    tags: ['Rajasthani', 'Traditional', 'Vegetarian', 'Festival Food', 'Royal'],
    image: {
      url: 'https://images.unsplash.com/photo-1585937421612-70a008356fbe?w=800',
      public_id: 'sample_dal_baati_churma'
    },
    isApproved: true,
    views: 654,
    averageRating: 4.3,
    totalRatings: 67
  },
  {
    title: 'Fish Curry',
    description: 'Authentic Kerala fish curry with coconut milk, curry leaves, and aromatic spices',
    region: { state: 'Kerala', city: 'Kochi' },
    cookingTime: { prep: 15, cook: 25 },
    servings: 4,
    difficulty: 'Easy',
    dietaryInfo: { 
      isVegetarian: false, 
      isVegan: false,
      spiceLevel: 'Hot',
      allergens: []
    },
    ingredients: [
      { name: 'Fish (kingfish/pomfret)', quantity: '500g', category: 'Protein' },
      { name: 'Coconut milk', quantity: '1 cup', category: 'Dairy' },
      { name: 'Onions', quantity: '2 medium', category: 'Vegetables' },
      { name: 'Tomatoes', quantity: '2 medium', category: 'Vegetables' },
      { name: 'Green chilies', quantity: '4', category: 'Spices' },
      { name: 'Curry leaves', quantity: '15-20', category: 'Herbs' },
      { name: 'Ginger-garlic paste', quantity: '2 tbsp', category: 'Aromatics' },
      { name: 'Red chili powder', quantity: '2 tsp', category: 'Spices' },
      { name: 'Coriander powder', quantity: '1 tsp', category: 'Spices' },
      { name: 'Turmeric powder', quantity: '1/2 tsp', category: 'Spices' },
      { name: 'Coconut oil', quantity: '3 tbsp', category: 'Others' },
      { name: 'Tamarind paste', quantity: '1 tsp', category: 'Others' }
    ],
    instructions: [
      {
        step: 1,
        title: 'Prepare fish',
        description: 'Clean fish and cut into pieces. Marinate with turmeric, salt, and a little chili powder for 10 minutes.',
        time: 10,
        tips: 'Use fresh fish for best results'
      },
      {
        step: 2,
        title: 'Make base curry',
        description: 'Heat coconut oil, add curry leaves, onions, and ginger-garlic paste. Sauté until golden.',
        time: 8,
        tips: 'Coconut oil gives authentic Kerala flavor'
      },
      {
        step: 3,
        title: 'Add spices and tomatoes',
        description: 'Add all spice powders, green chilies, and chopped tomatoes. Cook until tomatoes break down.',
        time: 5,
        tips: 'Cook spices well to avoid raw taste'
      },
      {
        step: 4,
        title: 'Add fish and coconut milk',
        description: 'Add marinated fish pieces and coconut milk. Simmer for 8-10 minutes until fish is cooked.',
        time: 10,
        tips: 'Don\'t overcook fish as it will break apart'
      }
    ],
    tags: ['Kerala', 'Coastal', 'Spicy', 'Coconut', 'Traditional'],
    image: {
      url: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=800',
      public_id: 'sample_fish_curry'
    },
    isApproved: true,
    views: 987,
    averageRating: 4.6,
    totalRatings: 112
  },
  {
    title: 'Dhokla',
    description: 'Steamed savory cake from Gujarat, light and fluffy with a tangy and sweet flavor',
    region: { state: 'Gujarat', city: 'Ahmedabad' },
    cookingTime: { prep: 20, cook: 30 },
    servings: 8,
    difficulty: 'Medium',
    dietaryInfo: { 
      isVegetarian: true, 
      isVegan: true,
      spiceLevel: 'Mild',
      allergens: []
    },
    ingredients: [
      { name: 'Gram flour (besan)', quantity: '1 cup', category: 'Main' },
      { name: 'Semolina (rava)', quantity: '2 tbsp', category: 'Main' },
      { name: 'Yogurt', quantity: '1/2 cup', category: 'Dairy' },
      { name: 'Ginger-green chili paste', quantity: '1 tbsp', category: 'Aromatics' },
      { name: 'Lemon juice', quantity: '2 tbsp', category: 'Others' },
      { name: 'Eno fruit salt', quantity: '1 tsp', category: 'Others' },
      { name: 'Mustard seeds', quantity: '1 tsp', category: 'Spices' },
      { name: 'Sesame seeds', quantity: '1 tsp', category: 'Others' },
      { name: 'Curry leaves', quantity: '10', category: 'Herbs' },
      { name: 'Green chilies', quantity: '2', category: 'Spices' },
      { name: 'Oil', quantity: '3 tbsp', category: 'Others' },
      { name: 'Salt', quantity: 'to taste', category: 'Seasoning' }
    ],
    instructions: [
      {
        step: 1,
        title: 'Prepare batter',
        description: 'Mix gram flour, semolina, yogurt, ginger-chili paste, and salt. Add water to make smooth batter.',
        time: 10,
        tips: 'Batter should be of pouring consistency'
      },
      {
        step: 2,
        title: 'Add leavening agent',
        description: 'Add lemon juice and eno fruit salt to batter. Mix gently and immediately pour into greased steaming tray.',
        time: 2,
        tips: 'Work quickly after adding eno to retain fluffiness'
      },
      {
        step: 3,
        title: 'Steam dhokla',
        description: 'Steam for 15-20 minutes until a toothpick inserted comes out clean. Cool for 5 minutes.',
        time: 20,
        tips: 'Don\'t open steamer frequently during cooking'
      },
      {
        step: 4,
        title: 'Prepare tempering',
        description: 'Heat oil, add mustard seeds, sesame seeds, curry leaves, and green chilies. Pour over dhokla.',
        time: 3,
        tips: 'Tempering should be hot when poured over dhokla'
      }
    ],
    tags: ['Gujarati', 'Steamed', 'Healthy', 'Snack', 'Traditional'],
    image: {
      url: 'https://images.unsplash.com/photo-1606491956689-2ea866880c84?w=800',
      public_id: 'sample_dhokla'
    },
    isApproved: true,
    views: 543,
    averageRating: 4.4,
    totalRatings: 89
  },
  {
    title: 'Hyderabadi Biryani',
    description: 'Fragrant rice dish with aromatic spices, tender mutton, and saffron from the royal kitchens of Hyderabad',
    region: { state: 'Telangana', city: 'Hyderabad' },
    cookingTime: { prep: 60, cook: 45 },
    servings: 6,
    difficulty: 'Hard',
    dietaryInfo: { 
      isVegetarian: false, 
      isVegan: false,
      spiceLevel: 'Medium',
      allergens: ['Dairy', 'Nuts']
    },
    ingredients: [
      { name: 'Basmati rice', quantity: '500g', category: 'Main' },
      { name: 'Mutton', quantity: '750g', category: 'Protein' },
      { name: 'Yogurt', quantity: '1 cup', category: 'Dairy' },
      { name: 'Onions', quantity: '4 large', category: 'Vegetables' },
      { name: 'Saffron', quantity: '1/2 tsp', category: 'Spices' },
      { name: 'Warm milk', quantity: '1/4 cup', category: 'Dairy' },
      { name: 'Ghee', quantity: '1/2 cup', category: 'Dairy' },
      { name: 'Ginger-garlic paste', quantity: '3 tbsp', category: 'Aromatics' },
      { name: 'Red chili powder', quantity: '2 tsp', category: 'Spices' },
      { name: 'Biryani masala powder', quantity: '2 tbsp', category: 'Spices' },
      { name: 'Mint leaves', quantity: '1/2 cup', category: 'Herbs' },
      { name: 'Coriander leaves', quantity: '1/2 cup', category: 'Herbs' },
      { name: 'Cashews', quantity: '1/4 cup', category: 'Nuts' },
      { name: 'Raisins', quantity: '2 tbsp', category: 'Others' }
    ],
    instructions: [
      {
        step: 1,
        title: 'Marinate mutton',
        description: 'Marinate mutton with yogurt, ginger-garlic paste, chili powder, and biryani masala for 2 hours.',
        time: 120,
        tips: 'Longer marination gives better flavor'
      },
      {
        step: 2,
        title: 'Prepare rice',
        description: 'Soak basmati rice for 30 minutes. Boil with whole spices until 70% cooked. Drain and set aside.',
        time: 20,
        tips: 'Rice should be firm, not fully cooked'
      },
      {
        step: 3,
        title: 'Cook mutton',
        description: 'Cook marinated mutton in heavy-bottomed pot until 80% done. Add fried onions, mint, and coriander.',
        time: 40,
        tips: 'Mutton should be tender but not falling apart'
      },
      {
        step: 4,
        title: 'Layer and dum cook',
        description: 'Layer rice over mutton, sprinkle saffron milk, ghee, and remaining herbs. Cover and cook on dum for 45 minutes.',
        time: 45,
        tips: 'Seal pot edges with dough for perfect dum cooking'
      }
    ],
    tags: ['Hyderabadi', 'Royal', 'Biryani', 'Mutton', 'Festive'],
    image: {
      url: 'https://images.unsplash.com/photo-1563379091339-03246963d51a?w=800',
      public_id: 'sample_biryani'
    },
    isApproved: true,
    isFeatured: true,
    views: 1876,
    averageRating: 4.7,
    totalRatings: 203
  },
  {
    title: 'Chole Bhature',
    description: 'Popular North Indian dish with spicy chickpea curry and fluffy deep-fried bread',
    region: { state: 'Punjab', city: 'Delhi' },
    cookingTime: { prep: 30, cook: 45 },
    servings: 4,
    difficulty: 'Medium',
    dietaryInfo: { 
      isVegetarian: true, 
      isVegan: false,
      spiceLevel: 'Medium',
      allergens: ['Gluten']
    },
    ingredients: [
      { name: 'Chickpeas (dried)', quantity: '1 cup', category: 'Protein' },
      { name: 'All-purpose flour', quantity: '2 cups', category: 'Main' },
      { name: 'Yogurt', quantity: '1/4 cup', category: 'Dairy' },
      { name: 'Onions', quantity: '2 large', category: 'Vegetables' },
      { name: 'Tomatoes', quantity: '3 medium', category: 'Vegetables' },
      { name: 'Ginger-garlic paste', quantity: '2 tbsp', category: 'Aromatics' },
      { name: 'Chole masala powder', quantity: '2 tbsp', category: 'Spices' },
      { name: 'Red chili powder', quantity: '1 tsp', category: 'Spices' },
      { name: 'Turmeric powder', quantity: '1/2 tsp', category: 'Spices' },
      { name: 'Garam masala', quantity: '1 tsp', category: 'Spices' },
      { name: 'Baking powder', quantity: '1/2 tsp', category: 'Others' },
      { name: 'Oil for frying', quantity: '2 cups', category: 'Others' }
    ],
    instructions: [
      {
        step: 1,
        title: 'Prepare chickpeas',
        description: 'Soak chickpeas overnight. Pressure cook with salt and tea bags until soft and well-cooked.',
        time: 30,
        tips: 'Tea bags give the dark color to chole'
      },
      {
        step: 2,
        title: 'Make bhature dough',
        description: 'Mix flour, yogurt, baking powder, and salt. Knead into soft dough. Rest for 2 hours.',
        time: 15,
        tips: 'Dough should be soft and pliable'
      },
      {
        step: 3,
        title: 'Prepare chole curry',
        description: 'Heat oil, sauté onions until golden. Add ginger-garlic paste, tomatoes, and all spices. Add cooked chickpeas.',
        time: 20,
        tips: 'Cook until oil separates from the masala'
      },
      {
        step: 4,
        title: 'Fry bhature',
        description: 'Roll bhature dough into circles. Deep fry in hot oil until puffed and golden. Serve hot with chole.',
        time: 15,
        tips: 'Oil should be hot enough for bhature to puff immediately'
      }
    ],
    tags: ['Punjabi', 'Street Food', 'Vegetarian', 'Spicy', 'Popular'],
    image: {
      url: 'https://images.unsplash.com/photo-1601050690597-df0568f70950?w=800',
      public_id: 'sample_chole_bhature'
    },
    isApproved: true,
    views: 1123,
    averageRating: 4.5,
    totalRatings: 156
  },
  {
    title: 'Rogan Josh',
    description: 'Aromatic Kashmiri lamb curry with rich red color and complex flavors',
    region: { state: 'Jammu and Kashmir', city: 'Srinagar' },
    cookingTime: { prep: 20, cook: 90 },
    servings: 4,
    difficulty: 'Hard',
    dietaryInfo: { 
      isVegetarian: false, 
      isVegan: false,
      spiceLevel: 'Medium',
      allergens: ['Dairy']
    },
    ingredients: [
      { name: 'Lamb/Mutton', quantity: '750g', category: 'Protein' },
      { name: 'Yogurt', quantity: '1/2 cup', category: 'Dairy' },
      { name: 'Onions', quantity: '2 large', category: 'Vegetables' },
      { name: 'Kashmiri red chili powder', quantity: '2 tbsp', category: 'Spices' },
      { name: 'Fennel powder', quantity: '1 tsp', category: 'Spices' },
      { name: 'Ginger powder', quantity: '1 tsp', category: 'Spices' },
      { name: 'Asafoetida', quantity: '1/4 tsp', category: 'Spices' },
      { name: 'Bay leaves', quantity: '2', category: 'Herbs' },
      { name: 'Green cardamom', quantity: '4', category: 'Spices' },
      { name: 'Cinnamon stick', quantity: '1 inch', category: 'Spices' },
      { name: 'Ghee', quantity: '4 tbsp', category: 'Dairy' },
      { name: 'Salt', quantity: 'to taste', category: 'Seasoning' }
    ],
    instructions: [
      {
        step: 1,
        title: 'Marinate meat',
        description: 'Cut lamb into pieces. Marinate with yogurt, salt, and half the red chili powder for 30 minutes.',
        time: 30,
        tips: 'Use tender cuts of lamb for best results'
      },
      {
        step: 2,
        title: 'Prepare onion paste',
        description: 'Fry sliced onions until golden brown. Cool and make a smooth paste with little water.',
        time: 15,
        tips: 'Well-fried onions give rich flavor and color'
      },
      {
        step: 3,
        title: 'Cook meat',
        description: 'Heat ghee, add whole spices, then marinated meat. Cook on high heat until meat changes color.',
        time: 15,
        tips: 'High heat seals the meat and retains juices'
      },
      {
        step: 4,
        title: 'Add spices and simmer',
        description: 'Add onion paste, remaining spices, and water. Cover and simmer for 60-75 minutes until tender.',
        time: 75,
        tips: 'Slow cooking makes the meat tender and flavorful'
      }
    ],
    tags: ['Kashmiri', 'Lamb', 'Royal', 'Aromatic', 'Traditional'],
    image: {
      url: 'https://images.unsplash.com/photo-1585937421612-70a008356fbe?w=800',
      public_id: 'sample_rogan_josh'
    },
    isApproved: true,
    views: 789,
    averageRating: 4.6,
    totalRatings: 98
  }
];

const seedRecipes = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log('Connected to MongoDB');

    // Clear existing recipes
    await Recipe.deleteMany({});
    console.log('Cleared existing recipes');

    // Create a default user if none exists
    let defaultUser = await User.findOne({ email: 'admin@desirasoi.com' });
    if (!defaultUser) {
      defaultUser = await User.create({
        name: 'Desi Rasoi Admin',
        email: 'admin@desirasoi.com',
        password: 'admin123',
        role: 'admin',
        isActive: true
      });
      console.log('Created default admin user');
    }

    // Add author to each recipe
    const recipesWithAuthor = sampleRecipes.map(recipe => ({
      ...recipe,
      author: defaultUser._id
    }));

    // Insert sample recipes
    const createdRecipes = await Recipe.insertMany(recipesWithAuthor);
    console.log(`Created ${createdRecipes.length} sample recipes`);

    console.log('✅ Database seeded successfully!');
    console.log('\n📊 Sample Recipes Created:');
    createdRecipes.forEach((recipe, index) => {
      console.log(`${index + 1}. ${recipe.title} (${recipe.region.state})`);
    });

    console.log('\n🔑 Admin Login Credentials:');
    console.log('Email: admin@desirasoi.com');
    console.log('Password: admin123');

    process.exit(0);
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
};

// Run the seed function
seedRecipes();