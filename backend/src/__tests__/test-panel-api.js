// Using built-in fetch (available in Node.js 18+)

const BASE_URL = 'http://localhost:3001/api';

async function testPanelAPI() {
  console.log('🧪 Testing Panel API endpoints...\n');

  try {
    // Test 1: Check panel test route
    console.log('1. Testing panel test route...');
    const testResponse = await fetch(`${BASE_URL}/test`);
    const testData = await testResponse.json();
    console.log('   Status:', testResponse.status);
    console.log('   Response:', testData);
    console.log('');

    // Test 2: Test panel-candidates-info endpoint
    console.log('2. Testing panel-candidates-info endpoint...');
    const candidatesResponse = await fetch(`${BASE_URL}/panel-candidates-info?l_2_interviewdate=2024-01-15&userEmail=test@example.com`);
    console.log('   Status:', candidatesResponse.status);
    
    if (candidatesResponse.status === 200) {
      const candidatesData = await candidatesResponse.json();
      console.log('   Response:', candidatesData);
    } else {
      const errorData = await candidatesResponse.text();
      console.log('   Error:', errorData);
    }
    console.log('');

    // Test 3: Test feedback-for-panel-member endpoint
    console.log('3. Testing feedback-for-panel-member endpoint...');
    const feedbackResponse = await fetch(`${BASE_URL}/feedback-for-panel-member?interview_date=2024-01-15&userEmail=test@example.com`);
    console.log('   Status:', feedbackResponse.status);
    
    if (feedbackResponse.status === 200) {
      const feedbackData = await feedbackResponse.json();
      console.log('   Response:', feedbackData);
    } else {
      const errorData = await feedbackResponse.text();
      console.log('   Error:', errorData);
    }
    console.log('');

    // Test 4: Test feedback-table endpoint
    console.log('4. Testing feedback-table endpoint...');
    const feedbackTableResponse = await fetch(`${BASE_URL}/feedback-table?interview_date=2024-01-15&userEmail=test@example.com`);
    console.log('   Status:', feedbackTableResponse.status);
    
    if (feedbackTableResponse.status === 200) {
      const feedbackTableData = await feedbackTableResponse.json();
      console.log('   Response:', feedbackTableData);
    } else {
      const errorData = await feedbackTableResponse.text();
      console.log('   Error:', errorData);
    }
    console.log('');

    // Test 5: Test get-engcenter-select endpoint
    console.log('5. Testing get-engcenter-select endpoint...');
    const engCenterResponse = await fetch(`${BASE_URL}/get-engcenter-select`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ candidateEmail: 'test@example.com' })
    });
    console.log('   Status:', engCenterResponse.status);
    
    if (engCenterResponse.status === 200) {
      const engCenterData = await engCenterResponse.json();
      console.log('   Response:', engCenterData);
    } else {
      const errorData = await engCenterResponse.text();
      console.log('   Error:', errorData);
    }
    console.log('');

    // Test 6: Test hr-candidates-info endpoint
    console.log('6. Testing hr-candidates-info endpoint...');
    const hrCandidatesResponse = await fetch(`${BASE_URL}/hr-candidates-info?l_2_interviewdate=2024-01-15&hr_email=hr@example.com`);
    console.log('   Status:', hrCandidatesResponse.status);
    
    if (hrCandidatesResponse.status === 200) {
      const hrCandidatesData = await hrCandidatesResponse.json();
      console.log('   Response:', hrCandidatesData);
    } else {
      const errorData = await hrCandidatesResponse.text();
      console.log('   Error:', errorData);
    }
    console.log('');

    console.log('✅ Panel API testing completed!');

  } catch (error) {
    console.error('❌ Error testing panel API:', error.message);
    console.log('\n💡 Make sure the backend server is running on port 3001');
    console.log('   Run: cd backend && npm start');
  }
}

testPanelAPI(); 