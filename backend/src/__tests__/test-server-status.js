const http = require('http');

function testServerStatus() {
  console.log('🧪 Testing backend server status...\n');
  
  const options = {
    hostname: 'localhost',
    port: 3001,
    path: '/health',
    method: 'GET'
  };

  const req = http.request(options, (res) => {
    console.log(`📊 Server Status: ${res.statusCode}`);
    
    if (res.statusCode === 200) {
      console.log('✅ Backend server is running!');
      
      // Test feedback routes
      testFeedbackRoutes();
    } else {
      console.log('⚠️ Server responded but with unexpected status');
    }
  });

  req.on('error', (error) => {
    console.log('❌ Backend server is not running');
    console.log('💡 Please start the server with: npm start');
  });

  req.end();
}

function testFeedbackRoutes() {
  console.log('\n📧 Testing feedback routes...');
  
  const options = {
    hostname: 'localhost',
    port: 3001,
    path: '/api/test',
    method: 'GET'
  };

  const req = http.request(options, (res) => {
    console.log(`📊 Feedback Routes Status: ${res.statusCode}`);
    
    if (res.statusCode === 200) {
      console.log('✅ Feedback routes are accessible!');
    } else {
      console.log('⚠️ Feedback routes might not be properly registered');
    }
  });

  req.on('error', (error) => {
    console.log('❌ Could not access feedback routes');
  });

  req.end();
}

testServerStatus(); 