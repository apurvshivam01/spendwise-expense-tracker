const BASE_URL = (import.meta.env.VITE_API_URL || '/api').replace(/\/+$/, '');

export const apiRequest = async (endpoint, options = {}) => {
  const token = localStorage.getItem('spendwise_token');

  const headers = {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...(options.headers || {}),
  };

  const config = {
    ...options,
    headers,
  };

  if (options.body && typeof options.body === 'object' && !(options.body instanceof FormData)) {
    config.body = JSON.stringify(options.body);
  }

  try {
    const response = await fetch(`${BASE_URL}${endpoint}`, config);

    // If unauthorized, clear token and redirect to login if not already on login/register/landing
    if (response.status === 401) {
      localStorage.removeItem('spendwise_token');
      localStorage.removeItem('spendwise_user');
      if (
        !window.location.pathname.startsWith('/login') &&
        !window.location.pathname.startsWith('/register') &&
        window.location.pathname !== '/'
      ) {
        window.location.href = '/login?expired=true';
      }
    }

    // Check if CSV or blob response
    if (options.responseType === 'blob') {
      if (!response.ok) {
        throw new Error('Failed to download file');
      }
      return await response.blob();
    }

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Something went wrong');
    }

    return data;
  } catch (error) {
    throw error;
  }
};

export const api = {
  // Auth
  register: (body) => apiRequest('/auth/register', { method: 'POST', body }),
  login: (body) => apiRequest('/auth/login', { method: 'POST', body }),
  getMe: () => apiRequest('/auth/me'),
  updateProfile: (body) => apiRequest('/auth/profile', { method: 'PUT', body }),
  changePassword: (body) => apiRequest('/auth/change-password', { method: 'PUT', body }),
  seedDemo: () => apiRequest('/auth/seed-demo', { method: 'POST' }),

  // Transactions
  getTransactions: (params = '') => apiRequest(`/transactions${params ? `?${params}` : ''}`),
  getTransaction: (id) => apiRequest(`/transactions/${id}`),
  createTransaction: (body) => apiRequest('/transactions', { method: 'POST', body }),
  updateTransaction: (id, body) => apiRequest(`/transactions/${id}`, { method: 'PUT', body }),
  deleteTransaction: (id) => apiRequest(`/transactions/${id}`, { method: 'DELETE' }),
  exportCSV: async (params = '') => {
    const blob = await apiRequest(`/transactions/export/csv${params ? `?${params}` : ''}`, {
      responseType: 'blob',
    });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `SpendWise_Export_${new Date().toISOString().split('T')[0]}.csv`;
    document.body.appendChild(a);
    a.click();
    a.remove();
  },

  // Budgets
  getBudget: (month) => apiRequest(`/budgets${month ? `?month=${month}` : ''}`),
  setBudget: (body) => apiRequest('/budgets', { method: 'POST', body }),

  // Analytics
  getDashboardSummary: () => apiRequest('/analytics/dashboard'),
  getMonthlyComparison: (months = 6) => apiRequest(`/analytics/monthly-comparison?months=${months}`),
  getCategoryBreakdown: (params = '') => apiRequest(`/analytics/category-breakdown${params ? `?${params}` : ''}`),
  getWeeklySpending: (days = 7) => apiRequest(`/analytics/weekly-spending?days=${days}`),

  // Notifications
  getNotifications: () => apiRequest('/notifications'),
  markNotificationRead: (id) => apiRequest(`/notifications/${id}/read`, { method: 'PUT' }),
  markAllNotificationsRead: () => apiRequest('/notifications/mark-all-read', { method: 'PUT' }),
  clearNotifications: () => apiRequest('/notifications', { method: 'DELETE' }),
};
