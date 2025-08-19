const fetch = require('node:fetch');

async function testGetCandidateData() {
  const baseUrl = 'http://localhost:3001';
  
  console.log('🧪 Testing getCandidateData endpoint...\n');
  
  // Test 1: Check if server is running
  try {
    const healthResponse = await fetch(`${baseUrl}/health`);
    console.log('✅ Server is running');
  } catch (error) {
    console.log('❌ Server is not running');
    return;
  }
  
  // Test 2: Test getCandidateData with a test email
  try {
    const testEmail = 'test@example.com';
    console.log(`📧 Testing getCandidateData with email: ${testEmail}`);
    
    const response = await fetch(`${baseUrl}/api/getCandidateData?candidateEmail=${encodeURIComponent(testEmail)}`);
    console.log(`📊 Response status: ${response.status}`);
    
    if (response.ok) {
      const data = await response.json();
      console.log('✅ getCandidateData endpoint is working');
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
  
  // Test 3: Test with a real email from the database (if available)
  try {
    console.log('\n📧 Testing with a real candidate email...');
    
    // You can replace this with a real email from your database
    const realEmail = 'Halika.Aluru@valuemomentum.com';
    console.log(`📧 Testing getCandidateData with real email: ${realEmail}`);
    
    const response = await fetch(`${baseUrl}/api/getCandidateData?candidateEmail=${encodeURIComponent(realEmail)}`);
    console.log(`📊 Response status: ${response.status}`);
    
    if (response.ok) {
      const data = await response.json();
      console.log('✅ getCandidateData with real email is working');
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
      } else {
        console.log('❌ ID field is missing from response');
      }
    } else {
      const errorData = await response.json();
      console.log('⚠️ getCandidateData with real email returned error:', errorData);
    }
  } catch (error) {
    console.log('❌ getCandidateData with real email test failed:', error.message);
  }
  
  console.log('\n🎯 getCandidateData test completed!');
}

testGetCandidateData().catch(console.error); 