const API_BASE = import.meta.env.VITE_API_URL || '/api';

class ApiService {
  constructor() {
    this.token = localStorage.getItem('opsgpt_token');
  }

  async request(endpoint, options = {}) {
    const url = `${API_BASE}${endpoint}`;
    const headers = {
      'Content-Type': 'application/json',
      ...options.headers,
    };

    if (this.token) {
      headers['Authorization'] = `Bearer ${this.token}`;
    }

    const response = await fetch(url, {
      ...options,
      headers,
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({ error: 'Request failed' }));
      throw new Error(error.error || error.message || 'Request failed');
    }

    return response.json();
  }

  // Auth
  async login(email, password) {
    const data = await this.request('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
    this.token = data.token;
    localStorage.setItem('opsgpt_token', data.token);
    localStorage.setItem('opsgpt_user', JSON.stringify(data.user));
    return data;
  }

  async register(userData) {
    return this.request('/auth/register', {
      method: 'POST',
      body: JSON.stringify(userData),
    });
  }

  logout() {
    this.token = null;
    localStorage.removeItem('opsgpt_token');
    localStorage.removeItem('opsgpt_user');
  }

  getCurrentUser() {
    const user = localStorage.getItem('opsgpt_user');
    return user ? JSON.parse(user) : null;
  }

  // Organizations
  async createOrganization(data) {
    return this.request('/org/create', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async getOrganizations() {
    return this.request('/org/');
  }

  // Projects
  async createProject(data) {
    return this.request('/org/projects', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async getProjects(orgId) {
    return this.request(`/org/projects/org/${orgId}`);
  }

  async getProject(projectId) {
    return this.request(`/org/projects/${projectId}`);
  }

  // KPIs
  async createKPIDefinition(data) {
    return this.request('/kpi/create-definition', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async getKPIDefinitions(projectId) {
    return this.request(`/kpi/definitions/project/${projectId}`);
  }

  async ingestKPIValue(data) {
    return this.request('/kpi/ingest-value', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async getKPIValues(projectId) {
    return this.request(`/kpi/project/${projectId}`);
  }

  // Justifications
  async createJustification(data) {
    return this.request('/kpi/justify', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async getJustifications(projectId) {
    return this.request(`/kpi/justifications/${projectId}`);
  }

  async updateJustification(id, data) {
    return this.request(`/kpi/justifications/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  // Root Causes
  async createRootCause(data) {
    return this.request('/kpi/root-cause/create', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async getRootCauses(projectId) {
    return this.request(`/kpi/root-cause/project/${projectId}`);
  }

  // Reports
  async getDailyReport(projectId, date) {
    return this.request(`/reports/daily/${projectId}?date=${date}`);
  }

  async getWeeklyReport(projectId, date) {
    return this.request(`/reports/weekly/${projectId}?date=${date}`);
  }

  async getMonthlyReport(projectId, year, month) {
    return this.request(`/reports/monthly/${projectId}?year=${year}&month=${month}`);
  }

  // Knowledge
  async createInsight(data) {
    return this.request('/knowledge/insights', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async getInsights(projectId, verified = false) {
    return this.request(`/knowledge/insights/project/${projectId}?verified=${verified}`);
  }
}

export const api = new ApiService();
export default api;