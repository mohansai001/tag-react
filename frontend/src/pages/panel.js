import React, { useState, useEffect } from 'react';
import './panel.css';

const Panel = () => {
  const [sidebarVisible, setSidebarVisible] = useState(false);
  const [currentMonth, setCurrentMonth] = useState(new Date().getMonth());
  const [currentYear, setCurrentYear] = useState(new Date().getFullYear());
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [meetings, setMeetings] = useState([]);
  const [feedbacks, setFeedbacks] = useState([]);
  const [feedbackWindows, setFeedbackWindows] = useState({});

  const monthNames = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];

  const roundDetailsMap = {
    "L2 Technical Round Scheduled": "L2 Technical",
    "Client Fitment Round Scheduled": "Client Fitment Round",
    "Project Fitment Round Scheduled": "Project Fitment Round",
    "Fitment Round Scheduled": "Fitment Round",
    "EC Fitment Round Scheduled": "EC Fitment Round",
  };

  useEffect(() => {
    loadCalendarAndFetchMeetings();
    window.addEventListener('message', handleMessage);
    return () => {
      window.removeEventListener('message', handleMessage);
    };
  }, []);

  const handleMessage = (event) => {
    if (event.data.action === "feedbackSubmitted") {
      const candidateEmail = event.data.candidateEmail;
      if (feedbackWindows[candidateEmail] && !feedbackWindows[candidateEmail].closed) {
        feedbackWindows[candidateEmail].close();
        const newFeedbackWindows = {...feedbackWindows};
        delete newFeedbackWindows[candidateEmail];
        setFeedbackWindows(newFeedbackWindows);
      }
      fetchMeetingsForSelectedDate(selectedDate);
    }
  };

  const logout = () => {
    window.location.href = "/";
  };

  const toggleSidebar = () => {
    setSidebarVisible(!sidebarVisible);
  };

  const loadCalendarAndFetchMeetings = () => {
    fetchMeetingsForSelectedDate(selectedDate);
  };


  const fetchMeetingsForSelectedDate = async (date) => {
    const userEmail = localStorage.getItem("userEmail");
    try {
      date.setHours(0, 0, 0, 0);
      const formattedSelectedDate = date.toLocaleDateString("en-CA");

      let candidatesData = [];
      let allFeedbacks = [];

      // Fetch shortlisted candidates (Meetings)
      try {
        const response = await fetch(
          // Fetch candidates for the selected date for panel login baesd on the login email and selected date

          `https://demotag.vercel.app/api/panel-candidates-info?l_2_interviewdate=${formattedSelectedDate}&userEmail=${userEmail}`
        );
        if (response.ok) {
          candidatesData = await response.json();
        }
      } catch (error) {
        console.error("Error fetching candidates:", error);
      }

      // Fetch feedback for the selected date
      try {
        const feedbackResponse = await fetch(
          // Fetch feedback for the selected date for panel login based on the login email and selected date
          `https://demotag.vercel.app/api/feedback-for-panel-member?interview_date=${formattedSelectedDate}&userEmail=${userEmail}`
        );
        if (feedbackResponse.ok) {
          const feedbacks = await feedbackResponse.json();
          allFeedbacks = [...allFeedbacks, ...feedbacks];
        }
      } catch (error) {
        console.error("Error fetching feedback:", error);
      }

      // Fetch feedback from the feedback-table API
      try {
        const feedbackTableResponse = await fetch(
          // Fetch feedback from all the existing feedback tables for the selected date and user email
          `https://demotag.vercel.app/api/feedback-table?interview_date=${formattedSelectedDate}&userEmail=${userEmail}`
        );
        if (feedbackTableResponse.ok) {
          const feedbackTableData = await feedbackTableResponse.json();
          allFeedbacks = [...allFeedbacks, ...feedbackTableData];
        }
      } catch (error) {
        console.error("Error fetching feedback from table:", error);
      }

      setMeetings(candidatesData);
      setFeedbacks(allFeedbacks);
    } catch (error) {
      console.error("Unexpected error:", error);
    }
  };

  const joinMeetingAndShowFeedback = (candidateEmail, recruitmentPhase, meetingLink) => {
    const roundDetails = roundDetailsMap[recruitmentPhase] || recruitmentPhase;
    openFeedbackForm(candidateEmail, roundDetails);
    window.open(meetingLink, "_blank");
  };

  const openFeedbackForm = async (candidateEmail, recruitmentPhase) => {
    try {
      // based on the EC category and recruitment phase, it will open the feedback form in a new window
      const response = await fetch("https://demotag.vercel.app/api/get-engcenter-select", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ candidateEmail }),
      });

      if (!response.ok) {
        throw new Error("Failed to fetch eng_center and position.");
      }

      const data = await response.json();
      const { eng_center, role } = data;
      const windowFeatures = "width=1000,height=800,top=100,left=100";

      const isL2Round = recruitmentPhase === "L2 Technical" || recruitmentPhase === "Shortlisted in L2";

      let newWindow;
      if (recruitmentPhase === "Project Fitment Round") {
        newWindow = window.open(
          `/project-fitment?candidateEmail=${encodeURIComponent(candidateEmail)}&roundDetails=${encodeURIComponent(recruitmentPhase)}`,
          `feedbackWindow_${candidateEmail}`,
          windowFeatures
        );
      } else if (recruitmentPhase === "EC Fitment Round") {
        newWindow = window.open(
          `/ec-fitment?candidateEmail=${encodeURIComponent(candidateEmail)}&roundDetails=${encodeURIComponent(recruitmentPhase)}`,
          `feedbackWindow_${candidateEmail}`,
          windowFeatures
        );
      }else if (eng_center === "App EC" && isL2Round) {
        newWindow = window.open(
          `/app-l2-technical?candidateEmail=${encodeURIComponent(candidateEmail)}&roundDetails=${encodeURIComponent(recruitmentPhase)}&position=${encodeURIComponent(role)}`,
          `feedbackWindow_${candidateEmail}`,
          windowFeatures
        );
      }
       else if (eng_center === "Cloud EC" && isL2Round) {
        newWindow = window.open(
          `L2-Technical.html?candidateEmail=${encodeURIComponent(candidateEmail)}&roundDetails=${encodeURIComponent(recruitmentPhase)}&position=${encodeURIComponent(role)}`,
          `feedbackWindow_${candidateEmail}`,
          windowFeatures
        );
      } else if (eng_center === "Data") {
        newWindow = window.open(
          `L2_Data_Technical.html?candidateEmail=${encodeURIComponent(candidateEmail)}&roundDetails=${encodeURIComponent(recruitmentPhase)}`,
          `feedbackWindow_${candidateEmail}`,
          windowFeatures
        );
      } else {
        newWindow = window.open(
          `/feedback-form?candidateEmail=${encodeURIComponent(candidateEmail)}&roundDetails=${encodeURIComponent(recruitmentPhase)}`,
          `feedbackWindow_${candidateEmail}`,
          windowFeatures
        );
      }

      setFeedbackWindows({
        ...feedbackWindows,
        [candidateEmail]: newWindow
      });
    } catch (error) {
      console.error("Error opening feedback form:", error);
      alert("Failed to open feedback form. Please try again.");
    }
  };

  const openPreviousFeedbacks = (email) => {
    const iframeUrl = `/final-feedback?email=${encodeURIComponent(email)}`;
    const popup = document.createElement("div");
    popup.className = "custom-feedback-popup";
    popup.innerHTML = `
      <div class="custom-popup-content">
        <button class="custom-close-btn" onclick="this.parentElement.parentElement.remove()">X</button>
        <iframe src="${iframeUrl}" width="100%" height="600px" style="border:none;"></iframe>
      </div>
    `;
    document.body.appendChild(popup);
  };

  const handleMonthChange = (e) => {
    setCurrentMonth(parseInt(e.target.value));
  };

  const handleYearChange = (e) => {
    setCurrentYear(parseInt(e.target.value));
  };

  const handlePrevMonth = () => {
    let newMonth = currentMonth - 1;
    let newYear = currentYear;
    if (newMonth < 0) {
      newMonth = 11;
      newYear--;
    }
    setCurrentMonth(newMonth);
    setCurrentYear(newYear);
  };

  const handleNextMonth = () => {
    let newMonth = currentMonth + 1;
    let newYear = currentYear;
    if (newMonth > 11) {
      newMonth = 0;
      newYear++;
    }
    setCurrentMonth(newMonth);
    setCurrentYear(newYear);
  };

  const handleDateClick = (day) => {
    const newSelectedDate = new Date(currentYear, currentMonth, day);
    setSelectedDate(newSelectedDate);
    fetchMeetingsForSelectedDate(newSelectedDate);
  };

  return (
    <div className="panel-container">
      <button id="toggle-sidebar-btn" onClick={toggleSidebar}>☰ Menu</button>
      <div className={`sidebar ${sidebarVisible ? 'show' : ''}`} id="sidebar">
        <ul>
          <li id="interviewsBtn">Interviews</li>
          <div style={{ flexGrow: 1 }}></div>
          <li onClick={logout}>Logout</li>
        </ul>
      </div>
      <div className="main-content">
        <div className="calendar-container" id="calendarContainer">
          <div className="calendar-header" id="calendarMonthYear">
            <button className="btn_prevnext" id="prevMonthBtn" onClick={handlePrevMonth}>&laquo;</button>
            <select id="monthSelector" value={currentMonth} onChange={handleMonthChange}>
              {monthNames.map((month, index) => (
                <option key={month} value={index}>{month}</option>
              ))}
            </select>
            <select id="yearSelector" value={currentYear} onChange={handleYearChange}>
              {Array.from({ length: 600 }, (_, i) => 1901 + i).map(year => (
                <option key={year} value={year}>{year}</option>
              ))}
            </select>
            <button className="btn_prevnext" id="nextMonthBtn" onClick={handleNextMonth}>&raquo;</button>
          </div>

          <div className="day-names">
            <div>Sun</div>
            <div>Mon</div>
            <div>Tue</div>
            <div>Wed</div>
            <div>Thu</div>
            <div>Fri</div>
            <div>Sat</div>
          </div>

          <div className="calendar-grid">
            {(() => {
              const firstDay = new Date(currentYear, currentMonth, 1);
              const firstDayIndex = firstDay.getDay();
              const lastDay = new Date(currentYear, currentMonth + 1, 0);
              const totalDaysInMonth = lastDay.getDate();
              const days = [];

              // Empty days from previous month
              for (let i = 0; i < firstDayIndex; i++) {
                days.push(<div key={`empty-${i}`} className="day other-month"></div>);
              }

              // Days of current month
              for (let day = 1; day <= totalDaysInMonth; day++) {
                const isActive = day === selectedDate.getDate() && 
                                currentMonth === selectedDate.getMonth() && 
                                currentYear === selectedDate.getFullYear();
                
                days.push(
                  <div 
                    key={`day-${day}`}
                    className={`day ${isActive ? 'selected' : ''}`}
                    onClick={() => handleDateClick(day)}
                  >
                    {day}
                  </div>
                );
              }

              return days;
            })()}
          </div>
        </div>

        <div className="meeting-section">
          <h3 className="meeting-date">
            {monthNames[currentMonth]} {selectedDate.getDate()}, {currentYear}
          </h3>
          <div id="meeting-container" style={{ color: '#666' }}>
            {meetings.length > 0 ? (
              meetings.map(candidate => {
                const formattedDate = new Date(candidate.l_2_interviewdate).toLocaleDateString("en-CA");
                const roundDetails = roundDetailsMap[candidate.recruitment_phase] || candidate.recruitment_phase || "L2 Technical";
                const hasImochaReport = candidate.imocha_report && candidate.imocha_report.trim() !== "" && candidate.imocha_report.toLowerCase() !== "null";

                return (
                  <div key={candidate.candidate_email} className="meeting-card">
                    <div className="meeting-header">
                      <div>
                        <h4 className="meeting-title">Meeting with - {candidate.candidate_name}</h4>
                      </div>
                    </div>
                    <div className="meeting-details">
                      <div className="meeting-info">
                        <div className="meeting-location">Interview Details: {roundDetails}</div>
                        <div className="meeting-location">Role: {candidate.role}</div>
                        <div className="meeting-location">Email: {candidate.candidate_email}</div>
                        <div className="meeting-location">🕐 {formattedDate}, {candidate.l_2_interviewtime}</div>
                      </div>
                      <button className="btn-teams" onClick={() => joinMeetingAndShowFeedback(candidate.candidate_email, candidate.recruitment_phase, candidate.meeting_link)}>
                        <img src="/assets/teams.svg" alt="Teams Logo" className="teams-logo" />
                        <a href={candidate.meeting_link} target="_blank" rel="noopener noreferrer" className="join-link">Join Meeting</a>
                      </button>
                    </div>
                    <div className="buttons">
                      <button className="btn btn-resume">
                        <a href={candidate.resume} target="_blank" rel="noopener noreferrer">Candidate Resume</a>
                      </button>
                      {hasImochaReport && (
                        <button className="btn btn-mocha">
                          <a href={candidate.imocha_report} target="_blank" rel="noopener noreferrer">iMocha Result</a>
                        </button>
                      )}
                      <button className="btn btn-feedback" onClick={() => openFeedbackForm(candidate.candidate_email, roundDetails)}>
                        Feedback Form
                      </button>
                      <button className="btn btn-previous-feedbacks" onClick={() => openPreviousFeedbacks(candidate.candidate_email)}>
                        Previous Feedbacks
                      </button>
                    </div>
                  </div>
                );
              })
            ) : (
              <p>No meetings scheduled for this date.</p>
            )}
          </div>
          <div id="feedback-container" style={{ color: '#666' }}>
            {feedbacks.map((feedback, index) => (
              <div key={`${feedback.candidate_email}-${index}`} className="feedback-card">
                <div className="feedback-header">
                  <h4 className="feedback-title">Feedback for - {feedback.candidate_name}</h4>
                </div>
                <div className="feedback-details">
                  <p><b>Position:</b> {feedback.position || "N/A"}</p>
                  <p><b>Interview Round:</b> {feedback.round_details || "L2 Technical"}</p>
                  <p><b>Email:</b> {feedback.candidate_email}</p>
                  <p><b>Result:</b> {feedback.result || "N/A"}</p>
                  <p><b>Submitted At:</b> {feedback.submitted_at ? new Date(feedback.submitted_at).toLocaleString() : "N/A"}</p>
                </div>
                <div className="buttons">
                  <button className="btn btn-feedback" onClick={() => openFeedbackForm(feedback.candidate_email, feedback.round_details || "L2 Technical")}>
                    Feedback Form
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div id="feedbackModal" className="modal">
        <div className="modal-content">
          <span className="close-btn" onClick={() => document.getElementById("feedbackModal").style.display = "none"}>&times;</span>
          <h2 style={{ color: 'black' }}>Feedback Form</h2>
          <iframe
            src=""
            id="feedbackFormIframe"
            width="100%"
            height="98%"
            title="Feedback Form"
          ></iframe>
        </div>
      </div>
    </div>
  );
};

export default Panel;
