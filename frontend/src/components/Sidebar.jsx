import { NavLink } from 'react-router-dom';
import { 
  LayoutDashboard, 
  FolderKanban, 
  Target, 
  FileText, 
  BarChart3, 
  Lightbulb, 
  Settings,
  LogOut
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const navItems = [
  { to: '/', icon: LayoutDashboard, label: 'Dashboard' },
  { to: '/projects', icon: FolderKanban, label: 'Projects' },
  { to: '/kpis', icon: Target, label: 'KPI Definitions' },
  { to: '/justifications', icon: FileText, label: 'Justifications' },
  { to: '/reports', icon: BarChart3, label: 'Reports' },
  { to: '/knowledge', icon: Lightbulb, label: 'Knowledge Base' },
];

export default function Sidebar() {
  const { user, logout } = useAuth();

  return (
    <aside className="sidebar">
      <div className="sidebar-logo">
        <div className="logo-icon">⚡</div>
        <span className="logo-text">OpsGPT</span>
      </div>

      <nav className="nav-section">
        <div className="nav-label">Main Menu</div>
        {navItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
            end={item.to === '/'}
          >
            <item.icon />
            <span>{item.label}</span>
          </NavLink>
        ))}
      </nav>

      <nav className="nav-section" style={{ marginTop: 'auto' }}>
        <NavLink to="/settings" className="nav-item">
          <Settings />
          <span>Settings</span>
        </NavLink>
        <div className="nav-item" onClick={logout} style={{ cursor: 'pointer' }}>
          <LogOut />
          <span>Logout</span>
        </div>
      </nav>

      {user && (
        <div style={{ padding: '16px', borderTop: '1px solid var(--border-color)', marginTop: '24px' }}>
          <div style={{ fontSize: '14px', fontWeight: '500' }}>{user.first_name} {user.last_name}</div>
          <div style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: '4px' }}>{user.role}</div>
        </div>
      )}
    </aside>
  );
}