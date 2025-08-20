import React, { useEffect, useState } from 'react';
import { PublicClientApplication } from '@azure/msal-browser';
import './candidates.css';
import SidebarDrawer from '../common/components/SidebarDrawer';


const sidebarItems = [
  { name: "Dashboard", icon: "DashboardIcon", path: "/dashboard" },
  { name: "Recruit", icon: "GroupIcon", path: "/apprecruit" },
  { name: "RRF Tracking", icon: "AssignmentIcon", path: "/rrf-tracking" },
  { name: "GT's Prescreening", icon: "ListAltIcon", path: "/gt-prescreening" },
  { name: "Logout", icon: "LogoutIcon", action: "logout" }
];





const Candidates = () => {
  const [sidebarVisible, setSidebarVisible] = useState(false);
  const [modalActive, setModalActive] = useState(false);
  const [overlayActive, setOverlayActive] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [toastType, setToastType] = useState('success');
  const [showToast, setShowToast] = useState(false);
  const [showFeedbackPopup, setShowFeedbackPopup] = useState(false);
  const [feedbackEmail, setFeedbackEmail] = useState('');
  const [candidates, setCandidates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedDomain, setSelectedDomain] = useState('');
  const [panelEmails, setPanelEmails] = useState([]);
  const [selectedPanel, setSelectedPanel] = useState('');
  const [selectedDateTime, setSelectedDateTime] = useState('');
  const [selectedCandidate, setSelectedCandidate] = useState(null);
  const [nextRound, setNextRound] = useState('');
  const [msalInstance, setMsalInstance] = useState(null);
  const [schedulingLoading, setSchedulingLoading] = useState(false);

  const msalConfig = {
    auth: {
      clientId: "ed0b1bf7-b012-4e13-a526-b696932c0673",
      authority: "https://login.microsoftonline.com/13085c86-4bcb-460a-a6f0-b373421c6323",
      redirectUri: "http://localhost:3000",
    },
  };

  const loggedInUserEmail = localStorage.getItem("userEmail");

  useEffect(() => {
    const initializeMsal = async () => {
      const instance = new PublicClientApplication(msalConfig);
      try {
        await instance.initialize();
        setMsalInstance(instance);
      } catch (error) {
        console.error("MSAL initialization error:", error);
      }
    };
    
    initializeMsal();
    fetchCandidatesInfo();
  }, []);

  useEffect(() => {
    if (selectedDomain) {
      fetchPanelEmails(selectedDomain);
    }
  }, [selectedDomain]);

  const fetchNextRound = async (rrf_id, recruitment_phase) => {
    try {
      if (recruitment_phase === "Moved to L2" || recruitment_phase === "No iMocha Exam") {
        return "L2 Technical";
      }

      const response = await fetch(
        `https://demotag.vercel.app/api/get-next-round?rrf_id=${rrf_id}&recruitment_phase=${encodeURIComponent(
          recruitment_phase
        )}`
      );
      
      if (!response.ok) {
        throw new Error(`Failed to fetch next round: ${response.statusText}`);
      }
      
      const data = await response.json();
      return data.nextRound;
    } catch (error) {
      console.error("Error fetching next round:", error);
      return null;
    }
  };

  // const navigateTo = (page) => {
  //   window.location.href = page;
  // };

  // const navigateToPage = () => {
  //   window.location.href = "Dashboard.html";
  // };

  const toggleSidebar = () => {
    setSidebarVisible(!sidebarVisible);
  };

  const closeFeedbackPopup = () => {
    setShowFeedbackPopup(false);
  };

  const fetchCandidatesInfo = async () => {
    setLoading(true);
    try {
      const response = await fetch("https://demotag.vercel.app/api/get-shortlisted-candidates");
      if (!response.ok) {
        throw new Error(`Failed to fetch data: ${response.statusText}`);
      }

      const data = await response.json();
      console.log("API Response:", data);

      const candidatesData = Array.isArray(data) ? data : data.candidates || [];
      const loggedInEmail = localStorage.getItem("userEmail");

      if (!loggedInEmail) {
        console.error("Login email not found in localStorage.");
        return;
      }

      const filteredCandidates = candidatesData.filter(
        (candidate) => candidate.hr_email?.toLowerCase() === loggedInEmail?.toLowerCase()
      );

      const candidatesWithNextRound = await Promise.all(
        filteredCandidates.map(async (candidate) => {
          const nextRound = await fetchNextRound(candidate.rrf_id, candidate.recruitment_phase);
          return { ...candidate, nextRound };
        })
      );

      setCandidates(candidatesWithNextRound);
      await sendEmailsForCompletedCandidates(candidatesWithNextRound);
    } catch (error) {
      console.error("Error fetching candidates:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleFeedbackButtonClick = (email) => {
    setFeedbackEmail(email);
    setShowFeedbackPopup(true);
  };

  const getCandidateEmailStatus = async (candidateEmail) => {
    try {
      const response = await fetch(
        `https://demotag.vercel.app/api/get-email-status?candidate_email=${encodeURIComponent(
          candidateEmail
        )}`
      );
      if (!response.ok) {
        throw new Error(`Failed to fetch email status for ${candidateEmail}`);
      }
      const data = await response.json();
      return data.status;
    } catch (error) {
      console.error(`Error fetching email status for ${candidateEmail}:`, error);
      return null;
    }
  };

  const updateEmailStatus = async (candidateEmail, status) => {
    try {
      const response = await fetch(
        "https://demotag.vercel.app/api/update-email-status",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ candidate_email: candidateEmail, status }),
        }
      );
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(`Failed to update email status: ${errorData.message}`);
      }
    } catch (error) {
      console.error(`Error updating email status for ${candidateEmail}:`, error);
      throw error;
    }
  };

  const sendEmailForCandidate = async (candidate) => {
    if (!candidate.imocha_report || !msalInstance) return;

    const emailStatus = await getCandidateEmailStatus(candidate.candidate_email);
    if (emailStatus === "emailsent") {
      console.log(
        `Email already sent for candidate ${candidate.candidate_name} (${candidate.candidate_email}). Skipping email.`
      );
      return;
    }

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
    const accessToken = tokenResponse.accessToken;

    const emailData = {
      message: {
        subject: `iMocha Assessment Completed: RRFID-${candidate.rrf_id} | Role: ${candidate.role} | Candidate: ${candidate.candidate_name}`,
        body: {
          contentType: "HTML",
          content: `
            <h3>Candidate iMocha Test Completed</h3>
            <p><strong>Name:</strong> ${candidate.candidate_name}</p>
            <p><strong>Email:</strong> ${candidate.candidate_email}</p>
            <p><strong>Phone:</strong> ${candidate.candidate_phone}</p>
            <p><strong>Role:</strong> ${candidate.role}</p>
            <p><strong>Score:</strong> ${candidate.score || "N/A"}</p>
            <p><strong>Status:</strong> ${candidate.l_1_status}</p>
            <p><strong>Recruitment Phase:</strong> ${candidate.recruitment_phase}</p>
            <p><strong>PDF Report:</strong> <a href="${candidate.imocha_report}" target="_blank">View Report</a></p>
            <p>Sent from: ${loggedInUserEmail}</p>
          `,
        },
        toRecipients: [
          {
            emailAddress: {
              address: candidate.hr_email,
            },
          },
        ],
      },
      saveToSentItems: "true",
    };

    const response = await fetch("https://graph.microsoft.com/v1.0/me/sendMail", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(emailData),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(`Error sending email: ${errorData.error.message}`);
    }
    console.log(
      `Email sent for candidate ${candidate.candidate_name} to ${candidate.hr_email}`
    );

    try {
      await updateEmailStatus(candidate.candidate_email, "emailsent");
      console.log(
        `Email status updated to 'emailsent' for candidate ${candidate.candidate_name}`
      );
    } catch (updateError) {
      console.error(
        `Failed to update email status for candidate ${candidate.candidate_name}:`,
        updateError
      );
    }
  };

  const sendEmailsForCompletedCandidates = async (candidates) => {
    for (const candidate of candidates) {
      try {
        await sendEmailForCandidate(candidate);
      } catch (error) {
        console.error(
          `Error sending email for candidate ${candidate.candidate_name}:`,
          error
        );
      }
    }
  };

  const filterCandidates = () => {
    const searchInput = document.getElementById("search-input").value.toLowerCase();
    const filterStatus = document.getElementById("filter-status").value;
    const candidates = document.querySelectorAll(".candidate");

    candidates.forEach((candidate) => {
      const name = candidate.cells[0].innerText.toLowerCase();
      const email = candidate.cells[1].innerText.toLowerCase();
      const status = candidate.getAttribute("data-status");
      const matchSearch = name.includes(searchInput) || email.includes(searchInput);
      const matchStatus = filterStatus === "all" || filterStatus === status;

      if (matchSearch && matchStatus) {
        candidate.style.display = "";
      } else {
        candidate.style.display = "none";
      }
    });
  };

  const handleScheduleClick = async (candidate, nextRoundText) => {
    try {
      setSelectedCandidate(candidate);
      setNextRound(nextRoundText);
      setModalActive(true);
      setOverlayActive(true);
    } catch (error) {
      console.error("Error in handleScheduleClick:", error);
    }
  };

  const scheduleInterview = async () => {
    if (!msalInstance) {
      console.error("MSAL instance not initialized");
      setToastMessage("Authentication system not ready. Please try again.");
      setToastType("error");
      setShowToast(true);
      return;
    }

    setSchedulingLoading(true);

    try {
      const candidate = selectedCandidate;
      const candidate_name = candidate.candidate_name;
      const hr_email = candidate.hr_email;
      const candidateEmail = candidate.candidate_email;
      const panelEmail = selectedPanel;
      const dateTime = selectedDateTime;
      const nextRoundText = nextRound;

      const date = new Date(dateTime);
      const startDateTime = date.toISOString();
      const endDateTime = new Date(date.getTime() + 30 * 60 * 1000).toISOString();

      const tokenRequest = {
        scopes: ["OnlineMeetings.ReadWrite", "Calendars.ReadWrite"],
        account: msalInstance.getAllAccounts()[0],
      };

      let tokenResponse;
      try {
        tokenResponse = await msalInstance.acquireTokenSilent(tokenRequest);
      } catch (silentError) {
        console.warn("Silent token acquisition failed; trying popup.", silentError);
        tokenResponse = await msalInstance.acquireTokenPopup(tokenRequest);
      }
 
      const accessToken = tokenResponse.accessToken;

      const meetingRequest = {
        startDateTime,
        endDateTime,
        subject: `${nextRoundText}: ${candidate_name}`,
        participants: {
          organizer: { upn: hr_email },
          attendees: [
            { upn: candidateEmail, role: "attendee" },
            { upn: panelEmail, role: "attendee" },
          ],
        },
      };

      const meetingResponse = await fetch(
        "https://graph.microsoft.com/v1.0/me/onlineMeetings",
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${accessToken}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify(meetingRequest),
        }
      );

      if (!meetingResponse.ok) {
        throw new Error("Failed to create Teams meeting");
      }

      const meetingData = await meetingResponse.json();
      const meetingLink = meetingData.joinWebUrl;

      const eventRequest = {
        subject: `${nextRoundText}: ${candidate_name}`,
        start: { dateTime: startDateTime, timeZone: "UTC" },
        end: { dateTime: endDateTime, timeZone: "UTC" },
        location: { displayName: "Microsoft Teams Meeting" },
        attendees: [
          {
            emailAddress: { address: candidateEmail, name: candidate_name },
            type: "required",
          },
          {
            emailAddress: { address: panelEmail, name: "Panel Member" },
            type: "required",
          },
        ],
        isOnlineMeeting: true,
        onlineMeetingProvider: "teamsForBusiness",
        onlineMeeting: { joinUrl: meetingLink },
        body: {
          contentType: "HTML",
          content: `
            <p>Dear ${candidate_name},</p>
            <p>You have been scheduled for your <b>${nextRoundText}</b>.</p>
            <p><b>Interview Details:</b></p>
            <ul>
              <li><b>Date & Time:</b> ${date.toUTCString()}</li>
              <li><b>Panel Member:</b> ${panelEmail}</li>
              <li><b>Meeting Link:</b> <a href="${meetingLink}">${meetingLink}</a></li>
            </ul>
            <p>Please ensure you join on time and have a stable internet connection.</p>
            <p>Best Regards,</p>
            <p><b>TAG Assist Team</b></p>
          `,
        },
      };

      const calendarResponse = await fetch(
        "https://graph.microsoft.com/v1.0/me/events",
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${accessToken}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify(eventRequest),
        }
      );

      if (!calendarResponse.ok) {
        throw new Error("Failed to create calendar event");
      }

      console.log('Updating candidate status:', {
        email: candidateEmail,
        status: `${nextRoundText.trim()} Round Scheduled`,
        panel: panelEmail,
        dateTime: startDateTime,
        meetingLink,
      });

      const statusUpdateResponse = await fetch("https://demotag.vercel.app/api/update-status", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: candidateEmail,
          status: `${nextRoundText.trim()} Round Scheduled`,
          panel: panelEmail,
          dateTime: startDateTime,
          meetingLink,
        }),
      });

      if (!statusUpdateResponse.ok) {
        const errorData = await statusUpdateResponse.json();
        console.error('Status update failed:', errorData);
        throw new Error(`Failed to update candidate status: ${errorData.message || statusUpdateResponse.statusText}`);
      }

      const statusUpdateData = await statusUpdateResponse.json();
      console.log('Status update successful:', statusUpdateData);

      setToastMessage(`Interview for ${candidate_name} scheduled successfully! Meeting link sent to ${candidateEmail} and ${panelEmail}.`);
      setToastType("success");
      setShowToast(true);

      setTimeout(() => {
        setModalActive(false);
        setOverlayActive(false);
        // Refresh the candidates data instead of reloading the page
        fetchCandidatesInfo();
      }, 3000);
    } catch (error) {
      console.error("Error scheduling Teams meeting:", error);
      setToastMessage("Error scheduling interview: " + error.message);
      setToastType("error");
      setShowToast(true);
    } finally {
      setSchedulingLoading(false);
    }
  };

  const closeModal = () => {
    setModalActive(false);
    setOverlayActive(false);
  };

  const fetchPanelEmails = (domain) => {
    fetch(`https://demotag.vercel.app/api/get-panel-emails?domain=${domain}`)
      .then((response) => response.json())
      .then((data) => {
        if (Array.isArray(data) && data.length > 0) {
          setPanelEmails(data);
        } else {
          setPanelEmails(["No panels available for this domain"]);
        }
      })
      .catch((error) => {
        console.error("Error fetching panel emails:", error);
      });
  };

  const handleDateRangeSubmit = async (event) => {
    event.preventDefault();

    const startDate = document.getElementById("startDate").value;
    const endDate = document.getElementById("endDate").value;
    const selectedEC = document.getElementById("ecCategory").value;

    if (!startDate || !endDate || !selectedEC) {
      setToastMessage("Please select all required fields.");
      setToastType("error");
      setShowToast(true);
      return;
    }

    document.getElementById("statusMessage").innerText = "Processing, please wait...";

    const apiUrl = `https://demotag.vercel.app/api/callTestAttempts/${selectedEC}`;

    try {
      const response = await fetch(apiUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ startDate, endDate }),
      });

      const data = await response.json();
      console.log("API Response:", data);
      document.getElementById("statusMessage").innerText = `Success: ${selectedEC} test attempts processed!`;
    } catch (error) {
      console.error("Error:", error);
      document.getElementById("statusMessage").innerText = "Error processing test attempts!";
    }
  };

  return (
    <div className="candidates-container">
      <div id="toast" className={`toast ${showToast ? 'show' : ''} ${toastType}`}>
        {toastMessage}
      </div>

      <button id="toggle-sidebar-btn" onClick={toggleSidebar}>☰Menu</button>

      {/* <div id="sidebar" className={`sidebar-menu ${sidebarVisible ? 'show' : ''}`}>
        <div className="sidebar-option active" data-target="dashboard" data-tooltip="Dashboard" onClick={() => navigateTo('Dashboard.html')}>
          <i className="fas fa-tachometer-alt"></i>
          <span>Dashboard</span>
        </div>
        <div className="sidebar-option" data-target="interviews" data-tooltip="Interviews" onClick={() => navigateTo('ECselection.html')}>
          <i className="fas fa-users"></i>
          <span>Recruit</span>
        </div>
        <div className="sidebar-option" data-target="candidateInfo" data-tooltip="candidateInfo" onClick={() => navigateTo('GTPrescreening.html')}>
          <i className="fas fa-tasks"></i>
          <span>GT's Prescreening</span>
        </div>
        <div className="sidebar-option" data-target="candidateProfile" data-tooltip="candidateProfile" onClick={() => navigateTo('candidatespage.html')}>
          <i className="fas fa-tasks"></i>
          <span>RRF Tracking</span>
        </div>
        <div className="sidebar-option logout-option" data-tooltip="Logout" onClick={() => navigateTo('index.html')}>
          <i className="fas fa-sign-out-alt"></i>
          <span>Logout</span>
        </div>
      </div> */}

      {/*Sidebar Drawer Component*/}
      <div className="SidebarDrawer" style={{marginTop:'20px'}}>
      <SidebarDrawer 
        menuItems={sidebarItems} />

        </div>



      {/* <div className="backbutton" onClick={navigateToPage}>
        <i className="fas fa-arrow-left"></i>
      </div> */}

      <div className="container">
        <header>
          <h1>RRF Tracking</h1>
          <div className="search-container">
            <input type="text" id="search-input" placeholder="Search by name" onChange={filterCandidates} />
            <button id="search-btn">
              <i className="fas fa-search"></i>
            </button>
          </div>
          <select id="filter-status" onChange={filterCandidates}>
            <option value="all">All</option>
            <option value="completed">Imocha Completed</option>
            <option value="not-completed">Imocha Pending</option>
          </select>
          <div style={{ marginTop: '10px' }}>
            <form id="dateRangeForm" onSubmit={handleDateRangeSubmit}>
              <div className='form-item'>
              <label htmlFor="startDate">Start Date:</label>
              <input type="date" id="startDate" name="startDate" required />
              </div>

              <div className='form-item'>
              <label htmlFor="endDate">End Date:</label>
              <input type="date" id="endDate" name="endDate" required />
              </div>

              
              <label htmlFor="ecCategory">Select EC Category:</label>
              <select id="ecCategory" name="ecCategory" required style={{ width: '18%' }}>
                <option value="">-- Select --</option>
                <option value="cloudEC">Cloud EC</option>
                <option value="dataEC">Data EC</option>
                <option value="appEC">App EC</option>
              </select>
              
              <button type="submit">Submit</button>
            </form>
            <p id="statusMessage"></p>
          </div>
        </header>

        <main>
          <div style={{  padding: '20px' }}>
            <table id="candidates-table">
              <thead>
                <tr>
                  <th>RRF ID</th>
                  <th>Name</th>
                  <th>Hr Email</th>
                  <th>Email</th>
                  <th>Mobile</th>
                  <th>Role</th>
                  <th>Test Score</th>
                  <th>Recruitment Phase</th>
                  <th>Imocha Due Date</th>
                  <th>Action</th>
                  <th>Feedback</th>
                </tr>
              </thead>
              <tbody>
                {candidates.length === 0 && !loading ? (
                  <tr>
                    <td colSpan="11" className="no-records-message" style={{ textAlign: 'center' }}>
                      No records available for your account.
                    </td>
                  </tr>
                ) : (
                  candidates.map((candidate) => {
                    const formattedDate = candidate.date
                      ? new Date(candidate.date).toISOString().split('T')[0]
                      : 'N/A';

                    const showPendingText = (!candidate.score || candidate.score === "N/A") &&
                      candidate.recruitment_phase === "Move to L1";

                    const isRejected = [
                      "Rejected in L1",
                      "Rejected in L2",
                      "Rejected in Client Fitment Round",
                      "Rejected in Project Fitment Round",
                      "Rejected in Fitment Round"
                    ].includes(candidate.recruitment_phase);

                    const isL2Technical = candidate.recruitment_phase === "Moved to L2" || 
                                         candidate.recruitment_phase === "No iMocha Exam";

                    return (
                      <tr key={candidate.rrf_id} className="candidate" data-status={
                        candidate.recruitment_phase === "Imocha Completed" ? "completed" : "not-completed"
                      }>
                        <td>{candidate.rrf_id}</td>
                        <td>{candidate.candidate_name}</td>
                        <td>{candidate.hr_email}</td>
                        <td>{candidate.candidate_email}</td>
                        <td>{candidate.candidate_phone}</td>
                        <td>{candidate.role}</td>
                        <td>{candidate.score || "N/A"}</td>
                        <td>{candidate.recruitment_phase}</td>
                        <td>{formattedDate}</td>
                        <td>
                          {showPendingText ? (
                            <span className="pending-text">Pending iMocha Exam</span>
                          ) : isRejected ? (
                            <span className="rejected-text">No Further Rounds</span>
                          ) : isL2Technical ? (
                            <button 
                              className="schedule-btn" 
                              onClick={() => handleScheduleClick(candidate, "L2 Technical")}
                              disabled={schedulingLoading}
                            >
                              Schedule L2 Technical
                            </button>
                          ) : candidate.nextRound ? (
                            <button 
                              className="schedule-btn" 
                              onClick={() => handleScheduleClick(candidate, candidate.nextRound)}
                              disabled={schedulingLoading}
                            >
                              Schedule {candidate.nextRound}
                            </button>
                          ) : (
                            <span className="no-next-round">Waiting For Feedback</span>
                          )}
                        </td>
                        <td>
                          <button 
                            className="feedbackButton" 
                            onClick={() => handleFeedbackButtonClick(candidate.candidate_email)}
                            disabled={schedulingLoading}
                          >
                            Feedback
                          </button>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </main>
      </div>

      {/* {loading && (
        <div id="loading-overlay">
          <div style={{
            left: '50%',
            border: '8px solid #f3f3f3',
            borderTop: '8px solid #3498db',
            borderRadius: '50%',
            width: '60px',
            height: '60px',
            animation: 'spin 1s linear infinite'
          }}></div>
          <span>Loading, please wait...</span>
        </div>
      )} */}

      <div className={`overlay ${overlayActive ? 'active' : ''}`} id="modal-overlay"></div>
      <div className={`modal ${modalActive ? 'active' : ''}`} id="schedule-modal">
        <div className="modal-header">Schedule Interview</div>
        <div className="modal-body">
          {schedulingLoading ? (
            <div className="scheduling-loading">
              <div className="spinner"></div>
              <p>Please wait, meeting is being scheduled...</p>
            </div>
          ) : (
            <>
              <div className="form-group">
                <label htmlFor="domain-select">Domain:</label>
                <select 
                  id="domain-select" 
                  value={selectedDomain} 
                  onChange={(e) => setSelectedDomain(e.target.value)}
                  disabled={schedulingLoading}
                >
                  <option value="">Select</option>
                  <option value="Cloud">Cloud</option>
                  <option value="App">App</option>
                  <option value="Data">Data</option>
                </select>
              </div>
              <div className="form-group">
                <label htmlFor="panel-select">Panel:</label>
                <select 
                  id="panel-select" 
                  value={selectedPanel} 
                  onChange={(e) => setSelectedPanel(e.target.value)}
                  disabled={schedulingLoading}
                >
                  <option value="">Select Panel</option>
                  {panelEmails.map((email, index) => (
                    <option key={index} value={email}>{email}</option>
                  ))}
                </select>
              </div>
              <div className="form-group">
                <label htmlFor="datetime-input">Date & Time:</label>
                <input 
                  type="datetime-local" 
                  id="datetime-input" 
                  value={selectedDateTime} 
                  onChange={(e) => setSelectedDateTime(e.target.value)}
                  disabled={schedulingLoading}
                />
              </div>
            </>
          )}
        </div>
        <div className="modal-footer">
          <button 
            className="btn" 
            id="schedule-btn" 
            onClick={scheduleInterview}
            disabled={schedulingLoading}
          >
            {schedulingLoading ? (
              <>
                <i className="fas fa-spinner fa-spin"></i> Scheduling...
              </>
            ) : (
              "Schedule"
            )}
          </button>
          <button 
            className="btn" 
            id="close-modal-btn" 
            onClick={closeModal}
            disabled={schedulingLoading}
          >
            Close
          </button>
        </div>
      </div>

      <div id="feedbackPopup" className="custom-modal" style={{ display: showFeedbackPopup ? 'block' : 'none' }}>
        <div className="custom-modal-content">
          <span className="custom-close" onClick={closeFeedbackPopup}>&times;</span>
          <iframe id="feedbackIframe" src={`/final-feedback?email=${encodeURIComponent(feedbackEmail)}`} style={{ width: '100%', height: '500px', border: 'none' }}></iframe>
        </div>
      </div>
    </div>
  );
};

export default Candidates;
