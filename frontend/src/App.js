import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './pages/Login';
import ResumeAnalysis from './pages/ResumeAnalysis';
import AppRecruit from './pages/apprecruit'; // Assuming it's a 
import ViewDuplicates from './pages/ViewDuplicates';
import PrescreeningForm from './pages/prescreeningform';
import ImochaPage from './pages/imocha';
import Candidates from './pages/candidates';
import Panel from './pages/panel';
import AppL2Technical from './pages/app_l2_technical';
import ProjectFitment from './pages/project_fitment';
import ECFitment from './pages/ec_fitment';
import FeedbackForm from './pages/feedback';
import FinalFeedback from './pages/finalfeedback';
import Dashboard from './pages/Dashboard.js';
import EcSelection from './pages/ec_selection'; // Assuming this is the correct path
import Sidebar from './pages/Sidebar'; // Assuming Sidebar is a component
import TestAPI from './pages/TestAPI.js';

import './index.css';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/apprecruit" element={<AppRecruit />} />
        <Route path="/resume-analysis" element={<ResumeAnalysis />} />
        <Route path="/view-duplicates" element={<ViewDuplicates />} />
        <Route path="/prescreening-form" element={<PrescreeningForm />} />
        <Route path="/imocha" element={<ImochaPage />} />
        <Route path="/candidates" element={<Candidates />} />
        <Route path="/panel" element={<Panel />} />
        <Route path="/app-l2-technical" element={<AppL2Technical />} />
        <Route path="/project-fitment" element={<ProjectFitment />} />
        <Route path="/ec-fitment" element={<ECFitment />} />
        <Route path="/feedback-form" element={<FeedbackForm />} />
        <Route path="/final-feedback" element={<FinalFeedback />} />
        <Route path="/ec-selection" element={<EcSelection />} />
        <Route path="/sidebar" element={<Sidebar />} />
        <Route path="/test-api" element={<TestAPI />} />



        {/* Add more routes as needed */}
      </Routes>
    </Router>
  );
}

export default App;
