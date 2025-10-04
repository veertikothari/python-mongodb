import { useState, useEffect } from 'react';
import { api } from '../services/api';

export default function Analytics() {
  const [loading, setLoading] = useState(true);
  const [avgPriceByCity, setAvgPriceByCity] = useState([]);
  const [activeAgents, setActiveAgents] = useState([]);
  const [propertiesByType, setPropertiesByType] = useState([]);
  const [inquiryStats, setInquiryStats] = useState([]);

  useEffect(() => {
    loadAnalytics();
  }, []);

  const loadAnalytics = async () => {
    try {
      setLoading(true);
      const [cityData, agentData, typeData, inquiryData] = await Promise.all([
        api.aggregation.averagePriceByCity(),
        api.aggregation.mostActiveAgents(),
        api.aggregation.propertiesByType(),
        api.aggregation.inquiryStatistics(),
      ]);

      setAvgPriceByCity(cityData);
      setActiveAgents(agentData);
      setPropertiesByType(typeData);
      setInquiryStats(inquiryData);
    } catch (error) {
      console.error('Error loading analytics:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
    }).format(price);
  };

  if (loading) {
    return <div className="loading">Loading analytics...</div>;
  }

  return (
    <div>
      <div className="page-header">
        <h2>Analytics Dashboard</h2>
        <p>Insights and statistics about your real estate platform</p>
      </div>

      <div className="stats-grid">
        <div className="stat-card">
          <h3>Total Cities</h3>
          <div className="stat-value">{avgPriceByCity.length}</div>
        </div>

        <div className="stat-card">
          <h3>Property Types</h3>
          <div className="stat-value">{propertiesByType.length}</div>
        </div>

        <div className="stat-card">
          <h3>Active Agents</h3>
          <div className="stat-value">{activeAgents.length}</div>
        </div>

        <div className="stat-card">
          <h3>Total Inquiries</h3>
          <div className="stat-value">
            {inquiryStats.reduce((sum, stat) => sum + stat.count, 0)}
          </div>
        </div>
      </div>

      <div className="table-container">
        <h3 style={{ marginBottom: '16px', fontSize: '20px', fontWeight: '600' }}>
          Average Price by City
        </h3>
        <table>
          <thead>
            <tr>
              <th>City</th>
              <th>Average Price</th>
              <th>Property Count</th>
              <th>Min Price</th>
              <th>Max Price</th>
            </tr>
          </thead>
          <tbody>
            {avgPriceByCity.map((item, index) => (
              <tr key={index}>
                <td style={{ fontWeight: '600' }}>{item.city}</td>
                <td style={{ color: '#27ae60', fontWeight: '600' }}>{formatPrice(item.averagePrice)}</td>
                <td>{item.propertyCount}</td>
                <td>{formatPrice(item.minPrice)}</td>
                <td>{formatPrice(item.maxPrice)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="table-container">
        <h3 style={{ marginBottom: '16px', fontSize: '20px', fontWeight: '600' }}>
          Most Active Agents
        </h3>
        <table>
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Specialization</th>
              <th>Active Listings</th>
              <th>Phone</th>
            </tr>
          </thead>
          <tbody>
            {activeAgents.map((agent) => (
              <tr key={agent._id}>
                <td style={{ fontWeight: '600' }}>{agent.name}</td>
                <td>{agent.email}</td>
                <td>
                  <span
                    style={{
                      display: 'inline-block',
                      padding: '4px 12px',
                      background: '#ecf0f1',
                      borderRadius: '12px',
                      fontSize: '12px',
                      fontWeight: '500',
                    }}
                  >
                    {agent.specialization}
                  </span>
                </td>
                <td>
                  <span style={{ color: '#27ae60', fontWeight: '600', fontSize: '18px' }}>
                    {agent.activeListings}
                  </span>
                </td>
                <td>{agent.phone}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="table-container">
        <h3 style={{ marginBottom: '16px', fontSize: '20px', fontWeight: '600' }}>
          Properties by Type
        </h3>
        <table>
          <thead>
            <tr>
              <th>Property Type</th>
              <th>Count</th>
              <th>Average Price</th>
              <th>Total Value</th>
            </tr>
          </thead>
          <tbody>
            {propertiesByType.map((item, index) => (
              <tr key={index}>
                <td style={{ fontWeight: '600' }}>{item.propertyType}</td>
                <td>{item.count}</td>
                <td style={{ color: '#27ae60' }}>{formatPrice(item.averagePrice)}</td>
                <td style={{ fontWeight: '600' }}>{formatPrice(item.totalValue)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="table-container">
        <h3 style={{ marginBottom: '16px', fontSize: '20px', fontWeight: '600' }}>
          Inquiry Statistics
        </h3>
        <table>
          <thead>
            <tr>
              <th>Status</th>
              <th>Count</th>
            </tr>
          </thead>
          <tbody>
            {inquiryStats.map((stat, index) => (
              <tr key={index}>
                <td style={{ fontWeight: '600' }}>{stat.status}</td>
                <td>
                  <span style={{ fontSize: '18px', fontWeight: '600', color: '#3498db' }}>
                    {stat.count}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
