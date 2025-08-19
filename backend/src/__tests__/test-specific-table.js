const db = require('./src/config/database/db');

async function testSpecificTable() {
  console.log('🔍 Testing specific feedback table...\n');

  try {
    const tableName = 'app_ec_dotnet_feedback_response';
    
    // Test 1: Check if table exists
    console.log(`1. Checking if table '${tableName}' exists...`);
    const tableExists = await db.query(`
      SELECT EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_name = $1
      );
    `, [tableName]);
    
    if (tableExists.rows[0].exists) {
      console.log(`   ✓ Table '${tableName}' exists`);
    } else {
      console.log(`   ❌ Table '${tableName}' does not exist`);
      return;
    }
    console.log('');

    // Test 2: Check table structure
    console.log(`2. Checking table structure for '${tableName}'...`);
    const columns = await db.query(`
      SELECT column_name, data_type, is_nullable, column_default
      FROM information_schema.columns 
      WHERE table_name = $1 
      ORDER BY ordinal_position;
    `, [tableName]);
    
    console.log('   Columns:');
    columns.rows.forEach(col => {
      console.log(`     - ${col.column_name}: ${col.data_type} (nullable: ${col.is_nullable})`);
    });
    console.log('');

    // Test 3: Check if candidate_info table has data
    console.log('3. Checking candidate_info table...');
    const candidates = await db.query('SELECT COUNT(*) as count FROM candidate_info;');
    console.log(`   candidate_info has ${candidates.rows[0].count} records`);
    
    if (candidates.rows[0].count > 0) {
      const sampleCandidate = await db.query('SELECT id, candidate_email FROM candidate_info LIMIT 1;');
      console.log(`   Sample candidate: ID=${sampleCandidate.rows[0].id}, Email=${sampleCandidate.rows[0].candidate_email}`);
    }
    console.log('');

    // Test 4: Try a simple insert to see what error we get
    console.log('4. Testing simple insert...');
    try {
      const testInsert = await db.query(`
        INSERT INTO ${tableName} (
          candidate_id,
          number_of_years_or_months,
          detailed_feedback,
          updated_at
        ) VALUES ($1, $2, $3, CURRENT_TIMESTAMP)
      `, [1, JSON.stringify([{skill: 'test', experience: '1 year'}]), 'Test feedback']);
      
      console.log('   ✓ Test insert successful');
      
      // Clean up test data
      await db.query(`DELETE FROM ${tableName} WHERE candidate_id = 1`);
      console.log('   ✓ Test data cleaned up');
      
    } catch (insertError) {
      console.log('   ❌ Test insert failed:');
      console.log(`     Error: ${insertError.message}`);
      console.log(`     Code: ${insertError.code}`);
      console.log(`     Detail: ${insertError.detail}`);
      console.log(`     Hint: ${insertError.hint}`);
    }

  } catch (error) {
    console.error('❌ Error testing table:', error.message);
  } finally {
    await db.close();
  }
}

testSpecificTable(); 