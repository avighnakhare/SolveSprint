import React, { useState } from 'react';
import { Clock, Trophy, ShieldAlert, Award, FileText, CheckSquare, MessageSquare, Send, Upload, Plus, Users, X, Info, HelpCircle } from 'lucide-react';

export default function ChallengeDetail({ 
  challenge, 
  currentUser, 
  teams, 
  students, 
  onSubmitSolution, 
  onJoinChallenge, 
  onCreateTeam, 
  onSendTeamMessage, 
  navigate 
}) {
  const [activeTab, setActiveTab] = useState('problem');
  const [showSubmitModal, setShowSubmitModal] = useState(false);
  const [showJoinModal, setShowJoinModal] = useState(false);
  
  // Team Creation states
  const [teamName, setTeamName] = useState('');
  const [teamLogo, setTeamLogo] = useState('🚀');
  const [invitedMembers, setInvitedMembers] = useState([]);
  
  // Message Chat states
  const [chatMessage, setChatMessage] = useState('');

  // Submission Form states
  const [subTitle, setSubTitle] = useState('');
  const [subSummary, setSubSummary] = useState('');
  const [subProblem, setSubProblem] = useState('');
  const [subSolution, setSubSolution] = useState('');
  const [subFeasibility, setSubFeasibility] = useState('');
  const [subImpact, setSubImpact] = useState('');
  const [subCodeLink, setSubCodeLink] = useState('');
  const [subPrototypeLink, setSubPrototypeLink] = useState('');
  const [subAiTools, setSubAiTools] = useState('None');
  const [subOriginality, setSubOriginality] = useState(false);
  const [subTerms, setSubTerms] = useState(false);

  if (!challenge) {
    return (
      <div className="container py-16 text-center">
        <h2>Challenge not found!</h2>
        <button onClick={() => navigate('challenges')} className="btn btn-primary mt-4">Back to Feed</button>
      </div>
    );
  }

  const isClosed = challenge.status === 'closed';
  const daysLeft = Math.ceil((new Date(challenge.deadline) - new Date()) / (1000 * 60 * 60 * 24));
  
  // Find if student is in a team for this challenge
  const studentTeam = currentUser && currentUser.role === 'student'
    ? teams.find(t => t.members.includes(currentUser.id))
    : null;

  const isJoined = currentUser && currentUser.role === 'student' && 
    (currentUser.watchlist.includes(challenge.id) || studentTeam);

  const handleJoinSubmit = (e) => {
    e.preventDefault();
    if (!currentUser) { navigate('login'); return; }
    
    // Guardian block check
    if (currentUser.parentConsentStatus === 'pending') {
      navigate('consent-page');
      return;
    }

    if (challenge.type.includes('Team Only') || (challenge.type.includes('Team') && teamName)) {
      if (!teamName) return;
      const newTeam = {
        id: `t_${Date.now()}`,
        name: teamName,
        logo: teamLogo,
        members: [currentUser.id],
        invites: invitedMembers,
        reputationScore: 100,
        chat: [{ sender: "System", text: `Team '${teamName}' formed for ${challenge.title}. Welcome!`, time: "Just Now" }],
        sharedFiles: []
      };
      onCreateTeam(newTeam);
      onJoinChallenge(challenge.id, currentUser.id);
      setShowJoinModal(false);
    } else {
      // Join as Individual
      onJoinChallenge(challenge.id, currentUser.id);
      setShowJoinModal(false);
    }
  };

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!chatMessage || !studentTeam) return;
    onSendTeamMessage(studentTeam.id, {
      sender: currentUser.name,
      text: chatMessage,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    });
    setChatMessage('');
  };

  const handleFinalSubmit = (e) => {
    e.preventDefault();
    if (!subTitle || !subSummary || !subOriginality || !subTerms) {
      alert("Please fill in required fields and check the compliance boxes.");
      return;
    }

    const newSub = {
      id: `sub_${Date.now()}`,
      challengeId: challenge.id,
      studentId: currentUser.id,
      teamId: studentTeam ? studentTeam.id : null,
      title: subTitle,
      summary: subSummary,
      problemUnderstanding: subProblem,
      proposedSolution: subSolution,
      feasibility: subFeasibility,
      expectedImpact: subImpact,
      prototypeLink: subPrototypeLink,
      codeLink: subCodeLink,
      aiToolsUsed: subAiTools,
      filesAttached: ["SolutionProposal.pdf"],
      status: "submitted",
      totalScore: null,
      judgeComments: null,
      createdAt: new Date().toISOString(),
      termsAccepted: subTerms,
      parentConsentApproved: currentUser.parentConsentStatus === 'approved'
    };

    onSubmitSolution(newSub);
    setShowSubmitModal(false);
  };

  return (
    <div className="container py-8 anim-fade-in" style={{ position: 'relative' }}>
      
      {/* Top Breadcrumb & Alerts */}
      <div style={{ marginBottom: '24px' }}>
        <button onClick={() => navigate('challenges')} className="btn btn-outline btn-sm mb-4">
          &larr; Back to Discovery Feed
        </button>

        {currentUser && currentUser.parentConsentStatus === 'pending' && (
          <div className="badge badge-pink" style={{ width: '100%', padding: '12px', borderRadius: 'var(--radius-sm)', textTransform: 'none', display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
            <ShieldAlert size={16} />
            <span>
              <strong>Guardian Consent Required:</strong> Your parent/guardian authorization is pending. You can read problem details but cannot submit solutions or participate in live team discussion boards. <a href="#consent" onClick={(e) => { e.preventDefault(); navigate('consent-page'); }} style={{ textDecoration: 'underline', color: '#fff', marginLeft: '6px' }}>Verify Guardian Consent Now &rarr;</a>
            </span>
          </div>
        )}
      </div>

      {/* Main Grid: Details (Left) + Rules (Right) */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 340px', gap: '32px' }} className="grid-feed-layout">
        
        {/* Left Side: Tabs Panel */}
        <main>
          <div style={{ display: 'flex', alignCenter: 'center', gap: '16px', marginBottom: '24px', alignItems: 'center' }}>
            <span style={{ fontSize: '2.5rem' }}>{challenge.companyLogo}</span>
            <div>
              <span className="badge badge-purple" style={{ marginBottom: '4px' }}>{challenge.category}</span>
              <h1 style={{ fontSize: '2.2rem', lineHeight: '1.2' }}>{challenge.title}</h1>
              <p className="text-secondary text-sm">
                Posted by <strong style={{ color: 'var(--text-primary)' }}>{challenge.companyName}</strong> &bull; Verified Corporate Sponsor
              </p>
            </div>
          </div>

          {/* Navigation Tabs */}
          <div className="tabs-nav">
            <button className={`tab-btn ${activeTab === 'problem' ? 'active' : ''}`} onClick={() => setActiveTab('problem')}>Problem Details</button>
            <button className={`tab-btn ${activeTab === 'deliverables' ? 'active' : ''}`} onClick={() => setActiveTab('deliverables')}>Deliverables</button>
            <button className={`tab-btn ${activeTab === 'rubric' ? 'active' : ''}`} onClick={() => setActiveTab('rubric')}>Judging Rubric</button>
            {isJoined && <button className={`tab-btn ${activeTab === 'team' ? 'active' : ''}`} onClick={() => setActiveTab('team')}>Team Workspace & Chat</button>}
          </div>

          {/* Tab Content 1: Problem Details */}
          {activeTab === 'problem' && (
            <div className="glass-panel anim-fade-in" style={{ padding: '32px' }}>
              <h3 style={{ fontSize: '1.4rem', marginBottom: '12px' }}>Problem Background</h3>
              <p className="text-secondary mb-6">{challenge.problemBackground}</p>
              
              <h3 style={{ fontSize: '1.4rem', marginBottom: '12px' }}>Context Brief</h3>
              <p className="text-secondary mb-6">{challenge.summary}</p>

              <h3 style={{ fontSize: '1.4rem', marginBottom: '12px' }}>Eligibility & Format</h3>
              <ul style={{ paddingLeft: '20px', display: 'flex', flexDirection: 'column', gap: '8px' }} className="text-secondary">
                <li><strong>Difficulty Level:</strong> {challenge.difficulty}</li>
                <li><strong>Eligible Grades:</strong> {challenge.eligibility}</li>
                <li><strong>Format Option:</strong> {challenge.type}</li>
                <li><strong>Guidelines Limit:</strong> {challenge.requirements}</li>
              </ul>
            </div>
          )}

          {/* Tab Content 2: Deliverables */}
          {activeTab === 'deliverables' && (
            <div className="glass-panel anim-fade-in" style={{ padding: '32px' }}>
              <h3 style={{ fontSize: '1.4rem', marginBottom: '12px' }}>Expected Submissions</h3>
              <p className="text-secondary mb-6">{challenge.deliverables}</p>

              <div style={{ display: 'flex', gap: '16px', background: 'rgba(6, 182, 212, 0.03)', border: '1px solid rgba(6, 182, 212, 0.1)', padding: '16px', borderRadius: 'var(--radius-md)' }}>
                <Info size={24} className="text-gradient-violet-cyan" style={{ flexShrink: 0 }} />
                <div>
                  <h4 style={{ fontSize: '0.95rem', marginBottom: '4px' }}>Originality & Intellectual Property Notice</h4>
                  <p className="text-secondary text-xs">
                    By submitting, teams confirm all materials are original. IP remains with students, with a non-exclusive license granted to {challenge.companyName} for review and pilot deployment.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Tab Content 3: Judging Rubric */}
          {activeTab === 'rubric' && (
            <div className="glass-panel anim-fade-in" style={{ padding: '32px' }}>
              <h3 style={{ fontSize: '1.4rem', marginBottom: '16px' }}>Judging Criteria & Score Weight</h3>
              {challenge.rubric && Object.keys(challenge.rubric).length > 0 ? (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                  {Object.entries(challenge.rubric).map(([crit, val]) => (
                    <div key={crit}>
                      <div className="flex justify-between text-sm font-semibold mb-2" style={{ justifyContent: 'space-between' }}>
                        <span>{crit}</span>
                        <span style={{ color: 'var(--color-primary)' }}>{val}% of Score</span>
                      </div>
                      <div style={{ height: '6px', background: 'var(--bg-surface-elevated)', borderRadius: 'var(--radius-full)', overflow: 'hidden' }}>
                        <div style={{ width: `${val}%`, height: '100%', background: 'var(--color-primary)' }}></div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-secondary">Basic participation guidelines apply. Points calculated based on completion speed and design detail.</p>
              )}
            </div>
          )}

          {/* Tab Content 4: Team Discussion / Room */}
          {activeTab === 'team' && (
            <div className="glass-panel anim-fade-in" style={{ padding: '32px' }}>
              {studentTeam ? (
                <div>
                  <div className="flex justify-between align-center mb-6" style={{ justifyContent: 'space-between' }}>
                    <div className="flex align-center gap-2">
                      <span style={{ fontSize: '2rem' }}>{studentTeam.logo}</span>
                      <div>
                        <h3 style={{ fontSize: '1.25rem' }}>{studentTeam.name}</h3>
                        <p className="text-muted text-xs">Reputation: {studentTeam.reputationScore} XP &bull; {studentTeam.members.length} member(s)</p>
                      </div>
                    </div>
                    <span className="badge badge-cyan">Team Mode Enabled</span>
                  </div>

                  <div className="grid grid-2 mb-6" style={{ gap: '20px' }}>
                    
                    {/* Chat Board */}
                    <div>
                      <h4 style={{ fontSize: '0.95rem', marginBottom: '8px' }}>Challenge Team Chat</h4>
                      <div className="chat-window">
                        <div className="chat-messages">
                          {studentTeam.chat.map((msg, i) => (
                            <div 
                              key={i} 
                              className={`chat-bubble ${msg.sender === (currentUser && currentUser.name) ? 'mine' : 'other'}`}
                            >
                              <div className="text-xs font-semibold" style={{ marginBottom: '2px', opacity: 0.8 }}>{msg.sender}</div>
                              <div>{msg.text}</div>
                              <div className="text-xs text-muted" style={{ textAlign: 'right', fontSize: '0.65rem', marginTop: '2px' }}>{msg.time}</div>
                            </div>
                          ))}
                        </div>
                        <form onSubmit={handleSendMessage} style={{ display: 'flex', borderTop: '1px solid var(--border-glass)' }}>
                          <input 
                            type="text" 
                            className="form-input" 
                            style={{ flex: 1, border: 'none', borderBottomLeftRadius: 'var(--radius-md)' }} 
                            placeholder="Message team members..."
                            value={chatMessage}
                            onChange={(e) => setChatMessage(e.target.value)}
                            disabled={currentUser.parentConsentStatus === 'pending'}
                          />
                          <button type="submit" className="btn btn-primary" style={{ borderTopLeftRadius: 0, borderBottomLeftRadius: 0, padding: '12px' }}>
                            <Send size={16} />
                          </button>
                        </form>
                      </div>
                    </div>

                    {/* Shared files list */}
                    <div>
                      <h4 style={{ fontSize: '0.95rem', marginBottom: '8px' }}>Shared Project Files</h4>
                      <div className="chat-window" style={{ padding: '16px', overflowY: 'auto' }}>
                        {studentTeam.sharedFiles.length === 0 ? (
                          <div style={{ textAlign: 'center', padding: '32px 0', color: 'var(--text-muted)' }}>
                            No files uploaded.
                          </div>
                        ) : (
                          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                            {studentTeam.sharedFiles.map((f, i) => (
                              <div key={i} style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 12px', background: 'rgba(255,255,255,0.02)', border: '1px solid var(--border-light)', borderRadius: 'var(--radius-sm)' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                  <FileText size={16} style={{ color: 'var(--color-secondary)' }} />
                                  <div>
                                    <div style={{ fontSize: '0.8rem', fontWeight: 'bold' }}>{f.name}</div>
                                    <div style={{ fontSize: '0.65rem', color: 'var(--text-muted)' }}>By {f.uploadedBy}</div>
                                  </div>
                                </div>
                                <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>{f.size}</span>
                              </div>
                            ))}
                          </div>
                        )}
                        <button 
                          onClick={() => {
                            if (currentUser.parentConsentStatus === 'pending') return;
                            studentTeam.sharedFiles.push({ name: "Revised_Pitch_Draft.pdf", size: "1.8 MB", uploadedBy: currentUser.name });
                            alert("Simulated file upload successfully!");
                          }}
                          className="btn btn-outline btn-sm" 
                          style={{ width: '100%', marginTop: '16px', display: 'flex', gap: '6px', alignItems: 'center', justifyContent: 'center' }}
                          disabled={currentUser.parentConsentStatus === 'pending'}
                        >
                          <Upload size={14} /> Upload Mock Resource
                        </button>
                      </div>
                    </div>

                  </div>
                </div>
              ) : (
                <div style={{ textAlign: 'center', padding: '32px', color: 'var(--text-secondary)' }}>
                  You must be in a team to see this tab workspace. Join the challenge to set up!
                </div>
              )}
            </div>
          )}
        </main>

        {/* Right Side: Constraints & CTA Card */}
        <aside>
          <div className="glass-panel" style={{ padding: '24px', position: 'sticky', top: '90px' }}>
            
            {/* Clock Countdown */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '20px' }}>
              <Clock size={20} className={daysLeft <= 3 ? 'text-danger' : 'text-gradient-violet-cyan'} />
              <div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', textTransform: 'uppercase' }}>TIME REMAINING</div>
                <div style={{ fontSize: '1.2rem', fontWeight: 'bold' }} className={daysLeft <= 3 ? 'badge badge-red' : ''}>
                  {isClosed ? 'Competition Ended' : `${daysLeft} Days Left`}
                </div>
              </div>
            </div>

            {/* Prize pool */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '24px' }}>
              <Trophy size={20} style={{ color: 'var(--color-warning)' }} />
              <div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', textTransform: 'uppercase' }}>PRIZE POOL</div>
                <div style={{ fontSize: '1.25rem', fontWeight: '900' }} className="text-gradient-gold">{challenge.prize}</div>
              </div>
            </div>

            {/* Constraints Checklist */}
            <div style={{ borderTop: '1px solid var(--border-glass)', paddingTop: '20px', marginBottom: '24px' }}>
              <h4 style={{ fontSize: '0.9rem', marginBottom: '12px', color: 'var(--text-secondary)' }}>SPRINT RULES</h4>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '0.85rem' }}>
                <div style={{ display: 'flex', gap: '8px' }}>
                  <CheckSquare size={16} className="text-gradient-violet-cyan" style={{ flexShrink: 0 }} />
                  <span><strong>Format:</strong> {challenge.type}</span>
                </div>
                <div style={{ display: 'flex', gap: '8px' }}>
                  <CheckSquare size={16} className="text-gradient-violet-cyan" style={{ flexShrink: 0 }} />
                  <span><strong>Grade eligibility:</strong> {challenge.eligibility}</span>
                </div>
                <div style={{ display: 'flex', gap: '8px' }}>
                  <CheckSquare size={16} className="text-gradient-violet-cyan" style={{ flexShrink: 0 }} />
                  <span><strong>Requirements:</strong> Deck & mockup URL</span>
                </div>
              </div>
            </div>

            {/* File Attachments Links */}
            {challenge.attachments && challenge.attachments.length > 0 && (
              <div style={{ borderTop: '1px solid var(--border-glass)', paddingTop: '20px', marginBottom: '24px' }}>
                <h4 style={{ fontSize: '0.9rem', marginBottom: '12px', color: 'var(--text-secondary)' }}>RESOURCES</h4>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  {challenge.attachments.map((file, i) => (
                    <button 
                      key={i} 
                      onClick={() => alert(`Simulated file download of "${file.name}" completed!`)}
                      style={{ 
                        background: 'rgba(255,255,255,0.02)', 
                        border: '1px solid var(--border-light)', 
                        color: 'var(--text-primary)', 
                        borderRadius: 'var(--radius-sm)', 
                        padding: '8px 12px',
                        fontSize: '0.75rem',
                        textAlign: 'left',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between'
                      }}
                    >
                      <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <FileText size={12} style={{ color: 'var(--color-secondary)' }} />
                        {file.name}
                      </span>
                      <span className="text-muted">{file.size}</span>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Join / Submit Call-To-Action */}
            {!isClosed && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {isJoined ? (
                  <>
                    <button 
                      onClick={() => {
                        if (currentUser.parentConsentStatus === 'pending') {
                          navigate('consent-page');
                          return;
                        }
                        setShowSubmitModal(true);
                      }} 
                      className="btn btn-primary" 
                      style={{ width: '100%' }}
                    >
                      Submit Solution
                    </button>
                    <div className="text-center text-xs text-muted">
                      You are registered for this sprint.
                    </div>
                  </>
                ) : (
                  <button 
                    onClick={() => {
                      if (!currentUser) { navigate('login'); return; }
                      if (currentUser.parentConsentStatus === 'pending') {
                        navigate('consent-page');
                        return;
                      }
                      setShowJoinModal(true);
                    }} 
                    className="btn btn-secondary" 
                    style={{ width: '100%' }}
                  >
                    Join Challenge Sprint
                  </button>
                )}
              </div>
            )}

          </div>
        </aside>

      </div>

      {/* MODAL 1: JOIN CHALLENGE (CHOOSE INDIVIDUAL VS CREATING TEAM) */}
      {showJoinModal && (
        <div style={{
          position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
          background: 'rgba(0,0,0,0.85)', zIndex: 1000,
          display: 'flex', alignItems: 'center', justifyContent: 'center'
        }} className="anim-fade-in">
          <div className="glass-panel" style={{ width: '90%', maxWidth: '480px', padding: '32px', position: 'relative' }}>
            <button onClick={() => setShowJoinModal(false)} style={{ position: 'absolute', top: '16px', right: '16px', background: 'transparent', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer' }}>
              <X size={20} />
            </button>

            <h3 style={{ fontSize: '1.5rem', marginBottom: '16px' }}>Join Sprint League</h3>
            <p className="text-secondary text-sm mb-6">Review terms and confirm how you will participate in this weekly challenge.</p>

            <form onSubmit={handleJoinSubmit}>
              
              {/* Option fields based on challenge config */}
              {challenge.type.includes('Team') ? (
                <div style={{ marginBottom: '24px' }}>
                  <div className="form-group">
                    <label className="form-label">Create Team Name</label>
                    <input 
                      type="text" 
                      className="form-input" 
                      placeholder="CyberDevs"
                      value={teamName}
                      onChange={(e) => setTeamName(e.target.value)}
                      required
                    />
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                    <div className="form-group">
                      <label className="form-label">Team Emblem</label>
                      <select className="form-select" value={teamLogo} onChange={(e) => setTeamLogo(e.target.value)}>
                        <option>🚀</option>
                        <option>🛸</option>
                        <option>🌿</option>
                        <option>🧠</option>
                        <option>🔥</option>
                      </select>
                    </div>

                    <div className="form-group">
                      <label className="form-label">Invited Members (Mock)</label>
                      <select 
                        className="form-select" 
                        multiple={false} 
                        onChange={(e) => setInvitedMembers([e.target.value])}
                      >
                        <option value="">Choose Classmate...</option>
                        {students.filter(s => s.id !== currentUser.id).map(st => (
                          <option key={st.id} value={st.id}>{st.name} ({st.school})</option>
                        ))}
                      </select>
                    </div>
                  </div>
                </div>
              ) : (
                <div style={{ background: 'rgba(255,255,255,0.01)', border: '1px solid var(--border-glass)', padding: '16px', borderRadius: 'var(--radius-md)', marginBottom: '20px' }}>
                  <span style={{ fontSize: '0.85rem', fontWeight: 'bold' }}>Individual Challenge Registration</span>
                  <p className="text-muted text-xs mt-1">This challenge is set to individual participation. You will register under your personal portfolio.</p>
                </div>
              )}

              <button type="submit" className="btn btn-primary" style={{ width: '100%' }}>
                Confirm Registration
              </button>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 2: SUBMIT SOLUTION FORM */}
      {showSubmitModal && (
        <div style={{
          position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
          background: 'rgba(0,0,0,0.85)', zIndex: 1000,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          overflowY: 'auto'
        }} className="anim-fade-in">
          <div className="glass-panel" style={{ width: '90%', maxWidth: '640px', padding: '32px', margin: '40px auto', position: 'relative' }}>
            <button onClick={() => setShowSubmitModal(false)} style={{ position: 'absolute', top: '16px', right: '16px', background: 'transparent', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer' }}>
              <X size={20} />
            </button>

            <h3 style={{ fontSize: '1.6rem', marginBottom: '8px' }}>Submit Sprint Solution</h3>
            <p className="text-secondary text-sm mb-6">Complete all proposal fields to submit your deliverables for review.</p>

            <form onSubmit={handleFinalSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              
              <div className="form-group">
                <label className="form-label">Project Title</label>
                <input type="text" className="form-input" placeholder="Linear Flow - Gesture Workspace" value={subTitle} onChange={(e) => setSubTitle(e.target.value)} required />
              </div>

              <div className="form-group">
                <label className="form-label">Executive Summary (Max 2 sentences)</label>
                <textarea className="form-textarea" placeholder="Swipe gestures developer organizer for code reviews..." value={subSummary} onChange={(e) => setSubSummary(e.target.value)} required />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }} className="grid-2">
                <div className="form-group">
                  <label className="form-label">Problem Statement / Critical Understanding</label>
                  <textarea className="form-textarea" placeholder="Why are current options inefficient?" value={subProblem} onChange={(e) => setSubProblem(e.target.value)} />
                </div>
                <div className="form-group">
                  <label className="form-label">Proposed Solution Framework</label>
                  <textarea className="form-textarea" placeholder="How does your concept function?" value={subSolution} onChange={(e) => setSubSolution(e.target.value)} />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }} className="grid-2">
                <div className="form-group">
                  <label className="form-label">Technical Feasibility & Integration</label>
                  <textarea className="form-textarea" placeholder="What APIs or structures are utilized?" value={subFeasibility} onChange={(e) => setSubFeasibility(e.target.value)} />
                </div>
                <div className="form-group">
                  <label className="form-label">Expected Impact / Metrics</label>
                  <textarea className="form-textarea" placeholder="What quantitative improvements does this create?" value={subImpact} onChange={(e) => setSubImpact(e.target.value)} />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }} className="grid-2">
                <div className="form-group">
                  <label className="form-label">Code Repository URL (Optional)</label>
                  <input type="url" className="form-input" placeholder="https://github.com/alexrivera" value={subCodeLink} onChange={(e) => setSubCodeLink(e.target.value)} />
                </div>
                <div className="form-group">
                  <label className="form-label">Clickable Prototype / Figma URL (Optional)</label>
                  <input type="url" className="form-input" placeholder="https://figma.com/proto" value={subPrototypeLink} onChange={(e) => setSubPrototypeLink(e.target.value)} />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">AI Tool Usage Disclosure</label>
                <select className="form-select" value={subAiTools} onChange={(e) => setSubAiTools(e.target.value)}>
                  <option>None (100% human-crafted)</option>
                  <option>Used LLM for formatting layout ideas</option>
                  <option>Used AI tools to debug code errors</option>
                  <option>Used LLM to draft parts of proposal text</option>
                </select>
              </div>

              {/* Upload file dummy block */}
              <div style={{ background: 'rgba(255,255,255,0.01)', border: '1px dashed var(--border-glass)', padding: '16px', borderRadius: 'var(--radius-md)', display: 'flex', alignCenter: 'center', justifyBetween: 'space-between', alignItems: 'center', justifyContent: 'space-between' }}>
                <span className="text-xs text-secondary" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}><FileText size={16} /> SolutionProposal.pdf (Mock upload active)</span>
                <span className="badge badge-green" style={{ fontSize: '0.65rem' }}>Attached</span>
              </div>

              {/* Originality checkboxes */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', margin: '8px 0' }}>
                <label className="checkbox-container">
                  <input type="checkbox" checked={subOriginality} onChange={(e) => setSubOriginality(e.target.checked)} required />
                  <span>I confirm this solution is our own original work.</span>
                </label>

                <label className="checkbox-container">
                  <input type="checkbox" checked={subTerms} onChange={(e) => setSubTerms(e.target.checked)} required />
                  <span>I accept the platform's intellectual property terms.</span>
                </label>

                {currentUser && currentUser.parentConsentStatus === 'approved' && (
                  <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.75rem', color: 'var(--color-success)' }}>
                    <CheckSquare size={12} /> Parent consent verified ( Sofia Rivera )
                  </div>
                )}
              </div>

              <button type="submit" className="btn btn-primary" style={{ width: '100%' }}>
                Submit Project to review queue
              </button>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
