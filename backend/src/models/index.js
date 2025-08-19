/**
 * Models Index - Exports all database models
 * Used for building queries and understanding data structure during migration
 */

const CandidateModel = require('./CandidateModel');
const HrModel = require('./HrModel');
const AdminModel = require('./AdminModel');
const LoginLogModel = require('./LoginLogModel');
const EcMappingModel = require('./EcMappingModel');
const InterviewRolesModel = require('./InterviewRolesModel');
const VmEcsModel = require('./VmEcsModel');
const AppEcModel = require('./AppEcModel');
const DataEcModel = require('./DataEcModel');
const CloudEcModel = require('./CloudEcModel');
const PanelDetailsModel = require('./PanelDetailsModel');
const PrescreeningFormModel = require('./PrescreeningFormModel');
const FeedbackResponseModel = require('./FeedbackResponseModel');
const QuestionnaireModel = require('./QuestionnaireModel');
const ImochaResultsModel = require('./ImochaResultsModel');
const InterviewSchedulerModel = require('./InterviewSchedulerModel');
const FeedbackformModel = require('./FeedbackformModel');

// Create instances of all models
const candidateModel = new CandidateModel();
const hrModel = new HrModel();
const adminModel = new AdminModel();
const ecMappingModel = new EcMappingModel();
const interviewRolesModel = new InterviewRolesModel();
const vmEcsModel = new VmEcsModel();
const appEcModel = new AppEcModel();
const dataEcModel = new DataEcModel();
const cloudEcModel = new CloudEcModel();
const panelDetailsModel = new PanelDetailsModel();
const prescreeningFormModel = new PrescreeningFormModel();
const feedbackResponseModel = new FeedbackResponseModel();
const questionnaireModel = new QuestionnaireModel();
const imochaResultsModel = new ImochaResultsModel();
const interviewSchedulerModel = new InterviewSchedulerModel();
const feedbackformModel = new FeedbackformModel();

// Export all models and their schemas
module.exports = {
  // Model instances
  CandidateModel: candidateModel,
  HrModel: hrModel,
  AdminModel: adminModel,
  EcMappingModel: ecMappingModel,
  InterviewRolesModel: interviewRolesModel,
  VmEcsModel: vmEcsModel,
  AppEcModel: appEcModel,
  DataEcModel: dataEcModel,
  CloudEcModel: cloudEcModel,
  PanelDetailsModel: panelDetailsModel,
  PrescreeningFormModel: prescreeningFormModel,
  FeedbackResponseModel: feedbackResponseModel,
  QuestionnaireModel: questionnaireModel,
  ImochaResultsModel: imochaResultsModel,
  InterviewSchedulerModel: interviewSchedulerModel,
  FeedbackformModel: feedbackformModel,

  // All table schemas for migration
  schemas: {
    candidate_info: candidateModel.getTableSchema(),
    hr_info: hrModel.getTableSchema(),
    admin_table: adminModel.getTableSchema(),
    ec_mapping: ecMappingModel.getTableSchema(),
    interview_roles: interviewRolesModel.getTableSchema(),
    vm_ecs: vmEcsModel.getTableSchema(),
    app_ec: appEcModel.getTableSchema(),
    data_ec: dataEcModel.getTableSchema(),
    cloud_ec: cloudEcModel.getTableSchema(),
    panel_details: panelDetailsModel.getTableSchema(),
    prescreening_form: prescreeningFormModel.getTableSchema(),
    feedback_response_tables: feedbackResponseModel.getTableSchema(),
    questionnaire_tables: questionnaireModel.getTableSchema(),
    imocha_results: imochaResultsModel.getTableSchema(),
    interview_scheduler: interviewSchedulerModel.getTableSchema(),
    feedbackform: feedbackformModel.getTableSchema()
  },

  // All field definitions for query building
  fieldDefinitions: {
    candidate_info: candidateModel.getFieldDefinitions(),
    hr_info: hrModel.getFieldDefinitions(),
    admin_table: adminModel.getFieldDefinitions(),
    ec_mapping: ecMappingModel.getFieldDefinitions(),
    interview_roles: interviewRolesModel.getFieldDefinitions(),
    vm_ecs: vmEcsModel.getFieldDefinitions(),
    app_ec: appEcModel.getFieldDefinitions(),
    data_ec: dataEcModel.getFieldDefinitions(),
    cloud_ec: cloudEcModel.getFieldDefinitions(),
    panel_details: panelDetailsModel.getFieldDefinitions(),
    prescreening_form: prescreeningFormModel.getFieldDefinitions(),
    feedback_response_tables: feedbackResponseModel.getFieldDefinitions(),
    questionnaire_tables: questionnaireModel.getFieldDefinitions(),
    imocha_results: imochaResultsModel.getFieldDefinitions(),
    interview_scheduler: interviewSchedulerModel.getFieldDefinitions(),
    feedbackform: feedbackformModel.getFieldDefinitions()
  },

  // All foreign key relationships
  foreignKeys: {
    candidate_info: candidateModel.getForeignKeyRelationships(),
    hr_info: hrModel.getForeignKeyRelationships(),
    admin_table: adminModel.getForeignKeyRelationships(),
    ec_mapping: ecMappingModel.getForeignKeyRelationships(),
    interview_roles: interviewRolesModel.getForeignKeyRelationships(),
    vm_ecs: vmEcsModel.getForeignKeyRelationships(),
    app_ec: appEcModel.getForeignKeyRelationships(),
    data_ec: dataEcModel.getForeignKeyRelationships(),
    cloud_ec: cloudEcModel.getForeignKeyRelationships(),
    panel_details: panelDetailsModel.getForeignKeyRelationships(),
    prescreening_form: prescreeningFormModel.getForeignKeyRelationships(),
    feedback_response_tables: feedbackResponseModel.getForeignKeyRelationships(),
    questionnaire_tables: questionnaireModel.getForeignKeyRelationships(),
    imocha_results: imochaResultsModel.getForeignKeyRelationships(),
    interview_scheduler: interviewSchedulerModel.getForeignKeyRelationships(),
    feedbackform: feedbackformModel.getForeignKeyRelationships()
  },

  // All indexes for performance optimization
  indexes: {
    candidate_info: candidateModel.getIndexes(),
    hr_info: hrModel.getIndexes(),
    admin_table: adminModel.getIndexes(),
    ec_mapping: ecMappingModel.getIndexes(),
    interview_roles: interviewRolesModel.getIndexes(),
    vm_ecs: vmEcsModel.getIndexes(),
    app_ec: appEcModel.getIndexes(),
    data_ec: dataEcModel.getIndexes(),
    cloud_ec: cloudEcModel.getIndexes(),
    panel_details: panelDetailsModel.getIndexes(),
    prescreening_form: prescreeningFormModel.getIndexes(),
    feedback_response_tables: feedbackResponseModel.getIndexes(),
    questionnaire_tables: questionnaireModel.getIndexes(),
    imocha_results: imochaResultsModel.getIndexes(),
    interview_scheduler: interviewSchedulerModel.getIndexes(),
    feedbackform: feedbackformModel.getIndexes()
  },

  // Sample data structures for migration
  sampleData: {
    candidate_info: candidateModel.getSampleData(),
    hr_info: hrModel.getSampleData(),
    admin_table: adminModel.getSampleData(),
    ec_mapping: ecMappingModel.getSampleData(),
    interview_roles: interviewRolesModel.getSampleData(),
    vm_ecs: vmEcsModel.getSampleData(),
    app_ec: appEcModel.getSampleData(),
    data_ec: dataEcModel.getSampleData(),
    cloud_ec: cloudEcModel.getSampleData(),
    panel_details: panelDetailsModel.getSampleData(),
    prescreening_form: prescreeningFormModel.getSampleData(),
    feedback_response_tables: feedbackResponseModel.getSampleData(),
    questionnaire_tables: questionnaireModel.getSampleData(),
    imocha_results: imochaResultsModel.getSampleData(),
    interview_scheduler: interviewSchedulerModel.getSampleData(),
    feedbackform: feedbackformModel.getSampleData()
  },

  // All table names for reference
  tableNames: {
    core: [
      'candidate_info', 
      'hr_info', 
      'admin_table',
      'EC_mapping',
      'InterviewRoles',
      'VM_EC\'s',
      'App_EC',
      'Data_EC',
      'Cloud_EC',
      'panel_details',
      'Prescreening_form',
      'tag_questionnaire',
      'Cloud_ec_questionnaire',
      'App_ec_questionnaire',
      'data_ec_questionnaire',
      'Cloud_ec_questionnaire_responses',
      'App_ec_questionnaire_responses',
      'Data_ec_questionnaire_responses',
      'Imocha_results',
      'interview_Scheduler',
      'feedbackform'
    ],
    feedback: feedbackResponseModel.getFeedbackTableNames(),
    questionnaire: questionnaireModel.getQuestionnaireTableNames(),
    all: [
      'candidate_info',
      'hr_info', 
      'admin_table',
      'EC_mapping',
      'InterviewRoles',
      'VM_EC\'s',
      'App_EC',
      'Data_EC',
      'Cloud_EC',
      'panel_details',
      'Prescreening_form',
      'tag_questionnaire',
      'Cloud_ec_questionnaire',
      'App_ec_questionnaire',
      'data_ec_questionnaire',
      'Cloud_ec_questionnaire_responses',
      'App_ec_questionnaire_responses',
      'Data_ec_questionnaire_responses',
      'Imocha_results',
      'interview_Scheduler',
      'feedbackform',
      ...feedbackResponseModel.getFeedbackTableNames(),
      ...questionnaireModel.getQuestionnaireTableNames()
    ]
  },

  // Helper functions for migration
  helpers: {
    // Get all field names for a table
    getFieldNames: (tableName) => {
      const models = {
        'candidate_info': candidateModel,
        'hr_info': hrModel,
        'admin_table': adminModel,
        'ec_mapping': ecMappingModel,
        'interview_roles': interviewRolesModel,
        'vm_ecs': vmEcsModel,
        'app_ec': appEcModel,
        'data_ec': dataEcModel,
        'cloud_ec': cloudEcModel,
        'panel_details': panelDetailsModel,
        'prescreening_form': prescreeningFormModel,
        'feedback_response_tables': feedbackResponseModel,
        'questionnaire_tables': questionnaireModel,
        'imocha_results': imochaResultsModel,
        'interview_scheduler': interviewSchedulerModel,
        'feedbackform': feedbackformModel
      };
      return models[tableName]?.getFieldNames() || [];
    },

    // Get field definitions for a table
    getFieldDefinitions: (tableName) => {
      const models = {
        'candidate_info': candidateModel,
        'hr_info': hrModel,
        'admin_table': adminModel,
        'ec_mapping': ecMappingModel,
        'interview_roles': interviewRolesModel,
        'vm_ecs': vmEcsModel,
        'app_ec': appEcModel,
        'data_ec': dataEcModel,
        'cloud_ec': cloudEcModel,
        'panel_details': panelDetailsModel,
        'prescreening_form': prescreeningFormModel,
        'feedback_response_tables': feedbackResponseModel,
        'questionnaire_tables': questionnaireModel,
        'imocha_results': imochaResultsModel,
        'interview_scheduler': interviewSchedulerModel,
        'feedbackform': feedbackformModel
      };
      return models[tableName]?.getFieldDefinitions() || {};
    },

    // Get foreign keys for a table
    getForeignKeys: (tableName) => {
      const models = {
        'candidate_info': candidateModel,
        'hr_info': hrModel,
        'admin_table': adminModel,
        'ec_mapping': ecMappingModel,
        'interview_roles': interviewRolesModel,
        'vm_ecs': vmEcsModel,
        'app_ec': appEcModel,
        'data_ec': dataEcModel,
        'cloud_ec': cloudEcModel,
        'panel_details': panelDetailsModel,
        'prescreening_form': prescreeningFormModel,
        'feedback_response_tables': feedbackResponseModel,
        'questionnaire_tables': questionnaireModel,
        'imocha_results': imochaResultsModel,
        'interview_scheduler': interviewSchedulerModel,
        'feedbackform': feedbackformModel
      };
      return models[tableName]?.getForeignKeyRelationships() || {};
    },

    // Get indexes for a table
    getIndexes: (tableName) => {
      const models = {
        'candidate_info': candidateModel,
        'hr_info': hrModel,
        'admin_table': adminModel,
        'ec_mapping': ecMappingModel,
        'interview_roles': interviewRolesModel,
        'vm_ecs': vmEcsModel,
        'app_ec': appEcModel,
        'data_ec': dataEcModel,
        'cloud_ec': cloudEcModel,
        'panel_details': panelDetailsModel,
        'prescreening_form': prescreeningFormModel,
        'feedback_response_tables': feedbackResponseModel,
        'questionnaire_tables': questionnaireModel,
        'imocha_results': imochaResultsModel,
        'interview_scheduler': interviewSchedulerModel,
        'feedbackform': feedbackformModel
      };
      return models[tableName]?.getIndexes() || [];
    },

    // Get sample data for a table
    getSampleData: (tableName) => {
      const models = {
        'candidate_info': candidateModel,
        'hr_info': hrModel,
        'admin_table': adminModel,
        'ec_mapping': ecMappingModel,
        'interview_roles': interviewRolesModel,
        'vm_ecs': vmEcsModel,
        'app_ec': appEcModel,
        'data_ec': dataEcModel,
        'cloud_ec': cloudEcModel,
        'panel_details': panelDetailsModel,
        'prescreening_form': prescreeningFormModel,
        'feedback_response_tables': feedbackResponseModel,
        'questionnaire_tables': questionnaireModel,
        'imocha_results': imochaResultsModel,
        'interview_scheduler': interviewSchedulerModel,
        'feedbackform': feedbackformModel,
        'login_logs': LoginLogModel
      };
      return models[tableName]?.getSampleData() || {};
    }
  }
}; 