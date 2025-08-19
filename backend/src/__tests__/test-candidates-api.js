// Using built-in fetch (available in Node.js 18+)

const BASE_URL = 'http://localhost:3001/api';

async function testCandidatesAPI() {
  console.log('🧪 Testing Candidates API endpoints...\n');

  try {
    // Test 1: Get shortlisted candidates
    console.log('1. Testing GET /get-shortlisted-candidates');
    const candidatesResponse = await fetch(`${BASE_URL}/get-shortlisted-candidates`);
    const candidatesData = await candidatesResponse.json();
    console.log('   Status:', candidatesResponse.status);
    console.log('   Response:', candidatesData);
    console.log('');

    // Test 2: Get panel emails
    console.log('2. Testing GET /get-panel-emails');
    const panelResponse = await fetch(`${BASE_URL}/get-panel-emails?domain=test`);
    const panelData = await panelResponse.json();
    console.log('   Status:', panelResponse.status);
    console.log('   Response:', panelData);
    console.log('');

    // Test 3: Get email status
    console.log('3. Testing GET /get-email-status');
    const emailStatusResponse = await fetch(`${BASE_URL}/get-email-status?candidate_email=test@example.com`);
    const emailStatusData = await emailStatusResponse.json();
    console.log('   Status:', emailStatusResponse.status);
    console.log('   Response:', emailStatusData);
    console.log('');

    // Test 4: Update email status
    console.log('4. Testing POST /update-email-status');
    const updateStatusResponse = await fetch(`${BASE_URL}/update-email-status`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ candidate_email: 'test@example.com', status: 'emailsent' })
    });
    const updateStatusData = await updateStatusResponse.json();
    console.log('   Status:', updateStatusResponse.status);
    console.log('   Response:', updateStatusData);
    console.log('');

    // Test 5: Process test attempts
    console.log('5. Testing POST /callTestAttempts/appEC');
    const testAttemptsResponse = await fetch(`${BASE_URL}/callTestAttempts/appEC`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ startDate: '2024-01-01', endDate: '2024-01-31' })
    });
    const testAttemptsData = await testAttemptsResponse.json();
    console.log('   Status:', testAttemptsResponse.status);
    console.log('   Response:', testAttemptsData);
    console.log('');

    // Test 6: Get candidate data
    console.log('6. Testing GET /getCandidateData');
    const candidateDataResponse = await fetch(`${BASE_URL}/getCandidateData?candidateEmail=test@example.com`);
    const candidateDataData = await candidateDataResponse.json();
    console.log('   Status:', candidateDataResponse.status);
    console.log('   Response:', candidateDataData);
    console.log('');

    console.log('✅ Candidates API tests completed!');

  } catch (error) {
    console.error('❌ Error testing Candidates API:', error.message);
    console.log('\n💡 Make sure the backend server is running on port 3001');
    console.log('   Run: cd backend && npm start');
  }
}

testCandidatesAPI(); 