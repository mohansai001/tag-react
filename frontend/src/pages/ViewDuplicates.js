import React, { useEffect, useState } from 'react';
import SidebarDrawer from '../common/components/SidebarDrawer';

const sidebarItems = [
  { name: "Dashboard", icon: "DashboardIcon", path: "/dashboard" },
  { name: "Recruit", icon: "GroupIcon", path: "/apprecruit" },
  { name: "RRF Tracking", icon: "AssignmentIcon", path: "/rrf-tracking" },
  { name: "GT's Prescreening", icon: "ListAltIcon", path: "/gt-prescreening" },
  { name: "Logout", icon: "LogoutIcon", action: "logout" }
];


function ViewDuplicates() {
  const [candidates, setCandidates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchDuplicates = async () => {
      const emailList = JSON.parse(sessionStorage.getItem("duplicateEmails") || "[]");

      if (emailList.length === 0) {
        setError("No duplicate email data found.");
        setLoading(false);
        return;
      }

      try {
        const res = await fetch("https://demotag.vercel.app/api/get-existing-candidates", {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({ emails: emailList })
        });

        const result = await res.json();

        if (result.success) {
          setCandidates(result.data);
        } else {
          throw new Error(result.message);
        }
      } catch (err) {
        console.error("❌ Failed to fetch duplicate candidates:", err);
        setError("Failed to fetch duplicate candidates.");
      } finally {
        setLoading(false);
      }
    };

    fetchDuplicates();
  }, []);

  if (loading) return <p>Loading duplicate candidates...</p>;
  if (error) return <p style={{ color: "red" }}>{error}</p>;

  return (
  <>
    <SidebarDrawer menuItems={sidebarItems} />
    <div style={{ padding: '20px' }}>
      {loading ? (
        <p>Loading duplicate candidates...</p>
      ) : error ? (
        <p style={{ color: "red" }}>{error}</p>
      ) : (
        <>
          <h2 style={{ color: 'black' }}>Duplicate Candidates</h2>
          <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '20px' }}>
            <thead>
              <tr style={{ backgroundColor: '#007bff', color: 'white' }}>
                <th style={cellStyle}>Name</th>
                <th style={cellStyle}>Email</th>
                <th style={cellStyle}>Phone</th>
                <th style={cellStyle}>Status</th>
                <th style={cellStyle}>RRF ID</th>
              </tr>
            </thead>
            <tbody style={{ color: 'black' }}>
              {candidates.map((candidate, index) => (
                <tr key={index} style={{ backgroundColor: index % 2 === 0 ? '#f9f9f9' : '#fff' }}>
                  <td style={cellStyle}>{candidate.candidate_name || "N/A"}</td>
                  <td style={cellStyle}>{candidate.candidate_email}</td>
                  <td style={cellStyle}>{candidate.candidate_phone || "N/A"}</td>
                  <td style={cellStyle}>{candidate.prescreening_status || "N/A"}</td>
                  <td style={cellStyle}>{candidate.rrf_id || "N/A"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </>
      )}
    </div>
  </>
);
}

const cellStyle = {
  padding: '10px',
  border: '1px solid #ddd',
  textAlign: 'left'
};

export default ViewDuplicates;
