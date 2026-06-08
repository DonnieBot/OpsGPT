import { useState } from 'react';
import { FolderKanban, Plus, Users, Target, MoreVertical, Search } from 'lucide-react';

const mockProjects = [
  { id: 1, name: 'Healthcare Support', client: 'HealthCorp', status: 'active', kpis: 5, team: 12 },
  { id: 2, name: 'E-Commerce Support', client: 'ShopEasy', status: 'active', kpis: 4, team: 8 },
  { id: 3, name: 'Tech Support LOB', client: 'TechServ', status: 'active', kpis: 6, team: 15 },
];

export default function Projects() {
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({ name: '', client: '', description: '' });

  const handleCreate = () => {
    // API call would go here
    setShowModal(false);
    setFormData({ name: '', client: '', description: '' });
  };

  return (
    <div className="fade-in">
      <div className="page-header">
        <div>
          <h1 className="page-title">Projects</h1>
          <p className="page-subtitle">Manage client accounts and LOBs</p>
        </div>
        <button className="btn btn-primary" onClick={() => setShowModal(true)}>
          <Plus size={18} />
          New Project
        </button>
      </div>

      <div style={{ display: 'flex', gap: '16px', marginBottom: '24px' }}>
        <div style={{ flex: 1, position: 'relative' }}>
          <Search size={18} style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
          <input
            type="text"
            placeholder="Search projects..."
            className="form-input"
            style={{ paddingLeft: '48px' }}
          />
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))', gap: '20px' }}>
        {mockProjects.map((project) => (
          <div key={project.id} className="card" style={{ cursor: 'pointer', transition: 'all 0.2s ease' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px' }}>
              <div style={{ display: 'flex', gap: '12px' }}>
                <div style={{
                  width: '48px',
                  height: '48px',
                  borderRadius: '12px',
                  background: 'var(--accent-gradient)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                  <FolderKanban size={24} />
                </div>
                <div>
                  <h3 style={{ fontSize: '16px', fontWeight: '600', marginBottom: '4px' }}>{project.name}</h3>
                  <p style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>{project.client}</p>
                </div>
              </div>
              <button style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}>
                <MoreVertical size={18} />
              </button>
            </div>

            <div style={{ display: 'flex', gap: '24px', padding: '16px 0', borderTop: '1px solid var(--border-color)', borderBottom: '1px solid var(--border-color)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Target size={16} style={{ color: 'var(--accent-primary)' }} />
                <span style={{ fontSize: '14px' }}>{project.kpis} KPIs</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Users size={16} style={{ color: 'var(--success)' }} />
                <span style={{ fontSize: '14px' }}>{project.team} Agents</span>
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '16px' }}>
              <span className="status-badge approved">Active</span>
              <span style={{ fontSize: '13px', color: 'var(--text-muted)' }}>Created Jan 2024</span>
            </div>
          </div>
        ))}
      </div>

      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2 className="modal-title">Create New Project</h2>
              <button className="modal-close" onClick={() => setShowModal(false)}>✕</button>
            </div>

            <div className="form-group">
              <label className="form-label">Project Name</label>
              <input
                type="text"
                className="form-input"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="e.g., Healthcare Support"
              />
            </div>

            <div className="form-group">
              <label className="form-label">Client Name</label>
              <input
                type="text"
                className="form-input"
                value={formData.client}
                onChange={(e) => setFormData({ ...formData, client: e.target.value })}
                placeholder="e.g., HealthCorp"
              />
            </div>

            <div className="form-group">
              <label className="form-label">Description</label>
              <textarea
                className="form-input"
                rows="3"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Brief description of the project..."
              />
            </div>

            <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
              <button className="btn btn-secondary" onClick={() => setShowModal(false)}>Cancel</button>
              <button className="btn btn-primary" onClick={handleCreate}>Create Project</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}