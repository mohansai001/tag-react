/**
 * Candidate Model - Database table structure and field definitions
 * Used for building queries and understanding data structure during migration
 */

class CandidateModel {
  constructor() {
    this.tableName = 'candidate_info';
    
    // Field definitions for migration queries
    this.fields = {
      id: {
        type: 'SERIAL',
        primaryKey: true,
        notNull: true,
        description: 'Auto-incrementing primary key'
      },
      candidate_name: {
        type: 'VARCHAR(255)',
        notNull: true,
        description: 'Full name of the candidate'
      },
      candidate_email: {
        type: 'VARCHAR(255)',
        unique: true,
        description: 'Email address of the candidate'
      },
      candidate_phone: {
        type: 'VARCHAR(20)',
        description: 'Contact number of the candidate'
      },
      primary_skill: {
        type: 'VARCHAR(255)',
        description: 'Primary technical skill of the candidate'
      },
      prescreening_status: {
        type: 'VARCHAR(50)',
        description: 'Status of prescreening process'
      },
      role: {
        type: 'VARCHAR(255)',
        description: 'Candidate\'s job role'
      },
      recruitment_phase: {
        type: 'VARCHAR(50)',
        description: 'Current recruitment phase'
      },
      resume_score: {
        type: 'VARCHAR(50)',
        description: 'Resume evaluation score'
      },
      resume: {
        type: 'TEXT',
        description: 'Resume file link'
      },
      content: {
        type: 'TEXT',
        description: 'Resume analysis and candidate content'
      },
      date: {
        type: 'DATE',
        description: 'Application submission date'
      },
      offer_status: {
        type: 'VARCHAR(50)',
        description: 'Offer issued or not'
      },
      hr_id: {
        type: 'VARCHAR(50)',
        description: 'HR managing the candidate'
      },
      hr_email: {
        type: 'VARCHAR(255)',
        description: 'HR email for candidate info upload'
      },
      uan_number: {
        type: 'BIGINT',
        description: 'Universal Account Number (numeric)'
      },
      candidate_image_url: {
        type: 'VARCHAR(500)',
        description: 'URL of the uploaded candidate image'
      },
      rrf_id: {
        type: 'VARCHAR(50)',
        description: 'References RRF ID'
      },
      eng_center: {
        type: 'VARCHAR(100)',
        description: 'Engineering center name'
      },
      visible: {
        type: 'BOOLEAN',
        default: false,
        description: 'Candidate visibility in reports'
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
      hr_id: {
        references: 'hr_info',
        referencedColumn: 'hr_id',
        description: 'References HR details table'
      },
      rrf_id: {
        references: 'rrf_details',
        referencedColumn: 'rrf_id',
        description: 'References RRF details table'
      }
    };

    // Indexes for performance
    this.indexes = [
      { name: 'idx_candidate_email', columns: ['candidate_email'] },
      { name: 'idx_candidate_hr_id', columns: ['hr_id'] },
      { name: 'idx_candidate_rrf_id', columns: ['rrf_id'] },
      { name: 'idx_candidate_status', columns: ['prescreening_status'] },
      { name: 'idx_candidate_phase', columns: ['recruitment_phase'] },
      { name: 'idx_candidate_visible', columns: ['visible'] },
      { name: 'idx_candidate_date', columns: ['date'] }
    ];

    // Sample data structure for migration
    this.sampleData = {
      id: 1,
      candidate_name: 'John Doe',
      candidate_email: 'john.doe@example.com',
      candidate_phone: '+91-9876543210',
      primary_skill: 'React.js',
      prescreening_status: 'Shortlisted',
      role: 'Frontend Developer',
      recruitment_phase: 'Technical Round',
      resume_score: '85%',
      resume: 'https://example.com/resume1.pdf',
      content: 'Strong JavaScript developer with 5 years of experience in React, Angular, and Vue.js. Excellent problem-solving skills and experience with modern frontend frameworks. Good understanding of responsive design and cross-browser compatibility. Previous experience includes building scalable web applications and working with REST APIs. Strong communication skills and ability to work in agile environments.',
      date: '2024-01-15',
      offer_status: 'Pending',
      hr_id: 'HR001',
      hr_email: 'hr@company.com',
      uan_number: 123456789012,
      candidate_image_url: 'https://example.com/image1.jpg',
      rrf_id: 'RRF001',
      eng_center: 'Bangalore',
      visible: true,
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

module.exports = CandidateModel; 