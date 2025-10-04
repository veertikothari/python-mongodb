import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { api } from '../services/api';

export default function PropertyDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [property, setProperty] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showInquiryModal, setShowInquiryModal] = useState(false);
  const [inquiryForm, setInquiryForm] = useState({
    name: '',
    email: '',
    phone: '',
    message: '',
  });

  useEffect(() => {
    loadProperty();
  }, [id]);

  const loadProperty = async () => {
    try {
      setLoading(true);
      const data = await api.properties.getById(id);
      setProperty(data);
    } catch (error) {
      console.error('Error loading property:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleInquirySubmit = async (e) => {
    e.preventDefault();

    try {
      const userData = await api.users.create({
        name: inquiryForm.name,
        email: inquiryForm.email,
        phone: inquiryForm.phone,
      });

      await api.inquiries.create({
        propertyId: property._id,
        userId: userData._id,
        agentId: property.agentId,
        message: inquiryForm.message,
        status: 'Pending',
      });

      alert('Inquiry submitted successfully!');
      setShowInquiryModal(false);
      setInquiryForm({ name: '', email: '', phone: '', message: '' });
    } catch (error) {
      console.error('Error submitting inquiry:', error);
      alert('Error submitting inquiry. Please try again.');
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
    return <div className="loading">Loading property details...</div>;
  }

  if (!property) {
    return <div className="error">Property not found</div>;
  }

  return (
    <div>
      <button className="btn btn-secondary" onClick={() => navigate('/properties')} style={{ marginBottom: '24px' }}>
        ← Back to Properties
      </button>

      <div style={{ background: 'white', borderRadius: '8px', overflow: 'hidden', boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}>
        <div style={{
          width: '100%',
          height: '400px',
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: 'white',
          fontSize: '96px'
        }}>
          🏠
        </div>

        <div style={{ padding: '32px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '24px' }}>
            <div>
              <h2 style={{ fontSize: '32px', fontWeight: '600', color: '#2c3e50', marginBottom: '8px' }}>
                {property.title}
              </h2>
              <p style={{ color: '#7f8c8d', fontSize: '16px' }}>{property.address}</p>
            </div>
            <div style={{ textAlign: 'right' }}>
              <div style={{ fontSize: '36px', fontWeight: '700', color: '#27ae60' }}>
                {formatPrice(property.price)}
              </div>
              <span className="property-type">{property.propertyType}</span>
            </div>
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
            gap: '24px',
            padding: '24px',
            background: '#f8f9fa',
            borderRadius: '8px',
            marginBottom: '32px'
          }}>
            <div>
              <div style={{ fontSize: '14px', color: '#7f8c8d', marginBottom: '4px' }}>Bedrooms</div>
              <div style={{ fontSize: '24px', fontWeight: '600', color: '#2c3e50' }}>{property.bedrooms}</div>
            </div>
            <div>
              <div style={{ fontSize: '14px', color: '#7f8c8d', marginBottom: '4px' }}>Bathrooms</div>
              <div style={{ fontSize: '24px', fontWeight: '600', color: '#2c3e50' }}>{property.bathrooms}</div>
            </div>
            <div>
              <div style={{ fontSize: '14px', color: '#7f8c8d', marginBottom: '4px' }}>Size</div>
              <div style={{ fontSize: '24px', fontWeight: '600', color: '#2c3e50' }}>{property.size} sq ft</div>
            </div>
            <div>
              <div style={{ fontSize: '14px', color: '#7f8c8d', marginBottom: '4px' }}>Status</div>
              <div style={{ fontSize: '24px', fontWeight: '600', color: '#27ae60' }}>{property.status}</div>
            </div>
          </div>

          <div style={{ marginBottom: '32px' }}>
            <h3 style={{ fontSize: '24px', fontWeight: '600', color: '#2c3e50', marginBottom: '16px' }}>
              Description
            </h3>
            <p style={{ color: '#555', fontSize: '16px', lineHeight: '1.6' }}>
              {property.description}
            </p>
          </div>

          <button
            className="btn btn-success"
            onClick={() => setShowInquiryModal(true)}
            style={{ width: '100%', padding: '16px', fontSize: '16px' }}
          >
            Inquire About This Property
          </button>
        </div>
      </div>

      {showInquiryModal && (
        <div className="modal-overlay" onClick={() => setShowInquiryModal(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <h3>Submit Inquiry</h3>
            <form onSubmit={handleInquirySubmit}>
              <div className="form-group">
                <label>Name *</label>
                <input
                  type="text"
                  required
                  value={inquiryForm.name}
                  onChange={(e) => setInquiryForm({ ...inquiryForm, name: e.target.value })}
                />
              </div>

              <div className="form-group">
                <label>Email *</label>
                <input
                  type="email"
                  required
                  value={inquiryForm.email}
                  onChange={(e) => setInquiryForm({ ...inquiryForm, email: e.target.value })}
                />
              </div>

              <div className="form-group">
                <label>Phone *</label>
                <input
                  type="tel"
                  required
                  value={inquiryForm.phone}
                  onChange={(e) => setInquiryForm({ ...inquiryForm, phone: e.target.value })}
                />
              </div>

              <div className="form-group">
                <label>Message *</label>
                <textarea
                  required
                  value={inquiryForm.message}
                  onChange={(e) => setInquiryForm({ ...inquiryForm, message: e.target.value })}
                  placeholder="Tell us what you're interested in..."
                />
              </div>

              <div className="modal-actions">
                <button type="button" className="btn btn-secondary" onClick={() => setShowInquiryModal(false)}>
                  Cancel
                </button>
                <button type="submit" className="btn btn-success">
                  Submit Inquiry
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
