import React, { useState, useEffect } from 'react';

function TestAPI() {
  const [candidates, setCandidates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchCandidates();
  }, []);

  const fetchCandidates = async () => {
    try {
      console.log('Fetching candidates...');
      const response = await fetch('http://localhost:3001/api/get/candidate-info');
      const data = await response.json();
      console.log('API Response:', data);
      
      if (data.success) {
        setCandidates(data.data || []);
      } else {
        setError(data.message || 'Failed to fetch candidates');
      }
    } catch (err) {
      console.error('Error:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div style={{ padding: '20px' }}>
      <h1>API Test - Candidates</h1>
      <p>Total candidates: {candidates.length}</p>
      
      {candidates.length > 0 ? (
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr>
              <th>ID</th>
              <th>Name</th>
              <th>Email</th>
              <th>Status</th>
              <th>Role</th>
            </tr>
          </thead>
          <tbody>
            {candidates.map(candidate => (
              <tr key={candidate.id}>
                <td>{candidate.id}</td>
                <td>{candidate.candidate_name}</td>
                <td>{candidate.candidate_email}</td>
                <td>{candidate.prescreening_status}</td>
                <td>{candidate.role}</td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p>No candidates found</p>
      )}
      
      <button onClick={fetchCandidates} style={{ marginTop: '20px' }}>
        Refresh
      </button>
    </div>
  );
}

export default TestAPI; 