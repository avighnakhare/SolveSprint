import React, { useState } from 'react';
import { Shield, Check, X, ShieldAlert, BarChart, Users, Building, ShieldCheck, Mail } from 'lucide-react';

export default function AdminPanel({ 
  companies, 
  challenges, 
  students, 
  submissions, 
  onVerifyCompany, 
  onVerifyChallenge 
}) {
  const [adminTab, setAdminTab] = useState('companies');

  // Filter pending data
  const pendingCompanies = companies.filter(c => c.verificationStatus === 'pending');
  const pendingChallenges = challenges.filter(c => c.status === 'pending_admin');

  // Consent logs: Students under 18
  const minorConsentLogs = students.filter(s => s.guardianEmail);

  // Simple admin stats
  const totalVerifiedCompanies = companies.filter(c => c.verificationStatus === 'verified').length;
  const totalActiveChallenges = challenges.filter(c => c.status === 'active').length;

  return (
    <div className="container py-8 anim-fade-in">
      
      {/* Page Header */}
      <div className="glass-panel mb-8" style={{ padding: '32px', display: 'flex', justifyBetween: 'space-between', alignItems: 'center', background: 'linear-gradient(135deg, rgba(20,28,45,0.7) 0%, rgba(236,72,153,0.05) 100%)', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div style={{ width: '56px', height: '56px', borderRadius: '50%', background: 'rgba(236,72,153,0.1)', display: 'flex', alignItems: 'center', justifyCenter: 'center', color: 'var(--color-accent)', justifyContent: 'center' }}>
            <Shield size={28} />
          </div>
          <div>
            <h1 style={{ fontSize: '1.8rem' }}>Platform Administrator Console</h1>
            <p className="text-secondary text-sm">Verify corporate sponsors, approve weekly rounds and audit guardian signatures.</p>
          </div>
        </div>
        <span className="badge badge-pink">Moderator Status Active</span>
      </div>

      {/* Admin Quick Metrics Dashboard */}
      <div className="grid grid-4 mb-8">
        <div className="glass-panel" style={{ padding: '16px 20px', display: 'flex', alignItems: 'center', gap: '16px' }}>
          <Building size={24} style={{ color: 'var(--color-primary)' }} />
          <div>
            <div className="text-muted text-xs">APPROVED COMPANIES</div>
            <div style={{ fontSize: '1.3rem', fontWeight: 'bold' }}>{totalVerifiedCompanies} / {companies.length}</div>
          </div>
        </div>

        <div className="glass-panel" style={{ padding: '16px 20px', display: 'flex', alignItems: 'center', gap: '16px' }}>
          <ShieldAlert size={24} style={{ color: 'var(--color-accent)' }} />
          <div>
            <div className="text-muted text-xs">PENDING REVIEWS</div>
            <div style={{ fontSize: '1.3rem', fontWeight: 'bold' }}>{pendingCompanies.length + pendingChallenges.length} Items</div>
          </div>
        </div>

        <div className="glass-panel" style={{ padding: '16px 20px', display: 'flex', alignItems: 'center', gap: '16px' }}>
          <Users size={24} style={{ color: 'var(--color-secondary)' }} />
          <div>
            <div className="text-muted text-xs">TOTAL STUDENTS</div>
            <div style={{ fontSize: '1.3rem', fontWeight: 'bold' }}>{students.length} Accounts</div>
          </div>
        </div>

        <div className="glass-panel" style={{ padding: '16px 20px', display: 'flex', alignItems: 'center', gap: '16px' }}>
          <ShieldCheck size={24} style={{ color: 'var(--color-success)' }} />
          <div>
            <div className="text-muted text-xs">VERIFIED CONSENTS</div>
            <div style={{ fontSize: '1.3rem', fontWeight: 'bold' }}>
              {students.filter(s => s.parentConsentStatus === 'approved').length} Audits
            </div>
          </div>
        </div>
      </div>

      {/* Switcher Navigation */}
      <div className="tabs-nav" style={{ marginBottom: '24px' }}>
        <button className={`tab-btn ${adminTab === 'companies' ? 'active' : ''}`} onClick={() => setAdminTab('companies')}>
          🏢 Business Reviews ({pendingCompanies.length})
        </button>
        <button className={`tab-btn ${adminTab === 'challenges' ? 'active' : ''}`} onClick={() => setAdminTab('challenges')}>
          ⚡ Challenge Sprints ({pendingChallenges.length})
        </button>
        <button className={`tab-btn ${adminTab === 'consent' ? 'active' : ''}`} onClick={() => setAdminTab('consent')}>
          🛡️ Parent Consent logs ({minorConsentLogs.length})
        </button>
      </div>

      {/* TAB CONTENT 1: BUSINESS VERIFICATION REVIEW */}
      {adminTab === 'companies' && (
        <div className="glass-panel" style={{ padding: '24px' }}>
          <h3 style={{ fontSize: '1.25rem', marginBottom: '16px' }}>Company Verification Requests</h3>
          
          {pendingCompanies.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '32px 0', color: 'var(--text-muted)' }}>
              No business accounts awaiting verification review.
            </div>
          ) : (
            <div style={{ overflowX: 'auto' }}>
              <table className="leaderboard-table">
                <thead>
                  <tr style={{ borderBottom: '1px solid var(--border-glass)' }}>
                    <th className="leaderboard-cell text-muted text-xs">COMPANY</th>
                    <th className="leaderboard-cell text-muted text-xs">WEBSITE</th>
                    <th className="leaderboard-cell text-muted text-xs">CONTACT PERSON</th>
                    <th className="leaderboard-cell text-muted text-xs">DOCS</th>
                    <th className="leaderboard-cell text-muted text-xs" style={{ textAlign: 'right' }}>ACTIONS</th>
                  </tr>
                </thead>
                <tbody>
                  {pendingCompanies.map(c => (
                    <tr key={c.id} className="leaderboard-row">
                      <td className="leaderboard-cell font-semibold text-sm">{c.businessName}</td>
                      <td className="leaderboard-cell text-sm text-secondary">
                        <a href={c.website} target="_blank" rel="noreferrer" style={{ color: 'var(--color-secondary)' }}>{c.website}</a>
                      </td>
                      <td className="leaderboard-cell text-sm">{c.contactPerson}</td>
                      <td className="leaderboard-cell text-sm">
                        <span className="badge badge-purple" style={{ cursor: 'pointer', fontSize: '0.65rem' }} onClick={() => alert("Simulating business license credential sheet preview...")}>
                          EIN_License_Proof.pdf
                        </span>
                      </td>
                      <td className="leaderboard-cell" style={{ textAlign: 'right' }}>
                        <div style={{ display: 'inline-flex', gap: '8px' }}>
                          <button onClick={() => onVerifyCompany(c.id, 'verified')} className="btn btn-secondary btn-sm" style={{ padding: '6px 12px' }}>
                            <Check size={14} /> Approve
                          </button>
                          <button onClick={() => onVerifyCompany(c.id, 'rejected')} className="btn btn-danger btn-sm" style={{ padding: '6px 12px' }}>
                            <X size={14} /> Reject
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* TAB CONTENT 2: CHALLENGE APPROVALS */}
      {adminTab === 'challenges' && (
        <div className="glass-panel" style={{ padding: '24px' }}>
          <h3 style={{ fontSize: '1.25rem', marginBottom: '16px' }}>Sprint Challenges Review List</h3>

          {pendingChallenges.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '32px 0', color: 'var(--text-muted)' }}>
              No challenge submissions awaiting publishing review.
            </div>
          ) : (
            <div style={{ overflowX: 'auto' }}>
              <table className="leaderboard-table">
                <thead>
                  <tr style={{ borderBottom: '1px solid var(--border-glass)' }}>
                    <th className="leaderboard-cell text-muted text-xs">TITLE</th>
                    <th className="leaderboard-cell text-muted text-xs">COMPANY ID</th>
                    <th className="leaderboard-cell text-muted text-xs">CATEGORY</th>
                    <th className="leaderboard-cell text-muted text-xs">PRIZE</th>
                    <th className="leaderboard-cell text-muted text-xs" style={{ textAlign: 'right' }}>ACTIONS</th>
                  </tr>
                </thead>
                <tbody>
                  {pendingChallenges.map(ch => (
                    <tr key={ch.id} className="leaderboard-row">
                      <td className="leaderboard-cell font-semibold text-sm">
                        <div>{ch.title}</div>
                        <div className="text-muted text-xs font-normal mt-1">{ch.summary}</div>
                      </td>
                      <td className="leaderboard-cell text-sm">{ch.companyName}</td>
                      <td className="leaderboard-cell">
                        <span className="badge badge-purple" style={{ fontSize: '0.65rem' }}>{ch.category}</span>
                      </td>
                      <td className="leaderboard-cell text-sm font-semibold">{ch.prize}</td>
                      <td className="leaderboard-cell" style={{ textAlign: 'right' }}>
                        <div style={{ display: 'inline-flex', gap: '8px' }}>
                          <button onClick={() => onVerifyChallenge(ch.id, 'active')} className="btn btn-secondary btn-sm" style={{ padding: '6px 12px' }}>
                            <Check size={14} /> Approve & Publish
                          </button>
                          <button onClick={() => onVerifyChallenge(ch.id, 'rejected')} className="btn btn-danger btn-sm" style={{ padding: '6px 12px' }}>
                            <X size={14} /> Reject
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* TAB CONTENT 3: PARENT CONSENT AUDITS LOG */}
      {adminTab === 'consent' && (
        <div className="glass-panel" style={{ padding: '24px' }}>
          <h3 style={{ fontSize: '1.25rem', marginBottom: '16px' }}>COPPA Compliance Consent Audit Trail</h3>

          <div style={{ overflowX: 'auto' }}>
            <table className="leaderboard-table">
              <thead>
                <tr style={{ borderBottom: '1px solid var(--border-glass)' }}>
                  <th className="leaderboard-cell text-muted text-xs">STUDENT</th>
                  <th className="leaderboard-cell text-muted text-xs">GUARDIAN NAME</th>
                  <th className="leaderboard-cell text-muted text-xs">GUARDIAN EMAIL</th>
                  <th className="leaderboard-cell text-muted text-xs">CONSENT STATUS</th>
                  <th className="leaderboard-cell text-muted text-xs" style={{ textAlign: 'right' }}>ACTIONS</th>
                </tr>
              </thead>
              <tbody>
                {minorConsentLogs.map(st => (
                  <tr key={st.id} className="leaderboard-row">
                    <td className="leaderboard-cell font-semibold text-sm">
                      <div>👦 {st.name}</div>
                      <div className="text-muted text-xs font-normal mt-1">{st.school}</div>
                    </td>
                    <td className="leaderboard-cell text-sm">{st.guardianName}</td>
                    <td className="leaderboard-cell text-sm">
                      <span style={{ display: 'inline-flex', alignCenter: 'center', gap: '6px', alignItems: 'center' }}>
                        <Mail size={12} className="text-secondary" /> {st.guardianEmail}
                      </span>
                    </td>
                    <td className="leaderboard-cell">
                      <span className={`badge ${st.parentConsentStatus === 'approved' ? 'badge-green' : 'badge-pink'}`}>
                        {st.parentConsentStatus}
                      </span>
                    </td>
                    <td className="leaderboard-cell" style={{ textAlign: 'right' }}>
                      {st.parentConsentStatus === 'pending' ? (
                        <button 
                          onClick={() => {
                            st.parentConsentStatus = 'approved';
                            onVerifyChallenge(); // Dummy trigger state reload
                            alert(`Simulated guardian signature verification override approved for ${st.name}!`);
                          }} 
                          className="btn btn-outline btn-sm"
                          style={{ padding: '4px 10px', fontSize: '0.75rem' }}
                        >
                          Approve Consent Override
                        </button>
                      ) : (
                        <span className="text-muted text-xs">Audit Locked</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

    </div>
  );
}
