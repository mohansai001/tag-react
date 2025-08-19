const db = require('./src/config/database/db');

async function testDatabaseTables() {
  console.log('🔍 Testing database tables...\n');

  try {
    // Test 1: Check if candidate_info table exists
    console.log('1. Testing candidate_info table...');
    const candidateResult = await db.query(`
      SELECT column_name, data_type, is_nullable 
      FROM information_schema.columns 
      WHERE table_name = 'candidate_info' 
      ORDER BY ordinal_position;
    `);
    
    if (candidateResult.rows.length > 0) {
      console.log('   ✓ candidate_info table exists');
      console.log('   Columns:', candidateResult.rows.map(row => row.column_name).join(', '));
    } else {
      console.log('   ❌ candidate_info table does not exist');
    }
    console.log('');

    // Test 2: Check if questionnaire tables exist
    console.log('2. Testing questionnaire tables...');
    const questionnaireTables = [
      'app_ec_java_questionnaire',
      'app_ec_dotnet_questionnaire',
      'app_ec_react_questionnaire',
      'app_ec_angular_questionnaire',
      'app_ec_mendix_questionnaire',
      'app_ec_devops_questionnaire',
      'app_ec_cloudops_questionnaire',
      'app_ec_platform_questionnaire',
      'app_ec_sre_questionnaire'
    ];

    for (const tableName of questionnaireTables) {
      const result = await db.query(`
        SELECT COUNT(*) as count 
        FROM information_schema.tables 
        WHERE table_name = $1;
      `, [tableName]);
      
      if (result.rows[0].count > 0) {
        console.log(`   ✓ ${tableName} exists`);
      } else {
        console.log(`   ❌ ${tableName} does not exist`);
      }
    }
    console.log('');

    // Test 3: Check if feedback tables exist
    console.log('3. Testing feedback tables...');
    const feedbackTables = [
      'app_ec_java_feedback_responses',
      'app_ec_dotnet_feedback_responses',
      'app_ec_react_feedback_responses',
      'app_ec_angular_feedback_responses',
      'app_ec_mendix_feedback_responses',
      'app_ec_devops_feedback_responses',
      'app_ec_cloudops_feedback_responses',
      'app_ec_platform_feedback_responses',
      'app_ec_sre_feedback_responses'
    ];

    for (const tableName of feedbackTables) {
      const result = await db.query(`
        SELECT COUNT(*) as count 
        FROM information_schema.tables 
        WHERE table_name = $1;
      `, [tableName]);
      
      if (result.rows[0].count > 0) {
        console.log(`   ✓ ${tableName} exists`);
      } else {
        console.log(`   ❌ ${tableName} does not exist`);
      }
    }
    console.log('');

    // Test 4: Check sample data
    console.log('4. Testing sample data...');
    const candidateCount = await db.query('SELECT COUNT(*) as count FROM candidate_info;');
    console.log(`   candidate_info has ${candidateCount.rows[0].count} records`);

    const javaQuestions = await db.query('SELECT COUNT(*) as count FROM app_ec_java_questionnaire;');
    console.log(`   app_ec_java_questionnaire has ${javaQuestions.rows[0].count} questions`);

  } catch (error) {
    console.error('❌ Error testing database:', error.message);
  } finally {
    await db.close();
  }
}

testDatabaseTables(); 