const fetch = require('node:fetch');

async function testFinalFeedbackAPI() {
  const baseUrl = 'http://localhost:3001';
  
  console.log('🧪 Testing Final Feedback API endpoints...\n');
  
  // Test 1: Check if server is running
  try {
    const healthResponse = await fetch(`${baseUrl}/health`);
    console.log('✅ Server is running');
  } catch (error) {
    console.log('❌ Server is not running');
    return;
  }
  
  // Test 2: Test final feedback routes test endpoint
  try {
    console.log('\n📧 Testing final feedback routes test endpoint...');
    
    const response = await fetch(`${baseUrl}/api/test`);
    console.log(`📊 Response status: ${response.status}`);
    
    if (response.ok) {
      const data = await response.json();
      console.log('✅ Final feedback routes test endpoint is working');
      console.log('📋 Response:', data);
    } else {
      console.log('⚠️ Final feedback routes test endpoint failed');
    }
  } catch (error) {
    console.log('❌ Final feedback routes test failed:', error.message);
  }
  
  // Test 3: Test getAllCandidateEmails endpoint
  try {
    console.log('\n📧 Testing getAllCandidateEmails endpoint...');
    
    const response = await fetch(`${baseUrl}/api/getAllCandidateEmails`);
    console.log(`📊 Response status: ${response.status}`);
    
    if (response.ok) {
      const data = await response.json();
      console.log('✅ getAllCandidateEmails endpoint is working');
      console.log('📋 Response data:', {
        emails: data.emails,
        count: data.emails ? data.emails.length : 0
      });
      
      if (data.emails && data.emails.length > 0) {
        console.log('✅ Found shortlisted candidates');
        console.log('📧 Sample emails:', data.emails.slice(0, 3));
      } else {
        console.log('⚠️ No shortlisted candidates found');
      }
    } else {
      const errorData = await response.json();
      console.log('⚠️ getAllCandidateEmails returned error:', errorData);
    }
  } catch (error) {
    console.log('❌ getAllCandidateEmails test failed:', error.message);
  }
  
  // Test 4: Test final-prescreening endpoint with test data
  try {
    console.log('\n📧 Testing final-prescreening endpoint...');
    
    const testEmail = 'test@example.com';
    const testCandidateId = '123';
    const testPosition = 'Software Engineer';
    
    const response = await fetch(`${baseUrl}/api/final-prescreening?candidateEmail=${encodeURIComponent(testEmail)}&candidateId=${encodeURIComponent(testCandidateId)}&position=${encodeURIComponent(testPosition)}`);
    console.log(`📊 Response status: ${response.status}`);
    
    if (response.status === 404) {
      const errorData = await response.json();
      console.log('✅ final-prescreening correctly returned 404 for non-existent data:', errorData);
    } else if (response.ok) {
      const data = await response.json();
      console.log('✅ final-prescreening endpoint is working');
      console.log('📋 Response data:', {
        prescreening: data.prescreening,
        feedback: data.feedback,
        l2Technical: data.l2Technical
      });
    } else {
      const errorData = await response.json();
      console.log('⚠️ final-prescreening returned error:', errorData);
    }
  } catch (error) {
    console.log('❌ final-prescreening test failed:', error.message);
  }
  
  // Test 5: Test final-prescreening endpoint with real data (if available)
  try {
    console.log('\n📧 Testing final-prescreening with real candidate data...');
    
    // First get a real candidate email
    const emailsResponse = await fetch(`${baseUrl}/api/getAllCandidateEmails`);
    if (emailsResponse.ok) {
      const emailsData = await emailsResponse.json();
      
      if (emailsData.emails && emailsData.emails.length > 0) {
        const realEmail = emailsData.emails[0];
        console.log(`📧 Testing with real email: ${realEmail}`);
        
        // Get candidate data to get ID and position
        const candidateResponse = await fetch(`${baseUrl}/api/getCandidateData?candidateEmail=${encodeURIComponent(realEmail)}`);
        if (candidateResponse.ok) {
          const candidateData = await candidateResponse.json();
          
          const response = await fetch(`${baseUrl}/api/final-prescreening?candidateEmail=${encodeURIComponent(realEmail)}&candidateId=${encodeURIComponent(candidateData.id)}&position=${encodeURIComponent(candidateData.role)}`);
          console.log(`📊 Response status: ${response.status}`);
          
          if (response.ok) {
            const data = await response.json();
            console.log('✅ final-prescreening with real data is working');
            console.log('📋 Response data:', {
              prescreening: data.prescreening,
              feedbackCount: data.feedback ? data.feedback.length : 0,
              l2Technical: data.l2Technical
            });
          } else {
            const errorData = await response.json();
            console.log('⚠️ final-prescreening with real data returned error:', errorData);
          }
        } else {
          console.log('⚠️ Could not get candidate data for real email test');
        }
      } else {
        console.log('⚠️ No real candidate emails available for testing');
      }
    } else {
      console.log('⚠️ Could not get candidate emails for real data test');
    }
  } catch (error) {
    console.log('❌ final-prescreening with real data test failed:', error.message);
  }
  
  console.log('\n🎯 Final Feedback API test completed!');
}

testFinalFeedbackAPI().catch(console.error); 