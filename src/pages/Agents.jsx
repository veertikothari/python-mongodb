import { useState, useEffect } from 'react';
import { api } from '../services/api';

export default function Agents() {
  const [agents, setAgents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadAgents();
  }, []);

  const loadAgents = async () => {
    try {
      setLoading(true);
      const data = await api.agents.getAll();
      setAgents(data);
    } catch (error) {
      console.error('Error loading agents:', error);
    } finally {
      setLoading(false);
    }
  };

  const getInitials = (name) => {
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase();
  };

  if (loading) {
    return <div className="loading">Loading agents...</div>;
  }

  return (
    <div>
      <div className="page-header">
        <h2>Our Agents</h2>
        <p>Meet our experienced real estate professionals</p>
      </div>

      {agents.length === 0 ? (
        <div className="empty-state">
          <h3>No agents found</h3>
        </div>
      ) : (
        <div className="agents-grid">
          {agents.map((agent) => (
            <div key={agent._id} className="agent-card">
              <div className="agent-header">
                <div className="agent-avatar">{getInitials(agent.name)}</div>
                <div className="agent-info">
                  <h3>{agent.name}</h3>
                  <p>{agent.specialization}</p>
                </div>
              </div>

              <div className="agent-details">
                <div>
                  <label>Email:</label>
                  <span>{agent.email}</span>
                </div>
                <div>
                  <label>Phone:</label>
                  <span>{agent.phone}</span>
                </div>
                <div>
                  <label>Active Listings:</label>
                  <span style={{ fontWeight: '600', color: '#27ae60' }}>{agent.activeListings}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
