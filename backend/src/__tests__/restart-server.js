const { spawn } = require('child_process');
const path = require('path');

console.log('🔄 Restarting server to check route registration...\n');

// Kill any existing server process
const killProcess = spawn('taskkill', ['/F', '/IM', 'node.exe'], { 
  stdio: 'ignore',
  shell: true 
});

killProcess.on('close', () => {
  console.log('✓ Killed existing Node.js processes');
  
  // Start the server
  const server = spawn('node', ['src/server.js'], {
    stdio: 'pipe',
    shell: true,
    cwd: __dirname
  });

  console.log('🚀 Starting server...\n');

  // Capture server output
  server.stdout.on('data', (data) => {
    const output = data.toString();
    console.log(output);
    
    // Check for route registration messages
    if (output.includes('Loading candidates routes...')) {
      console.log('✅ Candidates routes loading detected');
    }
    if (output.includes('CandidatesController loaded successfully')) {
      console.log('✅ CandidatesController loaded successfully');
    }
    if (output.includes('CandidatesController instance created')) {
      console.log('✅ CandidatesController instance created');
    }
    if (output.includes('✓ Candidates routes registered')) {
      console.log('✅ Candidates routes registered successfully');
    }
    if (output.includes('Loading panel routes...')) {
      console.log('✅ Panel routes loading detected');
    }
    if (output.includes('✓ Panel routes registered')) {
      console.log('✅ Panel routes registered successfully');
    }
    if (output.includes('Server running on port')) {
      console.log('✅ Server started successfully');
      
      // Wait a moment then test the routes
      setTimeout(() => {
        console.log('\n🧪 Testing routes after restart...');
        testRoutes();
      }, 2000);
    }
  });

  server.stderr.on('data', (data) => {
    const error = data.toString();
    console.error('❌ Server Error:', error);
  });

  server.on('close', (code) => {
    console.log(`Server process exited with code ${code}`);
  });
});

async function testRoutes() {
  try {
    const response = await fetch('http://localhost:3001/api/candidates/test');
    const data = await response.json();
    console.log('✅ Candidates test route working:', data);
  } catch (error) {
    console.log('❌ Candidates test route failed:', error.message);
  }
  
  try {
    const response = await fetch('http://localhost:3001/api/panel/test');
    const data = await response.json();
    console.log('✅ Panel test route working:', data);
  } catch (error) {
    console.log('❌ Panel test route failed:', error.message);
  }
} 