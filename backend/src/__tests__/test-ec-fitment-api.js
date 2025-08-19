const fetch = require('node:fetch');

async function testECFitmentAPI() {
  const baseUrl = 'http://localhost:3001';
  
  console.log('🧪 Testing EC Fitment API endpoints...\n');
  
  // Test 1: Check if server is running
  try {
    const healthResponse = await fetch(`${baseUrl}/health`);
    console.log('✅ Server is running');
  } catch (error) {
    console.log('❌ Server is not running');
    return;
  }
  
  // Test 2: Test get-feedbackform endpoint for EC Fitment
  try {
    console.log('\n📧 Testing get-feedbackform endpoint for EC Fitment...');
    
    const testEmail = 'test@example.com';
    const testRoundDetails = 'EC Fitment Round';
    
    const response = await fetch(`${baseUrl}/api/get-feedbackform?candidateEmail=${encodeURIComponent(testEmail)}&roundDetails=${encodeURIComponent(testRoundDetails)}`);
    console.log(`📊 Response status: ${response.status}`);
    
    if (response.status === 404) {
      const errorData = await response.json();
      console.log('✅ get-feedbackform correctly returned 404 for non-existent EC Fitment data:', errorData);
    } else if (response.ok) {
      const data = await response.json();
      console.log('✅ get-feedbackform endpoint is working for EC Fitment');
      console.log('📋 Response data:', data);
    } else {
      const errorData = await response.json();
      console.log('⚠️ get-feedbackform returned error:', errorData);
    }
  } catch (error) {
    console.log('❌ get-feedbackform test failed:', error.message);
  }
  
  // Test 3: Test submitFeedback endpoint for EC Fitment
  try {
    console.log('\n📧 Testing submitFeedback endpoint for EC Fitment...');
    
    const testFormData = {
      candidateEmail: 'test@example.com',
      imochaScore: '85',
      rrfId: 'RRF001',
      position: 'Software Engineer',
      candidateName: 'Test Candidate',
      interviewDate: '2024-01-15',
      interviewerName: 'test.interviewer@company.com',
      hrEmail: 'hr@company.com',
      detailedFeedback: 'This is a test EC Fitment feedback submission.',
      result: 'Recommended',
      organizationalFitment: 'Good organizational fitment feedback',
      customerCommunication: 'Excellent customer communication skills',
      continuousLearning: 'Shows strong continuous learning attitude',
      attitudePersonality: 'Positive attitude and good personality',
      communicationSkills: 'Strong communication skills'
    };
    
    const testRoundDetails = 'EC Fitment Round';
    
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
      console.log('✅ submitFeedback endpoint is working for EC Fitment');
      console.log('📋 Response data:', data);
    } else {
      const errorData = await response.json();
      console.log('⚠️ submitFeedback returned error:', errorData);
    }
  } catch (error) {
    console.log('❌ submitFeedback test failed:', error.message);
  }
  
  // Test 4: Test getCandidateData endpoint (used by EC Fitment)
  try {
    console.log('\n📧 Testing getCandidateData endpoint (used by EC Fitment)...');
    
    const testEmail = 'test@example.com';
    
    const response = await fetch(`${baseUrl}/api/getCandidateData?candidateEmail=${encodeURIComponent(testEmail)}`);
    console.log(`📊 Response status: ${response.status}`);
    
    if (response.status === 404) {
      const errorData = await response.json();
      console.log('✅ getCandidateData correctly returned 404 for non-existent candidate:', errorData);
    } else if (response.ok) {
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
    } else {
      const errorData = await response.json();
      console.log('⚠️ getCandidateData returned error:', errorData);
    }
  } catch (error) {
    console.log('❌ getCandidateData test failed:', error.message);
  }
  
  // Test 5: Test with real candidate data (if available)
  try {
    console.log('\n📧 Testing EC Fitment with real candidate data...');
    
    // First get a real candidate email
    const emailsResponse = await fetch(`${baseUrl}/api/getAllCandidateEmails`);
    if (emailsResponse.ok) {
      const emailsData = await emailsResponse.json();
      
      if (emailsData.emails && emailsData.emails.length > 0) {
        const realEmail = emailsData.emails[0];
        console.log(`📧 Testing with real email: ${realEmail}`);
        
        // Get candidate data
        const candidateResponse = await fetch(`${baseUrl}/api/getCandidateData?candidateEmail=${encodeURIComponent(realEmail)}`);
        if (candidateResponse.ok) {
          const candidateData = await candidateResponse.json();
          
          // Test get-feedbackform with real data
          const feedbackResponse = await fetch(`${baseUrl}/api/get-feedbackform?candidateEmail=${encodeURIComponent(realEmail)}&roundDetails=EC%20Fitment%20Round`);
          console.log(`📊 get-feedbackform response status: ${feedbackResponse.status}`);
          
          if (feedbackResponse.ok) {
            const feedbackData = await feedbackResponse.json();
            console.log('✅ get-feedbackform with real data is working');
            console.log('📋 Feedback data:', {
              candidate_name: feedbackData.candidate_name,
              position: feedbackData.position,
              result: feedbackData.result,
              has_detailed_feedback: !!feedbackData.detailed_feedback
            });
          } else if (feedbackResponse.status === 404) {
            console.log('✅ No existing EC Fitment feedback found (expected for new candidates)');
          } else {
            const errorData = await feedbackResponse.json();
            console.log('⚠️ get-feedbackform with real data returned error:', errorData);
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
    console.log('❌ EC Fitment with real data test failed:', error.message);
  }
  
  console.log('\n🎯 EC Fitment API test completed!');
  console.log('\n📋 Summary:');
  console.log('   - EC Fitment uses the same API endpoints as other feedback forms');
  console.log('   - get-feedbackform: Retrieves existing EC Fitment feedback');
  console.log('   - getCandidateData: Gets candidate information');
  console.log('   - submitFeedback: Submits EC Fitment feedback');
  console.log('   - All endpoints are already migrated and should be working!');
}

testECFitmentAPI().catch(console.error); 