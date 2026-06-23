import React, { useState } from 'react';
import { Trophy, Award, Flame, Users, BookOpen, GraduationCap, Star, Sparkles } from 'lucide-react';

export default function Leaderboard({ students, teams, navigate }) {
  const [boardTab, setBoardTab] = useState('global'); // global, school, category, team
  const [selectedCategory, setSelectedCategory] = useState('Coding');

  // Sort students by XP for Global Board
  const globalStudents = [...students].sort((a, b) => b.XP - a.XP);

  // Group by School & sum XP
  const schoolXP = students.reduce((acc, curr) => {
    acc[curr.school] = (acc[curr.school] || 0) + curr.XP;
    return acc;
  }, {});
  
  const schoolBoard = Object.entries(schoolXP)
    .map(([school, xp]) => ({ school, xp }))
    .sort((a, b) => b.xp - a.xp);

  // Filter students by Category Interests
  const categoryStudents = students.filter(s => s.interests?.includes(selectedCategory.toLowerCase()))
    .sort((a, b) => b.XP - a.XP);

  // Sort Teams by reputation Score
  const teamBoard = [...teams].sort((a, b) => b.reputationScore - a.reputationScore);

  return (
    <div className="container py-8 anim-fade-in">
      
      {/* Title Header */}
      <div style={{ marginBottom: '32px' }}>
        <h1 style={{ fontSize: '2.5rem', marginBottom: '8px' }}>Leaderboard & League Standings</h1>
        <p className="text-secondary">Track weekly rounds progress. Earn experience points (XP) to climb the ladder ranks.</p>
      </div>

      {/* Tabs list */}
      <div className="tabs-nav" style={{ marginBottom: '32px' }}>
        <button className={`tab-btn ${boardTab === 'global' ? 'active' : ''}`} onClick={() => setBoardTab('global')}>
          🌎 Global Standings
        </button>
        <button className={`tab-btn ${boardTab === 'school' ? 'active' : ''}`} onClick={() => setBoardTab('school')}>
          🏫 School Rankings
        </button>
        <button className={`tab-btn ${boardTab === 'category' ? 'active' : ''}`} onClick={() => setBoardTab('category')}>
          🏷️ Category Leaders
        </button>
        <button className={`tab-btn ${boardTab === 'team' ? 'active' : ''}`} onClick={() => setBoardTab('team')}>
          👥 Team Alliances
        </button>
      </div>

      {/* Render boards based on active tab */}
      <div className="glass-panel" style={{ padding: '24px' }}>
        
        {/* category picker */}
        {boardTab === 'category' && (
          <div style={{ display: 'flex', gap: '8px', marginBottom: '24px', flexWrap: 'wrap' }}>
            {['Coding', 'Design', 'Business', 'Social Impact'].map(cat => (
              <button 
                key={cat} 
                className={`btn btn-sm ${selectedCategory === cat ? 'btn-secondary' : 'btn-outline'}`}
                onClick={() => setSelectedCategory(cat)}
              >
                {cat}
              </button>
            ))}
          </div>
        )}

        {/* Global Standings Table */}
        {boardTab === 'global' && (
          <table className="leaderboard-table">
            <thead>
              <tr style={{ borderBottom: '1px solid var(--border-glass)' }}>
                <th className="leaderboard-cell text-muted text-xs">RANK</th>
                <th className="leaderboard-cell text-muted text-xs">STUDENT</th>
                <th className="leaderboard-cell text-muted text-xs">HIGH SCHOOL</th>
                <th className="leaderboard-cell text-muted text-xs">BADGES</th>
                <th className="leaderboard-cell text-muted text-xs">STREAK</th>
                <th className="leaderboard-cell text-muted text-xs" style={{ textAlign: 'right' }}>TOTAL XP</th>
              </tr>
            </thead>
            <tbody>
              {globalStudents.map((st, index) => {
                const rank = index + 1;
                return (
                  <tr key={st.id} className={`leaderboard-row ${rank <= 3 ? 'top-three' : ''}`} style={{ cursor: 'pointer' }} onClick={() => navigate(`portfolio-${st.id}`)}>
                    <td className="leaderboard-cell font-semibold">
                      {rank === 1 ? '🥇' : rank === 2 ? '🥈' : rank === 3 ? '🥉' : `#${rank}`}
                    </td>
                    <td className="leaderboard-cell">
                      <div style={{ display: 'flex', alignCenter: 'center', gap: '10px', alignItems: 'center' }}>
                        <span>👦</span>
                        <div>
                          <div style={{ fontWeight: 'bold', fontSize: '0.95rem' }} className="flex align-center gap-1">
                            {st.name} 
                            {st.streak >= 5 && <Sparkles size={12} className="text-gradient-pink-cyan" title="Rising Star" />}
                          </div>
                          <div className="text-muted text-xs">{st.grade}</div>
                        </div>
                      </div>
                    </td>
                    <td className="leaderboard-cell text-sm text-secondary">{st.school}</td>
                    <td className="leaderboard-cell">
                      <span className="badge badge-purple" style={{ fontSize: '0.65rem' }}>{st.badges?.length} Badges</span>
                    </td>
                    <td className="leaderboard-cell">
                      {st.streak > 1 ? (
                        <span className="badge badge-pink" style={{ fontSize: '0.65rem', display: 'flex', alignItems: 'center', gap: '3px' }}>
                          <Flame size={10} /> {st.streak} Days
                        </span>
                      ) : '-'}
                    </td>
                    <td className="leaderboard-cell font-bold text-gradient-violet-cyan" style={{ textAlign: 'right', fontSize: '1.05rem' }}>
                      {st.XP} XP
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}

        {/* School Standings Table */}
        {boardTab === 'school' && (
          <table className="leaderboard-table">
            <thead>
              <tr style={{ borderBottom: '1px solid var(--border-glass)' }}>
                <th className="leaderboard-cell text-muted text-xs">RANK</th>
                <th className="leaderboard-cell text-muted text-xs">SCHOOL</th>
                <th className="leaderboard-cell text-muted text-xs" style={{ textAlign: 'right' }}>ACCUMULATED XP</th>
              </tr>
            </thead>
            <tbody>
              {schoolBoard.map((sch, index) => {
                const rank = index + 1;
                return (
                  <tr key={sch.school} className={`leaderboard-row ${rank <= 3 ? 'top-three' : ''}`}>
                    <td className="leaderboard-cell font-semibold">
                      {rank === 1 ? '🥇' : rank === 2 ? '🥈' : rank === 3 ? '🥉' : `#${rank}`}
                    </td>
                    <td className="leaderboard-cell">
                      <div style={{ display: 'flex', alignCenter: 'center', gap: '10px', alignItems: 'center' }}>
                        <GraduationCap size={20} className="text-gradient-violet-cyan" />
                        <span style={{ fontWeight: 'bold' }}>{sch.school}</span>
                      </div>
                    </td>
                    <td className="leaderboard-cell font-bold text-gradient-violet-cyan" style={{ textAlign: 'right', fontSize: '1.05rem' }}>
                      {sch.xp} XP
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}

        {/* Category Leaders Table */}
        {boardTab === 'category' && (
          <table className="leaderboard-table">
            <thead>
              <tr style={{ borderBottom: '1px solid var(--border-glass)' }}>
                <th className="leaderboard-cell text-muted text-xs">RANK</th>
                <th className="leaderboard-cell text-muted text-xs">STUDENT</th>
                <th className="leaderboard-cell text-muted text-xs">SCHOOL</th>
                <th className="leaderboard-cell text-muted text-xs" style={{ textAlign: 'right' }}>ACCUMULATED XP</th>
              </tr>
            </thead>
            <tbody>
              {categoryStudents.length === 0 ? (
                <tr>
                  <td colSpan={4} className="leaderboard-cell text-center text-muted py-8">
                    No active students listed under this interest sector.
                  </td>
                </tr>
              ) : (
                categoryStudents.map((st, index) => {
                  const rank = index + 1;
                  return (
                    <tr key={st.id} className={`leaderboard-row ${rank <= 3 ? 'top-three' : ''}`} style={{ cursor: 'pointer' }} onClick={() => navigate(`portfolio-${st.id}`)}>
                      <td className="leaderboard-cell font-semibold">
                        {rank === 1 ? '🥇' : rank === 2 ? '🥈' : rank === 3 ? '🥉' : `#${rank}`}
                      </td>
                      <td className="leaderboard-cell">
                        <span style={{ fontWeight: 'bold' }}>{st.name}</span>
                      </td>
                      <td className="leaderboard-cell text-secondary text-sm">{st.school}</td>
                      <td className="leaderboard-cell font-bold text-gradient-violet-cyan" style={{ textAlign: 'right' }}>
                        {st.XP} XP
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        )}

        {/* Team Rankings Table */}
        {boardTab === 'team' && (
          <table className="leaderboard-table">
            <thead>
              <tr style={{ borderBottom: '1px solid var(--border-glass)' }}>
                <th className="leaderboard-cell text-muted text-xs">RANK</th>
                <th className="leaderboard-cell text-muted text-xs">ALLIANCE TEAM</th>
                <th className="leaderboard-cell text-muted text-xs">ALLIES</th>
                <th className="leaderboard-cell text-muted text-xs" style={{ textAlign: 'right' }}>REPUTATION SCORE</th>
              </tr>
            </thead>
            <tbody>
              {teamBoard.map((team, index) => {
                const rank = index + 1;
                return (
                  <tr key={team.id} className={`leaderboard-row ${rank <= 3 ? 'top-three' : ''}`}>
                    <td className="leaderboard-cell font-semibold">
                      {rank === 1 ? '🥇' : rank === 2 ? '🥈' : rank === 3 ? '🥉' : `#${rank}`}
                    </td>
                    <td className="leaderboard-cell">
                      <div style={{ display: 'flex', alignCenter: 'center', gap: '10px', alignItems: 'center' }}>
                        <span style={{ fontSize: '1.5rem' }}>{team.logo}</span>
                        <span style={{ fontWeight: 'bold' }}>{team.name}</span>
                      </div>
                    </td>
                    <td className="leaderboard-cell text-secondary text-sm">
                      {team.members.length} members &bull; {team.invites?.length || 0} pending
                    </td>
                    <td className="leaderboard-cell font-bold text-gradient-pink-cyan" style={{ textAlign: 'right', fontSize: '1.05rem' }}>
                      {team.reputationScore} Points
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}

      </div>
    </div>
  );
}
