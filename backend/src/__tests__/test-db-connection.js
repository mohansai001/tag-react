const db = require('./src/config/database/db');

async function testDatabaseConnection() {
  try {
    console.log('🔍 Testing database connection...');
    
    // Test basic connection
    const isConnected = await db.isConnected();
    console.log('Database connected:', isConnected);
    
    if (!isConnected) {
      console.log('❌ Database connection failed');
      return;
    }
    
    // Test simple query
    console.log('Testing simple query...');
    const simpleResult = await db.query('SELECT NOW() as current_time');
    console.log('Simple query result:', simpleResult.rows[0]);
    
    // Test if candidate_info table exists
    console.log('Checking if candidate_info table exists...');
    const tableCheckResult = await db.query(`
      SELECT EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_name = 'candidate_info'
      );
    `);
    console.log('Table exists:', tableCheckResult.rows[0].exists);
    
    if (tableCheckResult.rows[0].exists) {
      // Test querying the table
      console.log('Testing candidate_info table query...');
      const candidateResult = await db.query(`
        SELECT COUNT(*) as count FROM candidate_info
      `);
      console.log('Candidate count:', candidateResult.rows[0].count);
      
      // Test the actual query that's failing
      console.log('Testing the actual query...');
      const actualQueryResult = await db.query(`
        SELECT 
          id,
          candidate_name,
          resume,
          content,
          prescreening_status,
          hr_email,
          rrf_id,
          eng_center,
          role
        FROM candidate_info
        ORDER BY id DESC
      `);
      console.log('Actual query result rows:', actualQueryResult.rows.length);
      console.log('First row sample:', actualQueryResult.rows[0] || 'No rows found');
    }
    
    console.log('✅ All tests completed successfully!');
    
  } catch (error) {
    console.error('❌ Test failed:', error.message);
    console.error('Error stack:', error.stack);
  } finally {
    await db.close();
  }
}

testDatabaseConnection(); 