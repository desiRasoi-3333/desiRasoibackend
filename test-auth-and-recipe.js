const axios = require('axios');

const API_BASE = 'http://localhost:5000/api';

async function testAuthAndRecipe() {
  try {
    console.log('🔍 Testing authentication and recipe creation...\n');

    // Test 1: Check if backend is running
    console.log('1. Testing backend health...');
    const healthResponse = await axios.get(`${API_BASE}/health`);
    console.log('✅ Backend is running:', healthResponse.data.message);

    // Test 2: Try to login with admin credentials
    console.log('\n2. Testing login...');
    const loginData = {
      email: 'admin@desirasoi.com',
      password: 'admin123'
    };

    const loginResponse = await axios.post(`${API_BASE}/auth/login`, loginData);
    console.log('✅ Login successful:', loginResponse.data.message);
    console.log('User:', loginResponse.data.user.name, '- Role:', loginResponse.data.user.role);
    
    const token = loginResponse.data.token;
    console.log('Token received:', token.substring(0, 20) + '...');

    // Test 3: Test protected route (get user profile)
    console.log('\n3. Testing protected route...');
    const profileResponse = await axios.get(`${API_BASE}/auth/me`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    console.log('✅ Profile retrieved:', profileResponse.data.user.name);

    // Test 4: Test recipe creation with minimal data
    console.log('\n4. Testing recipe creation...');
    
    // Create a simple recipe data
    const recipeData = {
      title: 'Test Recipe',
      description: 'This is a test recipe to check if the API is working properly.',
      region: JSON.stringify({ state: 'Punjab', city: 'Amritsar' }),
      cookingTime: JSON.stringify({ prep: 30, cook: 45 }),
      servings: 4,
      difficulty: 'Easy',
      dietaryInfo: JSON.stringify({
        isVegetarian: true,
        isVegan: false,
        spiceLevel: 'Medium',
        allergens: []
      }),
      ingredients: JSON.stringify([
        { name: 'Rice', quantity: '2 cups', category: 'Main' },
        { name: 'Salt', quantity: '1 tsp', category: 'Spices' }
      ]),
      instructions: JSON.stringify([
        { step: 1, title: 'Prepare Rice', description: 'Wash and soak rice for 30 minutes', time: '30', tips: 'Use basmati rice for best results' }
      ]),
      tags: JSON.stringify(['test', 'simple']),
      nutritionInfo: JSON.stringify({ calories: 200, protein: 5, carbs: 40, fat: 2 })
    };

    // Create FormData
    const FormData = require('form-data');
    const fs = require('fs');
    const path = require('path');
    
    const formData = new FormData();
    
    // Add all recipe fields
    Object.keys(recipeData).forEach(key => {
      formData.append(key, recipeData[key]);
    });
    
    // Create a dummy image file for testing
    const dummyImagePath = path.join(__dirname, 'test-image.txt');
    fs.writeFileSync(dummyImagePath, 'This is a dummy image file for testing');
    formData.append('image', fs.createReadStream(dummyImagePath), {
      filename: 'test-image.jpg',
      contentType: 'image/jpeg'
    });

    try {
      const recipeResponse = await axios.post(`${API_BASE}/recipes`, formData, {
        headers: {
          'Authorization': `Bearer ${token}`,
          ...formData.getHeaders()
        }
      });
      console.log('✅ Recipe created successfully:', recipeResponse.data.message);
      console.log('Recipe ID:', recipeResponse.data.data._id);
      
      // Clean up dummy file
      fs.unlinkSync(dummyImagePath);
      
    } catch (recipeError) {
      console.log('❌ Recipe creation failed:', recipeError.response?.data || recipeError.message);
      
      // Clean up dummy file
      if (fs.existsSync(dummyImagePath)) {
        fs.unlinkSync(dummyImagePath);
      }
    }

  } catch (error) {
    console.error('❌ Test failed:', error.response?.data || error.message);
  }
}

testAuthAndRecipe();