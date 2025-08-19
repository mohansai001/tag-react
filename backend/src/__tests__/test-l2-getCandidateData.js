const fetch = require('node:fetch');

async function testL2GetCandidateData() {
  const baseUrl = 'http://localhost:3001';
  
  console.log('🧪 Testing L2 Technical Feedback getCandidateData endpoint...\n');
  
  // Test 1: Check if server is running
  try {
    const healthResponse = await fetch(`${baseUrl}/health`);
    console.log('✅ Server is running');
  } catch (error) {
    console.log('❌ Server is not running');
    return;
  }
  
  // Test 2: Test getCandidateData with a real email from the database
  try {
    console.log('\n📧 Testing getCandidateData with real candidate email...');
    
    // Using a real email from the database
    const realEmail = 'Halika.Aluru@valuemomentum.com';
    console.log(`📧 Testing getCandidateData with email: ${realEmail}`);
    
    const response = await fetch(`${baseUrl}/api/getCandidateData?candidateEmail=${encodeURIComponent(realEmail)}`);
    console.log(`📊 Response status: ${response.status}`);
    
    if (response.ok) {
      const data = await response.json();
      console.log('✅ L2 Technical Feedback getCandidateData endpoint is working');
      console.log('📋 Response data:', {
        id: data.id,
        candidate_name: data.candidate_name,
        candidate_email: data.candidate_email,
        role: data.role,
        rrf_id: data.rrf_id,
        hr_email: data.hr_email,
        panel_name: data.panel_name,
        l_2_interviewdate: data.l_2_interviewdate,
        l_1_score: data.l_1_score
      });
      
      if (data.id) {
        console.log('✅ ID field is present in response');
        console.log(`🎯 Candidate ID: ${data.id}`);
        console.log('🎉 L2 Technical Feedback form should now work correctly!');
      } else {
        console.log('❌ ID field is missing from response');
      }
    } else {
      const errorData = await response.json();
      console.log('⚠️ getCandidateData returned error:', errorData);
    }
  } catch (error) {
    console.log('❌ getCandidateData test failed:', error.message);
  }
  
  // Test 3: Test with a non-existent email
  try {
    console.log('\n📧 Testing with non-existent email...');
    
    const fakeEmail = 'nonexistent@example.com';
    console.log(`📧 Testing getCandidateData with fake email: ${fakeEmail}`);
    
    const response = await fetch(`${baseUrl}/api/getCandidateData?candidateEmail=${encodeURIComponent(fakeEmail)}`);
    console.log(`📊 Response status: ${response.status}`);
    
    if (response.status === 404) {
      const errorData = await response.json();
      console.log('✅ Correctly returned 404 for non-existent candidate:', errorData);
    } else {
      console.log('⚠️ Unexpected response for non-existent candidate');
    }
  } catch (error) {
    console.log('❌ Test with non-existent email failed:', error.message);
  }
  
  console.log('\n🎯 L2 Technical Feedback getCandidateData test completed!');
}

testL2GetCandidateData().catch(console.error); 