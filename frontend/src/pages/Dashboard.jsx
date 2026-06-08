import { useState, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';
import { TrendingUp, TrendingDown, Target, AlertTriangle, CheckCircle, Clock } from 'lucide-react';
import api from '../services/api';

const mockKPIData = [
  { date: 'Mon', aht: 285, csat: 88, fcr: 72 },
  { date: 'Tue', aht: 310, csat: 85, fcr: 68 },
  { date: 'Wed', aht: 295, csat: 90, fcr: 75 },
  { date: 'Thu', aht: 320, csat: 82, fcr: 65 },
  { date: 'Fri', aht: 280, csat: 92, fcr: 78 },
  { date: 'Sat', aht: 305, csat: 87, fcr: 70 },
  { date: 'Sun', aht: 290, csat: 89, fcr: 73 },
];

const mockRootCauses = [
  { category: 'People', count: 45, percentage: 38 },
  { category: 'Technology', count: 32, percentage: 27 },
  { category: 'Process', count: 28, percentage: 24 },
  { category: 'External', count: 13, percentage: 11 },
];

const mockJustifications = [
  { id: 1, kpi: 'AHT', comment: 'New hire training in progress', status: 'draft', date: '2024-01-15' },
  { id: 2, kpi: 'CSAT', comment: 'System maintenance scheduled', status: 'approved', date: '2024-01-14' },
  { id: 3, kpi: 'FCR', comment: 'Updated knowledge base articles', status: 'certified', date: '2024-01-13' },
];

export default function Dashboard() {
  const [stats, setStats] = useState({
    totalProjects: 3,
    activeKPIs: 15,
    pendingJustifications: 8,
    certifiedInsights: 24
  });

  return (
    <div className="fade-in">
      <div className="page-header">
        <div>
          <h1 className="page-title">Dashboard</h1>
          <p className="page-subtitle">Operations Intelligence Overview</p>
        </div>
        <button className="btn btn-primary">
          <TrendingUp size={18} />
          Generate Report
        </button>
      </div>

      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-label">Total Projects</div>
          <div className="stat-value">{stats.totalProjects}</div>
          <div className="stat-change positive">
            <TrendingUp size={14} />
            +2 this month
          </div>
        </div>

        <div className="stat-card success">
          <div className="stat-label">Active KPIs</div>
          <div className="stat-value">{stats.activeKPIs}</div>
          <div className="stat-change positive">
            <CheckCircle size={14} />
            All on track
          </div>
        </div>

        <div className="stat-card warning">
          <div className="stat-label">Pending Reviews</div>
          <div className="stat-value">{stats.pendingJustifications}</div>
          <div className="stat-change" style={{ color: 'var(--warning)' }}>
            <Clock size={14} />
            Needs attention
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-label">Certified Insights</div>
          <div className="stat-value">{stats.certifiedInsights}</div>
          <div className="stat-change positive">
            <Target size={14} />
            AI-ready data
          </div>
        </div>
      </div>

      <div className="dashboard-grid">
        <div className="card">
          <div className="card-header">
            <h3 className="card-title">KPI Performance Trend</h3>
          </div>
          <div className="chart-container">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={mockKPIData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#2a2a3a" />
                <XAxis dataKey="date" stroke="#606070" />
                <YAxis stroke="#606070" />
                <Tooltip
                  contentStyle={{
                    background: '#16161f',
                    border: '1px solid #2a2a3a',
                    borderRadius: '10px'
                  }}
                />
                <Line type="monotone" dataKey="aht" stroke="#6366f1" strokeWidth={2} dot={{ r: 4 }} />
                <Line type="monotone" dataKey="csat" stroke="#22c55e" strokeWidth={2} dot={{ r: 4 }} />
                <Line type="monotone" dataKey="fcr" stroke="#f59e0b" strokeWidth={2} dot={{ r: 4 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="card">
          <div className="card-header">
            <h3 className="card-title">Root Cause Distribution</h3>
          </div>
          <div className="chart-container">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={mockRootCauses} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" stroke="#2a2a3a" />
                <XAxis type="number" stroke="#606070" />
                <YAxis dataKey="category" type="category" stroke="#606070" width={100} />
                <Tooltip
                  contentStyle={{
                    background: '#16161f',
                    border: '1px solid #2a2a3a',
                    borderRadius: '10px'
                  }}
                />
                <Bar dataKey="count" fill="#6366f1" radius={[0, 8, 8, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <div className="card" style={{ marginTop: '24px' }}>
        <div className="card-header">
          <h3 className="card-title">Recent Justifications</h3>
          <button className="btn btn-secondary">View All</button>
        </div>
        <div className="table-container">
          <table>
            <thead>
              <tr>
                <th>KPI</th>
                <th>Comment</th>
                <th>Date</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {mockJustifications.map((j) => (
                <tr key={j.id}>
                  <td>
                    <div className="kpi-row">
                      <div className="kpi-icon">
                        <Target size={18} />
                      </div>
                      {j.kpi}
                    </div>
                  </td>
                  <td style={{ maxWidth: '300px' }}>{j.comment}</td>
                  <td>{j.date}</td>
                  <td>
                    <span className={`status-badge ${j.status}`}>
                      {j.status}
                    </span>
                  </td>
                  <td>
                    <button className="btn btn-secondary" style={{ padding: '6px 12px', fontSize: '12px' }}>
                      Review
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}