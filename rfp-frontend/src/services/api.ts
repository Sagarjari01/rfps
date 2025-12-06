const API_URL = 'http://127.0.0.1:5001';

export const api = {
  fetchVendors: async () => {
    const res = await fetch(`${API_URL}/vendors`);
    return res.json();
  },

  addVendor: async (vendor: { name: string; email: string; category: string }) => {
    await fetch(`${API_URL}/vendors`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(vendor),
    });
  },

  createRfp: async (text: string) => {
    const res = await fetch(`${API_URL}/rfps`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text }),
    });
    return res.json();
  },

  sendRfpEmails: async (rfpId: string, vendorIds: string[]) => {
    await fetch(`${API_URL}/rfps/${rfpId}/send`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ vendorIds }),
    });
  },

  syncEmails: async () => {
    const res = await fetch(`${API_URL}/proposals/sync`, { method: 'POST' });
    return res.json();
  },

  getComparison: async (rfpId: string) => {
    const res = await fetch(`${API_URL}/rfps/${rfpId}/comparison`);
    return res.json();
  }
};

