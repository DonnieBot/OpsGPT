import { useState } from 'react';
import { BarChart3, Calendar, Download, TrendingUp, TrendingDown } from 'lucide-react';
import { LineChart, Line, BarChart, Bar, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';

const mockDailyData = [
  { date: 'Jan 10', aht: 290, csat: 88, fcr: 72 },
  { date: 'Jan 11', aht: 305, csat: 85, fcr: 68 },
  { date: 'Jan 12', aht: 295, csat: 90, fcr: 75 },
  { date: 'Jan 13', aht: 280, csat: 92, fcr: 78 },
  { date: 'Jan 14', aht: 310, csat: 87, fcr: 70 },
  { date: 'Jan 15', aht: 285, csat: 91, fcr: 73 },
  { date: 'Jan 16', aht: 298, csat: 89, fcr: 71 },
];

const mockWeeklyData = [
  { week: 'Week 1', aht: 295, csat: 88, fcr: 72 },
  { week: 'Week 2', aht: 288, csat: 90, fcr: 74 },
  { week: 'Week 3', aht: 292, csat: 87, fcr: 71 },
  { week: 'Week 4', aht: 285, csat: 91, fcr: 75 },
];

const mockMonthlyData = [
  { month: 'Sep', aht: 310, csat: 85, fcr: 68 },
  { month: 'Oct', aht: 298, csat: 87, fcr: 70 },
  { month: 'Nov', aht: 288, csat: 89, fcr: 72 },
  { month: 'Dec', aht: 285, csat: 90, fcr: 74 },
  { month: 'Jan', aht: 280, csat: 91, fcr: 75 },
];

const kpiSummary = [
  { name: 'AHT', target: 300, actual: 285, variance: '-5.0%', trend: 'down' },
  { name: 'CSAT', target: 90, actual: 91, variance: '+1.1%', trend: 'up' },
  { name: 'FCR', target: 75, actual: 73, variance: '-2.7%', trend: 'down' },
  { name: 'ATT', target: 95, actual: 96, variance: '+1.1%', trend: 'up' },
  { name: 'QUAL', target: 85, actual: 88, variance: '+3.5%', trend: 'up' },
];

export default function Reports() {
  const [period, setPeriod] = useState('weekly');
  const [selectedProject, setSelectedProject] = useState('all');

  const getChartData = () => {
    switch (period) {
      case 'daily': return mockDailyData;
      case 'weekly': return mockWeeklyData;
      case 'monthly': return mockMonthlyData;
      default: return mockWeeklyData;
    }
  };

  const getXAxisKey = () => {
    switch (period) {
      case 'daily': return 'date';
      case 'weekly': return 'week';
      case 'monthly': return 'month';
      default: return 'week';
    }
  };

  return (
    <div className="fade-in">
      <div className="page-header">
        <div>
          <h1 className="page-title">Reports</h1>
          <p className="page-subtitle">KPI analytics and performance insights</p>
        </div>
        <div style={{ display: 'flex', gap: '12px' }}>
          <select
            className="form-input form-select"
            value={selectedProject}
            onChange={(e) => setSelectedProject(e.target.value)}
            style={{ width: '200px' }}
          >
            <option value="all">All Projects</option>
            <option value="healthcare">Healthcare Support</option>
            <option value="ecommerce">E-Commerce Support</option>
            <option value="tech">Tech Support LOB</option>
          </select>
          <button className="btn btn-secondary">
            <Download size={18} />
            Export
          </button>
        </div>
      </div>

      <div style={{ display: 'flex', gap: '8px', marginBottom: '24px' }}>
        {['daily', 'weekly', 'monthly'].map((p) => (
          <button
            key={p}
            onClick={() => setPeriod(p)}
            className={`btn ${period === p ? 'btn-primary' : 'btn-secondary'}`}
          >
            <Calendar size={16} />
            {p.charAt(0).toUpperCase() + p.slice(1)}
          </button>
        ))}
      </div>

      <div className="card" style={{ marginBottom: '24px' }}>
        <div className="card-header">
          <h3 className="card-title">KPI Summary - {period.charAt(0).toUpperCase() + period.slice(1)}</h3>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '16px' }}>
          {kpiSummary.map((kpi) => (
            <div key={kpi.name} style={{ padding: '16px', background: 'var(--bg-tertiary)', borderRadius: '12px', textAlign: 'center' }}>
              <div style={{ fontSize: '12px', color: 'var(--text-muted)', marginBottom: '8px' }}>{kpi.name}</div>
              <div style={{ fontSize: '24px', fontWeight: '700', fontFamily: 'Space Grotesk' }}>{kpi.actual}</div>
              <div style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: '4px' }}>Target: {kpi.target}</div>
              <div style={{
                marginTop: '8px',
                fontSize: '13px',
                fontWeight: '500',
                color: kpi.variance.startsWith('+') ? 'var(--success)' : 'var(--danger)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '4px'
              }}>
                {kpi.trend === 'up' ? <TrendingUp size={14} /> : <TrendingDown size={14} />}
                {kpi.variance}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="dashboard-grid">
        <div className="card">
          <div className="card-header">
            <h3 className="card-title">KPI Trends</h3>
          </div>
          <div className="chart-container" style={{ height: '350px' }}>
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={getChartData()}>
                <defs>
                  <linearGradient id="colorAht" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="colorCsat" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#22c55e" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#22c55e" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#2a2a3a" />
                <XAxis dataKey={getXAxisKey()} stroke="#606070" />
                <YAxis stroke="#606070" />
                <Tooltip
                  contentStyle={{
                    background: '#16161f',
                    border: '1px solid #2a2a3a',
                    borderRadius: '10px'
                  }}
                />
                <Legend />
                <Area type="monotone" dataKey="aht" stroke="#6366f1" fillOpacity={1} fill="url(#colorAht)" strokeWidth={2} />
                <Area type="monotone" dataKey="csat" stroke="#22c55e" fillOpacity={1} fill="url(#colorCsat)" strokeWidth={2} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="card">
          <div className="card-header">
            <h3 className="card-title">Root Cause Analysis</h3>
          </div>
          <div className="chart-container" style={{ height: '350px' }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={[
                { category: 'People', count: 45 },
                { category: 'Technology', count: 32 },
                { category: 'Process', count: 28 },
                { category: 'External', count: 13 },
              ]} layout="vertical">
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
    </div>
  );
}