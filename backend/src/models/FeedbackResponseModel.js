/**
 * Feedback Response Model - Database table structure and field definitions
 * Used for building queries and understanding data structure during migration
 * Covers all feedback response tables: app_*, cloud_*, data_* feedback_response
 */

class FeedbackResponseModel {
  constructor() {
    this.tableName = 'feedback_response_tables';
    
    // Common field definitions for all feedback response tables
    this.commonFields = {
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
      hr_id: {
        type: 'VARCHAR(255)',
        description: 'Reference to hr_info table'
      },
      overall_rating: {
        type: 'INT',
        description: 'Overall assessment rating (1-10)'
      },
      technical_feedback: {
        type: 'TEXT',
        description: 'Detailed technical feedback'
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

    // Technology-specific field definitions
    this.technologyFields = {
      // App Technology Fields
      app_angular: {
        angular_experience: {
          type: 'VARCHAR(50)',
          description: 'Years of Angular experience'
        },
        component_architecture: {
          type: 'TEXT',
          description: 'Understanding of component lifecycle'
        },
        routing_understanding: {
          type: 'TEXT',
          description: 'Knowledge of Angular Router'
        },
        service_patterns: {
          type: 'TEXT',
          description: 'Understanding of dependency injection'
        },
        rxjs_knowledge: {
          type: 'TEXT',
          description: 'Knowledge of RxJS and observables'
        }
      },
      app_dotnet: {
        dotnet_experience: {
          type: 'VARCHAR(50)',
          description: 'Years of .NET experience'
        },
        csharp_knowledge: {
          type: 'TEXT',
          description: 'C# programming skills'
        },
        aspnet_understanding: {
          type: 'TEXT',
          description: 'Understanding of ASP.NET MVC'
        },
        entity_framework: {
          type: 'TEXT',
          description: 'Knowledge of Entity Framework'
        },
        design_patterns: {
          type: 'TEXT',
          description: 'Understanding of design patterns'
        }
      },
      app_java: {
        java_experience: {
          type: 'VARCHAR(50)',
          description: 'Years of Java experience'
        },
        spring_framework: {
          type: 'TEXT',
          description: 'Knowledge of Spring Boot'
        },
        hibernate_knowledge: {
          type: 'TEXT',
          description: 'Understanding of JPA/Hibernate'
        },
        microservices: {
          type: 'TEXT',
          description: 'Microservices architecture knowledge'
        },
        design_patterns: {
          type: 'TEXT',
          description: 'Understanding of design patterns'
        }
      },
      app_react: {
        react_experience: {
          type: 'VARCHAR(50)',
          description: 'Years of React experience'
        },
        hooks_understanding: {
          type: 'TEXT',
          description: 'Understanding of React Hooks'
        },
        state_management: {
          type: 'TEXT',
          description: 'Knowledge of state management'
        },
        component_lifecycle: {
          type: 'TEXT',
          description: 'Understanding of component lifecycle'
        },
        performance_optimization: {
          type: 'TEXT',
          description: 'Knowledge of performance optimization'
        }
      },
      // Cloud Technology Fields
      cloud_devops: {
        devops_experience: {
          type: 'VARCHAR(50)',
          description: 'Years of DevOps experience'
        },
        ci_cd_pipelines: {
          type: 'TEXT',
          description: 'Knowledge of CI/CD pipelines'
        },
        containerization: {
          type: 'TEXT',
          description: 'Understanding of Docker/Kubernetes'
        },
        cloud_platforms: {
          type: 'TEXT',
          description: 'Knowledge of cloud platforms'
        },
        infrastructure_as_code: {
          type: 'TEXT',
          description: 'Understanding of IaC tools'
        }
      },
      cloud_cloudops: {
        cloudops_experience: {
          type: 'VARCHAR(50)',
          description: 'Years of CloudOps experience'
        },
        aws_services: {
          type: 'TEXT',
          description: 'Knowledge of AWS services'
        },
        azure_services: {
          type: 'TEXT',
          description: 'Knowledge of Azure services'
        },
        monitoring_logging: {
          type: 'TEXT',
          description: 'Understanding of monitoring and logging'
        },
        security_compliance: {
          type: 'TEXT',
          description: 'Knowledge of cloud security'
        }
      },
      // Data Technology Fields
      data_engineering: {
        data_experience: {
          type: 'VARCHAR(50)',
          description: 'Years of data engineering experience'
        },
        sql_knowledge: {
          type: 'TEXT',
          description: 'SQL programming skills'
        },
        etl_processes: {
          type: 'TEXT',
          description: 'Understanding of ETL processes'
        },
        data_warehousing: {
          type: 'TEXT',
          description: 'Knowledge of data warehousing'
        },
        big_data_tools: {
          type: 'TEXT',
          description: 'Knowledge of big data tools'
        }
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
      { name: 'idx_feedback_candidate_id', columns: ['candidate_id'] },
      { name: 'idx_feedback_hr_id', columns: ['hr_id'] },
      { name: 'idx_feedback_rating', columns: ['overall_rating'] },
      { name: 'idx_feedback_created_at', columns: ['created_at'] }
    ];

    // Sample data structure for migration
    this.sampleData = {
      id: 1,
      candidate_id: 1,
      hr_id: 'HR001',
      overall_rating: 8,
      technical_feedback: 'Strong technical skills, good problem-solving abilities',
      created_at: '2024-01-15T10:00:00Z',
      updated_at: '2024-01-15T10:00:00Z',
      created_by: 1,
      updated_by: 1
    };
  }

  // Get all field names for SELECT queries
  getFieldNames() {
    return Object.keys(this.commonFields);
  }

  // Get field definitions for CREATE/ALTER queries
  getFieldDefinitions() {
    return this.commonFields;
  }

  // Get technology-specific fields
  getTechnologyFields(technology) {
    return this.technologyFields[technology] || {};
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
      fields: this.commonFields,
      technologyFields: this.technologyFields,
      foreignKeys: this.foreignKeys,
      indexes: this.indexes,
      sampleData: this.sampleData
    };
  }

  // Get all feedback response table names
  getFeedbackTableNames() {
    return [
      'app_angular_l2_feedback_response',
      'app_dotnet_l2_feedback_response',
      'app_java_l2_feedback_response',
      'app_react_l2_feedback_response',
      'cloud_devops_l2_feedback_response',
      'cloud_cloudops_l2_feedback_response',
      'data_l2_feedback_response'
    ];
  }
}

module.exports = FeedbackResponseModel; 