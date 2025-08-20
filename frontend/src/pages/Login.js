import React, { useState, useEffect } from 'react';
import './Login.css';
import * as msal from '@azure/msal-browser';

const Login = () => {
  const [selectedTeam, setSelectedTeam] = useState('');
  const [adminUsername, setAdminUsername] = useState('');
  const [adminPassword, setAdminPassword] = useState('');
  const [modalMessage, setModalMessage] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [toastType, setToastType] = useState('success');
  const [showToast, setShowToast] = useState(false);
  const [msalInstance, setMsalInstance] = useState(null);
  const [isInitializing, setIsInitializing] = useState(true);

  // MSAL Configuration
  const msalConfig = {
    auth: {
      clientId: "ed0b1bf7-b012-4e13-a526-b696932c0673",
      authority: "https://login.microsoftonline.com/13085c86-4bcb-460a-a6f0-b373421c6323",
      redirectUri: "https://demotag.vercel.app",
    },
  };

  const loginRequest = {
    scopes: ["openid", "profile", "user.read", "Mail.Send"],
    prompt: "select_account"
  };

  useEffect(() => {
    // Initialize MSAL when component mounts
    const initializeMsal = async () => {
      const instance = new msal.PublicClientApplication(msalConfig);
      try {
        await instance.initialize();
        setMsalInstance(instance);
        setIsInitializing(false);
      } catch (error) {
        console.error("MSAL initialization failed:", error);
        showModalMessage("Authentication service failed to initialize. Please refresh the page.");
        setIsInitializing(false);
      }
    };

    initializeMsal();

    if (showToast) {
      const timer = setTimeout(() => {
        setShowToast(false);
      }, 4000);
      return () => clearTimeout(timer);
    }
  }, [showToast]);

  const handleTeamChange = (e) => {
    setSelectedTeam(e.target.value);
  };

  const showModalMessage = (message) => {
    setModalMessage(message);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
  };

  const showToastMessage = (message, type = "success") => {
    setToastMessage(message);
    setToastType(type);
    setShowToast(true);
  };

  const logLoginDetails = async (email, name) => {
    const now = new Date();
    const loginData = {
      email: email,
      name: name,
      date: now.toLocaleDateString("en-CA"),
      time: now.toTimeString().split(" ")[0],
    };

    try {
      const response = await fetch("/api/log-login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(loginData),
      });

      if (!response.ok) {
        console.error("Failed to log login details:", await response.text());
        return;
      }

      const responseData = await response.json();
      if (responseData.success && responseData.id) {
        localStorage.setItem("loggin-id", responseData.id);
        console.log("Login details logged successfully. ID:", responseData.id);
      }
    } catch (error) {
      console.error("Error sending login details to the server:", error);
    }
  };

  const handleAdminLogin = () => {
    if (adminUsername === "admin" && adminPassword === "admin") {
      window.location.href = "admin.html";
    } else {
      showToastMessage("Invalid username or password. Please try again.", "error");
    }
  };

  const handleLogin = async () => {
    if (!selectedTeam) {
      showModalMessage("Please select a team.");
      return;
    }

    if (selectedTeam === "admin-Login") {
      handleAdminLogin();
      return;
    }

    if (!msalInstance) {
      showModalMessage("Authentication service is not ready. Please try again later.");
      return;
    }

    try {
      // Clear any existing accounts first
      const accounts = msalInstance.getAllAccounts();
      if (accounts.length > 0) {
        msalInstance.setActiveAccount(accounts[0]);
      }
      
      const loginResponse = await msalInstance.loginPopup(loginRequest);
      const account = loginResponse.account;

      if (account) {
        const email = account.username;
        const name = account.name;
        localStorage.setItem("userEmail", email);
        console.log("Logged in email:", email);

        await logLoginDetails(email, name);

        showModalMessage(`Welcome, ${name}!`);

        if (selectedTeam === "panel") {
          window.location.href = `/panel`;
          return;
        }
//checks the admin table if the user is present or not
        const response = await fetch("https://demotag.vercel.app/api/check-admin", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email }),
        });

        if (!response.ok) {
          const errorData = await response.json();
          showModalMessage(errorData.error || "Error checking admin access.");
          return;
        }

        const { ec_mapping } = await response.json();
        localStorage.setItem("ec_mapping", ec_mapping);
        console.log("EC Mapping:", ec_mapping);

        if (["tag", "app-ec", "data-ec", "cloud-ec"].includes(selectedTeam)) {
          window.location.href = `/ec-selection?ec_mapping=${encodeURIComponent(ec_mapping)}`;
        }
      }
    } catch (error) {
      console.error("Login failed:", error);
      if (error.errorCode === "invalid_grant" || error.message.includes("AADSTS50076")) {
        showModalMessage("Multi-factor authentication is required. Please complete MFA setup with your administrator and try again.");
      } else if (error instanceof msal.InteractionRequiredAuthError) {
        showModalMessage("Additional authentication required. Please try again.");
      } else if (error.errorCode === "popup_window_error" || error.message.includes("popup")) {
        showModalMessage("Popup was blocked. Please allow popups for this site and try again.");
      } else {
        showModalMessage(`Authentication failed: ${error.message || 'Please contact your administrator for support.'}`);  
      }
    }
  };

  return (
    <div className="login-container">
      <div className="image">
        <img src="logo.png" alt="Logo" />
      </div>

      <div id="login-container">
        <h1>Welcome To ValueMomentum Hire Assist Portal</h1>

        <form id="login-form">
          <label htmlFor="team-select">Select Your Team:</label>
          <select
            id="team-select"
            required
            value={selectedTeam}
            onChange={handleTeamChange}
            disabled={isInitializing}
          >
            <option value="">Select Your Team</option>
            <option value="tag">TAG Team</option>
            <option value="panel">Panel Login</option>
            <option value="app-ec">App EC Lead</option>
            <option value="data-ec">Data EC Lead</option>
            <option value="cloud-ec">Cloud EC Lead</option>
            <option value="admin-Login">Admin</option>
          </select>

          <div
            id="admin-credentials"
            style={{ display: selectedTeam === "admin-Login" ? "flex" : "none" }}
          >
            <div>
              <label htmlFor="admin-username">Username:</label>
              <input
                type="text"
                id="admin-username"
                placeholder="Enter Username"
                value={adminUsername}
                onChange={(e) => setAdminUsername(e.target.value)}
              />
            </div>

            <div>
              <label htmlFor="admin-password">Password:</label>
              <input
                type="password"
                id="admin-password"
                placeholder="Enter Password"
                value={adminPassword}
                onChange={(e) => setAdminPassword(e.target.value)}
              />
            </div>
          </div>
          <button
            type="button"
            id="msal-login-button"
            onClick={handleLogin}
            disabled={isInitializing}
          >
            {isInitializing ? "Initializing..." : "Login"}
          </button>
        </form>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="modal">
          <div className="modal-content">
            <span className="close" onClick={closeModal}>&times;</span>
            <p id="modal-text">{modalMessage}</p>
          </div>
        </div>
      )}

      {/* Toast */}
      {showToast && (
        <div id="toast" className={`toast ${toastType}`}>
          {toastMessage}
        </div>
      )}
    </div>
  );
};

export default Login;
