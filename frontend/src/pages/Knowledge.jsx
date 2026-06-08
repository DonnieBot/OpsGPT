import { useState } from 'react';
import { Lightbulb, Plus, Search, CheckCircle, Clock, Sparkles, Filter } from 'lucide-react';

const mockInsights = [
  { id: 1, kpi: 'AHT', rootCause: 'Script Navigation', category: 'Process', comment: 'Agents taking longer due to complex system navigation', resolution: 'Simplified UI layout and quick links implemented', confidence: 85, verified: true, source: 'manual' },
  { id: 2, kpi: 'CSAT', rootCause: 'Hold Time', category: 'People', comment: 'High hold times causing customer dissatisfaction', resolution: 'Increased staffing during peak hours', confidence: 90, verified: true, source: 'ai_generated' },
  { id: 3, kpi: 'FCR', rootCause: 'Knowledge Base', category: 'Technology', comment: 'Agents unable to find answers in knowledge base', resolution: 'Updated KB articles and added search functionality', confidence: 75, verified: true, source: 'manual' },
  { id: 4, kpi: 'ATT', rootCause: 'Schedule Adherence', category: 'People', comment: 'Agents struggling with complex shift schedules', resolution: 'Simplified scheduling system and better communication', confidence: 68, verified: false, source: 'ai_generated' },
  { id: 5, kpi: 'QUAL', rootCause: 'Escalation Process', category: 'Process', comment: 'Delayed escalations affecting quality scores', resolution: 'Implemented real-time escalation monitoring', confidence: 82, verified: true, source: 'manual' },
];

export default function Knowledge() {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterVerified, setFilterVerified] = useState(false);
  const [showModal, setShowModal] = useState(false);

  const filteredInsights = mockInsights.filter(insight => {
    const matchesSearch = insight.rootCause.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         insight.comment.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter = !filterVerified || insight.verified;
    return matchesSearch && matchesFilter;
  });

  return (
    <div className="fade-in">
      <div className="page-header">
        <div>
          <h1 className="page-title">Knowledge Base</h1>
          <p className="page-subtitle">Operational insights for AI training</p>
        </div>
        <button className="btn btn-primary" onClick={() => setShowModal(true)}>
          <Plus size={18} />
          New Insight
        </button>
      </div>

      <div style={{ display: 'flex', gap: '16px', marginBottom: '24px' }}>
        <div style={{ flex: 1, position: 'relative' }}>
          <Search size={18} style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
          <input
            type="text"
            placeholder="Search insights..."
            className="form-input"
            style={{ paddingLeft: '48px' }}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <button
          className={`btn ${filterVerified ? 'btn-primary' : 'btn-secondary'}`}
          onClick={() => setFilterVerified(!filterVerified)}
        >
          <Filter size={16} />
          Verified Only
        </button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))', gap: '20px' }}>
        {filteredInsights.map((insight) => (
          <div key={insight.id} className="card">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div style={{
                  width: '44px',
                  height: '44px',
                  borderRadius: '10px',
                  background: insight.verified ? 'rgba(34, 197, 94, 0.1)' : 'rgba(245, 158, 11, 0.1)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                  {insight.verified ? <CheckCircle size={22} style={{ color: 'var(--success)' }} /> : <Clock size={22} style={{ color: 'var(--warning)' }} />}
                </div>
                <div>
                  <h3 style={{ fontSize: '15px', fontWeight: '600' }}>{insight.rootCause}</h3>
                  <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>{insight.kpi} • {insight.category}</span>
                </div>
              </div>
              {insight.source === 'ai_generated' && (
                <div style={{
                  padding: '4px 10px',
                  background: 'rgba(139, 92, 246, 0.1)',
                  borderRadius: '6px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px',
                  fontSize: '11px',
                  color: '#8b5cf6'
                }}>
                  <Sparkles size={12} />
                  AI
                </div>
              )}
            </div>

            <div style={{ marginBottom: '16px' }}>
              <div style={{ fontSize: '12px', color: 'var(--text-muted)', marginBottom: '4px' }}>ISSUE</div>
              <p style={{ fontSize: '14px', color: 'var(--text-secondary)', lineHeight: '1.5' }}>{insight.comment}</p>
            </div>

            <div style={{ marginBottom: '16px' }}>
              <div style={{ fontSize: '12px', color: 'var(--text-muted)', marginBottom: '4px' }}>RESOLUTION</div>
              <p style={{ fontSize: '14px', color: 'var(--text-primary)', lineHeight: '1.5' }}>{insight.resolution}</p>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '16px', borderTop: '1px solid var(--border-color)' }}>
              <div>
                <div style={{ fontSize: '11px', color: 'var(--text-muted)', marginBottom: '4px' }}>CONFIDENCE</div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <div style={{
                    width: '60px',
                    height: '6px',
                    background: 'var(--bg-tertiary)',
                    borderRadius: '3px',
                    overflow: 'hidden'
                  }}>
                    <div style={{
                      width: `${insight.confidence}%`,
                      height: '100%',
                      background: insight.confidence >= 80 ? 'var(--success)' : insight.confidence >= 60 ? 'var(--warning)' : 'var(--danger)',
                      borderRadius: '3px'
                    }} />
                  </div>
                  <span style={{ fontSize: '13px', fontWeight: '500' }}>{insight.confidence}%</span>
                </div>
              </div>
              {insight.verified && (
                <span style={{ fontSize: '12px', color: 'var(--success)', display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <CheckCircle size={14} />
                  Verified
                </span>
              )}
            </div>
          </div>
        ))}
      </div>

      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '600px' }}>
            <div className="modal-header">
              <h2 className="modal-title">Create Insight</h2>
              <button className="modal-close" onClick={() => setShowModal(false)}>✕</button>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
              <div className="form-group">
                <label className="form-label">KPI</label>
                <select className="form-input form-select">
                  <option>Select KPI</option>
                  <option>AHT</option>
                  <option>CSAT</option>
                  <option>FCR</option>
                  <option>ATT</option>
                  <option>QUAL</option>
                </select>
              </div>
              <div className="form-group">
                <label className="form-label">Root Cause Category</label>
                <select className="form-input form-select">
                  <option>Select Category</option>
                  <option>People</option>
                  <option>Technology</option>
                  <option>Process</option>
                  <option>External</option>
                </select>
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Root Cause / Issue</label>
              <input type="text" className="form-input" placeholder="Brief description of the root cause" />
            </div>

            <div className="form-group">
              <label className="form-label">Description</label>
              <textarea className="form-input" rows="3" placeholder="Detailed explanation of the issue..." />
            </div>

            <div className="form-group">
              <label className="form-label">Resolution</label>
              <textarea className="form-input" rows="2" placeholder="How was this issue resolved?" />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
              <div className="form-group">
                <label className="form-label">Confidence Score</label>
                <input type="number" className="form-input" placeholder="0-100" min="0" max="100" />
              </div>
              <div className="form-group">
                <label className="form-label">Source</label>
                <select className="form-input form-select">
                  <option value="manual">Manual Entry</option>
                  <option value="ai_generated">AI Generated</option>
                </select>
              </div>
            </div>

            <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end', marginTop: '24px' }}>
              <button className="btn btn-secondary" onClick={() => setShowModal(false)}>Cancel</button>
              <button className="btn btn-primary">Create Insight</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}