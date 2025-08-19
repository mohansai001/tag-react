/**
 * Prescreening Form Model - Database table structure and field definitions
 * Used for building queries and understanding data structure during migration
 */

class PrescreeningFormModel {
  constructor() {
    this.tableName = 'Prescreening_form';
    
    // Field definitions for migration queries
    this.fields = {
      id: {
        type: 'SERIAL',
        primaryKey: true,
        notNull: true,
        description: 'Auto-incrementing primary key'
      },
      candidate_id: {
        type: 'VARCHAR(255)',
        description: 'Reference to candidate_info table'
      },
      hr_id: {
        type: 'VARCHAR(255)',
        description: 'Reference to hr_info table'
      },
      preScreening_date: {
        type: 'DATE',
        notNull: true,
        description: 'Scheduled interview date'
      },
      status: {
        type: 'VARCHAR(50)',
        description: 'Status (shortlisted, rejected, pending)'
      },
      summary: {
        type: 'TEXT',
        description: 'Summary of candidate\'s prescreening'
      },
      ec_select: {
        type: 'TEXT',
        description: 'EC Selection - cloud/app/data'
      },
      detailed_feedback: {
        type: 'TEXT',
        description: 'Feedback from HR or interviewer'
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
      candidate_id: {
        references: 'candidate_info',
        referencedColumn: 'id',
        description: 'References candidate_info table'
      },
      hr_id: {
        references: 'hr_info',
        referencedColumn: 'hr_id',
        description: 'References hr_info table'
      },
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
      { name: 'idx_prescreening_candidate_id', columns: ['candidate_id'] },
      { name: 'idx_prescreening_hr_id', columns: ['hr_id'] },
      { name: 'idx_prescreening_date', columns: ['preScreening_date'] },
      { name: 'idx_prescreening_status', columns: ['status'] },
      { name: 'idx_prescreening_ec_select', columns: ['ec_select'] },
      { name: 'idx_prescreening_created_at', columns: ['created_at'] }
    ];

    // Sample data structure for migration
    this.sampleData = {
      id: 1,
      candidate_id: '1',
      hr_id: 'HR001',
      preScreening_date: '2024-01-25',
      status: 'Shortlisted',
      summary: 'Candidate shows strong technical skills and good communication',
      ec_select: 'cloud',
      detailed_feedback: 'Excellent problem-solving abilities and team collaboration skills',
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

module.exports = PrescreeningFormModel; 