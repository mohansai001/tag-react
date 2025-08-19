/**
 * HR Model - Database table structure and field definitions
 * Used for building queries and understanding data structure during migration
 */

class HrModel {
  constructor() {
    this.tableName = 'hr_info';
    
    // Field definitions for migration queries
    this.fields = {
      hr_id: {
        type: 'SERIAL',
        primaryKey: true,
        notNull: true,
        description: 'Auto-incrementing primary key for HR'
      },
      hr_name: {
        type: 'VARCHAR(255)',
        notNull: true,
        description: 'Full name of the HR representative'
      },
      hr_vam_id: {
        type: 'VARCHAR(255)',
        unique: true,
        notNull: true,
        description: 'Unique VAM ID for HR'
      },
      hr_email: {
        type: 'VARCHAR(255)',
        unique: true,
        notNull: true,
        description: 'Email address of the HR representative'
      },
      assigned_ec: {
        type: 'VARCHAR(255)',
        description: 'Engineering center assigned to HR'
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
      { name: 'idx_hr_vam_id', columns: ['hr_vam_id'] },
      { name: 'idx_hr_email', columns: ['hr_email'] },
      { name: 'idx_hr_assigned_ec', columns: ['assigned_ec'] },
      { name: 'idx_hr_name', columns: ['hr_name'] }
    ];

    // Sample data structure for migration
    this.sampleData = {
      hr_id: 1,
      hr_name: 'Sarah Johnson',
      hr_vam_id: 'VAM001',
      hr_email: 'sarah.johnson@company.com',
      assigned_ec: 'Bangalore',
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

module.exports = HrModel; 