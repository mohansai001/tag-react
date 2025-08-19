const db = require('./src/config/database/db');

async function listTables() {
  try {
    console.log('🔍 Connecting to database...');
    
    const isConnected = await db.isConnected();
    if (!isConnected) {
      console.log('❌ Database connection failed');
      return;
    }
    console.log('✅ Database connection successful!');
    
    // List all tables in the database
    const tablesQuery = `
      SELECT 
        table_name,
        table_type
      FROM information_schema.tables 
      WHERE table_schema = 'public'
      ORDER BY table_name;
    `;
    
    const tablesResult = await db.query(tablesQuery);
    
    console.log('\n📋 Tables in database:');
    console.log('=====================');
    
    if (tablesResult.rows.length === 0) {
      console.log('❌ No tables found in the database');
    } else {
      tablesResult.rows.forEach((table, index) => {
        console.log(`${index + 1}. ${table.table_name} (${table.table_type})`);
      });
    }
    
    // Get table details for each table
    console.log('\n📊 Table Details:');
    console.log('================');
    
    for (const table of tablesResult.rows) {
      const columnsQuery = `
        SELECT 
          column_name,
          data_type,
          is_nullable,
          column_default
        FROM information_schema.columns 
        WHERE table_name = $1
        ORDER BY ordinal_position;
      `;
      
      const columnsResult = await db.query(columnsQuery, [table.table_name]);
      
      console.log(`\n📋 Table: ${table.table_name}`);
      console.log('Columns:');
      
      if (columnsResult.rows.length === 0) {
        console.log('  No columns found');
      } else {
        columnsResult.rows.forEach(column => {
          const nullable = column.is_nullable === 'YES' ? 'NULL' : 'NOT NULL';
          const defaultValue = column.column_default ? ` DEFAULT ${column.column_default}` : '';
          console.log(`  - ${column.column_name}: ${column.data_type} ${nullable}${defaultValue}`);
        });
      }
      
      // Get row count for each table
      try {
        const countQuery = `SELECT COUNT(*) as count FROM "${table.table_name}";`;
        const countResult = await db.query(countQuery);
        console.log(`  Row count: ${countResult.rows[0].count}`);
      } catch (countError) {
        console.log(`  Row count: Unable to count (${countError.message})`);
      }
    }
    
    
  } catch (error) {
    console.error('❌ Error listing tables:', error.message);
  } finally {
    await db.close();
  }
}

listTables(); 