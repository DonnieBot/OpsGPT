import { useState } from 'react';
import { Target, Plus, TrendingUp, TrendingDown, Edit2, Trash2 } from 'lucide-react';
import { LineChart, Line, ResponsiveContainer, Tooltip } from 'recharts';

const mockKPIs = [
  { id: 1, name: 'Average Handle Time', code: 'AHT', target: 300, actual: 285, unit: 'seconds', direction: 'lower', project: 'Healthcare Support' },
  { id: 2, name: 'Customer Satisfaction', code: 'CSAT', target: 90, actual: 92, unit: '%', direction: 'higher', project: 'Healthcare Support' },
  { id: 3, name: 'First Contact Resolution', code: 'FCR', target: 75, actual: 68, unit: '%', direction: 'higher', project: 'E-Commerce Support' },
  { id: 4, name: 'Agent Attendance', code: 'ATT', target: 95, actual: 96, unit: '%', direction: 'higher', project: 'Tech Support LOB' },
  { id: 5, name: 'Quality Score', code: 'QUAL', target: 85, actual: 88, unit: '%', direction: 'higher', project: 'Tech Support LOB' },
];

const trendData = {
  AHT: [{ day: 'Mon', value: 290 }, { day: 'Tue', value: 310 }, { day: 'Wed', value: 295 }, { day: 'Thu', value: 280 }],
  CSAT: [{ day: 'Mon', value: 88 }, { day: 'Tue', value: 92 }, { day: 'Wed', value: 89 }, { day: 'Thu', value: 91 }],
};

export default function KPIs() {
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({ name: '', code: '', target: '', unit: '', direction: 'higher' });

  const getVariance = (actual, target) => {
    return ((actual - target) / target * 100).toFixed(1);
  };

  const getVarianceClass = (variance, direction) => {
    if (direction === 'higher') {
      return variance >= 0 ? 'positive' : 'negative';
    }
    return variance <= 0 ? 'positive' : 'negative';
  };

  return (
    <div className="fade-in">
      <div className="page-header">
        <div>
          <h1 className="page-title">KPI Definitions</h1>
          <p className="page-subtitle">Configure and monitor key performance indicators</p>
        </div>
        <button className="btn btn-primary" onClick={() => setShowModal(true)}>
          <Plus size={18} />
          New KPI
        </button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '20px' }}>
        {mockKPIs.map((kpi) => {
          const variance = getVariance(kpi.actual, kpi.target);
          const isPositive = getVarianceClass(parseFloat(variance), kpi.direction) === 'positive';

          return (
            <div key={kpi.id} className="card">
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '16px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <div style={{
                    width: '44px',
                    height: '44px',
                    borderRadius: '10px',
                    background: kpi.direction === 'higher' ? 'rgba(34, 197, 94, 0.1)' : 'rgba(239, 68, 68, 0.1)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}>
                    <Target size={22} style={{ color: kpi.direction === 'higher' ? 'var(--success)' : 'var(--danger)' }} />
                  </div>
                  <div>
                    <h3 style={{ fontSize: '15px', fontWeight: '600' }}>{kpi.name}</h3>
                    <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>{kpi.code} • {kpi.project}</span>
                  </div>
                </div>
                <div style={{ display: 'flex', gap: '4px' }}>
                  <button style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', padding: '4px' }}>
                    <Edit2 size={16} />
                  </button>
                  <button style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', padding: '4px' }}>
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>

              <div style={{ height: '60px', marginBottom: '16px' }}>
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={trendData[kpi.code] || []}>
                    <Line
                      type="monotone"
                      dataKey="value"
                      stroke={isPositive ? '#22c55e' : '#ef4444'}
                      strokeWidth={2}
                      dot={false}
                    />
                    <Tooltip
                      contentStyle={{
                        background: '#16161f',
                        border: '1px solid #2a2a3a',
                        borderRadius: '8px',
                        fontSize: '12px'
                      }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px', paddingTop: '16px', borderTop: '1px solid var(--border-color)' }}>
                <div>
                  <div style={{ fontSize: '11px', color: 'var(--text-muted)', marginBottom: '4px' }}>TARGET</div>
                  <div style={{ fontSize: '16px', fontWeight: '600' }}>{kpi.target} <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>{kpi.unit}</span></div>
                </div>
                <div>
                  <div style={{ fontSize: '11px', color: 'var(--text-muted)', marginBottom: '4px' }}>ACTUAL</div>
                  <div style={{ fontSize: '16px', fontWeight: '600' }}>{kpi.actual} <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>{kpi.unit}</span></div>
                </div>
                <div>
                  <div style={{ fontSize: '11px', color: 'var(--text-muted)', marginBottom: '4px' }}>VARIANCE</div>
                  <div style={{ fontSize: '16px', fontWeight: '600' }} className={`variance ${isPositive ? 'positive' : 'negative'}`}>
                    {variance > 0 ? '+' : ''}{variance}%
                    {kpi.direction === 'higher' ? <TrendingUp size={14} style={{ marginLeft: '4px' }} /> : <TrendingDown size={14} style={{ marginLeft: '4px' }} />}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2 className="modal-title">Create KPI Definition</h2>
              <button className="modal-close" onClick={() => setShowModal(false)}>✕</button>
            </div>

            <div className="form-group">
              <label className="form-label">KPI Name</label>
              <input
                type="text"
                className="form-input"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="e.g., Average Handle Time"
              />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
              <div className="form-group">
                <label className="form-label">Code</label>
                <input
                  type="text"
                  className="form-input"
                  value={formData.code}
                  onChange={(e) => setFormData({ ...formData, code: e.target.value })}
                  placeholder="e.g., AHT"
                />
              </div>
              <div className="form-group">
                <label className="form-label">Target Value</label>
                <input
                  type="number"
                  className="form-input"
                  value={formData.target}
                  onChange={(e) => setFormData({ ...formData, target: e.target.value })}
                  placeholder="e.g., 300"
                />
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
              <div className="form-group">
                <label className="form-label">Unit</label>
                <input
                  type="text"
                  className="form-input"
                  value={formData.unit}
                  onChange={(e) => setFormData({ ...formData, unit: e.target.value })}
                  placeholder="e.g., seconds"
                />
              </div>
              <div className="form-group">
                <label className="form-label">Direction</label>
                <select
                  className="form-input form-select"
                  value={formData.direction}
                  onChange={(e) => setFormData({ ...formData, direction: e.target.value })}
                >
                  <option value="higher">Higher is better</option>
                  <option value="lower">Lower is better</option>
                </select>
              </div>
            </div>

            <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end', marginTop: '24px' }}>
              <button className="btn btn-secondary" onClick={() => setShowModal(false)}>Cancel</button>
              <button className="btn btn-primary" onClick={handleCreate}>Create KPI</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}