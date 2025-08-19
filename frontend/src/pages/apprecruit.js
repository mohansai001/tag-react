import React, { useState, useEffect, useRef } from 'react';
import './apprecruit.css'; // Corrected CSS import path
import { useNavigate } from "react-router-dom"; // Add at top if not presentimport { useNavigate } from "react-router-dom";
import SidebarDrawer from '../common/components/SidebarDrawer';

import jspdf from 'jspdf';
import * as msal from "@azure/msal-browser";





const Toast = ({ message, type, show }) => {
  if (!show) return null;
  return <div className={`toast show ${type}`}>{message}</div>;
};

const sidebarItems = [
  { name: "Dashboard", icon: "DashboardIcon", path: "/dashboard" },
  { name: "Recruit", icon: "GroupIcon", path: "/apprecruit" },
  { name: "RRF Tracking", icon: "AssignmentIcon", path: "/rrf-tracking" },
  { name: "GT's Prescreening", icon: "ListAltIcon", path: "/gt-prescreening" },
  { name: "Logout", icon: "LogoutIcon", action: "logout" }
];


// const Sidebar = ({ onNavigate, onLogout }) => {
//   const [isOpen, setIsOpen] = useState(false);
//   return (
//     <>
//       <button id="toggle-sidebar-btn" onClick={() => setIsOpen(!isOpen)}>☰ Menu</button>
//       <div id="sidebar" className={`sidebar-menu ${isOpen ? 'show' : ''}`} style={{ width: '200px' }}>
//         <div className="sidebar-option active" onClick={() => onNavigate('Dashboard.html')}>
//           <i className="fas fa-tachometer-alt"></i>
//           <span>Dashboard</span>
//         </div>
//         <div className="sidebar-option" onClick={() => onNavigate('ECselection.html')}>
//           <i className="fas fa-users"></i>
//           <span>Recruit</span>
//         </div>
//         <div className="sidebar-option" onClick={() => onNavigate('candidatespage.html')}>
//           <i className="fas fa-tasks"></i><span>RRF Tracking</span>
//         </div>
//         <div className="sidebar-option" onClick={() => onNavigate('GTPrescreening.html')}>
//           <i className="fas fa-tasks"></i><span>GT's Prescreening</span>
//         </div>
//         <div className="sidebar-option logout-option" onClick={onLogout}>
//           <i className="fas fa-sign-out-alt"></i>
//           <span>Logout</span>
//         </div>
//       </div>
//     </>
//   );
// };

const ProgressSteps = () => (
  <div className="progress-steps">
    <div className="steps-container">
      <div className="progress-line"></div>
      <div className="step active">
        <div className="step-circle">1</div>
        <div className="step-title">Resume Pre-screen</div>
      </div>
      <div className="step">
        <div className="step-circle">2</div>
        <div className="step-title">Online iMocha</div>
      </div>
      <div className="step">
        <div className="step-circle">3</div>
        <div className="step-title">L2 Technical</div>
      </div>
      <div className="step">
        <div className="step-circle">4</div>
        <div className="step-title">Fitment Round</div>
      </div>
    </div>
  </div>
);


// --- Main App Component ---

function AppRecruit() {
    
    const navigate = useNavigate();

  // --- State Management ---
  const [toast, setToast] = useState({ message: '', type: 'success', show: false });
  const [selectedRole, setSelectedRole] = useState('');
  const [selectedCloudProvider, setSelectedCloudProvider] = useState('');
  const [selectedFrontendTech, setSelectedFrontendTech] = useState('');
  const [selectedLevel, setSelectedLevel] = useState('');
  const [jobDescription, setJobDescription] = useState('');
  const [ecName, setEcName] = useState('');

  const [isResumePopupOpen, setIsResumePopupOpen] = useState(false);
  const [isCloudProviderPopupOpen, setIsCloudProviderPopupOpen] = useState(false);
  const [isDuplicateModalOpen, setIsDuplicateModalOpen] = useState(false);
  
  const [duplicateCandidates, setDuplicateCandidates] = useState(new Set());
  const [evaluationResult, setEvaluationResult] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const msalInstanceRef = useRef(null);
  

  // --- Effects (Lifecycle) ---

  // Initialize MSAL and load initial data
  useEffect(() => {
    const msalConfig = {
      auth: {
        clientId: "ed0b1bf7-b012-4e13-a526-b696932c0673",
        authority: "https://login.microsoftonline.com/13085c86-4bcb-460a-a6f0-b373421c6323",
        redirectUri: window.location.origin,
      },
    };
    if (window.msal) {
        msalInstanceRef.current = new msal.PublicClientApplication(msalConfig);
    }

    const urlParams = new URLSearchParams(window.location.search);
    setEcName(urlParams.get("selectedValue") || "");

    // You can add functions like loadCandidateCounts here if needed
  }, []);

  // --- Functions (Converted from original JS) ---

  const showToast = (message, type = "success") => {
    setToast({ message, type, show: true });
    setTimeout(() => {
      setToast({ message: '', type: 'success', show: false });
    }, 3000);
  };
  
  // const navigateTo = (page) => {
  //     window.location.href = page;
  // };

  const showDuplicateModal = (email, name) => {
    setDuplicateCandidates(prev => new Set(prev).add(`${name} - ${email}`));
    setIsDuplicateModalOpen(true);
  };

  const sendCandidateInfoToDB = (candidateDetails) => {
    fetch("/api/add-candidate-info", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(candidateDetails),
      })
      .then((response) => response.json())
      .then((data) => {
        if (data.success) {
          console.log("✅ Candidate info saved:", data);
          localStorage.setItem("candidateId", data.data.id);
        } else if (data.code === "23505") { // Duplicate error code
          showDuplicateModal(candidateDetails.candidate_email, candidateDetails.candidate_name);
        } else {
          console.warn("Unhandled DB response:", data);
        }
      })
      .catch((error) => {
        console.error("❌ Error saving candidate:", error);
      });
  };

  const handleLogout = async () => {
      const loginId = localStorage.getItem('loggin-id');
      if (loginId) {
          try {
              await fetch('/api/log-logout', {
                  method: 'PATCH',
                  headers: { 'Content-Type': 'application/json' },
                  body: JSON.stringify({ id: loginId }),
              });
          } catch (error) {
              console.error('Error during logout API call:', error);
          }
      }
      localStorage.clear();
      window.location.href = 'index.html';
  };

  const getGithubToken = async () => {
    try {
      const response = await fetch("https://demotag.vercel.app/api/github-token");
      if (!response.ok) throw new Error("Network response was not ok");
      const data = await response.json();
      return data.token;
    } catch (error) {
      console.error("Failed to fetch GitHub token:", error);
      showToast("Failed to fetch GitHub token", "error");
      return null;
    }
  };

  const fetchJobDescription = async (role, cloudProvider, level, frontendTech) => {
    if (!cloudProvider) {
      showToast("Cloud Provider is missing.", "error");
      return;
    }

    let fileName = "";
    switch (role) {
      case "Cloud Native Application Engineer - Backend":
      case "Cloud Native Application Engineer - Frontend":
      case "LCNC Platform Engineer":
      case "Integration Engineer":
        fileName = `${level}_${cloudProvider}_App.txt`;
        break;
      case "Cloud Native Application Engineer - Full Stack":
        if (!frontendTech) {
           frontendTech = "None";
        }
        fileName = `${level}_${cloudProvider}_${frontendTech}_Full Stack.txt`;
        break;
      default:
        showToast("Role not found", "error");
        return;
    }

    const repoOwner = "mohansai001";
    const repoName = "JD";
    const folderPath = "JDS";
    const apiUrl = `https://api.github.com/repos/${repoOwner}/${repoName}/contents/${folderPath}/${fileName}`;

    try {
      const githubToken = await getGithubToken();
      if (!githubToken) return;

      const response = await fetch(apiUrl, {
        headers: { Authorization: `Bearer ${githubToken}` },
      });

      if (!response.ok) throw new Error(`Failed to fetch file from GitHub`);
      
      const fileData = await response.json();
      const content = atob(fileData.content);
      setJobDescription(content);
    } catch (error)      {
        console.error("Error fetching job description:", error);
        showToast("Error fetching job description", "error");
    }
  };

  const handleSelectRole = (role, level, cloud, frontend) => {
    if (!cloud) {
      setIsCloudProviderPopupOpen(true);
      return;
    }
    setSelectedRole(role);
    setSelectedLevel(level);
    setSelectedCloudProvider(cloud);
    setSelectedFrontendTech(frontend || '');
    
    fetchJobDescription(role, cloud, level, frontend);
    setIsResumePopupOpen(true);
  };
  const handleUploadResume = async (event) => {
    event.preventDefault();
    const form = event.target;
    const files = form.elements.resume.files;
    const hrEmail = form.elements['hr-email'].value;
    const rrfId = form.elements['RRF-ID'].value;
  
    if (!hrEmail || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(hrEmail)) {
      showToast("Please enter a valid TAG email.", "error");
      return;
    }
  
    if (!files || files.length === 0) {
      showToast("Please upload at least one resume.", "error");
      return;
    }
  
    setIsLoading(true);
    setIsResumePopupOpen(false);
  
    const uploadedFiles = [];
  
    try {
      for (let i = 0; i < files.length; i++) {
        let file = files[i];
        if (file.name.endsWith('.docx')) {
          file = await convertDocxToPdf(file);
        } else if (file.name.endsWith('.doc')) {
          file = await convertDocToPdf(file);
        }
  
        const timestamp = Date.now();
        const uniqueFileName = `${timestamp}_${file.name}`;
        const resumeUrl = await uploadToGitHub(uniqueFileName, file);
  
        if (resumeUrl) {
          uploadedFiles.push({ resumeUrl, fileName: file.name });
        }
      }
  
      // Pass data to ResumeAnalysis via sessionStorage
      sessionStorage.setItem("uploadedResumes", JSON.stringify({
        files: uploadedFiles,
        hrEmail,
        rrfId,
        jobDescription,
        selectedRole,
        selectedLevel,
        selectedCloudProvider,
        selectedFrontendTech,
        ecName: "App EC", // set EC name to App EC
      }));
      
  
      // Navigate to ResumeAnalysis
      navigate("/resume-analysis");
  
    } catch (error) {
      console.error("Error uploading resumes:", error);
      showToast(`Error: ${error.message}`, "error");
    } finally {
      setIsLoading(false);
    }
  };
  

  const uploadToGitHub = async (fileName, file) => {
    const githubToken = await getGithubToken();
    if (!githubToken) return null;

    const repoOwner = "mohansai001";
    const repoName = "resume";
    const folderPath = "resumes";
    const apiUrl = `https://api.github.com/repos/${repoOwner}/${repoName}/contents/${folderPath}/${fileName}`;

    const base64Content = await new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = (event) => resolve(event.target.result.split(",")[1]);
        reader.onerror = (error) => reject(error);
        reader.readAsDataURL(file);
    });

    try {
        // **FIX 2: Check if file exists to get its SHA for updates**
        let sha = null;
        const checkFileResponse = await fetch(apiUrl, {
            method: 'GET',
            headers: { 'Authorization': `Bearer ${githubToken}` }
        });

        if (checkFileResponse.ok) {
            const existingFileData = await checkFileResponse.json();
            sha = existingFileData.sha;
        } else if (checkFileResponse.status !== 404) {
            // If it's not a 404 (Not Found), then it's some other error
            throw new Error(`GitHub check file API error: ${checkFileResponse.status}`);
        }

        const response = await fetch(apiUrl, {
            method: 'PUT',
            headers: {
                'Authorization': `Bearer ${githubToken}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                message: `Upload resume: ${fileName}`,
                content: base64Content,
                sha: sha, // Include SHA if it exists (for updates)
            })
        });
        
        if (response.status === 422) {
             console.warn("GitHub API returned 422. This can happen if the file content is identical. Assuming success.");
             // To get the download URL even on a 422, we construct it.
             // This assumes the file *is* there.
             return `https://raw.githubusercontent.com/${repoOwner}/${repoName}/main/${folderPath}/${fileName}`;
        }

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || "Failed to upload to GitHub");
        }
        
        const data = await response.json();
        return data.content.download_url;

    } catch (error) {
        console.error("Error uploading to GitHub:", error);
        showToast(`GitHub Upload Error: ${error.message}`, 'error');
        return null;
    }
  };
  


  const handleBackToSelection = () => {
      setEvaluationResult(null);
  };
  
  // --- Dummy conversion functions ---
  const convertDocxToPdf = async (file) => {
    // This is a placeholder. In a real app, you'd use a library like jspdf and mammoth
    console.log("Converting DOCX to PDF (dummy)");
    return new File([await file.arrayBuffer()], file.name.replace(/\.docx$/, ".pdf"), { type: "application/pdf" });
  };
  const convertDocToPdf = async (file) => {
    console.log("Converting DOC to PDF (dummy)");
    return new File([await file.arrayBuffer()], file.name.replace(/\.doc$/, ".pdf"), { type: "application/pdf" });
  };

  // --- Render Logic ---

  if (isLoading) {
    return (
        <div id="loading-popup" style={{ display: 'flex' }}>
            <div style={{
                border: '6px solid rgba(255, 255, 255, 0.3)',
                borderTop: '6px solid #ffffff',
                borderRadius: '50%',
                width: '50px',
                height: '50px',
                animation: 'spin 1s linear infinite'
            }}></div>
            <span style={{ marginTop: '20px' }}>Please wait while resume is being evaluated!...</span>
        </div>
    );
  }

  if (evaluationResult) {
    // Render the evaluation result view
    return (
        <EvaluationResultView 
            result={evaluationResult} 
            onBack={handleBackToSelection}
            selectedRoleInfo={{ selectedRole, selectedLevel, selectedCloudProvider, selectedFrontendTech, ecName }}
            sendCandidateInfoToDB={sendCandidateInfoToDB}
        />
    );
  }

  return (
    <>
      <Toast {...toast} />
      {/* <Sidebar onNavigate={navigateTo} onLogout={handleLogout} /> */}

      <SidebarDrawer menuItems={sidebarItems} onLogout={handleLogout}/>

      {/* <div className="backbutton" onClick={() => navigateTo('ECselection.html')}>
        <i className="fas fa-arrow-left"></i>
      </div> */}
      <ProgressSteps />

      <div id="interviews" className="active">
        <div className="role-selection-container">
          <div className="role-selection-header">
            <h1 style={{ color: 'black' }}>Select Your Role for the Interview</h1>
          </div>

          <div className="role-cards">
            {/* --- Role Card 1: Backend --- */}
            <RoleCard
              title="Cloud Native Application Engineer - Backend"
              description="Responsible for overseeing the code releases..."
              onSelect={handleSelectRole}
              options={{
                cloud: { name: 'cloudProvider', values: ['.Net', 'Java', 'Nodejs', 'Python'] },
                level: { name: 'levelDropdown1', values: ['Junior', 'Senior', 'Lead'] }
              }}
            />
            {/* --- Role Card 2: Frontend --- */}
            <RoleCard
              title="Cloud Native Application Engineer - Frontend"
              description="Innovates and builds the underlying systems..."
              onSelect={handleSelectRole}
              options={{
                cloud: { name: 'cloudProvider', values: ['Angular', 'React'] },
                level: { name: 'levelDropdown2', values: ['Junior', 'Senior', 'Lead'] }
              }}
            />
            {/* --- Role Card 3: Full Stack --- */}
            <RoleCard
              title="Cloud Native Application Engineer - Full Stack"
              description="Designs and develops both front-end and back-end components..."
              onSelect={handleSelectRole}
              isFullStack={true}
              options={{
                backend: { name: 'cloudProvider', values: ['Java', '.NET'] },
                frontend: { name: 'frontendTechnology', values: ['Angular', 'React'] },
                level: { name: 'levelDropdown6', values: ['Junior', 'Senior', 'Lead'] }
              }}
            />
             {/* ... Other Role Cards would follow the same pattern ... */}
          </div>
        </div>
      </div>

      {/* --- Popups/Modals --- */}
      {isResumePopupOpen && (
        <ResumePopup
          onClose={() => setIsResumePopupOpen(false)}
          onSubmit={handleUploadResume}
          ecName={ecName}
        />
      )}
      {isCloudProviderPopupOpen && (
          <div className="popupc" style={{ display: 'block' }}>
              <div className="popup-contentc">
                  <span className="close-btn" onClick={() => setIsCloudProviderPopupOpen(false)}>&times;</span>
                  <p>Please select a cloud provider before proceeding.</p>
              </div>
          </div>
      )}
      {isDuplicateModalOpen && (
          <div id="emailModal" className="modal">
              <div className="modal-content">
                  <h3>Duplicate Candidates Detected</h3>
                  <p>The following candidates have already been evaluated:</p>
                  <ul id="duplicateEmailList">
                      {Array.from(duplicateCandidates).map(c => <li key={c}>{c}</li>)}
                  </ul>
                  <button onClick={() => { /* fetchExistingCandidates logic */ }}>Fetch Existing Info</button>
                  <button onClick={() => setIsDuplicateModalOpen(false)}>Close</button>
              </div>
          </div>
      )}
    </>
  );
}

// --- Child Components for better organization ---

const RoleCard = ({ title, description, onSelect, options, isFullStack = false }) => {
    const [formState, setFormState] = useState({});

    const handleChange = (e) => {
        setFormState({ ...formState, [e.target.name]: e.target.value });
    };

    const handleSelectClick = () => {
        onSelect(title, formState.level, formState.cloudProvider, formState.frontendTechnology);
    };

    return (
        <div className="role-card">
            <h2 style={{ color: 'black' }}>{title}</h2>
            <p style={{ color: 'black' }}>{description}</p>
            
            {isFullStack ? (
                <>
                    <div style={{ display: 'flex', flexDirection: 'row', gap: '30px' }}>
                        <div>
                            <h4 style={{ color: 'black' }}>Backend Technologies:</h4>
                            {options.backend.values.map(val => (
                                <label key={val}><input type="radio" name="cloudProvider" value={val} onChange={handleChange} /> {val}</label>
                            ))}
                        </div>
                        <div>
                            <h4 style={{ color: 'black' }}>Frontend Technologies:</h4>
                            {options.frontend.values.map(val => (
                                <label key={val}><input type="radio" name="frontendTechnology" value={val} onChange={handleChange} /> {val}</label>
                            ))}
                        </div>
                    </div>
                    <div>
                        <h4 style={{ color: 'black' }}>Select Level:</h4>
                        <select name="level" onChange={handleChange} style={{ padding: '5px', background: '#E6E6FA', color: 'black' }}>
                            <option value="">select</option>
                            {options.level.values.map(val => <option key={val} value={val}>{val}</option>)}
                        </select>
                    </div>
                </>
            ) : (
                <>
                    <h3 style={{ color: 'black' }}>Select Cloud Provider and Level:</h3>
                    <div style={{ alignItems: 'center', gap: '15px' }}>
                        <span className="radio-group">
                            {options.cloud.values.map(val => (
                                <label key={val}><input type="radio" name="cloudProvider" value={val} onChange={handleChange} /> {val}</label>
                            ))}
                        </span>
                        
                        <select name="level" onChange={handleChange} style={{width:'30%',marginTop: '15px', padding: '5px', background: '#E6E6FA', color: 'black' }}>
                            <option value="">select</option>
                            {options.level.values.map(val => <option key={val} value={val}>{val}</option>)}
                        </select>
                    </div>
                </>
            )}
            
            <button onClick={handleSelectClick} style={{ marginTop: '10px', backgroundColor: '#DAF7A6', color: 'black' }}>Select</button>
        </div>
    );
};

const ResumePopup = ({ onClose, onSubmit, ecName }) => {
    return (
        <div id="resume-popup" className="popup" style={{ display: 'flex' }}>
            <form className="popup-content" onSubmit={onSubmit}>
                <h2 style={{ color: 'black' }}>Prescreening</h2>
                <label htmlFor="hr-email" style={{ color: 'black' }}>TAG Email:</label>
                <input type="email" id="hr-email" name="hr-email" placeholder="Enter TAG Email" required />
                
                <label htmlFor="RRF-ID" style={{ color: 'black' }}>RRF ID:</label>
                <input type="text" id="RRF-ID" name="RRF-ID" placeholder="Enter RRF ID" required />

                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <label htmlFor="ec-name" style={{ color: 'black', marginRight: '10px' }}>EC Name:</label>
                    <input type="text" id="ec-name" value="App EC" readOnly />
                </div>
                
                <input type="file" id="resume" name="resume" accept=".pdf,.doc,.docx" multiple required />
                
                {/* <div className="progress-container"><div className="progress-bar"></div></div> */}
                <br />
                
                <button type="submit" style={{ height: '38px', backgroundColor: 'rgb(12 101 133)'}}>Upload</button>
                <button type="button" onClick={onClose} style={{ backgroundColor: 'rgb(12 101 133)' }}>Cancel</button>
            </form>
        </div>
    );
};

const EvaluationResultView = ({ result, onBack, selectedRoleInfo, sendCandidateInfoToDB }) => {
    const { content, resumeUrl, hrEmail, rrfId } = result;
    const { selectedRole, selectedLevel, selectedCloudProvider, ecName } = selectedRoleInfo;

    // Parse content to extract details
    const getDetail = (keyword) => {
        const match = content.match(new RegExp(`${keyword}:\\s*(.*)`));
        return match ? match[1].replace(/\*/g, '').trim() : '';
    };

    const candidateName = getDetail("Full Name");
    const candidateEmail = getDetail("Email");
    const candidatePhone = getDetail("Phone Number");
    const resultSectionText = content.substring(content.indexOf("Result:"));
    
    let statusText = "Processing...";
    if (resultSectionText.includes("Shortlisted")) statusText = "Shortlisted";
    else if (resultSectionText.includes("Rejected")) statusText = "Rejected";
    
    const suitabilityMatch = resultSectionText.match(/Suitability Percentage:\s*(\d+)%/);
    const suitabilityPercentage = suitabilityMatch ? suitabilityMatch[1] : "";

    useEffect(() => {
        const recruitmentPhase = statusText.toLowerCase() === "rejected" ? "prescreening" : "Move to L1";
        const role = `${selectedLevel} ${selectedCloudProvider} ${selectedRole}`;

        const candidateDetails = {
            resume: resumeUrl,
            candidate_name: candidateName,
            candidate_email: candidateEmail,
            prescreening_status: statusText,
            candidate_phone: candidatePhone,
            role: role,
            recruitment_phase: recruitmentPhase,
            resume_score: `${suitabilityPercentage}% Matching With JD`,
            hr_email: hrEmail,
            rrf_id: rrfId,
            eng_center: ecName,
            content: content,
        };
        sendCandidateInfoToDB(candidateDetails);
        // Here you would also call other functions like sendPrescreeningInfoToDB, sendRRFToDB etc.
        // and use the hrEmail, rrfId, resumeUrl variables.
    }, [result, sendCandidateInfoToDB, candidateName, candidateEmail, candidatePhone, content, ecName, hrEmail, resumeUrl, rrfId, selectedCloudProvider, selectedLevel, selectedRole, statusText, suitabilityPercentage]); // Effect runs when result changes


    const downloadContentAsFile = (textContent, candidateName, statusText) => {
        const doc = new jspdf.jsPDF();
        // This is a simplified version for demonstration
        doc.text(textContent, 10, 10);
        const fileName = `${candidateName.trim()}_${selectedLevel}_${selectedCloudProvider}_${selectedRole.trim()}.pdf`;
        doc.save(fileName);
    };

    const sections = [
        { title: "Candidate Overview", keyword: "Candidate Overview" },
        { title: "Contact Information", keyword: "Contact Information" },
        { title: "Education", keyword: "Education" },
        { title: "Work Experience", keyword: "Work Experience" },
        { title: "Skills", keyword: "Skills" },
        { title: "Candidate Stability", keyword: "Candidate Stability" },
        { title: "Skill Gaps", keyword: "Skill Gaps" },
        { title: "Result", keyword: "Result" },
    ];

    const parsedSections = sections.map((section, index) => {
        const startIndex = content.indexOf(section.keyword);
        if (startIndex === -1) return null;
        
        const nextIndex = index < sections.length - 1 ? content.indexOf(sections[index + 1].keyword, startIndex) : content.length;
        const sectionContent = content.substring(startIndex, nextIndex)
            .replace(section.keyword, '')
            .replace(/[#*:]/g, '')
            .trim();

        return { title: section.title, content: sectionContent };
    }).filter(Boolean);
    
    return (
        <div id="evaluation-result-container" className="cards-container" style={{ marginTop: '55px' }}>
            {parsedSections.map(({ title, content }) => (
                <div key={title} className="card">
                    <h2>
                        {title}
                        {title === 'Result' && (
                             <span style={{ color: statusText === 'Shortlisted' ? 'green' : 'red' }}>
                                 - {statusText} ({suitabilityPercentage}% Matching)
                             </span>
                        )}
                    </h2>
                    <p style={{ whiteSpace: 'pre-wrap' }}>{content}</p>
                </div>
            ))}
            <div className="feedback-container">
                 <button className="download-btn" onClick={() => downloadContentAsFile(content, candidateName, statusText)}>
                    <i className="fas fa-download"></i> Download Feedback
                </button>
                {statusText === 'Shortlisted' && (
                    <button className="next-btn" onClick={() => window.location.href='prescreeningform.html'}>
                        Next
                    </button>
                )}
                <div className="back-button-wrapper">
                    <button className="back-btnss" onClick={onBack}>Back</button>
                </div>
            </div>
        </div>
    );
};


export default AppRecruit;
