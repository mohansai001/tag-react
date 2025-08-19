const fetch = require('node:fetch');

async function testPanelRoutes() {
  const baseUrl = 'http://localhost:3001';
  
  console.log('🧪 Testing Panel Routes...\n');
  
  // Test 1: Check if server is running
  try {
    const healthResponse = await fetch(`${baseUrl}/health`);
    console.log('✅ Server is running');
  } catch (error) {
    console.log('❌ Server is not running');
    return;
  }
  
  // Test 2: Test the test route
  try {
    const testResponse = await fetch(`${baseUrl}/api/test`);
    const testData = await testResponse.json();
    console.log('✅ API routing is working:', testData.message);
  } catch (error) {
    console.log('❌ API routing test failed:', error.message);
  }
  
  // Test 3: Test panel test route
  try {
    const panelTestResponse = await fetch(`${baseUrl}/api/test`);
    const panelTestData = await panelTestResponse.json();
    console.log('✅ Panel test route is working:', panelTestData.message);
  } catch (error) {
    console.log('❌ Panel test route failed:', error.message);
  }
  
  // Test 4: Test feedback-table route
  try {
    const feedbackResponse = await fetch(`${baseUrl}/api/feedback-table?interview_date=2025-08-12&userEmail=Halika.Aluru@valuemomentum.com`);
    console.log(`📊 Feedback table response status: ${feedbackResponse.status}`);
    
    if (feedbackResponse.ok) {
      const feedbackData = await feedbackResponse.json();
      console.log('✅ Feedback table route is working');
      console.log(`📋 Data count: ${feedbackData.length || 0}`);
    } else {
      const errorData = await feedbackResponse.json();
      console.log('⚠️ Feedback table route returned error:', errorData.message);
    }
  } catch (error) {
    console.log('❌ Feedback table route failed:', error.message);
  }
  
  console.log('\n🎯 Test completed!');
}

testPanelRoutes().catch(console.error); 