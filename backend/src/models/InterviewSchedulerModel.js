/**
 * Interview Scheduler Model - Database table structure and field definitions
 * Used for building queries and understanding data structure during migration
 */

class InterviewSchedulerModel {
  constructor() {
    this.tableName = 'interview_Scheduler';
    
    // Field definitions for migration queries
    this.fields = {
      id: {
        type: 'SERIAL',
        primaryKey: true,
        notNull: true,
        description: 'Auto-incrementing primary key'
      },
      candidate_id: {
        type: 'INT',
        notNull: true,
        description: 'Candidate\'s ID'
      },
      hr_id: {
        type: 'INT',
        notNull: true,
        description: 'HR\'s ID'
      },
      panel_id: {
        type: 'INT',
        description: 'Interview panel ID (optional)'
      },
      recruitment_phase: {
        type: 'VARCHAR(100)',
        notNull: true,
        description: 'Phase of recruitment (e.g., Screening, Technical, HR Round)'
      },
      interview_link: {
        type: 'VARCHAR(500)',
        description: 'Online interview meeting link'
      },
      schedule_datetime: {
        type: 'TIMESTAMP',
        notNull: true,
        description: 'Scheduled interview date and time'
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
      panel_id: {
        references: 'panel_details',
        referencedColumn: 'id',
        description: 'References panel_details table'
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
      { name: 'idx_interview_scheduler_candidate_id', columns: ['candidate_id'] },
      { name: 'idx_interview_scheduler_hr_id', columns: ['hr_id'] },
      { name: 'idx_interview_scheduler_panel_id', columns: ['panel_id'] },
      { name: 'idx_interview_scheduler_phase', columns: ['recruitment_phase'] },
      { name: 'idx_interview_scheduler_datetime', columns: ['schedule_datetime'] },
      { name: 'idx_interview_scheduler_created_at', columns: ['created_at'] }
    ];

    // Sample data structure for migration
    this.sampleData = {
      id: 1,
      candidate_id: 1,
      hr_id: 1,
      panel_id: 1,
      recruitment_phase: 'Technical Round',
      interview_link: 'https://meet.google.com/abc-defg-hij',
      schedule_datetime: '2024-01-25T10:00:00Z',
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

module.exports = InterviewSchedulerModel; 