import React, { useState } from 'react';
import { Plus, BarChart3, Users, Eye, CheckCircle2, ChevronRight, FileText, Star, Award, ShieldCheck, X, FileCheck, HelpCircle } from 'lucide-react';

export default function CompanyDashboard({ 
  currentUser, 
  challenges, 
  submissions, 
  onPostChallenge, 
  onEvaluateSubmission,
  navigate 
}) {
  const [activeTab, setActiveTab] = useState('active'); // active, drafts, closed
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [selectedSub, setSelectedSub] = useState(null); // Submission selected for review

  // Submission grading details states
  const [gradeScore1, setGradeScore1] = useState(25);
  const [gradeScore2, setGradeScore2] = useState(25);
  const [gradeScore3, setGradeScore3] = useState(20);
  const [gradeScore4, setGradeScore4] = useState(15);
  const [judgeFeedback, setJudgeFeedback] = useState('');
  const [newStatus, setNewStatus] = useState('finalist'); // finalist, winner, rejected

  // Challenge editor multi-step state
  const [step, setStep] = useState(1);
  const [title, setTitle] = useState('');
  const [summary, setSummary] = useState('');
  const [category, setCategory] = useState('Coding');
  const [difficulty, setDifficulty] = useState('Intermediate');
  const [type, setType] = useState('Team or Individual');
  const [bg, setBg] = useState('');
  const [deliverables, setDeliverables] = useState('');
  const [prize, setPrize] = useState('');
  const [deadline, setDeadline] = useState('');
  const [eligibility, setEligibility] = useState('All Grades (9-12)');
  const [companySignature, setCompanySignature] = useState('');
  const [termsAccept, setTermsAccept] = useState(false);

  if (!currentUser) return null;

  // Filter challenges for this company
  const companyChallenges = challenges.filter(c => c.companyId === currentUser.id);
  const challengeIds = new Set(companyChallenges.map(c => c.id));
  
  // Filter submissions for this company's challenges
  const companySubs = submissions.filter(s => challengeIds.has(s.challengeId));

  const activeCount = companyChallenges.filter(c => c.status === 'active').length;
  const closedCount = companyChallenges.filter(c => c.status === 'closed').length;

  const totalViews = currentUser.analytics?.views || 0;
  const totalSubs = companySubs.length;
  const completionRate = currentUser.analytics?.completionRate || 0;

  // Handle Challenge Creation Submit
  const handleCreateChallenge = (e, status = 'active') => {
    e.preventDefault();
    if (!title || !summary || !prize || !deadline) {
      alert('Please fill in title, summary, prize pool and deadline.');
      return;
    }
    if (status === 'active' && !termsAccept) {
      alert('You must accept the terms to publish.');
      return;
    }

    const newCh = {
      id: `ch_${Date.now()}`,
      title,
      summary,
      companyId: currentUser.id,
      companyName: currentUser.businessName,
      companyLogo: currentUser.logo || "🏢",
      category,
      deadline: new Date(deadline).toISOString(),
      prize,
      requirements: "PDF Slides deck and project links.",
      eligibility,
      difficulty,
      type,
      attachments: [],
      rubric: {
        "UI/UX Visual Premiumness": 30,
        "Mobile-First Interaction Innovation": 30,
        "Technical Feasibility & Implementation Logic": 20,
        "Quality of Final Pitch Deck Presentation": 20
      },
      status: currentUser.verificationStatus === 'verified' ? status : 'pending_admin',
      views: 0,
      submissionsCount: 0,
      tags: [category, difficulty, type.split(' ')[0]],
      createdAt: new Date().toISOString(),
      problemBackground: bg,
      deliverables
    };

    onPostChallenge(newCh);
    setShowCreateModal(false);
    // Reset states
    setTitle(''); setSummary(''); setBg(''); setDeliverables(''); setPrize(''); setDeadline(''); setCompanySignature(''); setTermsAccept(false); setStep(1);
    alert(currentUser.verificationStatus === 'verified' 
      ? 'Challenge published successfully!' 
      : 'Challenge submitted for Admin verification review!'
    );
  };

  // Submit Submission evaluation score
  const handleEvaluate = (e) => {
    e.preventDefault();
    if (!selectedSub) return;
    
    const totalScore = parseInt(gradeScore1) + parseInt(gradeScore2) + parseInt(gradeScore3) + parseInt(gradeScore4);
    const breakdown = {
      "UI/UX Visual Premiumness": parseInt(gradeScore1),
      "Mobile-First Interaction Innovation": parseInt(gradeScore2),
      "Technical Feasibility & Implementation Logic": parseInt(gradeScore3),
      "Quality of Final Pitch Deck Presentation": parseInt(gradeScore4)
    };

    onEvaluateSubmission(selectedSub.id, {
      status: newStatus,
      scoreBreakdown: breakdown,
      totalScore,
      judgeComments: judgeFeedback
    });

    setSelectedSub(null);
    alert('Evaluation saved successfully! Winner stats updated.');
  };

  return (
    <div className="container py-8 anim-fade-in">
      
      {/* Top Banner with verification badge */}
      <div className="glass-panel" style={{ padding: '32px', marginBottom: '32px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '24px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <span style={{ fontSize: '3rem' }}>{currentUser.logo || '🏢'}</span>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <h1 style={{ fontSize: '1.8rem' }}>{currentUser.businessName} Console</h1>
              {currentUser.verificationStatus === 'verified' ? (
                <span className="badge badge-cyan" style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.65rem' }}>
                  <ShieldCheck size={12} /> VERIFIED BUSINESS
                </span>
              ) : (
                <span className="badge badge-pink" style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.65rem' }}>
                  <HelpCircle size={12} /> VERIFICATION PENDING
                </span>
              )}
            </div>
            <p className="text-secondary text-sm">{currentUser.industry} &bull; <a href={currentUser.website} target="_blank" rel="noreferrer" style={{ color: 'var(--color-secondary)' }}>{currentUser.website}</a></p>
          </div>
        </div>

        <button 
          onClick={() => {
            if (currentUser.verificationStatus !== 'verified') {
              alert("Verification Pending: You can draft challenges but publishing requires admin verification approval.");
            }
            setShowCreateModal(true);
          }} 
          className="btn btn-primary"
        >
          <Plus size={18} /> Post a Sprint Challenge
        </button>
      </div>

      {/* Analytics Summary Row */}
      <div className="grid grid-4 mb-8">
        <div className="glass-panel" style={{ padding: '20px', display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: 'rgba(139,92,246,0.1)', display: 'flex', alignItems: 'center', justifyCenter: 'center', color: 'var(--color-primary)', justifyContent: 'center' }}>
            <BarChart3 size={24} />
          </div>
          <div>
            <div className="text-muted text-xs">ACTIVE SPRINTS</div>
            <div style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>{activeCount} / {companyChallenges.length}</div>
          </div>
        </div>

        <div className="glass-panel" style={{ padding: '20px', display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: 'rgba(6,182,212,0.1)', display: 'flex', alignItems: 'center', justifyCenter: 'center', color: 'var(--color-secondary)', justifyContent: 'center' }}>
            <Users size={24} />
          </div>
          <div>
            <div className="text-muted text-xs">TOTAL SUBMISSIONS</div>
            <div style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>{totalSubs}</div>
          </div>
        </div>

        <div className="glass-panel" style={{ padding: '20px', display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: 'rgba(236,72,153,0.1)', display: 'flex', alignItems: 'center', justifyCenter: 'center', color: 'var(--color-accent)', justifyContent: 'center' }}>
            <Eye size={24} />
          </div>
          <div>
            <div className="text-muted text-xs">PAGE VIEWS</div>
            <div style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>{totalViews}</div>
          </div>
        </div>

        <div className="glass-panel" style={{ padding: '20px', display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: 'rgba(16,185,129,0.1)', display: 'flex', alignItems: 'center', justifyCenter: 'center', color: 'var(--color-success)', justifyContent: 'center' }}>
            <CheckCircle2 size={24} />
          </div>
          <div>
            <div className="text-muted text-xs">AVG COMPLETION RATE</div>
            <div style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>{completionRate}%</div>
          </div>
        </div>
      </div>

      {/* Main Grid: Management Tabs (Left) + Submissions review Queue (Right) */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 360px', gap: '32px' }} className="grid-feed-layout">
        
        {/* Left Side: Challenge Sprints Tabs list */}
        <main>
          <div className="tabs-nav">
            <button className={`tab-btn ${activeTab === 'active' ? 'active' : ''}`} onClick={() => setActiveTab('active')}>Active Sprints ({activeCount})</button>
            <button className={`tab-btn ${activeTab === 'closed' ? 'active' : ''}`} onClick={() => setActiveTab('closed')}>Closed Rounds ({closedCount})</button>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {companyChallenges.filter(c => activeTab === 'active' ? c.status === 'active' : c.status === 'closed').length === 0 ? (
              <div className="glass-panel" style={{ padding: '48px', textAlign: 'center', color: 'var(--text-muted)' }}>
                No challenges found under this status.
              </div>
            ) : (
              companyChallenges
                .filter(c => activeTab === 'active' ? c.status === 'active' : c.status === 'closed')
                .map(ch => (
                  <div key={ch.id} className="glass-panel" style={{ padding: '20px', display: 'flex', justifyBetween: 'space-between', alignItems: 'center', justifyContent: 'space-between' }}>
                    <div>
                      <span className="badge badge-purple" style={{ marginBottom: '6px' }}>{ch.category}</span>
                      <h3 style={{ fontSize: '1.15rem' }}>{ch.title}</h3>
                      <p className="text-muted text-xs mt-1">Deadline: {new Date(ch.deadline).toLocaleDateString()} &bull; Prize: {ch.prize}</p>
                    </div>
                    <button onClick={() => navigate(`challenge-${ch.id}`)} className="btn btn-outline btn-sm">
                      Open Brief View &rarr;
                    </button>
                  </div>
                ))
            )}
          </div>
        </main>

        {/* Right Side: Submissions review queue */}
        <aside>
          <div className="glass-panel" style={{ padding: '24px' }}>
            <h3 style={{ fontSize: '1.1rem', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <FileCheck size={18} style={{ color: 'var(--color-secondary)' }} /> Review Submissions Queue
            </h3>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {companySubs.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '32px 0', color: 'var(--text-muted)', fontSize: '0.85rem' }}>
                  No solution projects uploaded yet for your rounds.
                </div>
              ) : (
                companySubs.map(sub => (
                  <div 
                    key={sub.id} 
                    className="glass-card" 
                    style={{ 
                      padding: '16px', 
                      background: 'rgba(255,255,255,0.01)',
                      borderLeft: sub.status === 'winner' ? '3px solid var(--color-warning)' : '1px solid var(--border-glass)',
                      cursor: 'pointer' 
                    }}
                    onClick={() => setSelectedSub(sub)}
                  >
                    <div className="flex justify-between align-center mb-2" style={{ justifyContent: 'space-between' }}>
                      <span className="badge badge-cyan" style={{ fontSize: '0.6rem' }}>{sub.status}</span>
                      <span className="text-muted text-xs">{sub.totalScore ? `${sub.totalScore}/100` : 'Not Rated'}</span>
                    </div>
                    <div style={{ fontWeight: 'bold', fontSize: '0.85rem', marginBottom: '4px' }}>{sub.title}</div>
                    <div className="text-muted text-xs">By Team ID: {sub.teamId || 'Individual student'}</div>
                  </div>
                ))
              )}
            </div>
          </div>
        </aside>

      </div>

      {/* MODAL 1: POST A NEW CHALLENGE (5-STEP FORM PROCESS) */}
      {showCreateModal && (
        <div style={{
          position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
          background: 'rgba(0,0,0,0.85)', zIndex: 1000,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          overflowY: 'auto'
        }} className="anim-fade-in">
          <div className="glass-panel" style={{ width: '90%', maxWidth: '600px', padding: '32px', margin: '40px auto', position: 'relative' }}>
            <button onClick={() => setShowCreateModal(false)} style={{ position: 'absolute', top: '16px', right: '16px', background: 'transparent', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer' }}>
              <X size={20} />
            </button>

            <h3 style={{ fontSize: '1.6rem', marginBottom: '4px' }}>Post Sprint Challenge</h3>
            <p className="text-secondary text-sm mb-6">Step {step} of 5 &bull; Challenge Editor</p>

            <div className="steps-indicator">
              <div className={`step-node ${step >= 1 ? 'active' : ''}`}>1</div>
              <div className={`step-node ${step >= 2 ? 'active' : ''}`}>2</div>
              <div className={`step-node ${step >= 3 ? 'active' : ''}`}>3</div>
              <div className={`step-node ${step >= 4 ? 'active' : ''}`}>4</div>
              <div className={`step-node ${step >= 5 ? 'active' : ''}`}>5</div>
            </div>

            {/* STEP 1: BASICS */}
            {step === 1 && (
              <div className="anim-slide-up">
                <h4 style={{ fontSize: '1rem', marginBottom: '16px' }}>Step 1: Challenge Basics</h4>
                
                <div className="form-group">
                  <label className="form-label">Challenge Title</label>
                  <input type="text" className="form-input" placeholder="Design UI templates..." value={title} onChange={(e) => setTitle(e.target.value)} required />
                </div>

                <div className="form-group">
                  <label className="form-label">Short Summary (Visible on card)</label>
                  <input type="text" className="form-input" placeholder="A 4-week design layout syllabus for clubs..." value={summary} onChange={(e) => setSummary(e.target.value)} required />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }} className="grid-2">
                  <div className="form-group">
                    <label className="form-label">Category</label>
                    <select className="form-select" value={category} onChange={(e) => setCategory(e.target.value)}>
                      <option>Coding</option>
                      <option>Design</option>
                      <option>Business</option>
                      <option>Social Impact</option>
                    </select>
                  </div>
                  <div className="form-group">
                    <label className="form-label">Difficulty</label>
                    <select className="form-select" value={difficulty} onChange={(e) => setDifficulty(e.target.value)}>
                      <option>Intermediate</option>
                      <option>Advanced</option>
                      <option>Expert</option>
                    </select>
                  </div>
                </div>

                <div className="form-group">
                  <label className="form-label">Participation Type</label>
                  <select className="form-select" value={type} onChange={(e) => setType(e.target.value)}>
                    <option>Team or Individual</option>
                    <option>Individual Only</option>
                    <option>Team Only</option>
                  </select>
                </div>

                <button onClick={() => setStep(2)} className="btn btn-primary" style={{ width: '100%', marginTop: '16px' }}>Continue &rarr;</button>
              </div>
            )}

            {/* STEP 2: PROBLEM DETAILS */}
            {step === 2 && (
              <div className="anim-slide-up">
                <h4 style={{ fontSize: '1rem', marginBottom: '16px' }}>Step 2: Problem Details</h4>
                
                <div className="form-group">
                  <label className="form-label">Problem Background & Context</label>
                  <textarea className="form-textarea" placeholder="Provide background details and why this problem matters..." value={bg} onChange={(e) => setBg(e.target.value)}></textarea>
                </div>

                <div className="form-group">
                  <label className="form-label">Deliverables Expected</label>
                  <textarea className="form-textarea" placeholder="What files, deck presentations or prototype links are required?" value={deliverables} onChange={(e) => setDeliverables(e.target.value)}></textarea>
                </div>

                <div style={{ display: 'flex', gap: '12px' }}>
                  <button onClick={() => setStep(1)} className="btn btn-outline" style={{ flex: 1 }}>Back</button>
                  <button onClick={() => setStep(3)} className="btn btn-primary" style={{ flex: 1 }}>Continue &rarr;</button>
                </div>
              </div>
            )}

            {/* STEP 3: PRIZE & TIMELINE */}
            {step === 3 && (
              <div className="anim-slide-up">
                <h4 style={{ fontSize: '1rem', marginBottom: '16px' }}>Step 3: Prize Pool & Timeline</h4>

                <div className="form-group">
                  <label className="form-label">Prize Rewards Details</label>
                  <input type="text" className="form-input" placeholder="e.g. $1,500 Cash + Linear Team Mentorship" value={prize} onChange={(e) => setPrize(e.target.value)} required />
                </div>

                <div className="form-group">
                  <label className="form-label">Submission Deadline Date</label>
                  <input type="datetime-local" className="form-input" value={deadline} onChange={(e) => setDeadline(e.target.value)} required />
                </div>

                <div style={{ display: 'flex', gap: '12px' }}>
                  <button onClick={() => setStep(2)} className="btn btn-outline" style={{ flex: 1 }}>Back</button>
                  <button onClick={() => setStep(4)} className="btn btn-primary" style={{ flex: 1 }}>Continue &rarr;</button>
                </div>
              </div>
            )}

            {/* STEP 4: ELIGIBILITY */}
            {step === 4 && (
              <div className="anim-slide-up">
                <h4 style={{ fontSize: '1rem', marginBottom: '16px' }}>Step 4: Eligibility & Rules</h4>

                <div className="form-group">
                  <label className="form-label">Eligible School Grade Restrictions</label>
                  <select className="form-select" value={eligibility} onChange={(e) => setEligibility(e.target.value)}>
                    <option>All Grades (9-12)</option>
                    <option>Seniors Only (12th)</option>
                    <option>Juniors & Seniors (11-12)</option>
                    <option>Freshmen & Sophomores (9-10)</option>
                  </select>
                </div>

                <div style={{ background: 'rgba(255,255,255,0.01)', border: '1px solid var(--border-glass)', padding: '16px', borderRadius: 'var(--radius-md)', marginBottom: '20px' }}>
                  <span style={{ fontSize: '0.85rem', fontWeight: 'bold' }}>Intellectual Property Guidelines</span>
                  <p className="text-secondary text-xs mt-1">By default, intellectual property belongs to the students, with a licensing grant to the hosting business for piloting.</p>
                </div>

                <div style={{ display: 'flex', gap: '12px' }}>
                  <button onClick={() => setStep(3)} className="btn btn-outline" style={{ flex: 1 }}>Back</button>
                  <button onClick={() => setStep(5)} className="btn btn-primary" style={{ flex: 1 }}>Continue &rarr;</button>
                </div>
              </div>
            )}

            {/* STEP 5: VERIFICATION & PUBLISH */}
            {step === 5 && (
              <div className="anim-slide-up">
                <h4 style={{ fontSize: '1rem', marginBottom: '16px' }}>Step 5: Verification & Publishing</h4>

                <div className="form-group">
                  <label className="form-label">Authorized Corporate Signature</label>
                  <input type="text" className="form-input" placeholder="Elena Rostova (VP Product)" value={companySignature} onChange={(e) => setCompanySignature(e.target.value)} required />
                </div>

                <div className="form-group" style={{ marginBottom: '24px' }}>
                  <label className="checkbox-container">
                    <input type="checkbox" checked={termsAccept} onChange={(e) => setTermsAccept(e.target.checked)} />
                    <span>I confirm our business is committed to distributing the prize pool within 7 days of announcing winners.</span>
                  </label>
                </div>

                <div style={{ display: 'flex', gap: '12px' }}>
                  <button onClick={() => setStep(4)} className="btn btn-outline" style={{ flex: 1 }}>Back</button>
                  <button onClick={(e) => handleCreateChallenge(e, 'active')} className="btn btn-primary" style={{ flex: 1 }}>Publish Challenge</button>
                </div>
                
                <button onClick={(e) => handleCreateChallenge(e, 'draft')} className="btn btn-outline mt-4" style={{ width: '100%' }}>Save as Draft</button>
              </div>
            )}

          </div>
        </div>
      )}

      {/* MODAL 2: DETAIL SUBMISSION VIEWER & RATING PANEL FOR COMPANY */}
      {selectedSub && (
        <div style={{
          position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
          background: 'rgba(0,0,0,0.85)', zIndex: 1000,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          overflowY: 'auto'
        }} className="anim-fade-in">
          <div className="glass-panel" style={{ width: '90%', maxWidth: '680px', padding: '32px', margin: '40px auto', position: 'relative' }}>
            <button onClick={() => setSelectedSub(null)} style={{ position: 'absolute', top: '16px', right: '16px', background: 'transparent', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer' }}>
              <X size={20} />
            </button>

            <h3 style={{ fontSize: '1.6rem', marginBottom: '16px' }}>Evaluate Project: {selectedSub.title}</h3>
            
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px', marginBottom: '24px' }} className="grid-2">
              
              {/* Solution details */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <h4 style={{ fontSize: '0.95rem', color: 'var(--color-secondary)' }}>SUBMISSION BRIEF</h4>
                <div>
                  <div className="text-muted text-xs">EXECUTIVE SUMMARY</div>
                  <p className="text-secondary text-sm">{selectedSub.summary}</p>
                </div>
                <div>
                  <div className="text-muted text-xs">UNDERSTANDING</div>
                  <p className="text-secondary text-sm">{selectedSub.problemUnderstanding}</p>
                </div>
                <div>
                  <div className="text-muted text-xs">PROPOSAL</div>
                  <p className="text-secondary text-sm">{selectedSub.proposedSolution}</p>
                </div>
                <div>
                  <div className="text-muted text-xs">CODE REPO</div>
                  <a href={selectedSub.codeLink} target="_blank" rel="noreferrer" style={{ fontSize: '0.85rem', color: 'var(--color-primary)' }}>{selectedSub.codeLink || 'None'}</a>
                </div>
                <div>
                  <div className="text-muted text-xs">AI TOOL DECLARATION</div>
                  <span className="badge badge-purple" style={{ fontSize: '0.65rem' }}>{selectedSub.aiToolsUsed}</span>
                </div>
              </div>

              {/* Scoring Panel */}
              <form onSubmit={handleEvaluate} style={{ background: 'rgba(255,255,255,0.01)', border: '1px solid var(--border-glass)', padding: '20px', borderRadius: 'var(--radius-md)' }}>
                <h4 style={{ fontSize: '0.95rem', marginBottom: '16px', color: 'var(--color-primary)' }}>GRADING & SCOREBOARD</h4>

                <div className="form-group" style={{ marginBottom: '12px' }}>
                  <label className="form-label text-xs">UI/UX Layout (0-30)</label>
                  <input type="number" className="form-input" min={0} max={30} value={gradeScore1} onChange={(e) => setGradeScore1(e.target.value)} required />
                </div>

                <div className="form-group" style={{ marginBottom: '12px' }}>
                  <label className="form-label text-xs">Interaction Innovation (0-30)</label>
                  <input type="number" className="form-input" min={0} max={30} value={gradeScore2} onChange={(e) => setGradeScore2(e.target.value)} required />
                </div>

                <div className="form-group" style={{ marginBottom: '12px' }}>
                  <label className="form-label text-xs">Feasibility Structure (0-20)</label>
                  <input type="number" className="form-input" min={0} max={20} value={gradeScore3} onChange={(e) => setGradeScore3(e.target.value)} required />
                </div>

                <div className="form-group" style={{ marginBottom: '12px' }}>
                  <label className="form-label text-xs">Pitch Presentation (0-20)</label>
                  <input type="number" className="form-input" min={0} max={20} value={gradeScore4} onChange={(e) => setGradeScore4(e.target.value)} required />
                </div>

                <div className="form-group" style={{ marginBottom: '12px' }}>
                  <label className="form-label text-xs">Select Action / Status</label>
                  <select className="form-select" value={newStatus} onChange={(e) => setNewStatus(e.target.value)}>
                    <option value="finalist">Shortlist Finalist</option>
                    <option value="winner">Declare Round Winner 🏆</option>
                    <option value="rejected">Disqualify/Reject</option>
                  </select>
                </div>

                <div className="form-group" style={{ marginBottom: '16px' }}>
                  <label className="form-label text-xs">Feedback for student portfolio</label>
                  <textarea className="form-textarea" placeholder="Amazing visual fidelity. Code aligns well..." value={judgeFeedback} onChange={(e) => setJudgeFeedback(e.target.value)} style={{ minHeight: '60px' }}></textarea>
                </div>

                <button type="submit" className="btn btn-primary btn-sm" style={{ width: '100%' }}>
                  Submit Evaluation
                </button>
              </form>

            </div>
          </div>
        </div>
      )}

    </div>
  );
}
