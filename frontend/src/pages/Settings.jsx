import { useState } from 'react';
import { User, Building2, Bell, Shield, Database, Palette } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function Settings() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('profile');

  const tabs = [
    { id: 'profile', label: 'Profile', icon: User },
    { id: 'organization', label: 'Organization', icon: Building2 },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'security', label: 'Security', icon: Shield },
    { id: 'data', label: 'Data Management', icon: Database },
  ];

  return (
    <div className="fade-in">
      <div className="page-header">
        <div>
          <h1 className="page-title">Settings</h1>
          <p className="page-subtitle">Manage your account and preferences</p>
        </div>
      </div>

      <div style={{ display: 'flex', gap: '24px' }}>
        <div className="card" style={{ width: '240px', padding: '16px', height: 'fit-content' }}>
          {tabs.map((tab) => (
            <div
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`nav-item ${activeTab === tab.id ? 'active' : ''}`}
              style={{ marginBottom: '4px' }}
            >
              <tab.icon size={18} />
              <span>{tab.label}</span>
            </div>
          ))}
        </div>

        <div className="card" style={{ flex: 1 }}>
          {activeTab === 'profile' && (
            <div>
              <h3 style={{ fontSize: '18px', fontWeight: '600', marginBottom: '24px' }}>Profile Settings</h3>
              
              <div style={{ display: 'flex', alignItems: 'center', gap: '24px', marginBottom: '32px' }}>
                <div style={{
                  width: '80px',
                  height: '80px',
                  borderRadius: '50%',
                  background: 'var(--accent-gradient)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '32px',
                  fontWeight: '600'
                }}>
                  {user?.first_name?.[0]}{user?.last_name?.[0]}
                </div>
                <div>
                  <button className="btn btn-secondary">Change Photo</button>
                  <p style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: '8px' }}>JPG, PNG or GIF. Max 2MB.</p>
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                <div className="form-group">
                  <label className="form-label">First Name</label>
                  <input type="text" className="form-input" defaultValue={user?.first_name} />
                </div>
                <div className="form-group">
                  <label className="form-label">Last Name</label>
                  <input type="text" className="form-input" defaultValue={user?.last_name} />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Email</label>
                <input type="email" className="form-input" defaultValue={user?.email} disabled style={{ opacity: 0.6 }} />
              </div>

              <div className="form-group">
                <label className="form-label">Role</label>
                <input type="text" className="form-input" defaultValue={user?.role} disabled style={{ opacity: 0.6 }} />
              </div>

              <button className="btn btn-primary">Save Changes</button>
            </div>
          )}

          {activeTab === 'organization' && (
            <div>
              <h3 style={{ fontSize: '18px', fontWeight: '600', marginBottom: '24px' }}>Organization Settings</h3>
              
              <div className="form-group">
                <label className="form-label">Organization Name</label>
                <input type="text" className="form-input" defaultValue="BPO Operations Inc." />
              </div>

              <div className="form-group">
                <label className="form-label">Organization Code</label>
                <input type="text" className="form-input" defaultValue="BPO001" />
              </div>

              <div className="form-group">
                <label className="form-label">Description</label>
                <textarea className="form-input" rows="3" defaultValue="Leading BPO company managing multiple client accounts" />
              </div>

              <button className="btn btn-primary">Save Changes</button>
            </div>
          )}

          {activeTab === 'notifications' && (
            <div>
              <h3 style={{ fontSize: '18px', fontWeight: '600', marginBottom: '24px' }}>Notification Preferences</h3>
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                {[
                  { label: 'KPI Threshold Alerts', desc: 'Get notified when KPIs exceed threshold' },
                  { label: 'Justification Updates', desc: 'Receive updates on justification status changes' },
                  { label: 'Weekly Reports', desc: 'Get weekly summary reports via email' },
                  { label: 'Team Activity', desc: 'Notifications for team member actions' },
                ].map((item, i) => (
                  <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px', background: 'var(--bg-tertiary)', borderRadius: '12px' }}>
                    <div>
                      <div style={{ fontWeight: '500' }}>{item.label}</div>
                      <div style={{ fontSize: '13px', color: 'var(--text-muted)' }}>{item.desc}</div>
                    </div>
                    <label style={{ position: 'relative', width: '48px', height: '26px', cursor: 'pointer' }}>
                      <input type="checkbox" style={{ opacity: 0, width: 0, height: 0 }} defaultChecked />
                      <span style={{
                        position: 'absolute',
                        inset: 0,
                        background: 'var(--accent-primary)',
                        borderRadius: '13px',
                        transition: 'all 0.2s'
                      }}>
                        <span style={{
                          position: 'absolute',
                          left: '3px',
                          top: '3px',
                          width: '20px',
                          height: '20px',
                          background: 'white',
                          borderRadius: '50%',
                          transition: 'all 0.2s'
                        }} />
                      </span>
                    </label>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'security' && (
            <div>
              <h3 style={{ fontSize: '18px', fontWeight: '600', marginBottom: '24px' }}>Security Settings</h3>
              
              <div className="form-group">
                <label className="form-label">Current Password</label>
                <input type="password" className="form-input" placeholder="Enter current password" />
              </div>

              <div className="form-group">
                <label className="form-label">New Password</label>
                <input type="password" className="form-input" placeholder="Enter new password" />
              </div>

              <div className="form-group">
                <label className="form-label">Confirm New Password</label>
                <input type="password" className="form-input" placeholder="Confirm new password" />
              </div>

              <button className="btn btn-primary">Update Password</button>

              <div style={{ marginTop: '32px', padding: '20px', background: 'var(--bg-tertiary)', borderRadius: '12px' }}>
                <h4 style={{ fontSize: '14px', fontWeight: '600', marginBottom: '12px' }}>Two-Factor Authentication</h4>
                <p style={{ fontSize: '13px', color: 'var(--text-secondary)', marginBottom: '16px' }}>Add an extra layer of security to your account</p>
                <button className="btn btn-secondary">Enable 2FA</button>
              </div>
            </div>
          )}

          {activeTab === 'data' && (
            <div>
              <h3 style={{ fontSize: '18px', fontWeight: '600', marginBottom: '24px' }}>Data Management</h3>
              
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '16px', marginBottom: '24px' }}>
                <div style={{ padding: '20px', background: 'var(--bg-tertiary)', borderRadius: '12px', textAlign: 'center' }}>
                  <div style={{ fontSize: '32px', fontWeight: '700', color: 'var(--accent-primary)' }}>1,247</div>
                  <div style={{ fontSize: '13px', color: 'var(--text-muted)' }}>KPI Records</div>
                </div>
                <div style={{ padding: '20px', background: 'var(--bg-tertiary)', borderRadius: '12px', textAlign: 'center' }}>
                  <div style={{ fontSize: '32px', fontWeight: '700', color: 'var(--success)' }}>89</div>
                  <div style={{ fontSize: '13px', color: 'var(--text-muted)' }}>Justifications</div>
                </div>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <button className="btn btn-secondary" style={{ justifyContent: 'flex-start' }}>
                  Export All Data (CSV)
                </button>
                <button className="btn btn-secondary" style={{ justifyContent: 'flex-start' }}>
                  Export Reports (PDF)
                </button>
                <button className="btn btn-secondary" style={{ justifyContent: 'flex-start' }}>
                  Generate Backup
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}