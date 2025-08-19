// Using built-in fetch (available in Node.js 18+)

const BASE_URL = 'http://localhost:3001/api';

async function testCandidatesRoute() {
  console.log('🔍 Testing candidates route accessibility...\n');

  try {
    // Test 1: Check if server is running
    console.log('1. Testing server health...');
    const healthResponse = await fetch(`${BASE_URL.replace('/api', '')}/health`);
    const healthData = await healthResponse.json();
    console.log('   Status:', healthResponse.status);
    console.log('   Response:', healthData);
    console.log('');

    // Test 2: Check if candidates test route works
    console.log('2. Testing candidates test route...');
    const testResponse = await fetch(`${BASE_URL}/test`);
    const testData = await testResponse.json();
    console.log('   Status:', testResponse.status);
    console.log('   Response:', testData);
    console.log('');

    // Test 3: Check if get-shortlisted-candidates route works
    console.log('3. Testing get-shortlisted-candidates route...');
    const candidatesResponse = await fetch(`${BASE_URL}/get-shortlisted-candidates`);
    console.log('   Status:', candidatesResponse.status);
    
    if (candidatesResponse.status === 404) {
      const errorData = await candidatesResponse.json();
      console.log('   Error:', errorData);
    } else {
      const candidatesData = await candidatesResponse.json();
      console.log('   Response:', candidatesData);
    }
    console.log('');

    // Test 4: Check what routes are available
    console.log('4. Testing different route patterns...');
    const routes = [
      '/api/test',
      '/api/get-shortlisted-candidates',
      '/api/candidates/test',
      '/api/candidates/get-shortlisted-candidates'
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
    console.error('❌ Error testing candidates route:', error.message);
    console.log('\n💡 Server might not be running on port 3001');
    console.log('   Run: cd backend && npm start');
  }
}

testCandidatesRoute(); 