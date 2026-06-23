import React, { useState } from 'react';
import { Bell, User, LogOut, X, Menu, Sparkles } from 'lucide-react';

export function Header({ currentUser, setCurrentUser, navigate, unreadCount, toggleNotifications }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    setCurrentUser(null);
    navigate('landing');
  };

  return (
    <header className="app-header">
      <div className="container flex align-center justify-between">
        <a href="#landing" onClick={(e) => { e.preventDefault(); navigate('landing'); }} className="logo-container">
          <div className="logo-icon">S</div>
          <span>SolveSprint</span>
        </a>

        {/* Desktop Navigation */}
        <nav className="nav-links" style={{ display: 'none' }}>
          {/* Handled dynamically below */}
        </nav>

        <div className="flex align-center gap-4" style={{ display: 'flex' }}>
          <a href="#challenges" onClick={(e) => { e.preventDefault(); navigate('challenges'); }} className="nav-link">
            Challenges
          </a>
          <a href="#leaderboards" onClick={(e) => { e.preventDefault(); navigate('leaderboards'); }} className="nav-link">
            Leaderboard
          </a>

          {currentUser ? (
            <>
              {currentUser.role === 'student' && (
                <a href="#dashboard" onClick={(e) => { e.preventDefault(); navigate('student-dashboard'); }} className="nav-link">
                  Dashboard
                </a>
              )}
              {currentUser.role === 'company' && (
                <a href="#dashboard" onClick={(e) => { e.preventDefault(); navigate('company-dashboard'); }} className="nav-link">
                  Console
                </a>
              )}
              {currentUser.role === 'admin' && (
                <a href="#admin" onClick={(e) => { e.preventDefault(); navigate('admin-panel'); }} className="nav-link">
                  Admin
                </a>
              )}

              {/* Notification Bell */}
              <button
                onClick={toggleNotifications}
                style={{
                  background: 'transparent',
                  border: 'none',
                  color: 'var(--text-secondary)',
                  cursor: 'pointer',
                  position: 'relative',
                  padding: '8px',
                  display: 'flex',
                  alignItems: 'center'
                }}
              >
                <Bell size={18} />
                {unreadCount > 0 && (
                  <span style={{
                    position: 'absolute',
                    top: '4px',
                    right: '4px',
                    width: '16px',
                    height: '16px',
                    background: 'var(--color-primary)',
                    borderRadius: '50%',
                    color: '#fff',
                    fontSize: '9px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontWeight: 'bold'
                  }}>
                    {unreadCount}
                  </span>
                )}
              </button>

              {/* Profile Link */}
              {currentUser.role === 'student' && (
                <button
                  onClick={() => navigate(`portfolio-${currentUser.id}`)}
                  style={{
                    background: 'var(--bg-surface-elevated)',
                    border: '1px solid var(--border-default)',
                    color: 'var(--text-primary)',
                    borderRadius: 'var(--radius-sm)',
                    padding: '6px 12px',
                    fontSize: '0.8rem',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    fontWeight: '500'
                  }}
                >
                  <User size={14} /> Profile
                </button>
              )}

              <button
                onClick={handleLogout}
                style={{
                  background: 'transparent',
                  border: 'none',
                  color: 'var(--text-muted)',
                  cursor: 'pointer',
                  padding: '8px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px',
                  fontSize: '0.8rem'
                }}
                title="Log Out"
              >
                <LogOut size={16} />
              </button>
            </>
          ) : (
            <>
              <button onClick={() => navigate('login')} className="nav-link" style={{ background: 'transparent', border: 'none', cursor: 'pointer', fontFamily: 'inherit', fontSize: '0.875rem' }}>
                Log in
              </button>
              <button onClick={() => navigate('role-selection')} className="btn btn-primary btn-sm">
                Sign Up
              </button>
            </>
          )}

          {/* Mobile Menu Toggle */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            style={{
              background: 'transparent',
              border: 'none',
              color: 'var(--text-primary)',
              cursor: 'pointer',
              display: 'none'
            }}
            className="mobile-toggle-btn"
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Nav Drawer */}
      {mobileMenuOpen && (
        <div style={{
          background: 'var(--bg-surface)',
          padding: '16px 24px',
          borderBottom: '1px solid var(--border-default)',
          display: 'flex',
          flexDirection: 'column',
          gap: '14px'
        }}>
          <a href="#challenges" onClick={(e) => { e.preventDefault(); navigate('challenges'); setMobileMenuOpen(false); }} className="nav-link">Challenges</a>
          <a href="#leaderboards" onClick={(e) => { e.preventDefault(); navigate('leaderboards'); setMobileMenuOpen(false); }} className="nav-link">Leaderboards</a>
          {currentUser && currentUser.role === 'student' && (
            <a href="#dashboard" onClick={(e) => { e.preventDefault(); navigate('student-dashboard'); setMobileMenuOpen(false); }} className="nav-link">Dashboard</a>
          )}
          {currentUser && currentUser.role === 'company' && (
            <a href="#console" onClick={(e) => { e.preventDefault(); navigate('company-dashboard'); setMobileMenuOpen(false); }} className="nav-link">Console</a>
          )}
          {currentUser && currentUser.role === 'admin' && (
            <a href="#admin" onClick={(e) => { e.preventDefault(); navigate('admin-panel'); setMobileMenuOpen(false); }} className="nav-link">Admin</a>
          )}
        </div>
      )}
    </header>
  );
}

export function Footer({ navigate }) {
  return (
    <footer style={{
      background: 'var(--bg-surface)',
      borderTop: '1px solid var(--border-default)',
      padding: '48px 0 24px 0',
      marginTop: 'auto'
    }}>
      <div className="container">
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '32px',
          marginBottom: '40px'
        }}>
          <div>
            <div className="logo-container" style={{ marginBottom: '16px' }}>
              <div className="logo-icon">S</div>
              <span>SolveSprint</span>
            </div>
            <p className="text-muted text-sm" style={{ lineHeight: '1.6' }}>
              The high-school exclusive competition league. Build a certified portfolio, compete, and kickstart your career.
            </p>
          </div>

          <div>
            <h4 style={{ marginBottom: '16px', fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--text-muted)', fontWeight: '600' }}>Platform</h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <a href="#challenges" onClick={(e) => { e.preventDefault(); navigate('challenges'); }} className="nav-link text-sm">Browse Challenges</a>
              <a href="#leaderboards" onClick={(e) => { e.preventDefault(); navigate('leaderboards'); }} className="nav-link text-sm">Leaderboards</a>
              <a href="#about" onClick={(e) => { e.preventDefault(); navigate('landing'); }} className="nav-link text-sm">How it Works</a>
            </div>
          </div>

          <div>
            <h4 style={{ marginBottom: '16px', fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--text-muted)', fontWeight: '600' }}>Legal</h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <a href="#terms" onClick={(e) => { e.preventDefault(); navigate('terms-page'); }} className="nav-link text-sm">Terms & Conditions</a>
              <a href="#privacy" onClick={(e) => { e.preventDefault(); navigate('privacy-page'); }} className="nav-link text-sm">Privacy Policy</a>
              <a href="#guardian" onClick={(e) => { e.preventDefault(); navigate('consent-page'); }} className="nav-link text-sm">Parent Consent</a>
            </div>
          </div>

          <div>
            <h4 style={{ marginBottom: '16px', fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--text-muted)', fontWeight: '600' }}>Contact</h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <span className="text-secondary text-sm">support@solvesprint.com</span>
              <span className="text-muted text-sm">Built for high school visionaries.</span>
            </div>
          </div>
        </div>

        <div style={{
          borderTop: '1px solid var(--border-subtle)',
          paddingTop: '24px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '16px'
        }}>
          <p className="text-muted text-xs">&copy; 2026 SolveSprint Inc. All rights reserved.</p>
          <div style={{ display: 'flex', gap: '16px' }} className="text-xs text-muted">
            <span>Parent Consent Compliant</span>
            <span>&bull;</span>
            <span>COPPA Aligned</span>
          </div>
        </div>
      </div>
    </footer>
  );
}

export function RoleSwitcher({ currentRole, mockStudents, mockCompanies, setCurrentUser, navigate }) {
  const [isCollapsed, setIsCollapsed] = useState(false);

  return (
    <div className="role-switcher-floating" style={{ background: 'rgba(20, 20, 20, 0.95)', borderColor: 'var(--border-default)' }}>
      <div
        onClick={() => setIsCollapsed(!isCollapsed)}
        style={{ fontSize: '0.7rem', fontWeight: '700', color: 'var(--text-muted)', marginBottom: isCollapsed ? '0' : '10px', display: 'flex', alignItems: 'center', gap: '6px', cursor: 'pointer', textTransform: 'uppercase', letterSpacing: '0.08em' }}
      >
        <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: 'var(--color-primary)' }} />
        Prototype Switcher
      </div>
      {!isCollapsed && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
          {[
            { label: 'Student (Alex)', role: 'student', action: () => { setCurrentUser(mockStudents[0]); navigate('student-dashboard'); } },
            { label: 'Company (Linear)', role: 'company', action: () => { setCurrentUser(mockCompanies[0]); navigate('company-dashboard'); } },
            { label: 'Admin', role: 'admin', action: () => { setCurrentUser({ id: 'admin_1', name: 'Platform Moderator', role: 'admin' }); navigate('admin-panel'); } },
          ].map(({ label, role, action }) => (
            <button
              key={role}
              onClick={action}
              style={{
                background: currentRole === role ? 'var(--color-primary)' : 'var(--bg-surface-elevated)',
                border: currentRole === role ? 'none' : '1px solid var(--border-default)',
                color: currentRole === role ? '#fff' : 'var(--text-secondary)',
                padding: '6px 12px',
                borderRadius: 'var(--radius-sm)',
                cursor: 'pointer',
                fontSize: '0.75rem',
                textAlign: 'left',
                fontWeight: '600',
                transition: 'all 0.15s ease'
              }}
            >
              {label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

export function NotificationPanel({ notifications, onClose, onMarkRead }) {
  return (
    <div className="notification-modal card">
      <div style={{
        padding: '16px 20px',
        borderBottom: '1px solid var(--border-default)',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
      }}>
        <h3 style={{ fontSize: '1rem', fontWeight: '700', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Bell size={16} /> Notifications
        </h3>
        <button onClick={onClose} style={{ background: 'transparent', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', padding: '4px' }}>
          <X size={16} />
        </button>
      </div>

      <div style={{ overflowY: 'auto', flex: 1 }}>
        {notifications.length === 0 ? (
          <div style={{ padding: '40px 24px', textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.875rem' }}>
            All caught up! No notifications.
          </div>
        ) : (
          notifications.map(notif => (
            <div
              key={notif.id}
              className={`notification-item ${!notif.read ? 'unread' : ''}`}
              onClick={() => onMarkRead(notif.id)}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                <span style={{ fontWeight: '600', fontSize: '0.85rem', color: !notif.read ? 'var(--text-primary)' : 'var(--text-secondary)' }}>
                  {notif.title}
                </span>
                <span className="text-muted text-xs">
                  {new Date(notif.date).toLocaleDateString()}
                </span>
              </div>
              <p className="text-secondary text-xs" style={{ margin: 0, lineHeight: '1.5' }}>{notif.message}</p>
              {!notif.read && (
                <span className="badge badge-purple text-xs" style={{ marginTop: '8px', fontSize: '0.6rem', padding: '2px 6px' }}>New</span>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}
