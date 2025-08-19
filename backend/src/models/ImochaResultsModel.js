/**
 * Imocha Results Model - Database table structure and field definitions
 * Used for building queries and understanding data structure during migration
 */

class ImochaResultsModel {
  constructor() {
    this.tableName = 'Imocha_results';
    
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
        description: 'Reference to candidate_info table'
      },
      candidate_email: {
        type: 'VARCHAR(255)',
        notNull: true,
        description: 'Candidate\'s email address'
      },
      score: {
        type: 'INT',
        notNull: true,
        description: 'Test score'
      },
      total_test_points: {
        type: 'INT',
        notNull: true,
        description: 'Maximum test points'
      },
      score_percentage: {
        type: 'INT',
        notNull: true,
        description: 'Score percentage'
      },
      performance_category: {
        type: 'VARCHAR(50)',
        description: 'Performance category'
      },
      test_name: {
        type: 'VARCHAR(255)',
        description: 'Test name'
      },
      pdf_report_url: {
        type: 'TEXT',
        description: 'Report link'
      },
      attempted_date: {
        type: 'TIMESTAMP WITH TIME ZONE',
        description: 'Test attempt date'
      },
      visible: {
        type: 'BOOLEAN',
        default: false,
        description: 'Visibility flag'
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
      { name: 'idx_imocha_candidate_id', columns: ['candidate_id'] },
      { name: 'idx_imocha_candidate_email', columns: ['candidate_email'] },
      { name: 'idx_imocha_score', columns: ['score'] },
      { name: 'idx_imocha_score_percentage', columns: ['score_percentage'] },
      { name: 'idx_imocha_performance_category', columns: ['performance_category'] },
      { name: 'idx_imocha_test_name', columns: ['test_name'] },
      { name: 'idx_imocha_attempted_date', columns: ['attempted_date'] },
      { name: 'idx_imocha_visible', columns: ['visible'] },
      { name: 'idx_imocha_created_at', columns: ['created_at'] }
    ];

    // Sample data structure for migration
    this.sampleData = {
      id: 1,
      candidate_id: 1,
      candidate_email: 'john.doe@example.com',
      score: 85,
      total_test_points: 100,
      score_percentage: 85,
      performance_category: 'Excellent',
      test_name: 'Technical Assessment',
      pdf_report_url: 'https://example.com/report1.pdf',
      attempted_date: '2024-01-15T10:00:00Z',
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

module.exports = ImochaResultsModel; 