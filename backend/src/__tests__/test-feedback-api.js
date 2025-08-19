const fetch = require('node:fetch');

async function testFeedbackAPI() {
  const baseUrl = 'http://localhost:3001';
  
  console.log('🧪 Testing Feedback API endpoints...\n');
  
  // Test 1: Check if server is running
  try {
    const healthResponse = await fetch(`${baseUrl}/health`);
    console.log('✅ Server is running');
  } catch (error) {
    console.log('❌ Server is not running');
    return;
  }
  
  // Test 2: Test feedback routes test endpoint
  try {
    console.log('\n📧 Testing feedback routes test endpoint...');
    
    const response = await fetch(`${baseUrl}/api/test`);
    console.log(`📊 Response status: ${response.status}`);
    
    if (response.ok) {
      const data = await response.json();
      console.log('✅ Feedback routes test endpoint is working');
      console.log('📋 Response:', data);
    } else {
      console.log('⚠️ Feedback routes test endpoint failed');
    }
  } catch (error) {
    console.log('❌ Feedback routes test failed:', error.message);
  }
  
  // Test 3: Test get-feedbackform endpoint with test data
  try {
    console.log('\n📧 Testing get-feedbackform endpoint...');
    
    const testEmail = 'test@example.com';
    const testRoundDetails = 'L1 Technical';
    
    const response = await fetch(`${baseUrl}/api/get-feedbackform?candidateEmail=${encodeURIComponent(testEmail)}&roundDetails=${encodeURIComponent(testRoundDetails)}`);
    console.log(`📊 Response status: ${response.status}`);
    
    if (response.status === 404) {
      const errorData = await response.json();
      console.log('✅ get-feedbackform correctly returned 404 for non-existent data:', errorData);
    } else if (response.ok) {
      const data = await response.json();
      console.log('✅ get-feedbackform endpoint is working');
      console.log('📋 Response data:', data);
    } else {
      const errorData = await response.json();
      console.log('⚠️ get-feedbackform returned error:', errorData);
    }
  } catch (error) {
    console.log('❌ get-feedbackform test failed:', error.message);
  }
  
  // Test 4: Test submitFeedback endpoint with test data
  try {
    console.log('\n📧 Testing submitFeedback endpoint...');
    
    const testFormData = {
      candidateEmail: 'test@example.com',
      imochaScore: '85',
      rrfId: 'RRF001',
      position: 'Software Engineer',
      candidateName: 'Test Candidate',
      interviewDate: '2024-01-15',
      interviewerName: 'test.interviewer@company.com',
      hrEmail: 'hr@company.com',
      detailedFeedback: 'This is a test feedback submission.',
      result: 'Recommended'
    };
    
    const testRoundDetails = 'L1 Technical';
    
    const response = await fetch(`${baseUrl}/api/submitFeedback`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ 
        formData: testFormData, 
        roundDetails: testRoundDetails 
      })
    });
    console.log(`📊 Response status: ${response.status}`);
    
    if (response.ok) {
      const data = await response.json();
      console.log('✅ submitFeedback endpoint is working');
      console.log('📋 Response data:', data);
    } else {
      const errorData = await response.json();
      console.log('⚠️ submitFeedback returned error:', errorData);
    }
  } catch (error) {
    console.log('❌ submitFeedback test failed:', error.message);
  }
  
  console.log('\n🎯 Feedback API test completed!');
}

testFeedbackAPI().catch(console.error); 