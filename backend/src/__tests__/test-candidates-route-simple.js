// Using built-in fetch (available in Node.js 18+)

const BASE_URL = 'http://localhost:3001/api';

async function testCandidatesRoute() {
  console.log('🧪 Testing candidates route accessibility...\n');

  try {
    // Test 1: Check candidates test route
    console.log('1. Testing candidates test route...');
    const testResponse = await fetch(`${BASE_URL}/test`);
    const testData = await testResponse.json();
    console.log('   Status:', testResponse.status);
    console.log('   Response:', testData);
    console.log('');

    // Test 2: Check update-status test route
    console.log('2. Testing update-status test route...');
    const updateStatusTestResponse = await fetch(`${BASE_URL}/test-update-status`);
    const updateStatusTestData = await updateStatusTestResponse.json();
    console.log('   Status:', updateStatusTestResponse.status);
    console.log('   Response:', updateStatusTestData);
    console.log('');

    // Test 3: Check actual update-status route
    console.log('3. Testing actual update-status route...');
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

  } catch (error) {
    console.error('❌ Error testing candidates route:', error.message);
    console.log('\n💡 Make sure the backend server is running on port 3001');
    console.log('   Run: cd backend && npm start');
  }
}

testCandidatesRoute(); 