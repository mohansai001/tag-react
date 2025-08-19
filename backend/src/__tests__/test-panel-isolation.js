// Test to isolate panel routes issue

console.log('🧪 Testing panel routes isolation...\n');

// Test 1: Check if panel service can be loaded
console.log('1. Testing panel service loading...');
try {
  const PanelService = require('./src/services/panelService');
  console.log('✅ PanelService module loaded successfully');
  
  // Test 2: Check if panel service can be instantiated
  console.log('2. Testing panel service instantiation...');
  const panelService = new PanelService();
  console.log('✅ PanelService instantiated successfully');
  
  // Test 3: Check if panel controller can be loaded
  console.log('3. Testing panel controller loading...');
  const PanelController = require('./src/controllers/panelController');
  console.log('✅ PanelController module loaded successfully');
  
  // Test 4: Check if panel controller can be instantiated
  console.log('4. Testing panel controller instantiation...');
  const panelController = new PanelController();
  console.log('✅ PanelController instantiated successfully');
  
  // Test 5: Check if panel routes can be loaded
  console.log('5. Testing panel routes loading...');
  const panelRoutes = require('./src/routes/panelRoutes');
  console.log('✅ Panel routes module loaded successfully');
  
  console.log('\n✅ All panel components loaded successfully!');
  
} catch (error) {
  console.error('❌ Error loading panel components:', error.message);
  console.error('Stack trace:', error.stack);
} 