// Using built-in fetch (available in Node.js 18+)

const BASE_URL = 'http://localhost:3001/api';

async function testUpdateStatus() {
  console.log('🧪 Testing update-status endpoint...\n');

  try {
    // Test 1: Check if candidates routes are working
    console.log('1. Testing candidates test route...');
    const testResponse = await fetch(`${BASE_URL}/test`);
    const testData = await testResponse.json();
    console.log('   Status:', testResponse.status);
    console.log('   Response:', testData);
    console.log('');

    // Test 2: Test update-status endpoint
    console.log('2. Testing PUT /update-status...');
    const updateResponse = await fetch(`${BASE_URL}/update-status`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: 'test@example.com',
        status: 'L2 Technical Round Scheduled',
        panel: 'panel@example.com',
        dateTime: '2024-01-15T10:00:00.000Z',
        meetingLink: 'https://teams.microsoft.com/test-meeting'
      })
    });
    
    console.log('   Status:', updateResponse.status);
    
    if (updateResponse.status === 404) {
      const errorData = await updateResponse.json();
      console.log('   Error:', errorData);
    } else {
      const updateData = await updateResponse.json();
      console.log('   Response:', updateData);
    }
    console.log('');

    // Test 3: Check what routes are available
    console.log('3. Testing different route patterns...');
    const routes = [
      '/api/test',
      '/api/update-status',
      '/api/get-shortlisted-candidates'
    ];

    for (const route of routes) {
      try {
        const response = await fetch(`http://localhost:3001${route}`);
        console.log(`   ${route}: ${response.status}`);
      } catch (error) {
        console.log(`   ${route}: Error - ${error.message}`);
      }
    }

  } catch (error) {
    console.error('❌ Error testing update-status:', error.message);
    console.log('\n💡 Make sure the backend server is running on port 3001');
    console.log('   Run: cd backend && npm start');
  }
}

testUpdateStatus(); 