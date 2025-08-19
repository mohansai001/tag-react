import React, { useState, useEffect } from 'react';
import './app_l2_technical.css';
import { PublicClientApplication } from '@azure/msal-browser';
import html2pdf from 'html2pdf.js';

const AppL2Technical = () => {
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState({ show: false, message: '', type: '' });
  const [formData, setFormData] = useState({
    candidateEmail: '',
    candidateName: '',
    position: '',
    rrfId: '',
    interviewDate: '',
    interviewerName: '',
    hrEmail: '',
    imochaScore: '',
    detailedFeedback: '',
    result: '',
    responses: []
  });
  const [questions, setQuestions] = useState([]);
  const [msalInstance, setMsalInstance] = useState(null);
  const [msalInitialized, setMsalInitialized] = useState(false);

  const msalConfig = {
    auth: {
      clientId: "ed0b1bf7-b012-4e13-a526-b696932c0673",
      authority: "https://login.microsoftonline.com/13085c86-4bcb-460a-a6f0-b373421c6323",
      redirectUri: "http://localhost:3000"
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

    const urlParams = new URLSearchParams(window.location.search);
    const candidateEmail = urlParams.get('candidateEmail');
    const position = urlParams.get('position');

    if (!candidateEmail) {
      showToast("Candidate email is missing in the URL.", "error");
      return;
    }

    loadCandidateData(candidateEmail, position);
  }, []);

  const showToast = (message, type = "success") => {
    setToast({ show: true, message, type });
    setTimeout(() => {
      setToast({ show: false, message: '', type: '' });
    }, 3000);
  };

  const loadCandidateData = async (candidateEmail, position) => {
    try {
      const candidateResponse = await fetch(
        `http://localhost:3001/api/getCandidateData?candidateEmail=${encodeURIComponent(candidateEmail)}`
      );
      if (!candidateResponse.ok) throw new Error("Failed to fetch candidate data.");

      const candidateData = await candidateResponse.json();
      if (candidateData.error) {
        showToast(candidateData.error, "error");
        return;
      }

      const candidateId = candidateData.id;
      if (!candidateId) throw new Error("Candidate ID not found in response");

      setFormData({
        candidateEmail,
        candidateName: candidateData.candidate_name || "N/A",
        position: candidateData.role || "N/A",
        rrfId: candidateData.rrf_id || "N/A",
        interviewDate: candidateData.l_2_interviewdate || "N/A",
        interviewerName: candidateData.panel_name || "N/A",
        hrEmail: candidateData.hr_email || "N/A",
        imochaScore: candidateData.l_1_score || "N/A",
        detailedFeedback: '',
        result: '',
        responses: []
      });

      loadQuestions(position, candidateId);
    } catch (error) {
      console.error("Error loading data:", error);
      showToast(`Failed to load data: ${error.message}`, "error");
    }
  };

  const loadQuestions = async (position, candidateId) => {
    const positionToApiMap = {
      "Junior .Net Cloud Native Application Engineer - Backend": "http://localhost:3001/api/dotnet_feedback-questions",
      "Senior .Net Cloud Native Application Engineer - Backend": "http://localhost:3001/api/dotnet_feedback-questions",
      "Junior Java Cloud Native Application Engineer - Backend": "http://localhost:3001/api/java_feedback-questions",
      "Senior Java Cloud Native Application Engineer - Backend": "http://localhost:3001/api/java_feedback-questions",
      "Junior Angular Cloud Native Application Engineer - Frontend": "http://localhost:3001/api/angular_feedback-questions",
      "Senior Angular Cloud Native Application Engineer - Frontend": "http://localhost:3001/api/angular_feedback-questions",
      "Junior React Cloud Native Application Engineer - Frontend": "http://localhost:3001/api/react_feedback-questions",
      "Senior React Cloud Native Application Engineer - Frontend": "http://localhost:3001/api/react_feedback-questions",
      "Junior Java Angular Cloud Native Application Engineer - Full Stack": "http://localhost:3001/api/java_angular_fullstack_feedback-questions",
      "Senior Java Angular Cloud Native Application Engineer - Full Stack": "http://localhost:3001/api/java_angular_fullstack_feedback-questions",
      "Junior Java React Cloud Native Application Engineer - Full Stack": "http://localhost:3001/api/java_react_fullstack_feedback-questions",
      "Senior Java React Cloud Native Application Engineer - Full Stack": "http://localhost:3001/api/java_react_fullstack_feedback-questions",
      "Junior .Net Angular Cloud Native Application Engineer - Full Stack": "http://localhost:3001/api/dotnet_angular_fullstack_feedback-questions",
      "Senior .Net Angular Cloud Native Application Engineer - Full Stack": "http://localhost:3001/api/dotnet_angular_fullstack_feedback-questions",
      "Junior .Net React Cloud Native Application Engineer - Full Stack": "http://localhost:3001/api/dotnet_react_fullstack_feedback-questions",
      "Senior .Net React Cloud Native Application Engineer - Full Stack": "http://localhost:3001/api/dotnet_react_fullstack_feedback-questions"
    };

    const questionsApi = positionToApiMap[position] || "http://localhost:3001/api/app_generic_feedback-questions";

    try {
      const questionsResponse = await fetch(questionsApi);
      if (!questionsResponse.ok) throw new Error("Failed to fetch feedback questions.");

      const questionsData = await questionsResponse.json();
      setQuestions(questionsData);

      fetchExistingFeedback(candidateId, position, questionsData);
    } catch (error) {
      console.error("Error loading questions:", error);
      showToast("Failed to load questions.", "error");
    }
  };

  const fetchExistingFeedback = async (candidateId, position) => {
    try {
      const response = await fetch(
        // displays existing feedback for the candidate if available
        `http://localhost:3001/api/get-feedback/${candidateId}/${position}`
      );
      if (!response.ok) throw new Error("Failed to fetch existing feedback.");

      const feedbackData = await response.json();
      if (feedbackData.message === "No feedback found for this candidate") return;

      setFormData(prev => ({
        ...prev,
        detailedFeedback: feedbackData.overall_feedback || "",
        result: feedbackData.result || "",
        responses: feedbackData.responses || []
      }));
    } catch (error) {
      console.error("Error loading existing feedback:", error);
    }
  };

  const handleResponseChange = (questionId, field, value) => {
    setFormData(prev => {
      const existingResponseIndex = prev.responses.findIndex(r => r.questionId === questionId);
      const updatedResponses = [...prev.responses];
      
      if (existingResponseIndex >= 0) {
        updatedResponses[existingResponseIndex] = {
          ...updatedResponses[existingResponseIndex],
          [field]: value
        };
      } else {
        updatedResponses.push({
          questionId,
          [field]: value
        });
      }

      return {
        ...prev,
        responses: updatedResponses
      };
    });
  };

  const generateFeedback = async () => {
    const geminiApiKey = "AIzaSyD1NqvfelSR6l-8FEIIFiZM3aJmbo2mw-Q";
    setLoading(true);

    try {
      const mandatoryResponses = questions
        .filter(q => q.is_top_skill)
        .map(q => {
          const response = formData.responses.find(r => r.questionId === q.id) || {};
          return {
            skillCategory: q.skill_category,
            skillDescription: q.skill_description,
            mandatorySkill: q.is_top_skill,
            deployment: response.deploymentRating || "",
            justification: response.justification || "",
            improvements: response.improvements || ""
          };
        });

      const payload = {
        contents: [
          {
            parts: [
              {
                text: `Based on the candidate's performance across the provided skill categories, generate a concise and professional summary (approximately 120 words) that highlights:

- Key strengths and demonstrated skills
- Notable weaknesses or gaps
- Suggestions for improvement and growth

Please analyze the following data:

${mandatoryResponses.map(r => `
Skill Category: ${r.skillCategory}
- Deployment: ${r.deployment}
`).join("\n")}

After the summary, provide:

1. A clear recommendation in a new line as:
**Recommendation:** Selected / Rejected

2. A one-line analysis for each skill category, summarizing the candidate's strengths and weaknesses.

3. A short list of recommended training areas tailored to the candidate's improvement needs (maximum 3 suggestions).`
              }
            ]
          }
        ]
      };

      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${geminiApiKey}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(payload),
        }
      );

      const responseBody = await response.json();
      if (!response.ok || !responseBody.candidates || responseBody.candidates.length === 0) {
        throw new Error("Invalid response structure");
      }

      const generatedFeedback = responseBody.candidates[0]?.content?.parts[0]?.text || "No feedback generated";
      setFormData(prev => ({ ...prev, detailedFeedback: generatedFeedback }));
    } catch (error) {
      console.error("Error generating feedback:", error);
      showToast("Error generating feedback. Please try again later.", "error");
    } finally {
      setLoading(false);
    }
  };

  const convertBlobToBase64 = (blob) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(blob);
      reader.onloadend = () => {
        resolve(reader.result.split(",")[1]);
      };
      reader.onerror = reject;
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.detailedFeedback || !formData.result) {
      showToast("Please fill all required fields", "error");
      return;
    }

    if (!msalInitialized || !msalInstance) {
      showToast("Authentication service is not ready. Please try again later.", "error");
      return;
    }

    try {
      // Generate PDF
      const element = document.getElementById("form-container");
      const pdfBlob = await html2pdf()
        .set({
          margin: 0.5,
          filename: "Interview_Feedback_Form.pdf",
          image: { type: "jpeg", quality: 0.98 },
          html2canvas: { scale: 3, useCORS: true },
          jsPDF: {
            unit: "in",
            format: [11, 8.5],
            orientation: "landscape",
          },
        })
        .from(element)
        .outputPdf("blob");

      const base64PDF = await convertBlobToBase64(pdfBlob);

      // Get MSAL token
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

      // Send email
      const emailContent = {
        message: {
          subject: `Interview Feedback for ${formData.candidateName} - ${formData.position}`,
          body: {
            contentType: "HTML",
            content: `
              <p>Please find the attached interview feedback form for <strong>${formData.candidateName}</strong> for the position of <strong>${formData.position}</strong>.</p>
              <p>Interview Result: <strong>${formData.result}</strong></p>
              <p>Feedback Summary:</p>
              <p>${formData.detailedFeedback.substring(0, 200)}...</p>
            `,
          },
          toRecipients: [{ emailAddress: { address: formData.hrEmail } }],
          attachments: [
            {
              "@odata.type": "#microsoft.graph.fileAttachment",
              name: `Interview_Feedback_${formData.candidateName}.pdf`,
              contentType: "application/pdf",
              contentBytes: base64PDF,
            },
          ],
        },
      };

      const emailResponse = await fetch(
        "https://graph.microsoft.com/v1.0/me/sendMail",
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${tokenResponse.accessToken}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify(emailContent),
        }
      );

      if (!emailResponse.ok) {
        const emailError = await emailResponse.json();
        throw new Error(emailError.error?.message || "Failed to send email");
      }

      // Submit feedback
      const positionToSubmitApi = {
        "Junior .Net Cloud Native Application Engineer - Backend": "http://localhost:3001/api/dotnet_submit-feedback",
        "Senior .Net Cloud Native Application Engineer - Backend": "http://localhost:3001/api/dotnet_submit-feedback",
        "Junior Java Cloud Native Application Engineer - Backend": "http://localhost:3001/api/java_submit-feedback",
        "Senior Java Cloud Native Application Engineer - Backend": "http://localhost:3001/api/java_submit-feedback",
        "Junior Angular Cloud Native Application Engineer - Frontend": "http://localhost:3001/api/angular_submit-feedback",
        "Senior Angular Cloud Native Application Engineer - Frontend": "http://localhost:3001/api/angular_submit-feedback",
        "Junior React Cloud Native Application Engineer - Frontend": "http://localhost:3001/api/react_submit-feedback",
        "Senior React Cloud Native Application Engineer - Frontend": "http://localhost:3001/api/react_submit-feedback",
        "Junior Java Angular Cloud Native Application Engineer - Full Stack": "http://localhost:3001/api/java_angular_fullstack_submit-feedback",
        "Senior Java Angular Cloud Native Application Engineer - Full Stack": "http://localhost:3001/api/java_angular_fullstack_submit-feedback",
        "Junior Java React Cloud Native Application Engineer - Full Stack": "http://localhost:3001/api/java_react_fullstack_submit-feedback",
        "Senior Java React Cloud Native Application Engineer - Full Stack": "http://localhost:3001/api/java_react_fullstack_submit-feedback",
        "Junior .Net Angular Cloud Native Application Engineer - Full Stack": "http://localhost:3001/api/dotnet_angular_fullstack_submit-feedback",
        "Senior .Net Angular Cloud Native Application Engineer - Full Stack": "http://localhost:3001/api/dotnet_angular_fullstack_submit-feedback",
        "Junior .Net React Cloud Native Application Engineer - Full Stack": "http://localhost:3001/api/dotnet_react_fullstack_submit-feedback",
        "Senior .Net React Cloud Native Application Engineer - Full Stack": "http://localhost:3001/api/dotnet_react_fullstack_submit-feedback"
      };

      const submitApi = positionToSubmitApi[formData.position] || "http://localhost:3001/api/app_generic_submit-feedback";

      const response = await fetch(submitApi, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          candidateEmail: formData.candidateEmail,
          responses: formData.responses,
          detailedFeedback: formData.detailedFeedback,
          result: formData.result,
        }),
      });

      if (!response.ok) {
        const resultData = await response.json();
        throw new Error(resultData.error || "Failed to submit feedback");
      }

      showToast("Feedback submitted and email sent successfully!", "success");
      setTimeout(() => {
        window.close();
      }, 1500);
    } catch (error) {
      console.error("Error in submission process:", error);
      showToast(error.message || "Failed to process submission", "error");
    }
  };

  return (
    <div className="app-container">
      <div id="toast" className={`toast ${toast.type} ${toast.show ? 'show' : ''}`}>
        {toast.message}
      </div>

      <div className="form-container" id="form-container">
        <div style={{ color: '#000000' }}>
          <p>Email: <span id="candidate-email">{formData.candidateEmail}</span></p>
          <p>iMocha Score: <span id="imocha-score">{formData.imochaScore}</span></p>
        </div>
        <br />
        
        {/* Header Section */}
        <div style={{ display: 'flex', gap: '20px', width: '100%' }}>
          <div style={{ flex: 1 }}>
            <table>
              <tbody>
                <tr>
                  <td className="details">RRF ID</td>
                  <td><input type="text" id="rrf-id" value={formData.rrfId} readOnly /></td>
                </tr>
                <tr>
                  <td className="details">Job Designation</td>
                  <td><input type="text" id="position" value={formData.position} readOnly /></td>
                </tr>
                <tr>
                  <td className="details">Name of the Candidate</td>
                  <td><input type="text" id="candidate-name" value={formData.candidateName} readOnly /></td>
                </tr>
              </tbody>
            </table>
          </div>
          <div style={{ flex: 1 }}>
            <table>
              <tbody>
                <tr>
                  <td className="details">Date of Interview</td>
                  <td><input type="text" id="interview-date" value={formData.interviewDate} readOnly /></td>
                </tr>
                <tr>
                  <td className="details">Interviewer Mail</td>
                  <td><input type="text" id="interviewer-name" value={formData.interviewerName} readOnly /></td>
                </tr>
                <tr>
                  <td className="details">TAG Team Member</td>
                  <td><input type="text" id="hr-email" value={formData.hrEmail} readOnly /></td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* Skills Table */}
        <table id="skills-table">
          <thead>
            <tr style={{ fontWeight: 'bold', backgroundColor: 'rgb(187, 187, 187)' }}>
              <td>Skills</td>
              <td>Description</td>
              <td>Top Skills</td>
              <td>Rating</td>
              <td>Justification</td>
              <td>Improvements</td>
            </tr>
          </thead>
          <tbody id="skills-table-body">
            {questions.map((question) => {
              const response = formData.responses.find(r => r.questionId === question.id) || {};
              return (
                <tr key={question.id}>
                  <td>{question.skill_category}</td>
                  <td>{question.skill_description}</td>
                  <td>{question.is_top_skill ? "Yes" : "No"}</td>
                  <td>
                    <select style={{ width: '95px' }}
                      id={`deployment-${question.id}`}
                      value={response.deploymentRating || ''}
                      onChange={(e) => handleResponseChange(question.id, 'deploymentRating', e.target.value)}
                      required
                    >
                      <option value="">Select</option>
                      <option value="Good">Good</option>
                      <option value="Average">Average</option>
                      <option value="Poor">Poor</option>
                    </select>
                  </td>
                  <td>
                    <textarea className='justification-textarea
 '
                      id={`justification-${question.id}`}
                      value={response.justification || ''}
                      onChange={(e) => handleResponseChange(question.id, 'justification', e.target.value)}
                      required
                    />
                  </td>
                  <td>
                    <textarea className='justification-textarea'
                      id={`improvements-${question.id}`}
                      value={response.improvements || ''}
                      onChange={(e) => handleResponseChange(question.id, 'improvements', e.target.value)}
                      required
                    />
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>

        {/* Feedback Section */}
        <div className="feedback-section">
          <label htmlFor="detailed-feedback">Detailed Feedback: *</label>
          {loading && (
            <h3>
              <div id="loading-message" style={{ fontStyle: 'italic', color: '#00d9ff' }}>
                Please wait while analyzing the feedback based on given inputs...
              </div>
            </h3>
          )}
          <textarea
            id="detailed-feedback"
            className="feedback-section-text"
            placeholder="Enter your detailed feedback here..."
            value={formData.detailedFeedback}
            onChange={(e) => setFormData({ ...formData, detailedFeedback: e.target.value })}
            required
          />
          <button id="generate-summary" onClick={generateFeedback}>
            Generate Feedback
          </button>
        </div>

        {/* Result Section */}
        <div className="result-section">
          <label htmlFor="result">Shortlisted for next round</label>
          <select
            id="result"
            className="result-select"
            value={formData.result}
            onChange={(e) => setFormData({ ...formData, result: e.target.value })}
            required
          >
            <option value="">Select</option>
            <option value="Recommended">Shortlisted</option>
            <option value="Rejected">Rejected</option>
          </select>
        </div>
        <div style={{ display: 'flex', justifyContent: 'center' }}>
          <button
            id="submit-button"
            style={{
              backgroundColor: '#1f4e79',
              color: '#ffffff',
              height: '25px',
              width: '200px',
              borderRadius: '5px',
            }}
            onClick={handleSubmit}
            disabled={!msalInitialized}
          >
            {msalInitialized ? "Submit" : "Initializing..."}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AppL2Technical;