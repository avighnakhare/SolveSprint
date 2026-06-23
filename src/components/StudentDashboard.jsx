import React from 'react';
import { Trophy, Award, Flame, Zap, User, Plus, Users, Calendar, ArrowRight, ShieldCheck } from 'lucide-react';

export default function StudentDashboard({ 
  currentUser, 
  challenges, 
  submissions, 
  teams, 
  navigate 
}) {
  if (!currentUser) return null;

  // Filter student submissions
  const studentSubs = submissions.filter(s => s.studentId === currentUser.id);

  // Filter student active challenges
  const activeSprintIds = currentUser.watchlist || [];
  
  // Find joined challenges (based on submissions or watchlist)
  const joinedChallengeIds = new Set([
    ...studentSubs.map(s => s.challengeId),
    ...activeSprintIds
  ]);
  
  const activeJoinedSprints = challenges.filter(c => joinedChallengeIds.has(c.id) && c.status === 'active');
  const recommendedSprints = challenges.filter(c => 
    !joinedChallengeIds.has(c.id) && 
    c.status === 'active' && 
    c.interests?.some(i => currentUser.interests?.includes(i))
  ).slice(0, 2);

  // Fallback recommended if empty
  const recommendationsList = recommendedSprints.length > 0 
    ? recommendedSprints 
    : challenges.filter(c => !joinedChallengeIds.has(c.id) && c.status === 'active').slice(0, 2);

  // Student active team
  const activeTeam = teams.find(t => t.members.includes(currentUser.id));

  // XP calculation
  const nextLevelXp = 3000;
  const xpPercentage = Math.min((currentUser.XP / nextLevelXp) * 100, 100);
  const currentLevel = Math.floor(currentUser.XP / 1000) + 1;

  return (
    <div className="container py-8 anim-fade-in">
      
      {/* Top Banner - Gaming style profile header */}
      <div className="glass-panel" style={{ padding: '32px', marginBottom: '32px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '24px', background: 'linear-gradient(135deg, rgba(20,28,45,0.7) 0%, rgba(139,92,246,0.05) 100%)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
          <div style={{ width: '72px', height: '72px', borderRadius: '50%', background: 'var(--color-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '2.5rem', border: '2px solid rgba(255,255,255,0.1)' }}>
            👦
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <h1 style={{ fontSize: '1.8rem' }}>{currentUser.name}</h1>
              {currentUser.parentConsentStatus === 'approved' && (
                <span className="badge badge-green" style={{ fontSize: '0.65rem', display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <ShieldCheck size={12} /> VERIFIED STUDENT
                </span>
              )}
            </div>
            <p className="text-secondary text-sm">
              {currentUser.grade} &bull; {currentUser.school}
            </p>
          </div>
        </div>

        {/* XP, rank, streaks */}
        <div style={{ display: 'flex', gap: '24px', flexWrap: 'wrap' }}>
          <div className="glass-panel" style={{ padding: '12px 20px', textAlign: 'center', border: '1px solid var(--border-light)', minWidth: '110px' }}>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>LEAGUE RANK</div>
            <div style={{ fontSize: '1.5rem', fontWeight: '900', color: 'var(--color-secondary)' }}>#{currentUser.rank}</div>
          </div>

          <div className="glass-panel" style={{ padding: '12px 20px', textAlign: 'center', border: '1px solid var(--border-light)', minWidth: '110px' }}>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', justifyCenter: 'center', gap: '4px', justifyContent: 'center' }}>
              <Flame size={14} className="text-gradient-pink-cyan" /> STREAK
            </div>
            <div style={{ fontSize: '1.5rem', fontWeight: '900' }} className="text-gradient-pink-cyan">{currentUser.streak} days</div>
          </div>

          <div className="glass-panel" style={{ padding: '12px 20px', textAlign: 'center', border: '1px solid var(--border-light)', minWidth: '110px' }}>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>LEVEL</div>
            <div style={{ fontSize: '1.5rem', fontWeight: '900', color: 'var(--color-primary)' }}>{currentLevel}</div>
          </div>
        </div>
      </div>

      {/* Main Dashboard Workspace layout */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 320px', gap: '32px' }} className="grid-feed-layout">
        
        {/* Left Side: Active sprints, Recommended, Submissions history */}
        <main style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
          
          {/* Active / Registered Sprints */}
          <div>
            <h2 style={{ fontSize: '1.4rem', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Zap size={18} className="text-gradient-violet-cyan" /> Active Registered Sprints
            </h2>
            
            {activeJoinedSprints.length === 0 ? (
              <div className="glass-panel" style={{ padding: '40px', textAlign: 'center', color: 'var(--text-secondary)' }}>
                <p className="mb-4">You are not registered in any active sprint.</p>
                <button onClick={() => navigate('challenges')} className="btn btn-primary btn-sm">Explore Active Sprints</button>
              </div>
            ) : (
              <div className="grid grid-2">
                {activeJoinedSprints.map(ch => {
                  const daysLeft = Math.ceil((new Date(ch.deadline) - new Date()) / (1000 * 60 * 60 * 24));
                  return (
                    <div key={ch.id} className="glass-card cyan" style={{ padding: '20px' }}>
                      <div className="flex justify-between align-center mb-2">
                        <span className="badge badge-cyan" style={{ fontSize: '0.65rem' }}>{ch.category}</span>
                        <span style={{ fontSize: '0.75rem', color: daysLeft <= 3 ? 'var(--color-danger)' : 'var(--text-secondary)' }}>
                          {daysLeft} days left
                        </span>
                      </div>
                      <h3 style={{ fontSize: '1.1rem', marginBottom: '8px' }}>{ch.title}</h3>
                      <p className="text-secondary text-xs mb-4" style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                        {ch.companyLogo} {ch.companyName}
                      </p>
                      
                      {/* Submit vs detail action */}
                      <div style={{ display: 'flex', gap: '8px', marginTop: '12px' }}>
                        <button onClick={() => navigate(`challenge-${ch.id}`)} className="btn btn-outline btn-sm flex-1">
                          Workspace
                        </button>
                        <button 
                          onClick={() => navigate(`challenge-${ch.id}`)} // Will trigger submission modal
                          className="btn btn-primary btn-sm flex-1"
                        >
                          Submit
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Submissions queue state */}
          <div>
            <h2 style={{ fontSize: '1.4rem', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Trophy size={18} style={{ color: 'var(--color-warning)' }} /> Solutions Submission Ledger
            </h2>

            <div className="glass-panel" style={{ overflowX: 'auto' }}>
              {studentSubs.length === 0 ? (
                <div style={{ padding: '32px', textAlign: 'center', color: 'var(--text-muted)' }}>
                  No solutions submitted yet. Build your career credentials by finishing challenges!
                </div>
              ) : (
                <table className="leaderboard-table">
                  <thead>
                    <tr style={{ borderBottom: '1px solid var(--border-glass)' }}>
                      <th className="leaderboard-cell text-muted text-xs">PROJECT</th>
                      <th className="leaderboard-cell text-muted text-xs">SPONSOR</th>
                      <th className="leaderboard-cell text-muted text-xs">SUBMITTED ON</th>
                      <th className="leaderboard-cell text-muted text-xs">STATUS</th>
                      <th className="leaderboard-cell text-muted text-xs">SCORE</th>
                    </tr>
                  </thead>
                  <tbody>
                    {studentSubs.map(sub => {
                      const challenge = challenges.find(c => c.id === sub.challengeId);
                      return (
                        <tr key={sub.id} className="leaderboard-row">
                          <td className="leaderboard-cell font-semibold text-sm">{sub.title}</td>
                          <td className="leaderboard-cell text-sm">{challenge?.companyName}</td>
                          <td className="leaderboard-cell text-sm text-muted">{new Date(sub.createdAt).toLocaleDateString()}</td>
                          <td className="leaderboard-cell">
                            <span className={`badge ${
                              sub.status === 'winner' ? 'badge-amber' : 
                              sub.status === 'finalist' ? 'badge-purple' : 
                              sub.status === 'submitted' ? 'badge-cyan' : 'badge-green'
                            }`}>
                              {sub.status}
                            </span>
                          </td>
                          <td className="leaderboard-cell font-bold text-gradient-violet-cyan">
                            {sub.totalScore ? `${sub.totalScore}/100` : 'Pending'}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              )}
            </div>
          </div>

          {/* Recommended Briefs */}
          <div>
            <div className="flex justify-between align-center mb-4" style={{ justifyContent: 'space-between' }}>
              <h2 style={{ fontSize: '1.4rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Award size={18} className="text-gradient-violet-cyan" /> Recommended Sprints
              </h2>
              <button onClick={() => navigate('challenges')} className="btn btn-outline btn-sm">
                View All &rarr;
              </button>
            </div>

            <div className="grid grid-2">
              {recommendationsList.map(ch => (
                <div key={ch.id} className="glass-card flex flex-col" style={{ padding: '20px' }}>
                  <div className="flex justify-between align-center mb-2">
                    <span className="badge badge-purple" style={{ fontSize: '0.65rem' }}>{ch.category}</span>
                    <span style={{ color: 'var(--color-warning)', fontSize: '0.8rem', fontWeight: 'bold' }}>{ch.prize.split(' ')[0]}</span>
                  </div>
                  <h3 style={{ fontSize: '1.05rem', marginBottom: '8px' }}>{ch.title}</h3>
                  <p className="text-muted text-xs mb-4" style={{ flex: 1 }}>{ch.summary.slice(0, 80)}...</p>
                  <button onClick={() => navigate(`challenge-${ch.id}`)} className="btn btn-primary btn-sm" style={{ alignSelf: 'start' }}>
                    Challenge Details
                  </button>
                </div>
              ))}
            </div>
          </div>

        </main>

        {/* Right Side: Level, Trophy Cabinet, Team Card */}
        <aside style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
          
          {/* XP Progress Card */}
          <div className="glass-panel" style={{ padding: '24px' }}>
            <h3 style={{ fontSize: '1.1rem', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Zap size={16} style={{ color: 'var(--color-primary)' }} /> Experience & Leveling
            </h3>
            
            <div style={{ fontSize: '2rem', fontWeight: '900', color: 'var(--color-primary)' }}>{currentUser.XP} XP</div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginBottom: '12px' }}>Target: {nextLevelXp} XP for Level {currentLevel + 1}</div>

            <div style={{ height: '8px', background: 'var(--bg-surface-elevated)', borderRadius: 'var(--radius-full)', overflow: 'hidden', marginBottom: '16px' }}>
              <div style={{ width: `${xpPercentage}%`, height: '100%', background: 'linear-gradient(90deg, var(--color-primary) 0%, var(--color-secondary) 100%)' }}></div>
            </div>

            <p className="text-secondary text-xs">Submitting solutions grants +200 XP. Winners gain +1,000 XP bonus!</p>
          </div>

          {/* Active Team Panel */}
          <div className="glass-panel" style={{ padding: '24px' }}>
            <h3 style={{ fontSize: '1.1rem', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Users size={16} style={{ color: 'var(--color-secondary)' }} /> Active Alliance
            </h3>

            {activeTeam ? (
              <div>
                <div className="flex align-center gap-3 mb-4">
                  <span style={{ fontSize: '2.5rem' }}>{activeTeam.logo}</span>
                  <div>
                    <div style={{ fontWeight: 'bold', fontSize: '1rem' }}>{activeTeam.name}</div>
                    <div className="text-muted text-xs">Reputation: {activeTeam.reputationScore}</div>
                  </div>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', borderTop: '1px solid var(--border-glass)', paddingTop: '12px' }}>
                  <div className="text-xs text-muted mb-1">TEAM ALLIES:</div>
                  {activeTeam.members.map(mid => {
                    const mate = students.find(s => s.id === mid);
                    return (
                      <div key={mid} style={{ display: 'flex', justifyBetween: 'space-between', fontSize: '0.8rem', justifyContent: 'space-between' }}>
                        <span>👦 {mate?.name || 'You'}</span>
                        <span className="text-muted">(Leader)</span>
                      </div>
                    );
                  })}
                  {activeTeam.invites.map(mid => {
                    const mate = students.find(s => s.id === mid);
                    return (
                      <div key={mid} style={{ display: 'flex', justifyBetween: 'space-between', fontSize: '0.8rem', opacity: 0.6, justifyContent: 'space-between' }}>
                        <span>👦 {mate?.name}</span>
                        <span className="badge badge-pink" style={{ fontSize: '0.55rem', padding: '1px 4px' }}>Invited</span>
                      </div>
                    );
                  })}
                </div>
              </div>
            ) : (
              <div style={{ textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.85rem' }}>
                <p className="mb-4">No active team alliance created.</p>
                <button onClick={() => navigate('challenges')} className="btn btn-outline btn-sm" style={{ width: '100%' }}>Join Challenge to Team-up</button>
              </div>
            )}
          </div>

          {/* Trophy Cabinet */}
          <div className="glass-panel" style={{ padding: '24px' }}>
            <h3 style={{ fontSize: '1.1rem', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Award size={16} style={{ color: 'var(--color-warning)' }} /> Trophy Cabinet
            </h3>

            <div className="trophy-grid">
              {currentUser.badges?.map(badge => (
                <div key={badge} className="trophy-item" title={badge}>
                  <span className="trophy-icon">
                    {badge.includes('Coder') ? '💻' : badge.includes('Solver') ? '🧩' : badge.includes('Catalyst') ? '🧪' : badge.includes('Grandmaster') ? '👑' : '⭐'}
                  </span>
                  <span style={{ fontSize: '0.65rem', fontWeight: 'bold' }}>{badge}</span>
                </div>
              ))}
            </div>
          </div>

        </aside>

      </div>

    </div>
  );
}
