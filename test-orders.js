async function testOrdersEndpoint() {
  try {
    console.log('Testing orders endpoint with token...');
    
    // First login to get token
    const loginResponse = await fetch('http://localhost:3000/api/auth/login', {
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
    console.log('Login successful, token received');
    
    // Test orders endpoint
    const ordersResponse = await fetch('http://localhost:3000/api/orders', {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${loginData.token}`,
        'Content-Type': 'application/json'
      }
    });
    
    const ordersData = await ordersResponse.json();
    console.log('Orders Response:', JSON.stringify(ordersData, null, 2));
    
  } catch (error) {
    console.error('Test failed:', error.message);
  }
}

testOrdersEndpoint();