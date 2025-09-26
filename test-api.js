// Simple test script to verify API endpoints
const API_BASE_URL = 'http://localhost:3000/api';

async function testAPI() {
  console.log('Testing API endpoints...\n');
  
  // Test login endpoint
  try {
    console.log('Testing login endpoint...');
    const loginResponse = await fetch(`${API_BASE_URL}/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: 'buyer@example.com',
        password: 'password123'
      })
    });
    
    const loginData = await loginResponse.json();
    console.log('Login Response:', loginData);
    
    if (loginResponse.ok && loginData.token) {
      console.log('✅ Login successful!');
      
      // Test orders endpoint
      console.log('\nTesting orders endpoint...');
      const ordersResponse = await fetch(`${API_BASE_URL}/orders`, {
        headers: {
          'Authorization': `Bearer ${loginData.token}`
        }
      });
      
      const ordersData = await ordersResponse.json();
      console.log('Orders Response:', ordersData);
      
      if (ordersResponse.ok) {
        console.log('✅ Orders endpoint working!');
      } else {
        console.log('❌ Orders endpoint failed');
      }
      
      // Test suppliers endpoint
      console.log('\nTesting suppliers endpoint...');
      const suppliersResponse = await fetch(`${API_BASE_URL}/suppliers`, {
        headers: {
          'Authorization': `Bearer ${loginData.token}`
        }
      });
      
      const suppliersData = await suppliersResponse.json();
      console.log('Suppliers Response:', suppliersData);
      
      if (suppliersResponse.ok) {
        console.log('✅ Suppliers endpoint working!');
      } else {
        console.log('❌ Suppliers endpoint failed');
      }
      
      // Test notifications endpoint
      console.log('\nTesting notifications endpoint...');
      const notificationsResponse = await fetch(`${API_BASE_URL}/notifications`, {
        headers: {
          'Authorization': `Bearer ${loginData.token}`
        }
      });
      
      const notificationsData = await notificationsResponse.json();
      console.log('Notifications Response:', notificationsData);
      
      if (notificationsResponse.ok) {
        console.log('✅ Notifications endpoint working!');
      } else {
        console.log('❌ Notifications endpoint failed');
      }
      
      // Test messages endpoint
      console.log('\nTesting messages endpoint...');
      const messagesResponse = await fetch(`${API_BASE_URL}/messages`, {
        headers: {
          'Authorization': `Bearer ${loginData.token}`
        }
      });
      
      const messagesData = await messagesResponse.json();
      console.log('Messages Response:', messagesData);
      
      if (messagesResponse.ok) {
        console.log('✅ Messages endpoint working!');
      } else {
        console.log('❌ Messages endpoint failed');
      }
      
    } else {
      console.log('❌ Login failed');
    }
    
  } catch (error) {
    console.error('API test failed:', error);
  }
}

// Run the test
testAPI();