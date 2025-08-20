// FinalFeedback.js
import React, { useEffect, useState } from 'react';
import { BiDownload } from 'react-icons/bi';
import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';
import './finalfeedback.css';

const FinalFeedback = () => {
    const [formData, setFormData] = useState({
        rrfId: '',
        account: '',
        position: '',
        candidateName: '',
        interviewDate: '',
        interviewerName: '',
        hrEmail: '',
        prescreeningFeedback: '',
        prescreeningStatus: '',
        prescreeningSummary: '',
        imochaStatus: '',
        imochaScore: '',
        l2TechnicalSummary: '',
        l2TechnicalResult: '',
        l2TechnicalFeedback: '',
        ecFitmentSummary: '',
        ecFitmentResult: '',
        ecFitmentFeedback: '',
        projectFitmentSummary: '',
        projectFitmentResult: '',
        projectFitmentFeedback: '',
        clientFitmentSummary: '',
        clientFitmentResult: '',
        clientFitmentFeedback: '',
        fitmentSummary: '',
        fitmentResult: '',
        fitmentFeedback: ''
    });
    const [candidateEmail, setCandidateEmail] = useState('');
    const [candidateEmails, setCandidateEmails] = useState([]);
    const [toast, setToast] = useState({ show: false, message: '', type: '' });
    const [hiddenRows, setHiddenRows] = useState([]);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        // Fetch all candidate emails when component mounts
        const fetchEmails = async () => {
            try {
                setIsLoading(true);
                const response = await fetch("https://demotag.vercel.app/api/getAllCandidateEmails");
                const data = await response.json();
                
                if (data.error) {
                    showToast(data.error, "error");
                } else {
                    setCandidateEmails(data.emails);
                    
                    // Check for email in URL params
                    const queryParams = new URLSearchParams(window.location.search);
                    const emailFromURL = queryParams.get("email");
                    if (emailFromURL && data.emails.includes(emailFromURL)) {
                        setCandidateEmail(emailFromURL);
                        fetchCandidateData(emailFromURL);
                    }
                }
            } catch (error) {
                console.error("Error fetching candidate emails:", error);
                showToast("Failed to load candidate emails.", "error");
            } finally {
                setIsLoading(false);
            }
        };

        fetchEmails();

        // Hide empty feedback rows after 4 seconds
        const timer = setTimeout(() => {
            const feedbackIds = [
                'prescreening-summary',
                'l2-technical-feedback',
                'ec-fitment-feedback',
                'project-fitment-feedback',
                'client-fitment-feedback',
                'fitment-feedback'
            ];
            
            const newHiddenRows = [];
            feedbackIds.forEach(id => {
                const element = document.getElementById(id);
                if (element && element.value.trim() === "") {
                    newHiddenRows.push(id);
                }
            });
            setHiddenRows(newHiddenRows);
        }, 4000);

        return () => clearTimeout(timer);
    }, []);

    const showToast = (message, type = "success") => {
        setToast({ show: true, message, type });
        setTimeout(() => {
            setToast({ show: false, message: '', type: '' });
        }, 4000);
    };

    const fetchCandidateData = async (selectedEmail) => {
        if (!selectedEmail) return;

        setIsLoading(true);
        try {
            let imochaScore = null;
            let l2Result = "";

            // Step 1: Fetch candidate basic data
            const candidateResponse = await fetch(`https://demotag.vercel.app/api/getCandidateData?candidateEmail=${selectedEmail}`);
            const candidateData = await candidateResponse.json();

            if (candidateData.error) {
                showToast(candidateData.error, "error");
                return;
            }

            // Update basic info first
            const newFormData = {
                ...formData,
                rrfId: candidateData.rrf_id || '',
                hrEmail: candidateData.hr_email || '',
                candidateName: candidateData.candidate_name || '',
                position: candidateData.role || '',
                interviewerName: candidateData.panel_name || '',
                interviewDate: candidateData.l_2_interviewdate || '',
                imochaScore: candidateData.l_1_score || '',
                account: candidateData.eng_center || ''
            };
            setFormData(newFormData);
            imochaScore = candidateData.l_1_score;

            // Step 2: Fetch prescreening & feedback data
            const feedbackResponse = await fetch(`https://demotag.vercel.app/api/final-prescreening?candidateEmail=${selectedEmail}&candidateId=${candidateData.id}&position=${candidateData.role}`);
            const feedbackData = await feedbackResponse.json();

            if (feedbackData.message) {
                showToast(feedbackData.message, "error");
                return;
            }

            let updatedFormData = { ...newFormData };

            // Prescreening data
            if (feedbackData.prescreening) {
                updatedFormData.prescreeningFeedback = feedbackData.prescreening.hr_email || '';
                updatedFormData.prescreeningSummary = feedbackData.prescreening.feedback || '';
                updatedFormData.prescreeningStatus = feedbackData.prescreening.prescreening_status || '';
            }

            // Feedback data
            if (feedbackData.feedback && Array.isArray(feedbackData.feedback)) {
                feedbackData.feedback.forEach(feedback => {
                    const { round_details, detailed_feedback, result, interviewer_name } = feedback;

                    switch (round_details) {
                        case "EC Fitment Round":
                            updatedFormData.ecFitmentSummary = interviewer_name;
                            updatedFormData.ecFitmentFeedback = detailed_feedback;
                            updatedFormData.ecFitmentResult = result;
                            break;
                        case "Client Fitment Round":
                            updatedFormData.clientFitmentSummary = interviewer_name;
                            updatedFormData.clientFitmentFeedback = detailed_feedback;
                            updatedFormData.clientFitmentResult = result;
                            break;
                        case "Project Fitment Round":
                            updatedFormData.projectFitmentSummary = interviewer_name;
                            updatedFormData.projectFitmentFeedback = detailed_feedback;
                            updatedFormData.projectFitmentResult = result;
                            break;
                        case "Fitment Round":
                            updatedFormData.fitmentSummary = interviewer_name;
                            updatedFormData.fitmentFeedback = detailed_feedback;
                            updatedFormData.fitmentResult = result;
                            break;
                        default:
                            break;
                    }
                });
            }

            // L2 Technical data
            if (feedbackData.l2Technical) {
                const { detailed_feedback, overall_feedback, result, interviewer_name } = feedbackData.l2Technical;
                l2Result = result || '';
                updatedFormData.l2TechnicalSummary = interviewer_name || '';
                updatedFormData.l2TechnicalFeedback = detailed_feedback || overall_feedback || '';
                updatedFormData.l2TechnicalResult = l2Result;
            }

            // iMocha Status
            if (imochaScore != null && imochaScore !== "") {
                updatedFormData.imochaStatus = imochaScore >= 18 ? "Shortlisted" : "Rejected";
            } else {
                updatedFormData.imochaStatus = l2Result !== "" ? "iMocha Skipped" : "Waiting for iMocha";
            }

            setFormData(updatedFormData);
        } catch (error) {
            console.error("Error fetching candidate data:", error);
            showToast("Failed to load candidate data.", "error");
        } finally {
            setIsLoading(false);
        }
    };

    const handleEmailChange = (e) => {
        const selectedEmail = e.target.value;
        setCandidateEmail(selectedEmail);
        fetchCandidateData(selectedEmail);
    };

    const maximizeTextarea = (id) => {
        const textarea = document.getElementById(id);
        if (textarea) {
            textarea.classList.toggle("maximized");
        }
    };

    const downloadFormAsPDF = async () => {
        const formElement = document.getElementById("form-to-download");
        if (!formElement) {
            showToast("Form container not found!", "error");
            return;
        }

        try {
            const clonedForm = formElement.cloneNode(true);
            clonedForm.style.position = "absolute";
            clonedForm.style.top = "0";
            clonedForm.style.left = "0";
            clonedForm.style.zIndex = "-9999";
            clonedForm.style.opacity = "1";
            clonedForm.style.pointerEvents = "none";
            clonedForm.style.width = formElement.offsetWidth + "px";
            document.body.appendChild(clonedForm);

            // Hide buttons and icons
            const buttonsAndIcons = clonedForm.querySelectorAll("button, .icon, [type='button'], [type='submit'], svg, i, img.icon");
            buttonsAndIcons.forEach(el => el.style.display = "none");

            // Replace form elements with static content
            const replaceElement = (selector, value) => {
                const elements = clonedForm.querySelectorAll(selector);
                elements.forEach(el => {
                    const textDiv = document.createElement("div");
                    textDiv.textContent = value || el.value || el.textContent || el.placeholder || "";
                    Object.assign(textDiv.style, {
                        margin: "5px 0",
                        whiteSpace: "pre-wrap",
                        padding: "6px",
                        border: "1px solid #ccc",
                        backgroundColor: "#f3f3f3",
                        fontFamily: "Arial, sans-serif",
                        fontSize: "14px",
                    });
                    el.replaceWith(textDiv);
                });
            };

            replaceElement("textarea");
            replaceElement("input[type='text'], input[type='email'], input[type='number'], input[type='date']");

            // Replace checkboxes and radios with text
            const inputs = clonedForm.querySelectorAll("input[type='checkbox'], input[type='radio']");
            inputs.forEach(input => {
                const label = input.closest("label") ? input.closest("label").innerText : input.name;
                const statusDiv = document.createElement("div");
                statusDiv.textContent = `${label}: ${input.checked ? "Checked" : "Unchecked"}`;
                Object.assign(statusDiv.style, {
                    margin: "5px 0",
                    padding: "6px",
                    border: "1px solid #ccc",
                    backgroundColor: "#f3f3f3",
                    fontFamily: "Arial, sans-serif",
                    fontSize: "14px",
                });
                input.replaceWith(statusDiv);
            });

            await new Promise(resolve => setTimeout(resolve, 300));

            const scale = 3;
            const canvas = await html2canvas(clonedForm, {
                scale: scale,
                useCORS: true,
                backgroundColor: "#ffffff",
                width: clonedForm.scrollWidth,
                height: clonedForm.scrollHeight,
            });

            document.body.removeChild(clonedForm);

            const imgData = canvas.toDataURL("image/jpeg", 1.0);
            const pdf = new jsPDF("p", "mm", "a4");

            const pdfWidth = pdf.internal.pageSize.getWidth();
            const pdfHeight = (canvas.height * pdfWidth) / canvas.width;

            pdf.addImage(imgData, "JPEG", 0, 0, pdfWidth, pdfHeight);
            pdf.save("candidate_feedback.pdf");
        } catch (error) {
            console.error("Error generating PDF:", error);
            showToast("Failed to generate PDF.", "error");
        }
    };

    const getStatusStyle = (status) => {
        if (!status) return {};
        
        const lowerStatus = status.toLowerCase();
        if (lowerStatus.includes("shortlisted")) {
            return { backgroundColor: "lightgreen" };
        } else if (lowerStatus.includes("rejected")) {
            return { backgroundColor: "lightcoral" };
        } else if (lowerStatus.includes("skipped")) {
            return { backgroundColor: "#f0f0f0" };
        } else if (lowerStatus.includes("waiting")) {
            return { backgroundColor: "#fffacd" };
        }
        return {};
    };

    return (
        <div className="final-feedback-container">
            <div id="toast" className={`toast ${toast.show ? 'show' : ''} ${toast.type}`}>
                {toast.message}
            </div>

            {isLoading && (
                <div className="loading-overlay">
                    <div className="loading-spinner"></div>
                    <p>Loading candidate data...</p>
                </div>
            )}

            <div id="form-to-download" className="form-container">
                <center>
                    <h1><strong>Final Feedback</strong></h1>
                </center>
                
                <button
                    onClick={downloadFormAsPDF}
                    title="Download PDF"
                    className="download-btn"
                    disabled={isLoading}
                >
                    <BiDownload /> Download
                </button>

                <div className="email-selector">
                    <select
                        id="candidate-email-dropdown"
                        className="styled-input"
                        value={candidateEmail}
                        onChange={handleEmailChange}
                        disabled={isLoading}
                    >
                        <option value="">Select Candidate Email</option>
                        {candidateEmails.map(email => (
                            <option key={email} value={email}>{email}</option>
                        ))}
                    </select>
                </div>
                <br />

                {/* Candidate Details */}
                <div className="candidate-details-section">
                    <table className="candidate-details-table">
                        <tbody>
                            <tr>
                                <td className="header-cell">RRF ID</td>
                                <td><input type="text" id="rrf-id" value={formData.rrfId} readOnly /></td>
                            </tr>
                            <tr>
                                <td className="header-cell">Account</td>
                                <td><input type="text" id="account" value={formData.account} readOnly /></td>
                            </tr>
                            <tr>
                                <td className="header-cell">Job Designation</td>
                                <td><input type="text" id="position" value={formData.position} readOnly /></td>
                            </tr>
                            <tr>
                                <td className="header-cell">Name of the Candidate</td>
                                <td><input type="text" id="candidate-name" value={formData.candidateName} readOnly /></td>
                            </tr>
                            <tr>
                                <td className="header-cell">Date of Interview</td>
                                <td><input type="text" id="interview-date" value={formData.interviewDate} readOnly /></td>
                            </tr>
                            <tr hidden>
                                <td className="header-cell">L2 Interview Panel</td>
                                <td><input type="text" id="interviewer-name" value={formData.interviewerName} readOnly /></td>
                            </tr>
                            <tr hidden>
                                <td className="header-cell">HR Interview Panel</td>
                                <td><input type="text" id="interviewer-name" value={formData.interviewerName} readOnly /></td>
                            </tr>
                            <tr>
                                <td className="header-cell">TAG Team Member</td>
                                <td><input type="text" id="hr-email" value={formData.hrEmail} readOnly /></td>
                            </tr>
                        </tbody>
                    </table>
                </div>

                {/* Feedback Table */}
                <table className="feedback-table" border="1" cellPadding="10" cellSpacing="0">
                    <thead>
                        <tr>
                            <th></th>
                            <th>Panel Member</th>
                            <th>Final Rating</th>
                            <th>Feedback</th>
                        </tr>
                    </thead>
                    <tbody>
                        {/* Prescreening */}
                        {!hiddenRows.includes('prescreening-summary') && (
                            <tr>
                                <td className="header-cell">Prescreening</td>
                                <td><input type="text" id="prescreening-feedback" value={formData.prescreeningFeedback} readOnly /></td>
                                <td><input type="text" id="prescreening-status" value={formData.prescreeningStatus} readOnly style={getStatusStyle(formData.prescreeningStatus)} /></td>
                                <td className="feedback-cell">
                                    <textarea id="prescreening-summary" value={formData.prescreeningSummary} readOnly />
                                    <button className="maximize-btn" type="button" onClick={() => maximizeTextarea('prescreening-summary')}>🗖</button>
                                </td>
                            </tr>
                        )}

                        {/* iMocha */}
                        <tr>
                            <td className="header-cell">L1 or iMocha</td>
                            <td><input type="text" id="hr-email" value={formData.hrEmail} readOnly /></td>
                            <td><input type="text" id="imocha-status" value={formData.imochaStatus} readOnly style={getStatusStyle(formData.imochaStatus)} /></td>
                            <td><input type="text" id="imocha-score" value={formData.imochaScore} readOnly /></td>
                        </tr>

                        {/* L2 Technical */}
                        {!hiddenRows.includes('l2-technical-feedback') && (
                            <tr>
                                <td className="header-cell">L2 Technical</td>
                                <td><input type="text" id="l2-technical-summary" value={formData.l2TechnicalSummary} readOnly /></td>
                                <td><input type="text" id="l2-technical-result" value={formData.l2TechnicalResult} readOnly style={getStatusStyle(formData.l2TechnicalResult)} /></td>
                                <td className="feedback-cell">
                                    <textarea id="l2-technical-feedback" value={formData.l2TechnicalFeedback} readOnly />
                                    <button className="maximize-btn" type="button" onClick={() => maximizeTextarea('l2-technical-feedback')}>🗖</button>
                                </td>
                            </tr>
                        )}

                        {/* EC Fitment */}
                        {!hiddenRows.includes('ec-fitment-feedback') && (
                            <tr>
                                <td className="header-cell">EC Fitment</td>
                                <td><input type="text" id="ec-fitment-summary" value={formData.ecFitmentSummary} readOnly /></td>
                                <td><input type="text" id="ec-fitment-result" value={formData.ecFitmentResult} readOnly style={getStatusStyle(formData.ecFitmentResult)} /></td>
                                <td className="feedback-cell">
                                    <textarea id="ec-fitment-feedback" value={formData.ecFitmentFeedback} readOnly />
                                    <button className="maximize-btn" type="button" onClick={() => maximizeTextarea('ec-fitment-feedback')}>🗖</button>
                                </td>
                            </tr>
                        )}

                        {/* Project Fitment */}
                        {!hiddenRows.includes('project-fitment-feedback') && (
                            <tr>
                                <td className="header-cell">Project Fitment</td>
                                <td><input type="text" id="project-fitment-summary" value={formData.projectFitmentSummary} readOnly /></td>
                                <td><input type="text" id="project-fitment-result" value={formData.projectFitmentResult} readOnly style={getStatusStyle(formData.projectFitmentResult)} /></td>
                                <td className="feedback-cell">
                                    <textarea id="project-fitment-feedback" value={formData.projectFitmentFeedback} readOnly />
                                    <button className="maximize-btn" type="button" onClick={() => maximizeTextarea('project-fitment-feedback')}>🗖</button>
                                </td>
                            </tr>
                        )}

                        {/* Client Fitment */}
                        {!hiddenRows.includes('client-fitment-feedback') && (
                            <tr>
                                <td className="header-cell">Client Fitment</td>
                                <td><input type="text" id="client-fitment-summary" value={formData.clientFitmentSummary} readOnly /></td>
                                <td><input type="text" id="client-fitment-result" value={formData.clientFitmentResult} readOnly style={getStatusStyle(formData.clientFitmentResult)} /></td>
                                <td className="feedback-cell">
                                    <textarea id="client-fitment-feedback" value={formData.clientFitmentFeedback} readOnly />
                                    <button className="maximize-btn" type="button" onClick={() => maximizeTextarea('client-fitment-feedback')}>🗖</button>
                                </td>
                            </tr>
                        )}

                        {/* Fitment */}
                        {!hiddenRows.includes('fitment-feedback') && (
                            <tr>
                                <td className="header-cell">Fitment</td>
                                <td><input type="text" id="fitment-summary" value={formData.fitmentSummary} readOnly /></td>
                                <td><input type="text" id="fitment-result" value={formData.fitmentResult} readOnly style={getStatusStyle(formData.fitmentResult)} /></td>
                                <td className="feedback-cell">
                                    <textarea id="fitment-feedback" value={formData.fitmentFeedback} readOnly />
                                    <button className="maximize-btn" type="button" onClick={() => maximizeTextarea('fitment-feedback')}>🗖</button>
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default FinalFeedback;
