const API_BASE_URL = '/api';

export const api = {
  properties: {
    getAll: async (params = {}) => {
      const queryString = new URLSearchParams(params).toString();
      const url = `${API_BASE_URL}/properties${queryString ? `?${queryString}` : ''}`;
      const response = await fetch(url);
      return response.json();
    },
    getById: async (id) => {
      const response = await fetch(`${API_BASE_URL}/properties/${id}`);
      return response.json();
    },
    create: async (data) => {
      const response = await fetch(`${API_BASE_URL}/properties`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      return response.json();
    },
    update: async (id, data) => {
      const response = await fetch(`${API_BASE_URL}/properties/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      return response.json();
    },
    delete: async (id) => {
      const response = await fetch(`${API_BASE_URL}/properties/${id}`, {
        method: 'DELETE',
      });
      return response.json();
    },
  },

  agents: {
    getAll: async (params = {}) => {
      const queryString = new URLSearchParams(params).toString();
      const url = `${API_BASE_URL}/agents${queryString ? `?${queryString}` : ''}`;
      const response = await fetch(url);
      return response.json();
    },
    getById: async (id) => {
      const response = await fetch(`${API_BASE_URL}/agents/${id}`);
      return response.json();
    },
    create: async (data) => {
      const response = await fetch(`${API_BASE_URL}/agents`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      return response.json();
    },
    update: async (id, data) => {
      const response = await fetch(`${API_BASE_URL}/agents/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      return response.json();
    },
    delete: async (id) => {
      const response = await fetch(`${API_BASE_URL}/agents/${id}`, {
        method: 'DELETE',
      });
      return response.json();
    },
  },

  inquiries: {
    getAll: async (params = {}) => {
      const queryString = new URLSearchParams(params).toString();
      const url = `${API_BASE_URL}/inquiries${queryString ? `?${queryString}` : ''}`;
      const response = await fetch(url);
      return response.json();
    },
    create: async (data) => {
      const response = await fetch(`${API_BASE_URL}/inquiries`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      return response.json();
    },
    update: async (id, data) => {
      const response = await fetch(`${API_BASE_URL}/inquiries/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      return response.json();
    },
  },

  users: {
    getAll: async () => {
      const response = await fetch(`${API_BASE_URL}/users`);
      return response.json();
    },
    create: async (data) => {
      const response = await fetch(`${API_BASE_URL}/users`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      return response.json();
    },
  },

  aggregation: {
    averagePriceByCity: async () => {
      const response = await fetch(`${API_BASE_URL}/aggregation/average-price-by-city`);
      return response.json();
    },
    mostActiveAgents: async () => {
      const response = await fetch(`${API_BASE_URL}/aggregation/most-active-agents`);
      return response.json();
    },
    propertiesByType: async () => {
      const response = await fetch(`${API_BASE_URL}/aggregation/properties-by-type`);
      return response.json();
    },
    inquiryStatistics: async () => {
      const response = await fetch(`${API_BASE_URL}/aggregation/inquiry-statistics`);
      return response.json();
    },
    priceRangeDistribution: async () => {
      const response = await fetch(`${API_BASE_URL}/aggregation/price-range-distribution`);
      return response.json();
    },
  },

  initDb: async () => {
    const response = await fetch(`${API_BASE_URL}/init-db`, {
      method: 'POST',
    });
    return response.json();
  },
};
