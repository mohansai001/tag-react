/**
 * Admin Model - Database table structure and field definitions
 * Used for building queries and understanding data structure during migration
 */

class AdminModel {
  constructor() {
    this.tableName = 'admin_table';
    
    // Field definitions for migration queries
    this.fields = {
      vamid: {
        type: 'INT',
        primaryKey: true,
        description: 'Unique admin ID'
      },
      email: {
        type: 'VARCHAR(255)',
        unique: true,
        notNull: true,
        description: 'Admin\'s email address'
      },
      name: {
        type: 'VARCHAR(255)',
        notNull: true,
        description: 'Admin\'s full name'
      },
      ec_mapping: {
        type: 'TEXT',
        notNull: true,
        description: 'ECs mapped to the admin (comma-separated)'
      },
      status: {
        type: 'VARCHAR(50)',
        notNull: true,
        check: "IN ('Enable', 'Disable')",
        description: 'Admin account status'
      },
      created_at: {
        type: 'TIMESTAMP',
        notNull: true,
        default: 'CURRENT_TIMESTAMP',
        description: 'Record creation timestamp'
      },
      updated_at: {
        type: 'TIMESTAMP',
        notNull: true,
        default: 'CURRENT_TIMESTAMP',
        description: 'Last updated timestamp'
      },
      created_by: {
        type: 'INT',
        notNull: true,
        description: 'User who created the record'
      },
      updated_by: {
        type: 'INT',
        description: 'User who last updated the record'
      }
    };

    // Foreign key relationships
    this.foreignKeys = {
      created_by: {
        references: 'users',
        referencedColumn: 'id',
        description: 'References users table'
      },
      updated_by: {
        references: 'users',
        referencedColumn: 'id',
        description: 'References users table'
      }
    };

    // Indexes for performance
    this.indexes = [
      { name: 'idx_admin_email', columns: ['email'] },
      { name: 'idx_admin_status', columns: ['status'] },
      { name: 'idx_admin_name', columns: ['name'] },
      { name: 'idx_admin_vamid', columns: ['vamid'] }
    ];

    // Sample data structure for migration
    this.sampleData = {
      vamid: 1001,
      email: 'admin@company.com',
      name: 'Admin User',
      ec_mapping: 'Bangalore,Mumbai,Delhi',
      status: 'Enable',
      created_at: '2024-01-15T10:00:00Z',
      updated_at: '2024-01-15T10:00:00Z',
      created_by: 1,
      updated_by: 1
    };
  }

  // Get all field names for SELECT queries
  getFieldNames() {
    return Object.keys(this.fields);
  }

  // Get field definitions for CREATE/ALTER queries
  getFieldDefinitions() {
    return this.fields;
  }

  // Get foreign key relationships
  getForeignKeyRelationships() {
    return this.foreignKeys;
  }

  // Get indexes for performance optimization
  getIndexes() {
    return this.indexes;
  }

  // Get sample data structure
  getSampleData() {
    return this.sampleData;
  }

  // Get table schema for migration
  getTableSchema() {
    return {
      tableName: this.tableName,
      fields: this.fields,
      foreignKeys: this.foreignKeys,
      indexes: this.indexes,
      sampleData: this.sampleData
    };
  }
}

module.exports = AdminModel; 