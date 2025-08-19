// Using built-in fetch (available in Node.js 18+)

const BASE_URL = 'http://localhost:3001/api';

async function testAllRoutes() {
  console.log('🧪 Testing all routes to identify the issue...\n');

  try {
    // Test 1: Check server health
    console.log('1. Testing server health...');
    const healthResponse = await fetch(`${BASE_URL.replace('/api', '')}/health`);
    const healthData = await healthResponse.json();
    console.log('   Status:', healthResponse.status);
    console.log('   Response:', healthData);
    console.log('');

    // Test 2: Check main API test route
    console.log('2. Testing main API test route...');
    const mainTestResponse = await fetch(`${BASE_URL.replace('/api', '')}/api/test`);
    const mainTestData = await mainTestResponse.json();
    console.log('   Status:', mainTestResponse.status);
    console.log('   Response:', mainTestData);
    console.log('');

    // Test 3: Check candidates test route
    console.log('3. Testing candidates test route...');
    const candidatesTestResponse = await fetch(`${BASE_URL}/test`);
    const candidatesTestData = await candidatesTestResponse.json();
    console.log('   Status:', candidatesTestResponse.status);
    console.log('   Response:', candidatesTestData);
    console.log('');

    // Test 4: Check update-status test route
    console.log('4. Testing update-status test route...');
    const updateStatusTestResponse = await fetch(`${BASE_URL}/test-update-status`);
    const updateStatusTestData = await updateStatusTestResponse.json();
    console.log('   Status:', updateStatusTestResponse.status);
    console.log('   Response:', updateStatusTestData);
    console.log('');

    // Test 5: Check actual update-status route
    console.log('5. Testing actual update-status route...');
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

    // Test 6: Check all available routes
    console.log('6. Testing all route patterns...');
    const routes = [
      '/api/test',
      '/api/candidates/test',
      '/api/candidates/test-update-status',
      '/api/candidates/update-status',
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
    console.error('❌ Error testing routes:', error.message);
    console.log('\n💡 Make sure the backend server is running on port 3001');
    console.log('   Run: cd backend && npm start');
  }
}

testAllRoutes(); 