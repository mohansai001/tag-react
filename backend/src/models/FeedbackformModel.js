/**
 * Feedback Form Model - Database table structure and field definitions
 * Used for building queries and understanding data structure during migration
 */

class FeedbackformModel {
  constructor() {
    this.tableName = 'feedbackform';
    
    // Field definitions for migration queries
    this.fields = {
      id: {
        type: 'SERIAL',
        primaryKey: true,
        notNull: true,
        description: 'Auto-incrementing primary key'
      },
      candidate_email: {
        type: 'VARCHAR(255)',
        notNull: true,
        description: 'Candidate\'s email address'
      },
      imocha_score: {
        type: 'INT',
        check: 'imocha_score >= 0',
        description: 'iMocha test score (must be non-negative)'
      },
      rrf_id: {
        type: 'VARCHAR(50)',
        notNull: true,
        description: 'Requisition Request Form (RRF) ID'
      },
      position: {
        type: 'VARCHAR(255)',
        notNull: true,
        description: 'Job position applied for'
      },
      candidate_name: {
        type: 'VARCHAR(255)',
        notNull: true,
        description: 'Full name of the candidate'
      },
      interview_date: {
        type: 'DATE',
        notNull: true,
        description: 'Date of the interview'
      },
      interviewer_name: {
        type: 'VARCHAR(255)',
        notNull: true,
        description: 'Name of the interviewer'
      },
      hr_email: {
        type: 'VARCHAR(255)',
        notNull: true,
        description: 'Email of the HR personnel'
      },
      detailed_feedback: {
        type: 'TEXT',
        description: 'Detailed feedback from the interviewer'
      },
      result: {
        type: 'VARCHAR(50)',
        description: 'Final interview result (e.g., selected, rejected)'
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
      candidate_email: {
        references: 'candidate_info',
        referencedColumn: 'candidate_email',
        description: 'References candidate_info table'
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
      { name: 'idx_feedbackform_candidate_email', columns: ['candidate_email'] },
      { name: 'idx_feedbackform_imocha_score', columns: ['imocha_score'] },
      { name: 'idx_feedbackform_rrf_id', columns: ['rrf_id'] },
      { name: 'idx_feedbackform_position', columns: ['position'] },
      { name: 'idx_feedbackform_candidate_name', columns: ['candidate_name'] },
      { name: 'idx_feedbackform_interview_date', columns: ['interview_date'] },
      { name: 'idx_feedbackform_interviewer_name', columns: ['interviewer_name'] },
      { name: 'idx_feedbackform_hr_email', columns: ['hr_email'] },
      { name: 'idx_feedbackform_result', columns: ['result'] },
      { name: 'idx_feedbackform_created_at', columns: ['created_at'] }
    ];

    // Sample data structure for migration
    this.sampleData = {
      id: 1,
      candidate_email: 'john.doe@example.com',
      imocha_score: 85,
      rrf_id: 'RRF001',
      position: 'Frontend Developer',
      candidate_name: 'John Doe',
      interview_date: '2024-01-25',
      interviewer_name: 'Sarah Johnson',
      hr_email: 'hr@company.com',
      detailed_feedback: 'Excellent technical skills and good communication. Strong problem-solving abilities.',
      result: 'Selected',
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

module.exports = FeedbackformModel; 