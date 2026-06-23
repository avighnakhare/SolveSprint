import React from 'react';
import { Award, Code, GraduationCap, Link2, Download, Zap, Heart, CheckCircle2, ShieldCheck } from 'lucide-react';

export default function Portfolio({ studentId, students, submissions, challenges, navigate }) {
  // Find the student profile
  const student = students.find(s => s.id === studentId) || students[0];

  // Filter completed wins and submissions for this student
  const studentSubs = submissions.filter(s => s.studentId === student.id);
  const studentWins = studentSubs.filter(s => s.status === 'winner');

  const handleDownloadResume = () => {
    alert(`Generating verified SolveSprint credentials sheet for ${student.name}... Simulated PDF download completed!`);
  };

  return (
    <div className="container py-8 anim-fade-in">
      
      {/* Top Breadcrumbs & Portfolio Share Link */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', flexWrap: 'wrap', gap: '12px' }}>
        <button onClick={() => navigate('student-dashboard')} className="btn btn-outline btn-sm">
          &larr; Back to Dashboard
        </button>

        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', background: 'rgba(255,255,255,0.02)', padding: '6px 12px', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-light)' }}>
          <Link2 size={14} className="text-gradient-violet-cyan" />
          <span className="text-secondary text-xs">Public Share Link: </span>
          <span className="text-gradient-violet-cyan text-xs font-semibold" style={{ cursor: 'pointer' }} onClick={() => alert("Copied portfolio link to clipboard!")}>
            solvesprint.com/portfolio/{student.id}
          </span>
        </div>
      </div>

      {/* Main Grid Layout: Profile Details (Left) + Credential Resume Card (Right) */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 340px', gap: '32px' }} className="grid-feed-layout">
        
        {/* Left Side: Biography, Skills, Project Case Studies */}
        <main style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
          
          {/* Main Bio Panel */}
          <div className="glass-panel" style={{ padding: '32px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '20px', marginBottom: '24px' }}>
              <div style={{ width: '80px', height: '80px', borderRadius: '50%', background: 'var(--color-secondary)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '2.8rem', border: '3px solid rgba(255,255,255,0.1)' }}>
                👦
              </div>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <h1 style={{ fontSize: '2rem' }}>{student.name}</h1>
                  {student.parentConsentStatus === 'approved' && (
                    <ShieldCheck size={20} className="text-gradient-violet-cyan" title="Consent Approved" />
                  )}
                </div>
                <p className="text-secondary text-sm" style={{ display: 'flex', alignItems: 'center', gap: '6px', marginTop: '4px' }}>
                  <GraduationCap size={16} /> {student.school} &bull; {student.grade}
                </p>
              </div>
            </div>

            <h3 style={{ fontSize: '1.25rem', marginBottom: '8px' }}>About Me</h3>
            <p className="text-secondary text-sm mb-6">
              Ambitious high school innovator focused on {student.interests?.join(', ')}. Actively competing in weekly corporate hack sprints to scale practical coding and design logic.
            </p>

            <h3 style={{ fontSize: '1.25rem', marginBottom: '12px' }}>Core Skills</h3>
            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginBottom: '6px' }}>
              {student.skills?.map(skill => (
                <span key={skill} className="badge badge-purple" style={{ fontSize: '0.75rem', padding: '6px 12px' }}>
                  {skill}
                </span>
              ))}
            </div>
          </div>

          {/* Solution Case Studies & Showcases */}
          <div>
            <h2 style={{ fontSize: '1.4rem', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Code size={18} className="text-gradient-violet-cyan" /> Verified SolveSprint Solutions ({studentSubs.length})
            </h2>

            {studentSubs.length === 0 ? (
              <div className="glass-panel" style={{ padding: '48px', textAlign: 'center', color: 'var(--text-muted)' }}>
                No solutions published to portfolio yet. Once challenge projects are rated, they appear here automatically.
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                {studentSubs.map(sub => {
                  const ch = challenges.find(c => c.id === sub.challengeId);
                  return (
                    <div key={sub.id} className="glass-panel" style={{ padding: '28px' }}>
                      <div className="flex justify-between align-center mb-4 flex-wrap gap-2" style={{ justifyContent: 'space-between' }}>
                        <div>
                          <span className="badge badge-cyan" style={{ fontSize: '0.65rem', marginBottom: '4px' }}>{ch?.category}</span>
                          <h3 style={{ fontSize: '1.25rem' }}>{sub.title}</h3>
                        </div>
                        <span className={`badge ${sub.status === 'winner' ? 'badge-amber' : 'badge-purple'}`} style={{ textTransform: 'uppercase', display: 'flex', alignItems: 'center', gap: '4px' }}>
                          <Award size={12} /> {sub.status}
                        </span>
                      </div>

                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '20px' }} className="grid-2">
                        <div>
                          <div className="text-muted text-xs font-semibold">THE PROBLEM</div>
                          <p className="text-secondary text-sm mt-1">{sub.problemUnderstanding}</p>
                        </div>
                        <div>
                          <div className="text-muted text-xs font-semibold">THE PROPOSED SOLUTION</div>
                          <p className="text-secondary text-sm mt-1">{sub.proposedSolution}</p>
                        </div>
                      </div>

                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '20px' }} className="grid-2">
                        <div>
                          <div className="text-muted text-xs font-semibold">TECHNICAL FEASIBILITY</div>
                          <p className="text-secondary text-sm mt-1">{sub.feasibility || 'Optimized modular components.'}</p>
                        </div>
                        <div>
                          <div className="text-muted text-xs font-semibold">EXPECTED IMPACT</div>
                          <p className="text-secondary text-sm mt-1">{sub.expectedImpact || 'Highly scalable framework.'}</p>
                        </div>
                      </div>

                      {/* Mentor Comments if Rated */}
                      {sub.judgeComments && (
                        <div style={{ background: 'rgba(139,92,246,0.03)', border: '1px solid rgba(139,92,246,0.1)', padding: '16px', borderRadius: 'var(--radius-md)', marginTop: '16px' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.8rem', fontWeight: 'bold', color: 'var(--color-primary)', marginBottom: '4px' }}>
                            <CheckCircle2 size={14} /> Sponsor Evaluation Comment &bull; {ch?.companyName}
                          </div>
                          <p className="text-secondary text-xs font-medium">"{sub.judgeComments}"</p>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>

        </main>

        {/* Right Side: Resume summary credentials download card */}
        <aside>
          <div className="glass-panel" style={{ padding: '24px', position: 'sticky', top: '90px', background: 'linear-gradient(180deg, var(--bg-surface) 0%, rgba(139,92,246,0.03) 100%)' }}>
            <div style={{ textAlign: 'center', borderBottom: '1px solid var(--border-glass)', paddingBottom: '20px', marginBottom: '20px' }}>
              <div style={{ width: '48px', height: '48px', borderRadius: '50%', background: 'rgba(6,182,212,0.1)', display: 'flex', alignItems: 'center', justifyCenter: 'center', color: 'var(--color-secondary)', margin: '0 auto 12px auto', justifyContent: 'center' }}>
                <Zap size={24} />
              </div>
              <h3 style={{ fontSize: '1.1rem' }}>SolveSprint Credentials</h3>
              <p className="text-muted text-xs mt-1">Verified Block Credentials Card</p>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', marginBottom: '24px' }}>
              <div className="flex justify-between" style={{ justifyContent: 'space-between' }}>
                <span className="text-secondary text-xs">Platform Level</span>
                <span className="font-semibold text-sm text-gradient-violet-cyan">{Math.floor(student.XP / 1000) + 1}</span>
              </div>
              
              <div className="flex justify-between" style={{ justifyContent: 'space-between' }}>
                <span className="text-secondary text-xs">Total XP Accumulation</span>
                <span className="font-semibold text-sm">{student.XP} XP</span>
              </div>

              <div className="flex justify-between" style={{ justifyContent: 'space-between' }}>
                <span className="text-secondary text-xs">Challenge Submissions</span>
                <span className="font-semibold text-sm">{studentSubs.length} Rounds</span>
              </div>

              <div className="flex justify-between" style={{ justifyContent: 'space-between' }}>
                <span className="text-secondary text-xs">Sponsor Placements</span>
                <span className="font-semibold text-sm text-gradient-gold">{studentWins.length} Wins</span>
              </div>
            </div>

            <button 
              onClick={handleDownloadResume}
              className="btn btn-primary" 
              style={{ width: '100%', display: 'flex', justifyCenter: 'center', alignCenter: 'center', gap: '8px', justifyContent: 'center', alignItems: 'center' }}
            >
              <Download size={16} /> Download Resume Summary
            </button>
          </div>
        </aside>

      </div>

    </div>
  );
}
