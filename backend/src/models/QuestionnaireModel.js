/**
 * Questionnaire Model - Database table structure and field definitions
 * Used for building queries and understanding data structure during migration
 * Covers questionnaire and response tables
 */

class QuestionnaireModel {
  constructor() {
    this.tableName = 'questionnaire_tables';
    
    // Field definitions for questionnaire tables
    this.questionnaireFields = {
      id: {
        type: 'SERIAL',
        primaryKey: true,
        notNull: true,
        description: 'Auto-incrementing primary key'
      },
      category_id: {
        type: 'INT',
        notNull: true,
        description: 'Reference to EC_mapping table'
      },
      question_text: {
        type: 'TEXT',
        notNull: true,
        description: 'Question text content'
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

    // Field definitions for questionnaire response tables
    this.responseFields = {
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
      question_id: {
        type: 'INT',
        notNull: true,
        description: 'Reference to questionnaire table'
      },
      response_text: {
        type: 'TEXT',
        description: 'Candidate\'s response to the question'
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

    // Field definitions for tag questionnaire table
    this.tagQuestionnaireFields = {
      id: {
        type: 'SERIAL',
        primaryKey: true,
        notNull: true,
        description: 'Auto-incrementing primary key'
      },
      hr_id: {
        type: 'VARCHAR(255)',
        description: 'Reference to hr_info table'
      },
      candidate_id: {
        type: 'VARCHAR(255)',
        description: 'Reference to candidate_info table'
      },
      introduction_value_momentum: {
        type: 'TEXT',
        description: 'Candidate\'s knowledge about ValueMomentum'
      },
      introduction_cloud_app: {
        type: 'TEXT',
        description: 'Candidate\'s knowledge about Cloud Apps'
      },
      roles_responsibilities: {
        type: 'TEXT',
        description: 'Roles & responsibilities understanding'
      },
      did_candidate_qualify_using_pre_screening_qs: {
        type: 'TEXT',
        description: 'Did candidate qualify using pre-screening questions'
      },
      pre_screening_qs: {
        type: 'TEXT',
        description: 'Pre-screening questions'
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
      category_id: {
        references: 'EC_mapping',
        referencedColumn: 'id',
        description: 'References EC_mapping table'
      },
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
      question_id: {
        references: 'questionnaire_tables',
        referencedColumn: 'id',
        description: 'References questionnaire tables'
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
      { name: 'idx_questionnaire_category_id', columns: ['category_id'] },
      { name: 'idx_questionnaire_question_text', columns: ['question_text'] },
      { name: 'idx_response_candidate_id', columns: ['candidate_id'] },
      { name: 'idx_response_hr_id', columns: ['hr_id'] },
      { name: 'idx_response_question_id', columns: ['question_id'] },
      { name: 'idx_tag_questionnaire_candidate_id', columns: ['candidate_id'] },
      { name: 'idx_tag_questionnaire_hr_id', columns: ['hr_id'] }
    ];

    // Sample data structure for migration
    this.sampleData = {
      questionnaire: {
        id: 1,
        category_id: 1,
        question_text: 'What is AWS Lambda and how does it work?',
        created_at: '2024-01-15T10:00:00Z',
        updated_at: '2024-01-15T10:00:00Z',
        created_by: 1,
        updated_by: 1
      },
      response: {
        id: 1,
        candidate_id: '1',
        hr_id: 'HR001',
        question_id: 1,
        response_text: 'AWS Lambda is a serverless compute service that runs code in response to events.',
        created_at: '2024-01-15T10:00:00Z',
        updated_at: '2024-01-15T10:00:00Z',
        created_by: 1,
        updated_by: 1
      },
      tagQuestionnaire: {
        id: 1,
        hr_id: 'HR001',
        candidate_id: '1',
        introduction_value_momentum: 'Good understanding of company values',
        introduction_cloud_app: 'Familiar with cloud technologies',
        roles_responsibilities: 'Clear understanding of role requirements',
        did_candidate_qualify_using_pre_screening_qs: 'Yes',
        pre_screening_qs: 'Technical assessment questions',
        created_at: '2024-01-15T10:00:00Z',
        updated_at: '2024-01-15T10:00:00Z',
        created_by: 1,
        updated_by: 1
      }
    };
  }

  // Get all field names for SELECT queries
  getFieldNames() {
    return Object.keys(this.questionnaireFields);
  }

  // Get field definitions for CREATE/ALTER queries
  getFieldDefinitions() {
    return this.questionnaireFields;
  }

  // Get response field definitions
  getResponseFieldDefinitions() {
    return this.responseFields;
  }

  // Get tag questionnaire field definitions
  getTagQuestionnaireFieldDefinitions() {
    return this.tagQuestionnaireFields;
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
      questionnaireFields: this.questionnaireFields,
      responseFields: this.responseFields,
      tagQuestionnaireFields: this.tagQuestionnaireFields,
      foreignKeys: this.foreignKeys,
      indexes: this.indexes,
      sampleData: this.sampleData
    };
  }

  // Get all questionnaire table names
  getQuestionnaireTableNames() {
    return [
      'Cloud_ec_questionnaire',
      'App_ec_questionnaire',
      'data_ec_questionnaire',
      'Cloud_ec_questionnaire_responses',
      'App_ec_questionnaire_responses',
      'Data_ec_questionnaire_responses',
      'tag_questionnaire'
    ];
  }
}

module.exports = QuestionnaireModel; 