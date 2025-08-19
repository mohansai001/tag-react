// Test to isolate candidates routes issue

console.log('🧪 Testing candidates routes isolation...\n');

// Test 1: Check if candidates controller can be loaded
console.log('1. Testing candidates controller loading...');
try {
  const CandidatesController = require('./src/controllers/candidatesController');
  console.log('✅ CandidatesController module loaded successfully');
  
  // Test 2: Check if candidates controller can be instantiated
  console.log('2. Testing candidates controller instantiation...');
  const candidatesController = new CandidatesController();
  console.log('✅ CandidatesController instantiated successfully');
  
  // Test 3: Check if candidates service can be loaded
  console.log('3. Testing candidates service loading...');
  const CandidatesService = require('./src/services/candidatesService');
  console.log('✅ CandidatesService module loaded successfully');
  
  // Test 4: Check if candidates service can be instantiated
  console.log('4. Testing candidates service instantiation...');
  const candidatesService = new CandidatesService();
  console.log('✅ CandidatesService instantiated successfully');
  
  // Test 5: Check if candidates routes can be loaded
  console.log('5. Testing candidates routes loading...');
  const candidatesRoutes = require('./src/routes/candidatesRoutes');
  console.log('✅ Candidates routes module loaded successfully');
  
  console.log('\n✅ All candidates components loaded successfully!');
  
} catch (error) {
  console.error('❌ Error loading candidates components:', error.message);
  console.error('Stack trace:', error.stack);
} 