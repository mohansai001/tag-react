// Shared MSAL config for both frontend and backend
// Only include frontend-safe values (no secrets)



const msalConfig = {
  auth: {
    clientId: "ed0b1bf7-b012-4e13-a526-b696932c0673", // Azure AD app client ID
    authority: "https://login.microsoftonline.com/13085c86-4bcb-460a-a6f0-b373421c6323", // Tenant ID
    redirectUri: "http://localhost:3000" // Must match Azure AD registered redirect URI
  }
};

module.exports = msalConfig;

