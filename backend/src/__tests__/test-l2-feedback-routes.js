const fetch = require('node:fetch');

async function testL2FeedbackRoutes() {
  const baseUrl = 'http://localhost:3001';
  
  console.log('🧪 Testing L2 Technical Feedback Routes...\n');
  
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
  
  // Test 3: Test L2 Technical Feedback test route
  try {
    const l2TestResponse = await fetch(`${baseUrl}/api/test`);
    const l2TestData = await l2TestResponse.json();
    console.log('✅ L2 Technical Feedback test route is working:', l2TestData.message);
  } catch (error) {
    console.log('❌ L2 Technical Feedback test route failed:', error.message);
  }
  
  // Test 4: Test .NET feedback questions route
  try {
    const dotnetQuestionsResponse = await fetch(`${baseUrl}/api/dotnet_feedback-questions`);
    console.log(`📊 .NET feedback questions response status: ${dotnetQuestionsResponse.status}`);
    
    if (dotnetQuestionsResponse.ok) {
      const dotnetQuestionsData = await dotnetQuestionsResponse.json();
      console.log('✅ .NET feedback questions route is working');
      console.log(`📋 Questions count: ${dotnetQuestionsData.length || 0}`);
    } else {
      const errorData = await dotnetQuestionsResponse.json();
      console.log('⚠️ .NET feedback questions route returned error:', errorData.message);
    }
  } catch (error) {
    console.log('❌ .NET feedback questions route failed:', error.message);
  }
  
  // Test 5: Test Java feedback questions route
  try {
    const javaQuestionsResponse = await fetch(`${baseUrl}/api/java_feedback-questions`);
    console.log(`📊 Java feedback questions response status: ${javaQuestionsResponse.status}`);
    
    if (javaQuestionsResponse.ok) {
      const javaQuestionsData = await javaQuestionsResponse.json();
      console.log('✅ Java feedback questions route is working');
      console.log(`📋 Questions count: ${javaQuestionsData.length || 0}`);
    } else {
      const errorData = await javaQuestionsResponse.json();
      console.log('⚠️ Java feedback questions route returned error:', errorData.message);
    }
  } catch (error) {
    console.log('❌ Java feedback questions route failed:', error.message);
  }
  
  // Test 6: Test Angular feedback questions route
  try {
    const angularQuestionsResponse = await fetch(`${baseUrl}/api/angular_feedback-questions`);
    console.log(`📊 Angular feedback questions response status: ${angularQuestionsResponse.status}`);
    
    if (angularQuestionsResponse.ok) {
      const angularQuestionsData = await angularQuestionsResponse.json();
      console.log('✅ Angular feedback questions route is working');
      console.log(`📋 Questions count: ${angularQuestionsData.length || 0}`);
    } else {
      const errorData = await angularQuestionsResponse.json();
      console.log('⚠️ Angular feedback questions route returned error:', errorData.message);
    }
  } catch (error) {
    console.log('❌ Angular feedback questions route failed:', error.message);
  }
  
  // Test 7: Test React feedback questions route
  try {
    const reactQuestionsResponse = await fetch(`${baseUrl}/api/react_feedback-questions`);
    console.log(`📊 React feedback questions response status: ${reactQuestionsResponse.status}`);
    
    if (reactQuestionsResponse.ok) {
      const reactQuestionsData = await reactQuestionsResponse.json();
      console.log('✅ React feedback questions route is working');
      console.log(`📋 Questions count: ${reactQuestionsData.length || 0}`);
    } else {
      const errorData = await reactQuestionsResponse.json();
      console.log('⚠️ React feedback questions route returned error:', errorData.message);
    }
  } catch (error) {
    console.log('❌ React feedback questions route failed:', error.message);
  }
  
  // Test 8: Test generic feedback questions route
  try {
    const genericQuestionsResponse = await fetch(`${baseUrl}/api/app_generic_feedback-questions`);
    console.log(`📊 Generic feedback questions response status: ${genericQuestionsResponse.status}`);
    
    if (genericQuestionsResponse.ok) {
      const genericQuestionsData = await genericQuestionsResponse.json();
      console.log('✅ Generic feedback questions route is working');
      console.log(`📋 Questions count: ${genericQuestionsData.length || 0}`);
    } else {
      const errorData = await genericQuestionsResponse.json();
      console.log('⚠️ Generic feedback questions route returned error:', errorData.message);
    }
  } catch (error) {
    console.log('❌ Generic feedback questions route failed:', error.message);
  }
  
  console.log('\n🎯 L2 Technical Feedback Routes Test completed!');
}

testL2FeedbackRoutes().catch(console.error); 