const db = require('./src/config/database/db');

async function testConnection() {
  try {
    console.log('Testing database connection...');
    
    const isConnected = await db.isConnected();
    if (isConnected) {
      console.log('✅ Database connection successful!');
      
      // Test if candidate_info table exists
      try {
        const tableResult = await db.query(`
          SELECT EXISTS (
            SELECT FROM information_schema.tables 
            WHERE table_name = 'candidate_info'
          );
        `);
        console.log('Table candidate_info exists:', tableResult.rows[0].exists);
      } catch (tableError) {
        console.log('❌ Error checking table:', tableError.message);
      }
    } else {
      console.log('❌ Database connection failed');
    }
  } catch (error) {
    console.error('❌ Database connection failed:', error.message);
  } finally {
    await db.close();
  }
}

testConnection(); 