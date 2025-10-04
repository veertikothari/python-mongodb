import { useState, useEffect } from 'react';
import { api } from '../services/api';

export default function Inquiries() {
  const [inquiries, setInquiries] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadInquiries();
  }, []);

  const loadInquiries = async () => {
    try {
      setLoading(true);
      const data = await api.inquiries.getAll();
      setInquiries(data);
    } catch (error) {
      console.error('Error loading inquiries:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateInquiryStatus = async (id, newStatus) => {
    try {
      await api.inquiries.update(id, { status: newStatus });
      loadInquiries();
    } catch (error) {
      console.error('Error updating inquiry:', error);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Pending':
        return '#f39c12';
      case 'Responded':
        return '#3498db';
      case 'Closed':
        return '#95a5a6';
      default:
        return '#7f8c8d';
    }
  };

  if (loading) {
    return <div className="loading">Loading inquiries...</div>;
  }

  return (
    <div>
      <div className="page-header">
        <h2>Inquiries</h2>
        <p>Manage customer inquiries and requests</p>
      </div>

      {inquiries.length === 0 ? (
        <div className="empty-state">
          <h3>No inquiries found</h3>
          <p>Customer inquiries will appear here</p>
        </div>
      ) : (
        <div className="table-container">
          <table>
            <thead>
              <tr>
                <th>Date</th>
                <th>Property ID</th>
                <th>User ID</th>
                <th>Message</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {inquiries.map((inquiry) => (
                <tr key={inquiry._id}>
                  <td>{formatDate(inquiry.createdAt)}</td>
                  <td style={{ fontSize: '12px', color: '#7f8c8d' }}>{inquiry.propertyId.slice(0, 8)}...</td>
                  <td style={{ fontSize: '12px', color: '#7f8c8d' }}>{inquiry.userId.slice(0, 8)}...</td>
                  <td style={{ maxWidth: '300px' }}>{inquiry.message}</td>
                  <td>
                    <span
                      style={{
                        display: 'inline-block',
                        padding: '4px 12px',
                        borderRadius: '12px',
                        fontSize: '12px',
                        fontWeight: '500',
                        color: 'white',
                        background: getStatusColor(inquiry.status),
                      }}
                    >
                      {inquiry.status}
                    </span>
                  </td>
                  <td>
                    <select
                      value={inquiry.status}
                      onChange={(e) => updateInquiryStatus(inquiry._id, e.target.value)}
                      style={{
                        padding: '6px 12px',
                        border: '1px solid #ddd',
                        borderRadius: '4px',
                        fontSize: '14px',
                      }}
                    >
                      <option value="Pending">Pending</option>
                      <option value="Responded">Responded</option>
                      <option value="Closed">Closed</option>
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
