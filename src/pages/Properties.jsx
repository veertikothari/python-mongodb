import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../services/api';

export default function Properties() {
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    city: '',
    propertyType: '',
    minPrice: '',
    maxPrice: '',
    sortBy: 'price',
    order: 'asc',
  });

  const navigate = useNavigate();

  useEffect(() => {
    loadProperties();
  }, []);

  const loadProperties = async () => {
    try {
      setLoading(true);
      const params = {};
      if (filters.city) params.city = filters.city;
      if (filters.propertyType) params.propertyType = filters.propertyType;
      if (filters.minPrice) params.minPrice = filters.minPrice;
      if (filters.maxPrice) params.maxPrice = filters.maxPrice;
      if (filters.sortBy) params.sortBy = filters.sortBy;
      if (filters.order) params.order = filters.order;

      const data = await api.properties.getAll(params);
      setProperties(data);
    } catch (error) {
      console.error('Error loading properties:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (e) => {
    setFilters({ ...filters, [e.target.name]: e.target.value });
  };

  const applyFilters = () => {
    loadProperties();
  };

  const resetFilters = () => {
    setFilters({
      city: '',
      propertyType: '',
      minPrice: '',
      maxPrice: '',
      sortBy: 'price',
      order: 'asc',
    });
    setTimeout(() => loadProperties(), 0);
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
    }).format(price);
  };

  if (loading) {
    return <div className="loading">Loading properties...</div>;
  }

  return (
    <div>
      <div className="page-header">
        <h2>Properties</h2>
        <p>Browse our collection of real estate listings</p>
      </div>

      <div className="filters">
        <div className="filters-row">
          <div className="filter-group">
            <label>City</label>
            <input
              type="text"
              name="city"
              value={filters.city}
              onChange={handleFilterChange}
              placeholder="Enter city"
            />
          </div>

          <div className="filter-group">
            <label>Property Type</label>
            <select name="propertyType" value={filters.propertyType} onChange={handleFilterChange}>
              <option value="">All Types</option>
              <option value="Apartment">Apartment</option>
              <option value="House">House</option>
              <option value="Penthouse">Penthouse</option>
              <option value="Commercial">Commercial</option>
            </select>
          </div>

          <div className="filter-group">
            <label>Min Price</label>
            <input
              type="number"
              name="minPrice"
              value={filters.minPrice}
              onChange={handleFilterChange}
              placeholder="0"
            />
          </div>

          <div className="filter-group">
            <label>Max Price</label>
            <input
              type="number"
              name="maxPrice"
              value={filters.maxPrice}
              onChange={handleFilterChange}
              placeholder="Any"
            />
          </div>

          <div className="filter-group">
            <label>Sort By</label>
            <select name="sortBy" value={filters.sortBy} onChange={handleFilterChange}>
              <option value="price">Price</option>
              <option value="size">Size</option>
              <option value="city">Location</option>
              <option value="createdAt">Date Added</option>
            </select>
          </div>

          <div className="filter-group">
            <label>Order</label>
            <select name="order" value={filters.order} onChange={handleFilterChange}>
              <option value="asc">Ascending</option>
              <option value="desc">Descending</option>
            </select>
          </div>
        </div>

        <div style={{ display: 'flex', gap: '12px' }}>
          <button className="btn btn-primary" onClick={applyFilters}>
            Apply Filters
          </button>
          <button className="btn btn-secondary" onClick={resetFilters}>
            Reset
          </button>
        </div>
      </div>

      {properties.length === 0 ? (
        <div className="empty-state">
          <h3>No properties found</h3>
          <p>Try adjusting your filters</p>
        </div>
      ) : (
        <div className="properties-grid">
          {properties.map((property) => (
            <div
              key={property._id}
              className="property-card"
              onClick={() => navigate(`/properties/${property._id}`)}
            >
              <div className="property-image">🏠</div>
              <div className="property-content">
                <h3 className="property-title">{property.title}</h3>
                <div className="property-price">{formatPrice(property.price)}</div>
                <div className="property-details">
                  <span>{property.bedrooms} beds</span>
                  <span>{property.bathrooms} baths</span>
                  <span>{property.size} sq ft</span>
                </div>
                <div className="property-location">{property.city}</div>
                <span className="property-type">{property.propertyType}</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
