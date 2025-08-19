/**
 * Panel Details Model - Database table structure and field definitions
 * Used for building queries and understanding data structure during migration
 */

class PanelDetailsModel {
  constructor() {
    this.tableName = 'panel_details';
    
    // Field definitions for migration queries
    this.fields = {
      id: {
        type: 'SERIAL',
        primaryKey: true,
        notNull: true,
        description: 'Auto-incrementing primary key'
      },
      name: {
        type: 'VARCHAR(255)',
        notNull: true,
        description: 'Panelist\'s name'
      },
      status: {
        type: 'VARCHAR(50)',
        notNull: true,
        description: 'Panelist\'s current status'
      },
      ec_account: {
        type: 'VARCHAR(100)',
        notNull: true,
        description: 'Associated account'
      },
      email: {
        type: 'VARCHAR(255)',
        unique: true,
        notNull: true,
        description: 'Panelist\'s unique email'
      },
      overall_experience: {
        type: 'VARCHAR(255)',
        description: 'Overall experience of panelist'
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
      { name: 'idx_panel_details_name', columns: ['name'] },
      { name: 'idx_panel_details_email', columns: ['email'] },
      { name: 'idx_panel_details_status', columns: ['status'] },
      { name: 'idx_panel_details_ec_account', columns: ['ec_account'] },
      { name: 'idx_panel_details_created_at', columns: ['created_at'] }
    ];

    // Sample data structure for migration
    this.sampleData = {
      id: 1,
      name: 'Dr. Sarah Johnson',
      status: 'Active',
      ec_account: 'Bangalore',
      email: 'sarah.johnson@company.com',
      overall_experience: '8 years',
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

module.exports = PanelDetailsModel; 