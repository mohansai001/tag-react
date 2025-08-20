// feedbackform.js
import React, { useEffect, useState } from 'react';
import { PublicClientApplication } from '@azure/msal-browser';
import html2pdf from 'html2pdf.js';
import './feedback.css';

const FeedbackForm = () => {
    const [formData, setFormData] = useState({
        rrfId: '',
        position: '',
        candidateName: '',
        interviewDate: '',
        interviewerName: '',
        hrEmail: '',
        detailedFeedback: '',
        result: ''
    });
    const [candidateEmail, setCandidateEmail] = useState('');
    const [roundDetails, setRoundDetails] = useState('');
    const [imochaScore, setImochaScore] = useState('N/A');
    const [toast, setToast] = useState({ show: false, message: '', type: '' });
    const [msalInstance, setMsalInstance] = useState(null);

    useEffect(() => {
        const initializeMsal = async () => {
            const config = {
                auth: {
                    clientId: "ed0b1bf7-b012-4e13-a526-b696932c0673",
                    authority: "https://login.microsoftonline.com/13085c86-4bcb-460a-a6f0-b373421c6323",
                    redirectUri: "http://localhost:3000",
                }
            };
            
            const pca = new PublicClientApplication(config);
            try {
                await pca.initialize();
                setMsalInstance(pca);
            } catch (error) {
                console.error("MSAL initialization failed:", error);
                showToast("Failed to initialize authentication", "error");
            }
        };

        initializeMsal();

        const queryParams = new URLSearchParams(window.location.search);
        const candidateEmailParam = queryParams.get('candidateEmail');
        const roundDetailsParam = queryParams.get('roundDetails');

        if (candidateEmailParam && roundDetailsParam) {
            setCandidateEmail(candidateEmailParam);
            setRoundDetails(roundDetailsParam);

            fetch(`https://demotag.vercel.app/api/get-feedbackform?candidateEmail=${candidateEmailParam}&roundDetails=${roundDetailsParam}`)
                .then(response => response.json())
                .then(data => {
                    if (data.error) {
                        fetch(`https://demotag.vercel.app/api/getCandidateData?candidateEmail=${candidateEmailParam}`)
                            .then(response => response.json())
                            .then(candidateData => {
                                if (candidateData.error) {
                                    showToast(candidateData.error, "error");
                                } else {
                                    setFormData(prev => ({
                                        ...prev,
                                        candidateName: candidateData.candidate_name,
                                        position: candidateData.role,
                                        interviewerName: candidateData.panel_name,
                                        interviewDate: candidateData.l_2_interviewdate,
                                        rrfId: candidateData.rrf_id,
                                        hrEmail: candidateData.hr_email
                                    }));
                                    setImochaScore(candidateData.l_1_score || 'N/A');
                                }
                            })
                            .catch(error => {
                                console.error('Error fetching candidate data:', error);
                                showToast("Failed to load candidate data.", "error");
                            });
                    } else {
                        setFormData(prev => ({
                            ...prev,
                            candidateName: data.candidate_name || '',
                            position: data.position || '',
                            interviewerName: data.interviewer_name || '',
                            interviewDate: data.interview_date || '',
                            rrfId: data.rrf_id || '',
                            hrEmail: data.hr_email || '',
                            detailedFeedback: data.detailed_feedback || '',
                            result: data.result || ''
                        }));
                        setImochaScore(data.imocha_score || 'N/A');
                    }
                })
                .catch(error => {
                    console.error('Error fetching feedback data:', error);
                    showToast("Failed to load feedback data.", "error");
                });
        } else {
            showToast("Candidate email or round details missing.", "error");
        }
    }, []);

    const showToast = (message, type = 'success') => {
        setToast({ show: true, message, type });
        setTimeout(() => {
            setToast({ show: false, message: '', type: '' });
        }, 3000);
    };

    const handleInputChange = (e) => {
        const { id, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [id]: value
        }));
    };

    const sendEmailWithPDF = async (hrEmail, roundDetails) => {
        if (!msalInstance) {
            showToast("Authentication not initialized", "error");
            return;
        }

        try {
            let account = msalInstance.getAllAccounts()[0];

            if (!account) {
                console.log("No active account found. Attempting to log in...");
                await msalInstance.loginPopup({ scopes: ["Mail.Send"] });
                account = msalInstance.getAllAccounts()[0];

                if (!account) {
                    showToast("Login required to send email", "error");
                    return;
                }
            }

            msalInstance.setActiveAccount(account);

            const request = {
                account: account,
                scopes: ["Mail.Send"]
            };

            const response = await msalInstance.acquireTokenSilent(request);
            const accessToken = response.accessToken;

            if (!accessToken) {
                showToast("Failed to get access token", "error");
                return;
            }

            const formContainer = document.querySelector('.form-container');
            const pdfBlob = await html2pdf().from(formContainer).outputPdf("blob");

            const reader = new FileReader();
            reader.readAsDataURL(pdfBlob);
            reader.onloadend = async function () {
                const base64PDF = reader.result.split(',')[1];

                const emailData = {
                    message: {
                        subject: `Interview Feedback - ${roundDetails}`,
                        body: {
                            contentType: "Text",
                            content: "Please find the attached interview feedback form."
                        },
                        toRecipients: [{ emailAddress: { address: hrEmail } }],
                        attachments: [
                            {
                                "@odata.type": "#microsoft.graph.fileAttachment",
                                name: "Interview_Feedback_Form.pdf",
                                contentBytes: base64PDF
                            }
                        ]
                    },
                    saveToSentItems: "true"
                };

                const emailResponse = await fetch("https://graph.microsoft.com/v1.0/me/sendMail", {
                    method: "POST",
                    headers: {
                        "Authorization": `Bearer ${accessToken}`,
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify(emailData)
                });

                if (emailResponse.ok) {
                    showToast("Email sent successfully", "success");
                } else {
                    const errorData = await emailResponse.json();
                    console.error("Error sending email:", errorData);
                    showToast("Failed to send email", "error");
                }
            };
        } catch (error) {
            console.error("Error:", error);
            showToast("Error sending email", "error");
        }
    };

    const handleSubmit = async () => {
        const { 
            rrfId, position, candidateName, interviewDate, interviewerName, hrEmail, 
            detailedFeedback, result
        } = formData;

        if (!detailedFeedback || !result) {
            showToast('Please fill all required fields', 'error');
            return;
        }

        const submissionData = {
            candidateEmail,
            imochaScore,
            rrfId,
            position,
            candidateName,
            interviewDate,
            interviewerName,
            hrEmail,
            detailedFeedback,
            result
        };

        try {
            const response = await fetch('https://demotag.vercel.app/api/submitFeedback', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ formData: submissionData, roundDetails })
            });
            const data = await response.json();

            if (data.success) {
                showToast('Feedback submitted successfully', 'success');
                await sendEmailWithPDF(hrEmail, roundDetails);

                setTimeout(() => {
                    if (window.opener) {
                        window.close();
                    } else if (window.parent && window.parent.closeFeedbackModal) {
                        window.parent.closeFeedbackModal();
                    } else {
                        window.location.href = `feedbackform.html?success=true&candidateEmail=${encodeURIComponent(candidateEmail)}&position=${encodeURIComponent(position)}`;
                    }
                }, 1500);
            } else {
                showToast('Error submitting feedback', 'error');
            }
        } catch (error) {
            console.error('Error:', error);
            showToast('Error submitting feedback', 'error');
        }
    };

    return (
        <div>
            <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css" />
            <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700&display=swap" rel="stylesheet" />

            <div id="toast" className={`toast ${toast.show ? 'show' : ''} ${toast.type}`} style={{ display: toast.show ? 'block' : 'none' }}>
                {toast.message}
            </div>

            <div className="form-container" id="form-container">
                <div style={{ color: '#000000' }}>
                    <p>Round Details: <span id="round-details">{roundDetails}</span></p>
                    <p>Email: <span id="candidate-email">{candidateEmail}</span></p>
                    <p>iMocha Score: <span id="imocha-score">{imochaScore}</span></p>
                </div>
                <br />
                
                <div style={{ maxWidth: '50%' }}>
                    <table>
                        <tbody>
                            <tr>
                                <td className="details">RRF ID</td>
                                <td><input type="text" id="rrf-id" placeholder="" value={formData.rrfId} onChange={handleInputChange} /></td>
                            </tr>
                            <tr>
                                <td className="details">Job Designation</td>
                                <td><input type="text" id="position" placeholder="" value={formData.position} readOnly /></td>
                            </tr>
                            <tr>
                                <td className="details">Name of the Candidate</td>
                                <td><input type="text" id="candidate-name" placeholder="" value={formData.candidateName} readOnly /></td>
                            </tr>
                            <tr>
                                <td className="details">Date of Interview</td>
                                <td><input type="text" id="interview-date" value={formData.interviewDate} readOnly /></td>
                            </tr>
                            <tr>
                                <td className="details">Interviewer Mail</td>
                                <td><input type="text" id="interviewer-name" placeholder="" value={formData.interviewerName} readOnly /></td>
                            </tr>
                            <tr>
                                <td className="details">TAG Team Member</td>
                                <td><input type="text" id="hr-email" placeholder="" value={formData.hrEmail} readOnly /></td>
                            </tr>
                        </tbody>
                    </table>
                </div>

                <div className="feedback-section">
                    <label htmlFor="detailed-feedback">Detailed Feedback: *</label>
                    <textarea 
                        id="detailedFeedback" 
                        className="feedback-section-text"
                        placeholder="Enter your detailed feedback here..." 
                        required
                        value={formData.detailedFeedback}
                        onChange={handleInputChange}
                    />
                </div>

                <div className="result-section">
                    <label htmlFor="result">Shortlisted for next round</label>
                    <select 
                        id="result" 
                        className="result-select" 
                        required
                        value={formData.result}
                        onChange={handleInputChange}
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
                            borderRadius: '5px'
                        }}
                        onClick={handleSubmit}
                    >
                        Submit
                    </button>
                </div>
            </div>
        </div>
    );
};

export default FeedbackForm;
