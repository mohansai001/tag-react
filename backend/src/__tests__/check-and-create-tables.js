const db = require('./src/config/database/db');

async function checkAndCreateTables() {
  try {
    console.log('🔍 Checking database tables...');
    
    const isConnected = await db.isConnected();
    if (!isConnected) {
      console.log('❌ Database connection failed');
      return;
    }
    console.log('✅ Database connection successful!');
    
    // List all tables
    const tablesQuery = `
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public'
      ORDER BY table_name;
    `;
    
    const tablesResult = await db.query(tablesQuery);
    console.log('\n📋 Existing tables:');
    tablesResult.rows.forEach((table, index) => {
      console.log(`${index + 1}. ${table.table_name}`);
    });
    
    // Check if candidate_info table exists
    const candidateInfoExists = tablesResult.rows.some(table => table.table_name === 'candidate_info');
    
    if (!candidateInfoExists) {
      console.log('\n📝 Creating candidate_info table...');
      
      const createTableQuery = `
        CREATE TABLE IF NOT EXISTS candidate_info (
          id SERIAL PRIMARY KEY,
          candidate_name VARCHAR(255) NOT NULL,
          candidate_email VARCHAR(255) UNIQUE NOT NULL,
          prescreening_status VARCHAR(100),
          role VARCHAR(255),
          recruitment_phase VARCHAR(100),
          resume_score DECIMAL(5,2),
          resume TEXT,
          candidate_phone VARCHAR(20),
          hr_email VARCHAR(255),
          rrf_id VARCHAR(100),
          eng_center VARCHAR(100),
          content TEXT,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        );
      `;
      
      await db.query(createTableQuery);
      console.log('✅ candidate_info table created successfully!');
    } else {
      console.log('✅ candidate_info table already exists');
    }
    
    // Check if login_logs table exists (for auth functionality)
    const loginLogsExists = tablesResult.rows.some(table => table.table_name === 'login_logs');
    
    if (!loginLogsExists) {
      console.log('\n📝 Creating login_logs table...');
      
      const createLoginLogsQuery = `
        CREATE TABLE IF NOT EXISTS login_logs (
          id SERIAL PRIMARY KEY,
          email VARCHAR(255) NOT NULL,
          name VARCHAR(255) NOT NULL,
          date VARCHAR(10),
          time VARCHAR(8),
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        );
      `;
      
      await db.query(createLoginLogsQuery);
      console.log('✅ login_logs table created successfully!');
    } else {
      console.log('✅ login_logs table already exists');
    }
    
    console.log('\n🎉 Database setup complete!');
    
  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    await db.close();
  }
}

checkAndCreateTables(); 