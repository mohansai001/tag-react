import React, { useState, useEffect } from 'react';
import { PublicClientApplication } from '@azure/msal-browser';
import './ResumeAnalysis.css';
 
// --- Helper Functions ---
const extractFilename = (url) => {
  if (!url) return null;
  const parts = url.split("/");
  return parts[parts.length - 1];
};
 
const getStatusClass = (status) => {
  if (!status) return "";
  switch (status.toLowerCase()) {
    case "shortlisted":
      return "status-completed";
    case "rejected":
      return "status-failed";
    case "pending":
    case "processing...":
      return "status-processing";
    default:
      return "";
  }
};
 
const formatSectionContent = (content) => {
  let htmlContent = content
    .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>")
    .replace(/\*(.*?)\*/g, "<em>$1</em>")
    .replace(/^• (.*$)/gm, "<li>$1</li>")
    .replace(/^- (.*$)/gm, "<li>$1</li>")
    .replace(/^\* (.*$)/gm, "<li>$1</li>");
 
  if (htmlContent.includes("<li>")) {
    htmlContent = "<ul>" + htmlContent.replace(/<\/li>\s*<li>/g, "</li><li>") + "</ul>";
  }
 
  return htmlContent.replace(/\n/g, "<br>");
};
 
const parseEvaluationContent = (content) => {
  const sectionTitles = [
    "Candidate Overview", "Contact Information", "Education",
    "Work Experience", "Skills", "Achievements",
    "Candidate Stability", "Skill Gaps", "Result",
  ];
  const sections = [];
  let currentSection = { title: "Evaluation", content: "" };
 
  content.split("\n").forEach((line) => {
    const trimmedLine = line.trim();
    const matchedTitle = sectionTitles.find(
      (title) => trimmedLine.startsWith(title) || trimmedLine.includes(title)
    );
 
    if (matchedTitle) {
      if (currentSection.content) sections.push(currentSection);
      currentSection = { title: matchedTitle, content: "" };
    } else {
      currentSection.content += line + "\n";
    }
  });
 
  if (currentSection.content) sections.push(currentSection);
  return sections;
};
 
// --- Child Components ---
const EvaluationView = ({ evaluationData, onBack }) => {
  if (!evaluationData) return null;
 
  const {
    content, resume_url, rrf_id, hr_email, eng_center,
    role, level, cloud_provider, prescreening_status
  } = evaluationData;
 
  const isShortlisted = prescreening_status === "Shortlisted";
  const sections = parseEvaluationContent(content || "");
 
  const handleDownload = () => {
    console.log("Downloading report...");
    // Add your report download logic here
  };
 
  return (
    <div className="evaluation-container">
      <div className="evaluation-header">
        <h2 className="evaluation-title">Candidate Analysis Report</h2>
        <span className={`status-badge ${isShortlisted ? "status-shortlisted" : "status-rejected"}`}>
          {prescreening_status || 'N/A'}
        </span>
      </div>
 
      <div className="evaluation-section">
        <div className="section-header">Basic Information</div>
        <div className="section-content">
          <p><strong>Resume:</strong> {extractFilename(resume_url)}</p>
          <p><strong>RRF ID:</strong> {rrf_id || "N/A"}</p>
          <p><strong>HR Email:</strong> {hr_email || "N/A"}</p>
          <p><strong>Engineering Center:</strong> {eng_center || "N/A"}</p>
          <p><strong>Role:</strong> {role || "N/A"}</p>
          <p><strong>Level:</strong> {level || "N/A"}</p>
          <p><strong>Cloud Provider:</strong> {cloud_provider || "N/A"}</p>
        </div>
      </div>
 
      <div id="evaluation-sections">
        {sections.map(section => (
          section.content.trim() && (
            <div key={section.title} className="evaluation-section">
              <div className="section-header">{section.title}</div>
              <div className="section-content" dangerouslySetInnerHTML={{ __html: formatSectionContent(section.content) }} />
            </div>
          )
        ))}
      </div>
 
      <div className="action-buttons">
        <button className="download-btn" onClick={handleDownload}>Download Full Report</button>
        {isShortlisted && (
          <button
            className="next-btn"
            onClick={() => {
              sessionStorage.setItem("currentCandidate", JSON.stringify(evaluationData));
              console.log(evaluationData);
              window.location.href = '/prescreening-form';
            }}
          >
            Proceed to Next Step
          </button>
        )}
      </div>
 
      <button className="back-to-results-btn" onClick={onBack}>
        Back to Candidates List
      </button>
    </div>
  );
};
 
const CandidateTable = ({ candidates, onSelectCandidate }) => (
  <table id="upload-table" className="styled-table">
    <thead>
      <tr>
        <th>Candidate Name</th>
        <th>Resume Name</th>
        <th>RRF ID</th>
        <th>Analysis Status</th>
        <th>Action</th>
      </tr>
    </thead>
    <tbody>
      {candidates.length > 0 ? (
        candidates.map(candidate => (
          <tr key={candidate.id || candidate.fileName}>
            <td>{candidate.candidate_name || "Processing..."}</td>
            <td>{candidate.fileName || extractFilename(candidate.resume)}</td>
            <td>{candidate.rrf_id || "N/A"}</td>
            <td className={`status-cell ${getStatusClass(candidate.prescreening_status || candidate.status)}`}>
              {candidate.prescreening_status || candidate.status || "Pending"}
            </td>
            <td>
              <button
                className="view-btn"
                onClick={() => onSelectCandidate(candidate.id)}
                disabled={!candidate.id || candidate.prescreening_status === "Pending" || candidate.status === "Processing..."}
              >
                View Analysis
              </button>
            </td>
          </tr>
        ))
      ) : (
        <tr>
          <td colSpan="5" className="loading">
            <div className="spinner"></div>
            <p>Loading candidate data...</p>
          </td>
        </tr>
      )}
    </tbody>
  </table>
);
 
// --- Main Component ---
function ResumeAnalysis() {
  const [duplicateInfoList, setDuplicateInfoList] = useState([]);
  const [showDuplicateModal, setShowDuplicateModal] = useState(false);
  const [candidates, setCandidates] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedEvaluation, setSelectedEvaluation] = useState(null);
  const [toast, setToast] = useState({ show: false, message: '', type: '' });
  const [msalInstance, setMsalInstance] = useState(null);
  const [msalInitialized, setMsalInitialized] = useState(false);
 
  const msalConfig = {
    auth: {
      clientId: "ed0b1bf7-b012-4e13-a526-b696932c0673",
      authority: "https://login.microsoftonline.com/13085c86-4bcb-460a-a6f0-b373421c6323",
      redirectUri: "http://localhost:3000",
    }
  };
 
  useEffect(() => {
    // Initialize MSAL when component mounts
    const initializeMsal = async () => {
      const instance = new PublicClientApplication(msalConfig);
      try {
        await instance.initialize();
        setMsalInstance(instance);
        setMsalInitialized(true);
      } catch (error) {
        console.error("MSAL initialization failed:", error);
        showToast("Authentication service failed to initialize. Please refresh the page.", "error");
      }
    };
 
    initializeMsal();
  }, []);
 
  const showToast = (message, type = "success") => {
    setToast({ show: true, message, type });
    setTimeout(() => {
      setToast({ show: false, message: '', type: '' });
    }, 3000);
  };
 
  const sendEmailViaGraph = async (candidateDetails, accessToken) => {
    const emailContent = {
      message: {
        subject: `Candidate Analysis Report - ${candidateDetails.candidate_name}`,
        body: {
          contentType: "HTML",
          content: `
            <h2>Candidate Analysis Report</h2>
            <p><strong>Candidate Name:</strong> ${candidateDetails.candidate_name}</p>
            <p><strong>Status:</strong> ${candidateDetails.prescreening_status}</p>
            <p><strong>Resume Score:</strong> ${candidateDetails.resume_score}</p>
            <p><strong>RRF ID:</strong> ${candidateDetails.rrf_id || "N/A"}</p>
            <p><strong>Role:</strong> ${candidateDetails.role || "N/A"}</p>
            <p><strong>Engineering Center:</strong> ${candidateDetails.eng_center || "N/A"}</p>
            <p>Please log in to the system to view the full analysis report.</p>
          `
        },
        toRecipients: [{
          emailAddress: {
            address: candidateDetails.hr_email
          }
        }]
      }
    };
 
    try {
      const response = await fetch("https://graph.microsoft.com/v1.0/me/sendMail", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${accessToken}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify(emailContent)
      });
 
      if (!response.ok) {
        throw new Error("Failed to send email");
      }
      return true;
    } catch (error) {
      console.error("Error sending email:", error);
      return false;
    }
  };
 
  useEffect(() => {
    const controller = new AbortController();
    const signal = controller.signal;
 
    const processData = async () => {
      const sessionData = JSON.parse(sessionStorage.getItem("uploadedResumes") || "{}");
      const {
        files = [],
        hrEmail,
        rrfId,
        jobDescription,
        selectedRole,
        selectedLevel,
        selectedCloudProvider,
        ecName
      } = sessionData;
 
      try {
        const initialRes = await fetch("https://demotag.vercel.app/api/get/candidate-info", { signal });
        const initialData = await initialRes.json();
        let existingCandidates = initialData.data || [];
 
        if (!files.length || !jobDescription) {
          setCandidates(existingCandidates);
          setIsLoading(false);
          return;
        }
 
        const processingRows = files.map(file => ({
          id: file.fileName,
          candidate_name: "Processing...",
          resume: file.resumeUrl,
          fileName: file.fileName,
          rrf_id: rrfId,
          prescreening_status: "Processing...",
          status: "Processing..."
        }));
 
        setCandidates([...processingRows, ...existingCandidates]);
        setIsLoading(false);
 
        const duplicates = [];
        const processedCandidates = [];
 
        for (const file of files) {
          try {
            const resumeText = await extractTextFromFile(file.resumeUrl, signal);
            const content = await evaluateViaGemini(resumeText, jobDescription, signal);
 
            const candidateName = extractField(content, "Full Name");
            const candidateEmail = extractField(content, "Email").replace(/\(Note:.*\)/i, '').trim();
            const candidatePhone = extractField(content, "Phone Number");
            const statusText = content.includes("Shortlisted") ? "Shortlisted" : "Rejected";
            const matchPercent = extractField(content, "Suitability Percentage");
 
            const candidateDetails = {
              resume: file.resumeUrl,
              candidate_name: candidateName,
              candidate_email: candidateEmail.split(/[ ,(]/)[0].trim(),
              prescreening_status: statusText,
              candidate_phone: candidatePhone,
              role: `${selectedLevel} ${selectedCloudProvider} ${selectedRole}`,
              recruitment_phase: statusText === "Shortlisted" ? "Move to L1" : "Prescreening",
              resume_score: `${matchPercent || 0} Matching With JD`,
              hr_email: hrEmail,
              rrf_id: rrfId,
              eng_center: ecName,
              content,
            };
 
            const saveRes = await fetch("https://demotag.vercel.app/api/add-candidate-info", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify(candidateDetails),
              signal,
            });
 
            const saved = await saveRes.json();
 
            if (saved.code === "23505") {
              duplicates.push({ name: candidateName, email: candidateEmail });
              processedCandidates.push({ fileName: file.fileName, status: 'Duplicate' });
              continue;
            }
           
            const newId = saved?.data?.id || null;
            const finalCandidate = {
              ...candidateDetails,
              id: newId,
              status: statusText,
              fileName: file.fileName
            };
            processedCandidates.push(finalCandidate);
 
            // Send email notification if MSAL is initialized
            if (msalInstance && msalInitialized) {
              try {
                const tokenRequest = {
                  scopes: ["Mail.Send"],
                  account: msalInstance.getAllAccounts()[0],
                };
 
                let tokenResponse;
                try {
                  tokenResponse = await msalInstance.acquireTokenSilent(tokenRequest);
                } catch (silentError) {
                  console.warn("Silent token acquisition failed; trying popup.", silentError);
                  tokenResponse = await msalInstance.acquireTokenPopup(tokenRequest);
                }
 
                const emailSent = await sendEmailViaGraph(candidateDetails, tokenResponse.accessToken);
                if (!emailSent) {
                  console.warn('Email sending failed for candidate:', candidateDetails.candidate_name);
                }
              } catch (authError) {
                console.error('Authentication failed:', authError);
              }
            }
 
          } catch (err) {
            if (err.name === 'AbortError') {
                console.log('Fetch aborted');
                return;
            }
            console.error("Resume processing failed for a file:", err);
            processedCandidates.push({ fileName: file.fileName, status: 'Failed' });
          }
        }
       
        setCandidates(prev => {
            const oldList = prev.filter(p => !files.some(f => f.fileName === p.fileName));
            const updatedList = processedCandidates
              .map(proc => {
                  if (proc.status === 'Duplicate' || proc.status === 'Failed') {
                      const originalRow = prev.find(p => p.fileName === proc.fileName);
                      if(originalRow) {
                          return {...originalRow, prescreening_status: proc.status, candidate_name: proc.status};
                      }
                      return null;
                  }
                  return proc;
              })
              .filter(Boolean);
            return [...updatedList, ...oldList];
        });
 
        if (duplicates.length > 0) {
          setDuplicateInfoList(duplicates);
          setShowDuplicateModal(true);
        }
 
        sessionStorage.removeItem("uploadedResumes");
 
      } catch (err) {
        if (err.name !== 'AbortError') {
          setError("Failed to process data. " + err.message);
          setIsLoading(false);
        }
      }
    };
 
    processData();
 
    return () => {
      controller.abort();
    };
  }, [msalInstance, msalInitialized]);
 
  const handleSelectCandidate = async (candidateId) => {
    if (!candidateId) return;
    setIsLoading(true);
    try {
      const response = await fetch(`https://demotag.vercel.app/api/get/candidate-evaluation/${candidateId}`);
      const result = await response.json();
      if(result.success) {
        setSelectedEvaluation(result.data);
      } else {
        throw new Error(result.message || 'Failed to fetch evaluation.');
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };
 
  const handleBackToTable = () => {
    setSelectedEvaluation(null);
    setError(null);
  };
 
  if (isLoading && candidates.length === 0) {
    return (
      <div className="loading">
        <div className="spinner"></div>
        <p>Loading...</p>
      </div>
    );
  }
 
  if (error) {
    return (
      <div className="error-message">
        <h3>Error</h3>
        <p>{error}</p>
        <button onClick={() => window.location.reload()}>Retry</button>
      </div>
    );
  }
 
  return (
    <div>
      {toast.show && (
        <div className={`toast ${toast.type}`}>
          {toast.message}
        </div>
      )}
     
      <h1>Upload Results</h1>
      {selectedEvaluation ? (
        <EvaluationView evaluationData={selectedEvaluation} onBack={handleBackToTable} />
      ) : (
        <div id="results-table-container">
          <CandidateTable candidates={candidates} onSelectCandidate={handleSelectCandidate} />
          <button className="back-btn" onClick={() => window.location.href = 'apprecruit.html'}>
            Back to Upload
          </button>
        </div>
      )}
 
      {showDuplicateModal && duplicateInfoList.length > 0 && (
        <div className="popup">
          <div className="popup-content">
            <h3>Duplicate Candidates Detected</h3>
            <ul>
              {duplicateInfoList.map((info, idx) => (
                <li key={idx}>
                  <strong>Name:</strong> {info.name} <br />
                  <strong>Email:</strong> {info.email}
                </li>
              ))}
            </ul>
            <button onClick={() => {
              const cleanEmails = duplicateInfoList.map(info =>
                info.email.split(/[ ,(]/)[0].trim()
              );
              sessionStorage.setItem("duplicateEmails", JSON.stringify(cleanEmails));
              setShowDuplicateModal(false);
              window.location.href = "/view-duplicates";
            }}>
              View Records
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
 
const extractField = (content, label) => {
  if(!content) return "";
  const match = content.match(new RegExp(`${label}:\\s*(.*)`));
  return match ? match[1].trim().replace(/\*/g, '') : "";
};
 
const extractTextFromFile = async (url, signal) => {
  if (url.endsWith(".pdf")) {
    const pdf = await window.pdfjsLib.getDocument({ url, signal }).promise;
    let text = '';
    for (let i = 1; i <= pdf.numPages; i++) {
      const page = await pdf.getPage(i);
      const content = await page.getTextContent();
      text += content.items.map(item => item.str).join(' ') + '\n';
    }
    return text;
  } else if (url.endsWith(".docx")) {
    const response = await fetch(url, { signal });
    const arrayBuffer = await response.arrayBuffer();
    const result = await window.mammoth.extractRawText({ arrayBuffer });
    return result.value;
  }
  return "";
};
 
const evaluateViaGemini = async (resumeText, jobDescription, signal) => {
  const API_KEY = "AIzaSyD1NqvfelSR6l-8FEIIFiZM3aJmbo2mw-Q";
  const API_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${API_KEY}`;
 
  const response = await fetch(API_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      contents: [{
        parts: [{
            text: `
            You are an expert HR assistant tasked with pre-screening resumes. Given a resume, analyze it thoroughly and provide a structured evaluation based on the following criteria:
           
            **Job Role Retrieval:**
            ${jobDescription}
           
            **Candidate Resume Content:**
            ${resumeText}
           
            **Candidate Overview:**
            - Extract the candidate's full name.
            - Identify the total years of professional experience.
            - Determine the current or most recent job designation.
           
            **Contact Information:**
            - Verify if essential details (email, phone number, location) are present.
           
            **Education:**
            - Identify the highest level of education and the field of study.
            - Note any relevant certifications or specialized training.
           
            **Work Experience:**
            - Summarize the candidate's work history, focusing on the most recent or relevant positions.
            - Highlight any roles or responsibilities that align with the job opening.
           
            **Skills:**
            - List key technical and soft skills mentioned.
            - Identify any skills that are particularly relevant to the position.
           
            **Achievements:**
            - Note any significant accomplishments or awards.
            - Highlight quantifiable achievements.
           
            **Candidate Stability:**
            - Note any red flags (e.g., gaps, frequent job changes).
           
            **Skill Gaps**
            - Compare resume with JD and identify missing skills.
           
            **Result:**
            Shortlisted or Rejected, and Suitability Percentage.
                      `
        }]
      }]
    }),
    signal,
  });
 
  if (!response.ok) {
      const errorBody = await response.json();
      throw new Error(`Gemini API error: ${errorBody.error?.message || response.statusText}`);
  }
 
  const result = await response.json();
  return result?.candidates?.[0]?.content?.parts?.[0]?.text || "No evaluation returned.";
};
 
export default ResumeAnalysis;
