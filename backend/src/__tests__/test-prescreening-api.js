// Using built-in fetch (available in Node.js 18+)

const BASE_URL = 'http://localhost:3001/api';

async function testPrescreeningAPI() {
  console.log('🧪 Testing Prescreening API endpoints...\n');

  try {
    // Test 1: Get all candidate emails
    console.log('1. Testing GET /getAllCandidateEmails');
    const emailsResponse = await fetch(`${BASE_URL}/getAllCandidateEmails`);
    const emailsData = await emailsResponse.json();
    console.log('   Status:', emailsResponse.status);
    console.log('   Response:', emailsData);
    console.log('');

    // Test 2: Get Java EC questions
    console.log('2. Testing GET /java_ec_questions');
    const questionsResponse = await fetch(`${BASE_URL}/java_ec_questions`);
    const questionsData = await questionsResponse.json();
    console.log('   Status:', questionsResponse.status);
    console.log('   Response type:', Array.isArray(questionsData) ? 'Array' : typeof questionsData);
    console.log('   Response length:', Array.isArray(questionsData) ? questionsData.length : 'N/A');
    console.log('');

    // Test 3: Get candidate data (with a test email)
    console.log('3. Testing GET /getCandidateData');
    const candidateResponse = await fetch(`${BASE_URL}/getCandidateData?candidateEmail=test@example.com`);
    const candidateData = await candidateResponse.json();
    console.log('   Status:', candidateResponse.status);
    console.log('   Response:', candidateData);
    console.log('');

    console.log('✅ API tests completed!');

  } catch (error) {
    console.error('❌ Error testing API:', error.message);
    console.log('\n💡 Make sure the backend server is running on port 3001');
    console.log('   Run: cd backend && npm start');
  }
}

testPrescreeningAPI(); 