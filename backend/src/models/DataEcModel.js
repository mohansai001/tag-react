/**
 * Data EC Model - Database table structure and field definitions
 * Used for building queries and understanding data structure during migration
 */

class DataEcModel {
  constructor() {
    this.tableName = 'Data_EC';
    
    // Field definitions for migration queries
    this.fields = {
      job_id: {
        type: 'SERIAL',
        primaryKey: true,
        notNull: true,
        description: 'Auto-incrementing primary key'
      },
      job_role: {
        type: 'VARCHAR(255)',
        notNull: true,
        description: 'Job role title'
      },
      data_job_jd: {
        type: 'TEXT',
        description: 'Data job JD s3 bucket link'
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
      { name: 'idx_data_ec_job_role', columns: ['job_role'] },
      { name: 'idx_data_ec_created_at', columns: ['created_at'] }
    ];

    // Sample data structure for migration
    this.sampleData = {
      job_id: 1,
      job_role: 'Data Engineer',
      data_job_jd: 'https://s3.amazonaws.com/jd/data-engineer.pdf',
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

module.exports = DataEcModel; 