import { useState } from 'react';
import { FileText, Plus, CheckCircle, Clock, AlertTriangle, Send } from 'lucide-react';

const mockJustifications = [
  { id: 1, kpi: 'AHT', project: 'Healthcare Support', comment: 'New hire training in progress. Expected improvement next week as training completes.', rootCause: 'People - New Hire', actionPlan: 'Monitor training progress and provide additional coaching', status: 'draft', date: '2024-01-15', author: 'John Manager' },
  { id: 2, kpi: 'CSAT', project: 'E-Commerce Support', comment: 'System maintenance scheduled during peak hours affected response times.', rootCause: 'Technology - System Issue', actionPlan: 'Rescheduled maintenance to off-peak hours', status: 'approved', date: '2024-01-14', author: 'Jane Analyst' },
  { id: 3, kpi: 'FCR', project: 'Tech Support LOB', comment: 'Updated knowledge base articles with new product information.', rootCause: 'Process - Knowledge Gap', actionPlan: 'Continuous KB updates and agent training', status: 'certified', date: '2024-01-13', author: 'John Manager' },
  { id: 4, kpi: 'ATT', project: 'Healthcare Support', comment: 'Staff shortage due to unexpected sick leave during flu season.', rootCause: 'People - Staffing', actionPlan: 'Implemented backup staffing protocol', status: 'draft', date: '2024-01-12', author: 'Jane Analyst' },
  { id: 5, kpi: 'QUAL', project: 'Tech Support LOB', comment: 'New escalation procedures being implemented across teams.', rootCause: 'Process - Procedure Gap', actionPlan: 'Training sessions scheduled for all agents', status: 'approved', date: '2024-01-11', author: 'John Manager' },
];

const statusConfig = {
  draft: { icon: Clock, color: 'var(--warning)', label: 'Draft' },
  approved: { icon: CheckCircle, color: 'var(--info)', label: 'Approved' },
  certified: { icon: CheckCircle, color: 'var(--success)', label: 'Certified' },
};

export default function Justifications() {
  const [filter, setFilter] = useState('all');
  const [showModal, setShowModal] = useState(false);

  const filteredData = filter === 'all' ? mockJustifications : mockJustifications.filter(j => j.status === filter);

  return (
    <div className="fade-in">
      <div className="page-header">
        <div>
          <h1 className="page-title">Justifications</h1>
          <p className="page-subtitle">Root cause capture and approval workflow</p>
        </div>
        <button className="btn btn-primary" onClick={() => setShowModal(true)}>
          <Plus size={18} />
          New Justification
        </button>
      </div>

      <div style={{ display: 'flex', gap: '8px', marginBottom: '24px' }}>
        {['all', 'draft', 'approved', 'certified'].map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`btn ${filter === f ? 'btn-primary' : 'btn-secondary'}`}
            style={{ textTransform: 'capitalize' }}
          >
            {f === 'all' ? 'All' : statusConfig[f].label}
          </button>
        ))}
      </div>

      <div className="card">
        <div className="table-container">
          <table>
            <thead>
              <tr>
                <th>KPI</th>
                <th>Project</th>
                <th>Comment</th>
                <th>Root Cause</th>
                <th>Status</th>
                <th>Date</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredData.map((j) => {
                const status = statusConfig[j.status];
                const StatusIcon = status.icon;
                return (
                  <tr key={j.id}>
                    <td>
                      <div className="kpi-row">
                        <div className="kpi-icon">
                          <FileText size={16} />
                        </div>
                        <div>
                          <div style={{ fontWeight: '500' }}>{j.kpi}</div>
                          <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>{j.author}</div>
                        </div>
                      </div>
                    </td>
                    <td style={{ color: 'var(--text-secondary)' }}>{j.project}</td>
                    <td style={{ maxWidth: '250px' }}>
                      <div style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{j.comment}</div>
                    </td>
                    <td>
                      <span style={{
                        padding: '4px 10px',
                        background: 'var(--bg-tertiary)',
                        borderRadius: '6px',
                        fontSize: '12px'
                      }}>
                        {j.rootCause}
                      </span>
                    </td>
                    <td>
                      <span className={`status-badge ${j.status}`}>
                        <StatusIcon size={12} style={{ marginRight: '4px' }} />
                        {status.label}
                      </span>
                    </td>
                    <td style={{ color: 'var(--text-muted)' }}>{j.date}</td>
                    <td>
                      <div style={{ display: 'flex', gap: '8px' }}>
                        {j.status === 'draft' && (
                          <button className="btn btn-secondary" style={{ padding: '6px 12px', fontSize: '12px' }}>
                            <Send size={12} />
                            Submit
                          </button>
                        )}
                        {j.status === 'approved' && (
                          <button className="btn btn-primary" style={{ padding: '6px 12px', fontSize: '12px' }}>
                            <CheckCircle size={12} />
                            Certify
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '600px' }}>
            <div className="modal-header">
              <h2 className="modal-title">Create Justification</h2>
              <button className="modal-close" onClick={() => setShowModal(false)}>✕</button>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
              <div className="form-group">
                <label className="form-label">KPI</label>
                <select className="form-input form-select">
                  <option>Select KPI</option>
                  <option value="AHT">Average Handle Time</option>
                  <option value="CSAT">Customer Satisfaction</option>
                  <option value="FCR">First Contact Resolution</option>
                </select>
              </div>
              <div className="form-group">
                <label className="form-label">Project</label>
                <select className="form-input form-select">
                  <option>Select Project</option>
                  <option value="healthcare">Healthcare Support</option>
                  <option value="ecommerce">E-Commerce Support</option>
                  <option value="tech">Tech Support LOB</option>
                </select>
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Comment / Explanation</label>
              <textarea
                className="form-input"
                rows="4"
                placeholder="Describe what happened and why the variance occurred..."
              />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
              <div className="form-group">
                <label className="form-label">Root Cause Category</label>
                <select className="form-input form-select">
                  <option>Select Category</option>
                  <option value="people">People</option>
                  <option value="technology">Technology</option>
                  <option value="process">Process</option>
                  <option value="external">External</option>
                </select>
              </div>
              <div className="form-group">
                <label className="form-label">Root Cause Subcategory</label>
                <select className="form-input form-select">
                  <option>Select Subcategory</option>
                  <option value="new-hire">New Hire / Training</option>
                  <option value="staffing">Staffing</option>
                  <option value="system">System Issue</option>
                  <option value="procedure">Procedure Gap</option>
                </select>
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Action Plan</label>
              <textarea
                className="form-input"
                rows="2"
                placeholder="What steps will be taken to prevent this in the future?"
              />
            </div>

            <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end', marginTop: '24px' }}>
              <button className="btn btn-secondary" onClick={() => setShowModal(false)}>Cancel</button>
              <button className="btn btn-primary">Create Justification</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}