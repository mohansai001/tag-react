console.log('Testing imports...');

try {
  console.log('1. Testing service import...');
  const CandidatesService = require('./src/services/candidatesService');
  console.log('   ✓ Service imported successfully');
  
  console.log('2. Testing service instantiation...');
  const service = new CandidatesService();
  console.log('   ✓ Service instantiated successfully');
  
  console.log('3. Testing controller import...');
  const CandidatesController = require('./src/controllers/candidatesController');
  console.log('   ✓ Controller imported successfully');
  
  console.log('4. Testing controller instantiation...');
  const controller = new CandidatesController();
  console.log('   ✓ Controller instantiated successfully');
  
  console.log('✅ All imports successful!');
  
} catch (error) {
  console.error('❌ Import error:', error.message);
  console.error('Stack:', error.stack);
} 