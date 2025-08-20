import React, { useState, useEffect } from 'react';
import './prescreeningform.css';

const PrescreeningForm = () => {
  const [candidateEmail, setCandidateEmail] = useState('');
  const [emails, setEmails] = useState([]);
  const [rrfId, setRrfId] = useState('');
  const [position, setPosition] = useState('');
  const [candidateName, setCandidateName] = useState('');
  const [uanNumber, setUanNumber] = useState('');
  const [interviewDate, setInterviewDate] = useState('');
  const [hrEmail, setHrEmail] = useState('');
  const [introductionToValuemomentum, setIntroductionToValuemomentum] = useState('');
  const [introductionOfCloudAppEngineering, setIntroductionOfCloudAppEngineering] = useState('');
  const [introductionToRolesResponsibilities, setIntroductionToRolesResponsibilities] = useState('');
  const [didCandidateQualify, setDidCandidateQualify] = useState('');
  const [currentCtc, setCurrentCtc] = useState('');
  const [expectedCtc, setExpectedCtc] = useState('');
  const [noticePeriod, setNoticePeriod] = useState('');
  const [offerInHand, setOfferInHand] = useState('');
  const [status, setStatus] = useState('shortlisted');
  const [summary, setSummary] = useState('');
  const [ecSelect, setEcSelect] = useState('');
  const [detailedFeedback, setDetailedFeedback] = useState('');
  const [imagePreview, setImagePreview] = useState(null);
  const [toast, setToast] = useState({ show: false, message: '', type: '' });

  const showToast = (message, type) => {
    setToast({ show: true, message, type });
    setTimeout(() => {
      setToast({ show: false, message: '', type: '' });
    }, 3000);
  };

  useEffect(() => {
    const evaluationData = JSON.parse(sessionStorage.getItem("currentCandidate"));
  
    if (evaluationData) {
      if (evaluationData.content) {
        setSummary(evaluationData.content);
      }
  
      if (evaluationData.candidate_email) {
        console.log("Candidate email from sessionStorage:", evaluationData.candidate_email);
        setCandidateEmail(evaluationData.candidate_email);
        fetchCandidateData(evaluationData.candidate_email);
      }
  
      if (evaluationData.summary) {
        setSummary(evaluationData.summary);
      }
    }
  
    // Fetch all candidate emails from the server (optional)
    
    fetch("https://demotag.vercel.app/api/getAllCandidateEmails")
      .then((response) => response.json())
      .then((data) => {
        if (data.error) {
          showToast(data.error, "error");
          setEmails([]); // Set empty array to prevent map errors
        } else {
          setEmails(data.emails || []); // Ensure emails is always an array
        }
      })
      .catch((error) => {
        console.error("Error fetching candidate emails:", error);
        showToast("Failed to load candidate emails.", "error");
        setEmails([]); // Set empty array to prevent map errors
      });
  
    // Load questions for all sections
    loadQuestions("https://demotag.vercel.app/api/java_ec_questions", "java-table-body", "java_experience_");
    loadQuestions("https://demotag.vercel.app/api/dotnet_ec_questions", "dotnet-table-body", "dotnet_experience_");
    loadQuestions("https://demotag.vercel.app/api/react_ec_questions", "react-table-body", "react_experience_");
    loadQuestions("https://demotag.vercel.app/api/angular_ec_questions", "angular-table-body", "angular_experience_");
    loadQuestions("https://demotag.vercel.app/api/mendix_ec_questions", "mendix-table-body", "mendix_experience_");
    loadQuestions("https://demotag.vercel.app/api/devops_ec_questions", "devops-table-body", "devops_experience_");
    loadQuestions("https://demotag.vercel.app/api/cloudops_ec_questions", "cloudops-table-body", "cloudops_experience_");
    loadQuestions("https://demotag.vercel.app/api/platform_ec_questions", "platform-table-body", "platform_experience_");
    loadQuestions("https://demotag.vercel.app/api/sre_ec_questions", "sre-table-body", "sre_experience_");
  
  }, []);
  

  const fetchCandidateData = (email) => {
    fetch(`https://demotag.vercel.app/api/getCandidateData?candidateEmail=${email}`)
      .then((response) => response.json())
      .then((data) => {
        if (data.error) {
          showToast(data.error, "error");
        } else {
          setCandidateName(data.candidate_name);
          setPosition(data.role);
          setRrfId(data.rrf_id);
          setHrEmail(data.hr_email);

          // Define role categories
          const appRolesJava = [
            "Junior Java Cloud Native Application Engineer - Backend",
            "Senior Java Cloud Native Application Engineer - Backend",
          ];
          const appRolesDotNet = [
            "Junior .Net Cloud Native Application Engineer - Backend",
            "Senior .Net Cloud Native Application Engineer - Backend",
          ];
          const appRolesReact = [
            "Junior React Cloud Native Application Engineer - Frontend",
            "Senior React Cloud Native Application Engineer - Frontend",
          ];
          const appRolesAngular = [
            "Junior Angular Cloud Native Application Engineer - Frontend",
            "Senior Angular Cloud Native Application Engineer - Frontend",
          ];
          const appRolesFullStack = [
            "Junior Java Angular Cloud Native Application Engineer - Full Stack",
            "Senior Java Angular Cloud Native Application Engineer - Full Stack",
            "Junior Java React Cloud Native Application Engineer - Full Stack",
            "Senior Java React Cloud Native Application Engineer - Full Stack",
            "Junior .Net Angular Cloud Native Application Engineer - Full Stack",
            "Senior .Net Angular Cloud Native Application Engineer - Full Stack",
            "Junior .Net React Cloud Native Application Engineer - Full Stack",
            "Senior .Net React Cloud Native Application Engineer - Full Stack",
          ];
          const devopsRoles = [
            "Junior Azure DevOps Engineer",
            "Senior Azure DevOps Engineer",
            "Lead Azure DevOps Engineer",
            "Junior AWS DevOps Engineer",
            "Senior AWS DevOps Engineer",
            "Lead AWS DevOps Engineer",
          ];
          const platformRoles = [
            "Junior Azure Platform Engineer",
            "Senior Azure Platform Engineer",
            "Lead Azure Platform Engineer",
            "Junior AWS Platform Engineer",
            "Senior AWS Platform Engineer",
            "Lead AWS Platform Engineer",
          ];
          const cloudopsRoles = [
            "Junior Azure Cloudops Engineer",
            "Senior Azure Cloudops Engineer",
            "Lead Azure Cloudops Engineer",
            "Junior AWS Cloudops Engineer",
            "Senior AWS Cloudops Engineer",
            "Lead AWS Cloudops Engineer",
          ];

          const isAppEC = [
            ...appRolesJava,
            ...appRolesDotNet,
            ...appRolesReact,
            ...appRolesAngular,
            ...appRolesFullStack,
          ].includes(data.role);

          const isCloudEC = [
            ...devopsRoles,
            ...platformRoles,
            ...cloudopsRoles,
          ].includes(data.role);

          // Handle App EC Display
        // --- Handle App EC Display ---
if (isAppEC) {
    setEcSelect("App");
    document.getElementById("app-section").style.display = "block";
    document.getElementById("cloud-section").style.display = "none";
    document.getElementById("data-section").style.display = "none";
  
    // First hide ALL App EC technology sections
    document.getElementById("java-section").style.display = "none";
    document.getElementById("dotnet-section").style.display = "none";
    document.getElementById("react-section").style.display = "none";
    document.getElementById("angular-section").style.display = "none";
    document.getElementById("fullstack-section").style.display = "none";
  
    // Then show only the relevant one
    if (appRolesJava.includes(data.role)) {
      document.getElementById("java-section").style.display = "block";
    } else if (appRolesDotNet.includes(data.role)) {
      document.getElementById("dotnet-section").style.display = "block";
    } else if (appRolesReact.includes(data.role)) {
      document.getElementById("react-section").style.display = "block";
    } else if (appRolesAngular.includes(data.role)) {
      document.getElementById("angular-section").style.display = "block";
    } else if (appRolesFullStack.includes(data.role)) {
      document.getElementById("fullstack-section").style.display = "block";
      // Load appropriate fullstack questions...
    }
  }

          // Handle Cloud EC Display
          if (isCloudEC) {
            setEcSelect("Cloud");
            if (devopsRoles.includes(data.role)) {
              // Show DevOps section
            } else if (cloudopsRoles.includes(data.role)) {
              // Show CloudOps section
            } else if (platformRoles.includes(data.role)) {
              // Show Platform section
            }
          }
        }
      })
      .catch((error) => {
        console.error("Error fetching candidate data:", error);
        showToast("Failed to load candidate data.", "error");
      });
  };

  const handleEcSelectChange = (e) => {
    const selectedValue = e.target.value;
    setEcSelect(selectedValue);
  };

  const validateWordCount = (feedback) => {
    const wordCount = feedback.trim().split(/\s+/).filter(Boolean).length;
    return wordCount >= 100;
  };

  const handleSubmit = async () => {
    const detailedFeedbackValue = detailedFeedback;
    const selectedRole = position;
    const summaryBox = status;

    if (!candidateEmail || !selectedRole) {
      alert("Please select role and enter candidate email.");
      return;
    }

    let tableSelector = "";
    let apiEndpoint = "";

    // Full Stack roles
    if (
      selectedRole.toLowerCase().includes("java") &&
      selectedRole.toLowerCase().includes("angular")
    ) {
      tableSelector = "#fullstack-table-body tr";
      apiEndpoint = "https://demotag.vercel.app/api/java_angular_fullstack_submit-feedback";
    } else if (
      selectedRole.toLowerCase().includes("java") &&
      selectedRole.toLowerCase().includes("react")
    ) {
      tableSelector = "#fullstack-table-body tr";
      apiEndpoint = "https://demotag.vercel.app/api/java_react_fullstack_submit-feedback";
    } else if (
      selectedRole.toLowerCase().includes(".net") &&
      selectedRole.toLowerCase().includes("angular")
    ) {
      tableSelector = "#fullstack-table-body tr";
      apiEndpoint = "https://demotag.vercel.app/api/dotnet_angular_fullstack_submit-feedback";
    } else if (
      selectedRole.toLowerCase().includes(".net") &&
      selectedRole.toLowerCase().includes("react")
    ) {
      tableSelector = "#fullstack-table-body tr";
      apiEndpoint = "https://demotag.vercel.app/api/dotnet_react_fullstack_submit-feedback";

      // App EC roles
    } else if (selectedRole.toLowerCase().includes("java")) {
      tableSelector = "#java-table-body tr";
      apiEndpoint = "https://demotag.vercel.app/api/java_ec_submit-feedback";
    } else if (selectedRole.toLowerCase().includes(".net")) {
      tableSelector = "#dotnet-table-body tr";
      apiEndpoint = "https://demotag.vercel.app/api/dotnet_ec_submit-feedback";
    } else if (selectedRole.toLowerCase().includes("react")) {
      tableSelector = "#react-table-body tr";
      apiEndpoint = "https://demotag.vercel.app/api/react_ec_submit-feedback";
    } else if (selectedRole.toLowerCase().includes("angular")) {
      tableSelector = "#angular-table-body tr";
      apiEndpoint = "https://demotag.vercel.app/api/angular_ec_submit-feedback";
    } else if (selectedRole.toLowerCase().includes("mendix")) {
      tableSelector = "#mendix-table-body tr";
      apiEndpoint = "https://demotag.vercel.app/api/mendix_ec_submit-feedback";

      // Cloud EC roles
    } else if (selectedRole.toLowerCase().includes("devops")) {
      tableSelector = "#devops-table-body tr";
      apiEndpoint = "https://demotag.vercel.app/api/devops_ec_submit-feedback";
    } else if (selectedRole.toLowerCase().includes("cloudops")) {
      tableSelector = "#cloudops-table-body tr";
      apiEndpoint = "https://demotag.vercel.app/api/cloudops_ec_submit-feedback";
    } else if (selectedRole.toLowerCase().includes("platform")) {
      tableSelector = "#platform-table-body tr";
      apiEndpoint = "https://demotag.vercel.app/api/platform_ec_submit-feedback";
    } else {
      alert("Selected role not supported.");
      return;
    }

    const rows = document.querySelectorAll(tableSelector);
    const number_of_years_or_months = [];

    rows.forEach((row) => {
      const skill = row.children[0].innerText;
      const input = row.children[1].querySelector("input");
      const experience = input ? input.value : "";
      number_of_years_or_months.push({ skill, experience });
    });

    const payload = {
      candidateEmail,
      introduction_to_valuemomentum: introductionToValuemomentum,
      introduction_of_cloud_app_engineering: introductionOfCloudAppEngineering,
      introduction_to_roles_responsibilities: introductionToRolesResponsibilities,
      did_candidate_qualify_using_pre_screening_qs: didCandidateQualify,
      current_ctc: currentCtc,
      expected_ctc: expectedCtc,
      notice_period: noticePeriod,
      offer_in_hand: offerInHand,
      number_of_years_or_months,
      detailed_feedback: detailedFeedbackValue,
      status: summaryBox,
    };

    try {
      const response = await fetch(apiEndpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const result = await response.json();
      if (response.ok) {
        showToast("✅ Feedback submitted successfully!");
        window.location.href = "/imocha";
      } else {
        showToast(`❌ Error: ${result.error || "Something went wrong."}`);
      }
    } catch (err) {
      console.error("Submit error:", err);
      showToast("❌ Failed to submit feedback. See console for details.");
    }
  };

  const loadQuestions = async (apiUrl, tbodyId, prefixToRemove = "") => {
    try {
      const res = await fetch(apiUrl);
      const data = await res.json();
      const tbody = document.getElementById(tbodyId);
      
      if (!tbody) {
        console.warn(`Table body element with id '${tbodyId}' not found`);
        return;
      }
      
      tbody.innerHTML = "";

      // Check if data is an array before calling forEach
      if (!data || !Array.isArray(data)) {
        console.warn(`No questions data received from ${apiUrl}`);
        tbody.innerHTML = "<tr><td colspan='3'>No questions available</td></tr>";
        return;
      }

      data.forEach((q) => {
        const label = formatLabel(q.question_text, prefixToRemove);
        const inputId = q.question_text;

        const tr = document.createElement("tr");
        tr.innerHTML = `
          <td>${label}</td>
          <td><input type="text" id="${inputId}" placeholder="Enter total experience in Years/Months" /></td>
          <td>${q.mandatory_for_candidates}</td>
        `;
        tbody.appendChild(tr);
      });
    } catch (error) {
      console.error("Error loading questions:", error);
      const tbody = document.getElementById(tbodyId);
      if (tbody) {
        tbody.innerHTML = "<tr><td colspan='3'>Error loading questions</td></tr>";
      }
    }
  };

  const formatLabel = (text, prefix) => {
    return text
      .replace(prefix, "")
      .replace(/_/g, " ")
      .replace(/\b\w/g, (char) => char.toUpperCase());
  };

  const generateFeedbackWithGemini = async (candidateEmail, selectedRole, skills) => {
    try {
      const geminiPrompt = `
        Please generate a detailed prescreening evaluation feedback for the following candidate:
        - Email: ${candidateEmail}
        - Role: ${selectedRole}
        - Skills & experience: ${skills && Array.isArray(skills) 
          ? skills.map((s) => `${s.skill}: ${s.experience}`).join(", ")
          : "No skills data available"}
        Feedback should be professional, actionable, and at least 100 words.
      `;

      const geminiResponse = await fetch(
        "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=AIzaSyD1NqvfelSR6l-8FEIIFiZM3aJmbo2mw-Q",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            contents: [{ parts: [{ text: geminiPrompt }] }],
          }),
        }
      );

      const geminiData = await geminiResponse.json();
      const generatedText =
        geminiData.candidates?.[0]?.content?.parts?.[0]?.text || "";

      return generatedText.trim();
    } catch (error) {
      console.error("Error generating feedback with Gemini:", error);
      return "";
    }
  };

  const handleGenerateFeedback = async () => {
    const selectedRole = position;

    let tableSelector = "";
    if (selectedRole.toLowerCase().includes("java")) {
      tableSelector = "#java-table-body tr";
    } else if (selectedRole.toLowerCase().includes(".net")) {
      tableSelector = "#dotnet-table-body tr";
    } else if (selectedRole.toLowerCase().includes("react")) {
      tableSelector = "#react-table-body tr";
    } else if (selectedRole.toLowerCase().includes("angular")) {
      tableSelector = "#angular-table-body tr";
    } else if (selectedRole.toLowerCase().includes("mendix")) {
      tableSelector = "#mendix-table-body tr";
    } else if (selectedRole.toLowerCase().includes("devops")) {
      tableSelector = "#devops-table-body tr";
    } else if (selectedRole.toLowerCase().includes("cloudops")) {
      tableSelector = "#cloudops-table-body tr";
    } else if (selectedRole.toLowerCase().includes("platform")) {
      tableSelector = "#platform-table-body tr";
    } else if (selectedRole.toLowerCase().includes("sre")) {
      tableSelector = "#sre-table-body tr";
    } else {
      alert("Selected role not supported for feedback generation.");
      return;
    }

    const rows = document.querySelectorAll(tableSelector);
    const skills = [];
    rows.forEach((row) => {
      const skill = row.children[0].innerText;
      const input = row.children[1].querySelector("input");
      const experience = input ? input.value : "";
      skills.push({ skill, experience });
    });

    showToast("Generating feedback... please wait.", "success");

    const generatedFeedback = await generateFeedbackWithGemini(
      candidateEmail,
      selectedRole,
      skills
    );

    if (generatedFeedback && validateWordCount(generatedFeedback)) {
      setDetailedFeedback(generatedFeedback);
      showToast("✅ Feedback generated!", "success");
    } else {
      showToast(
        "⚠️ Feedback generation incomplete or too short. Please review.",
        "error"
      );
      setDetailedFeedback(generatedFeedback || "");
    }
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file && file.type.startsWith("image/")) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setImagePreview(e.target.result);
        showToast("Image uploaded successfully!", "success");
      };
      reader.readAsDataURL(file);
    } else {
      setImagePreview(null);
    }
  };

  const handleStatusChange = (e) => {
    setStatus(e.target.value);
  };

  return (
    <div className="form-container">
      <center>
        <h1><strong>TAG Team Prescreening Form</strong></h1>
      </center>
      <div style={{ color: '#000000', width: '60%' }}>
        <select 
          id="candidate-email-dropdown" 
          className="styled-dropdown"
          value={candidateEmail}
          onChange={(e) => {
            setCandidateEmail(e.target.value);
            if (e.target.value) {
              fetchCandidateData(e.target.value);
              const finalSummary = localStorage.getItem("finalSummary");
              if (finalSummary) {
                setSummary(finalSummary);
              }
            }
          }}
        >
          <option value="">Select a Candidate Email</option>
          {emails.map((email) => (
            <option key={email} value={email}>{email}</option>
          ))}
        </select>
      </div>
      <br />

      <div className="header">
        <div className="candidate-container">
          <div className="candidate-info">
            <table>
              <tr>
                <td className="details">RRF ID</td>
                <td>
                  <input type="text" id="rrf-id" value={rrfId} placeholder="" readOnly />
                </td>
              </tr>
              <tr>
                <td className="details">Job Designation</td>
                <td>
                  <input type="text" id="position" value={position} placeholder="" readOnly />
                </td>
              </tr>
              <tr>
                <td className="details">Name of the Candidate</td>
                <td>
                  <input
                    type="text"
                    id="candidate-name"
                    value={candidateName}
                    placeholder=""
                    readOnly
                  />
                </td>
              </tr>
              <tr>
                <td>UAN Number</td>
                <td>
                  <input
                    type="text"
                    id="uan-number"
                    value={uanNumber}
                    onChange={(e) => setUanNumber(e.target.value.replace(/[^0-9]/g, ''))}
                    placeholder="Enter UAN Number"
                    minLength="0"
                    maxLength="12"
                  />
                </td>
              </tr>
              <tr>
                <td>Date of Interview</td>
                <td>
                  <input
                    type="date"
                    id="interview-date"
                    value={interviewDate}
                    onChange={(e) => setInterviewDate(e.target.value)}
                    onClick={(e) => e.target.showPicker()}
                  />
                </td>
              </tr>
              <tr>
                <td className="details">TAG Team Member</td>
                <td>
                  <input type="text" id="hr-email" value={hrEmail} placeholder="" readOnly />
                </td>
              </tr>
            </table>
          </div>

          <div className="introduction-tables">
            <table>
              <tr>
                <td>Introduction of ValueMomentum</td>
                <td>
                  <select 
                    id="introduction_to_valuemomentum"
                    value={introductionToValuemomentum}
                    onChange={(e) => setIntroductionToValuemomentum(e.target.value)}
                  >
                    <option value="" selected>Select</option>
                    <option value="Yes">Yes</option>
                    <option value="No">No</option>
                  </select>
                </td>
              </tr>
              <tr>
                <td>Introduction of Cloud/App Engineering</td>
                <td>
                  <select 
                    id="introduction_of_cloud_app_engineering"
                    value={introductionOfCloudAppEngineering}
                    onChange={(e) => setIntroductionOfCloudAppEngineering(e.target.value)}
                  >
                    <option value="" selected>Select</option>
                    <option value="Yes">Yes</option>
                    <option value="No">No</option>
                  </select>
                </td>
              </tr>
              <tr>
                <td>Introduction to Roles & Responsibilities</td>
                <td>
                  <select 
                    id="introduction_to_roles_responsibilities"
                    value={introductionToRolesResponsibilities}
                    onChange={(e) => setIntroductionToRolesResponsibilities(e.target.value)}
                  >
                    <option value="" selected>Select</option>
                    <option value="Yes">Yes</option>
                    <option value="No">No</option>
                  </select>
                </td>
              </tr>
              <tr>
                <td>Did Candidate qualify using pre-screening Q's</td>
                <td>
                  <select 
                    id="did_candidate_qualify_using_pre_screening_qs"
                    value={didCandidateQualify}
                    onChange={(e) => setDidCandidateQualify(e.target.value)}
                  >
                    <option value="" selected>Select</option>
                    <option value="Yes">Yes</option>
                    <option value="No">No</option>
                  </select>
                </td>
              </tr>
              <tr>
                <td>Current CTC</td>
                <td>
                  <input
                    type="text"
                    id="current_ctc"
                    value={currentCtc}
                    onChange={(e) => setCurrentCtc(e.target.value)}
                    placeholder="e.g., 8 LPA"
                  />
                </td>
              </tr>
              <tr>
                <td>Expected CTC</td>
                <td>
                  <input
                    type="text"
                    id="expected_ctc"
                    value={expectedCtc}
                    onChange={(e) => setExpectedCtc(e.target.value)}
                    placeholder="e.g., 12 LPA"
                  />
                </td>
              </tr>
              <tr>
                <td>Notice Period</td>
                <td>
                  <input
                    type="text"
                    id="notice_period"
                    value={noticePeriod}
                    onChange={(e) => setNoticePeriod(e.target.value)}
                    placeholder="e.g., 30 days"
                  />
                </td>
              </tr>
              <tr>
                <td>Offer in Hand</td>
                <td>
                  <select 
                    id="offer_in_hand"
                    value={offerInHand}
                    onChange={(e) => setOfferInHand(e.target.value)}
                  >
                    <option value="" selected>Select</option>
                    <option value="Yes">Yes</option>
                    <option value="No">No</option>
                  </select>
                </td>
              </tr>
            </table>
          </div>
        </div>

        <div className="candidate-photo">
          <input
            type="file"
            id="imageUpload"
            accept="image/*"
            style={{ display: 'none' }}
            onChange={handleImageUpload}
          />
          <div className="image-container" id="imageContainer" onClick={() => document.getElementById('imageUpload').click()}>
            {imagePreview ? (
              <img id="imagePreview" src={imagePreview} alt="Candidate" style={{ display: 'block' }} />
            ) : (
              <label htmlFor="imageUpload" id="uploadLabel" className="upload-label">
                <center>Upload</center>
                <br />Candidate Image
              </label>
            )}
          </div>
        </div>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-start' }}>
        <table>
          <tr>
            <th className="pre-screening">Pre-screening Q's</th>
            <th>Summary</th>
          </tr>
          <tr>
            <td>
              <select 
                id="status-dropdown" 
                style={{ fontWeight: 'bold' }}
                value={status}
                onChange={handleStatusChange}
                className={status === 'shortlisted' ? 'green-background' : status === 'not-shortlisted' ? 'red-background' : ''}
              >
                <option value="shortlisted">Shortlisted</option>
                <option value="not-shortlisted">Not Shortlisted</option>
              </select>
            </td>
            <td>
              <textarea
                id="summary"
                value={summary}
                onChange={(e) => setSummary(e.target.value)}
                style={{
                  height: '100px',
                  width: '100%',
                  fontFamily: 'Arial, sans-serif',
                }}
              ></textarea>
            </td>
          </tr>
        </table>

        <div style={{ marginLeft: '50px' }}>
          <label htmlFor="ec-select">Select the EC</label>
          <select 
            id="ec-select" 
            style={{ width: '150px' }}
            value={ecSelect}
            onChange={handleEcSelectChange}
          >
            <option value="" selected>Select an option</option>
            <option value="Cloud">Cloud EC</option>
            <option value="App">App EC</option>
            <option value="Data">Data EC</option>
          </select>
        </div>
      </div>

      <div id="cloud-section" style={{ display: ecSelect === 'Cloud' ? 'block' : 'none' }}>
        <div id="devops-section" className="section">
          <table>
            <thead>
              <tr>
                <th>DevOps Experience</th>
                <th>Number of years or Months</th>
                <th>Projects Handled</th>
              </tr>
            </thead>
            <tbody id="devops-table-body"></tbody>
          </table>
        </div>

        <div id="cloudops-section" className="section">
          <table>
            <thead>
              <tr>
                <th>CloudOps Experience</th>
                <th>Number of years or Months</th>
                <th>Projects Handled</th>
              </tr>
            </thead>
            <tbody id="cloudops-table-body"></tbody>
          </table>
        </div>

        <div id="platform-section" className="section">
          <table>
            <thead>
              <tr>
                <th>Platform Experience</th>
                <th>Number of years or Months</th>
                <th>Projects Handled</th>
              </tr>
            </thead>
            <tbody id="platform-table-body"></tbody>
          </table>
        </div>

        <div id="sre-section" className="section">
          <table>
            <thead>
              <tr>
                <th>Site Reliability Engineering (SRE) Experience</th>
                <th>Number of years or Months</th>
                <th>Projects Handled</th>
              </tr>
            </thead>
            <tbody id="sre-table-body"></tbody>
          </table>
        </div>
      </div>

      <div id="app-section" style={{ display: ecSelect === 'App' ? 'block' : 'none' }}>
        <div id="java-section">
          <div className="section">
            <table>
              <thead>
                <tr>
                  <th>Java Experience</th>
                  <th>Number of years or Months</th>
                  <th>Mandatory for Candidates</th>
                </tr>
              </thead>
              <tbody id="java-table-body"></tbody>
            </table>
          </div>
        </div>

        <div id="dotnet-section">
          <div className="section">
            <table>
              <thead>
                <tr>
                  <th>.NET Experience</th>
                  <th>Number of years or Months</th>
                  <th>Mandatory for Candidates</th>
                </tr>
              </thead>
              <tbody id="dotnet-table-body"></tbody>
            </table>
          </div>
        </div>
      </div>
      
      <div id="react-section" style={{ display: 'none' }}>
        <div className="section">
          <table>
            <thead>
              <tr>
                <th>React Experience</th>
                <th>Number of years or Months</th>
                <th>Mandatory for Candidates</th>
              </tr>
            </thead>
            <tbody id="react-table-body"></tbody>
          </table>
        </div>
      </div>

      <div id="angular-section" style={{ display: 'none' }}>
        <div className="section">
          <table>
            <thead>
              <tr>
                <th>Angular Experience</th>
                <th>Number of years or Months</th>
                <th>Mandatory for Candidates</th>
              </tr>
            </thead>
            <tbody id="angular-table-body"></tbody>
          </table>
        </div>
      </div>

      <div id="mendix-section" style={{ display: 'none' }}>
        <div className="section">
          <table>
            <thead>
              <tr>
                <th>Mendix Experience</th>
                <th>Number of years or Months</th>
                <th>Mandatory for Candidates</th>
              </tr>
            </thead>
            <tbody id="mendix-table-body"></tbody>
          </table>
        </div>
      </div>
      
      <div id="fullstack-section" style={{ display: 'none' }}>
        <div className="section">
          <table>
            <thead>
              <tr>
                <th>Full Stack Experience</th>
                <th>Number of years or Months</th>
                <th>Mandatory for Candidates</th>
              </tr>
            </thead>
            <tbody id="fullstack-table-body"></tbody>
          </table>
        </div>
      </div>

      <div id="data-section" style={{ display: ecSelect === 'Data' ? 'block' : 'none' }}>
        <div className="section">
          <table className="experience-table">
            <tr>
              <th>Data Engineering Experience</th>
              <th>Number of years or Months</th>
              <th>Projects Handled</th>
            </tr>
            <tr>
              <td>Total Experience in Data Engineering?</td>
              <td>
                <input
                  type="text"
                  id="data-engineering-experience"
                  placeholder="Enter total experience in Years/Months"
                />
              </td>
              <td>
                <input
                  type="text"
                  id="data-engineering-projects"
                  placeholder="Enter number of projects"
                />
              </td>
            </tr>
            <tr>
              <td>Experience in SQL (PostgreSQL, MySQL, etc.)</td>
              <td>
                <input
                  type="text"
                  id="sql-experience"
                  placeholder="Enter total experience in Years/Months"
                />
              </td>
              <td>
                <input
                  type="text"
                  id="sql-projects"
                  placeholder="Enter number of projects"
                />
              </td>
            </tr>
            <tr>
              <td>Experience in NoSQL (MongoDB, Cassandra, etc.)</td>
              <td>
                <input
                  type="text"
                  id="nosql-experience"
                  placeholder="Enter total experience in Years/Months"
                />
              </td>
              <td>
                <input
                  type="text"
                  id="nosql-projects"
                  placeholder="Enter number of projects"
                />
              </td>
            </tr>
            <tr>
              <td>Experience in ETL Tools (Informatica, Talend, etc.)</td>
              <td>
                <input
                  type="text"
                  id="etl-experience"
                  placeholder="Enter total experience in Years/Months"
                />
              </td>
              <td>
                <input
                  type="text"
                  id="etl-projects"
                  placeholder="Enter number of projects"
                />
              </td>
            </tr>
            <tr>
              <td>Experience in Big Data (Hadoop, Spark, Hive, etc.)</td>
              <td>
                <input
                  type="text"
                  id="bigdata-experience"
                  placeholder="Enter total experience in Years/Months"
                />
              </td>
              <td>
                <input
                  type="text"
                  id="bigdata-projects"
                  placeholder="Enter number of projects"
                />
              </td>
            </tr>
            <tr>
              <td>
                Experience in Data Warehousing (Snowflake, Redshift, etc.)
              </td>
              <td>
                <input
                  type="text"
                  id="data-warehousing-experience"
                  placeholder="Enter total experience in Years/Months"
                />
              </td>
              <td>
                <input
                  type="text"
                  id="data-warehousing-projects"
                  placeholder="Enter number of projects"
                />
              </td>
            </tr>
            <tr>
              <td>Experience in Data Pipelines (Airflow, Luigi, etc.)</td>
              <td>
                <input
                  type="text"
                  id="data-pipelines-experience"
                  placeholder="Enter total experience in Years/Months"
                />
              </td>
              <td>
                <input
                  type="text"
                  id="data-pipelines-projects"
                  placeholder="Enter number of projects"
                />
              </td>
            </tr>
            <tr>
              <td>Experience in Data Analytics (Python, R, Pandas, etc.)</td>
              <td>
                <input
                  type="text"
                  id="data-analytics-experience"
                  placeholder="Enter total experience in Years/Months"
                />
              </td>
              <td>
                <input
                  type="text"
                  id="data-analytics-projects"
                  placeholder="Enter number of projects"
                />
              </td>
            </tr>
          </table>
        </div>
      </div>

      <div className="feedback-section">
        <label htmlFor="detailed-feedback">Detailed Feedback: *</label>
        <textarea
          id="detailed-feedback"
          className="feedback-section-text"
          value={detailedFeedback}
          onChange={(e) => setDetailedFeedback(e.target.value)}
          placeholder="Enter your detailed feedback here..."
          required
        ></textarea>
      </div>

      <button 
        type="button" 
        id="generate-feedback-btn" 
        className="generate-feedback-btn"
        onClick={handleGenerateFeedback}
      >
        Generate Feedback (AI)
      </button>

      <div style={{ display: 'flex', justifyContent: 'center' }}>
        <button
          id="submit-button"
          className="submit-button"
          onClick={handleSubmit}
        >
          Submit
        </button>
      </div>
      
      <div id="toast" className={`toast ${toast.type} ${toast.show ? 'show' : ''}`}>
        {toast.message}
      </div>
      <br />
    </div>
  );
};

export default PrescreeningForm;
