import React, { useState } from 'react';
import { User, Building, ShieldCheck, Mail, Lock, CheckCircle, ArrowRight, ArrowLeft, Upload, FileText, Check, AlertCircle } from 'lucide-react';

// Combined Auth Pages (Handles login, signup, onboarding, minor consent, terms)
export default function AuthPages({ 
  view, 
  navigate, 
  setCurrentUser, 
  mockStudents, 
  mockCompanies, 
  onRegisterStudent,
  onRegisterCompany
}) {
  // Common states
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  
  // Student registration states
  const [studentType, setStudentType] = useState('individual'); // individual or team
  const [school, setSchool] = useState('');
  const [grade, setGrade] = useState('11th Grade');
  const [interests, setInterests] = useState([]);
  const [skills, setSkills] = useState('');
  const [age, setAge] = useState(16);
  const [guardianName, setGuardianName] = useState('');
  const [guardianEmail, setGuardianEmail] = useState('');
  const [studentTermsAccepted, setStudentTermsAccepted] = useState(false);
  const [consentSubmitted, setConsentSubmitted] = useState(false);
  
  // Company registration states
  const [businessName, setBusinessName] = useState('');
  const [website, setWebsite] = useState('');
  const [industry, setIndustry] = useState('Software & Productivity');
  const [companySize, setCompanySize] = useState('1-10');
  const [contactPerson, setContactPerson] = useState('');
  const [goals, setGoals] = useState('');
  const [companyTermsAccepted, setCompanyTermsAccepted] = useState(false);
  const [uploadMockDoc, setUploadMockDoc] = useState(null);

  // Errors state
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  // Handle Login
  const handleLoginSubmit = (e) => {
    e.preventDefault();
    if (!email || !password) {
      setErrorMsg('Please fill in all fields.');
      return;
    }

    // Try finding in mock students
    const student = mockStudents.find(s => s.email.toLowerCase() === email.toLowerCase());
    if (student) {
      setCurrentUser(student);
      navigate('student-dashboard');
      return;
    }

    // Try finding in mock companies
    const company = mockCompanies.find(c => c.website.toLowerCase().includes(email.toLowerCase()) || email.toLowerCase() === 'linear@admin.com');
    if (company) {
      setCurrentUser(company);
      navigate('company-dashboard');
      return;
    }

    // Default prototype fallback
    if (email === 'admin@solvesprint.com') {
      setCurrentUser({ id: 'admin_1', name: 'Platform Moderator', role: 'admin' });
      navigate('admin-panel');
      return;
    }

    setErrorMsg('Invalid email or password. Use the Floating switcher for fast demo testing!');
  };

  // Toggle student interests
  const handleInterestToggle = (interest) => {
    setInterests(prev => 
      prev.includes(interest) ? prev.filter(i => i !== interest) : [...prev, interest]
    );
  };

  // Submit Student Onboarding
  const handleStudentSignup = (e) => {
    e.preventDefault();
    if (!name || !email || !school) {
      setErrorMsg('Please fill in all required fields.');
      return;
    }
    if (!studentTermsAccepted) {
      setErrorMsg('You must accept the Terms and Conditions.');
      return;
    }

    // If student is minor (< 18), they must complete the guardian consent step.
    const isMinor = parseInt(age) < 18;
    if (isMinor && (!guardianName || !guardianEmail)) {
      setErrorMsg('Minors require parent or guardian consent details.');
      return;
    }

    // Register student
    const newStudent = {
      id: `st_${Date.now()}`,
      name,
      email,
      role: "student",
      type: studentType,
      school,
      grade,
      interests,
      skills: skills.split(',').map(s => s.trim()).filter(Boolean),
      XP: 100, // start with 100 XP
      badges: ["Fresh Recruit"],
      teams: [],
      submissions: [],
      portfolio: [],
      rank: 100,
      termsAccepted: studentTermsAccepted,
      parentConsentStatus: isMinor ? "pending" : "not_required",
      guardianName: isMinor ? guardianName : null,
      guardianEmail: isMinor ? guardianEmail : null,
      streak: 1,
      watchlist: []
    };

    onRegisterStudent(newStudent);
    setCurrentUser(newStudent);

    if (isMinor) {
      navigate('consent-page');
    } else {
      navigate('student-dashboard');
    }
  };

  // Submit Company Onboarding
  const handleCompanySignup = (e) => {
    e.preventDefault();
    if (!businessName || !website || !contactPerson) {
      setErrorMsg('Please fill in business name, website and contact person.');
      return;
    }
    if (!companyTermsAccepted) {
      setErrorMsg('Please accept the company terms.');
      return;
    }

    const newCompany = {
      id: `co_${Date.now()}`,
      businessName,
      logo: "🏢",
      website,
      verificationStatus: "pending",
      contactPerson,
      industry,
      termsAccepted: companyTermsAccepted,
      activeChallenges: 0,
      history: goals || "Innovative company partnering with high schoolers.",
      analytics: { views: 0, submissions: 0, completionRate: 0 }
    };

    onRegisterCompany(newCompany);
    setCurrentUser(newCompany);
    navigate('company-verification');
  };

  return (
    <div className="container py-16 flex justify-center align-center min-h-screen">
      <div className="glass-card" style={{ width: '100%', maxWidth: '520px', padding: '40px', position: 'relative' }}>
        
        {/* Error/Success Alerts */}
        {errorMsg && (
          <div className="badge badge-red" style={{ width: '100%', padding: '12px', borderRadius: 'var(--radius-sm)', marginBottom: '20px', textTransform: 'none', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <AlertCircle size={16} />
            <span>{errorMsg}</span>
          </div>
        )}
        {successMsg && (
          <div className="badge badge-green" style={{ width: '100%', padding: '12px', borderRadius: 'var(--radius-sm)', marginBottom: '20px', textTransform: 'none', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <CheckCircle size={16} />
            <span>{successMsg}</span>
          </div>
        )}

        {/* 1. ROLE SELECTION */}
        {view === 'role-selection' && (
          <div className="text-center anim-slide-up">
            <h2 style={{ fontSize: '2rem', marginBottom: '8px' }}>Create Account</h2>
            <p className="text-secondary mb-8">Choose your role to get started on the league.</p>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div 
                className="glass-card cyan flex align-center gap-6" 
                style={{ padding: '24px', cursor: 'pointer', textAlign: 'left', background: 'rgba(255,255,255,0.01)' }}
                onClick={() => navigate('student-signup')}
              >
                <div style={{ width: '48px', height: '48px', borderRadius: '50%', background: 'rgba(6,182,212,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--color-secondary)' }}>
                  <User size={24} />
                </div>
                <div>
                  <h3 style={{ fontSize: '1.2rem', marginBottom: '4px' }}>I'm a Student</h3>
                  <p className="text-muted text-xs">Solve company briefs, join teams, earn XP and awards.</p>
                </div>
              </div>

              <div 
                className="glass-card flex align-center gap-6" 
                style={{ padding: '24px', cursor: 'pointer', textAlign: 'left', background: 'rgba(255,255,255,0.01)' }}
                onClick={() => navigate('company-signup')}
              >
                <div style={{ width: '48px', height: '48px', borderRadius: '50%', background: 'rgba(139,92,246,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--color-primary)' }}>
                  <Building size={24} />
                </div>
                <div>
                  <h3 style={{ fontSize: '1.2rem', marginBottom: '4px' }}>We're a Company</h3>
                  <p className="text-muted text-xs">Post problem briefs, scout high school talent, hire interns.</p>
                </div>
              </div>
            </div>

            <div className="mt-8 text-sm">
              <span className="text-muted">Already have an account? </span>
              <a href="#login" onClick={(e) => { e.preventDefault(); navigate('login'); }} className="text-gradient-violet-cyan font-semibold">Log In &rarr;</a>
            </div>
          </div>
        )}

        {/* 2. LOGIN PAGE */}
        {view === 'login' && (
          <form onSubmit={handleLoginSubmit} className="anim-slide-up">
            <h2 style={{ fontSize: '2rem', marginBottom: '8px' }}>Welcome Back</h2>
            <p className="text-secondary mb-8">Sign in to resume your active weekly rounds.</p>

            <div className="form-group">
              <label className="form-label">Email Address</label>
              <div style={{ position: 'relative' }}>
                <Mail size={16} style={{ position: 'absolute', left: '16px', top: '16px', color: 'var(--text-muted)' }} />
                <input 
                  type="email" 
                  className="form-input" 
                  style={{ width: '100%', paddingLeft: '48px' }} 
                  placeholder="name@school.edu"
                  value={email}
                  onChange={(e) => { setEmail(e.target.value); setErrorMsg(''); }}
                />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label flex justify-between" style={{ display: 'flex', justifyContent: 'space-between', width: '100%' }}>
                <span>Password</span>
                <a href="#forgot" onClick={(e) => { e.preventDefault(); navigate('forgot-password'); }} className="text-xs text-gradient-pink-cyan">Forgot?</a>
              </label>
              <div style={{ position: 'relative' }}>
                <Lock size={16} style={{ position: 'absolute', left: '16px', top: '16px', color: 'var(--text-muted)' }} />
                <input 
                  type="password" 
                  className="form-input" 
                  style={{ width: '100%', paddingLeft: '48px' }} 
                  placeholder="&bull;&bull;&bull;&bull;&bull;&bull;&bull;&bull;"
                  value={password}
                  onChange={(e) => { setPassword(e.target.value); setErrorMsg(''); }}
                />
              </div>
            </div>

            <button type="submit" className="btn btn-primary" style={{ width: '100%', marginTop: '8px' }}>
              Sign In <ArrowRight size={16} />
            </button>

            <div className="mt-8 text-center text-sm">
              <span className="text-muted">New to SolveSprint? </span>
              <a href="#signup" onClick={(e) => { e.preventDefault(); navigate('role-selection'); }} className="text-gradient-violet-cyan font-semibold">Join the League &rarr;</a>
            </div>
          </form>
        )}

        {/* 3. FORGOT PASSWORD */}
        {view === 'forgot-password' && (
          <div className="anim-slide-up">
            <h2 style={{ fontSize: '2rem', marginBottom: '8px' }}>Reset Password</h2>
            <p className="text-secondary mb-8">Enter your registered email to request a reset link.</p>

            <div className="form-group">
              <label className="form-label">Email Address</label>
              <input 
                type="email" 
                className="form-input" 
                placeholder="name@school.edu"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <button 
              onClick={() => {
                if (!email) { setErrorMsg('Please enter your email.'); return; }
                setErrorMsg('');
                setSuccessMsg(`Mock email sent to ${email} with password reset instructions!`);
              }} 
              className="btn btn-primary" 
              style={{ width: '100%', marginTop: '8px' }}
            >
              Send Reset Link
            </button>

            <button 
              onClick={() => { setErrorMsg(''); setSuccessMsg(''); navigate('login'); }} 
              className="btn btn-outline" 
              style={{ width: '100%', marginTop: '12px', display: 'flex', gap: '8px', alignItems: 'center', justifyContent: 'center' }}
            >
              <ArrowLeft size={16} /> Back to Login
            </button>
          </div>
        )}

        {/* 4. STUDENT SIGNUP / ONBOARDING */}
        {view === 'student-signup' && (
          <form onSubmit={handleStudentSignup} className="anim-slide-up">
            <h2 style={{ fontSize: '1.8rem', marginBottom: '4px' }}>Student Sign Up</h2>
            <p className="text-secondary text-sm mb-6">Complete the registration to build your profile.</p>

            {/* Steps indicator placeholder: Details -> Parent Consent (if minor) */}
            <div className="steps-indicator">
              <div className="step-node active">1</div>
              <div className="step-node">2</div>
              <div className="step-node">3</div>
            </div>

            <div className="form-group">
              <label className="form-label">Participation Type</label>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <button 
                  type="button" 
                  className={`btn ${studentType === 'individual' ? 'btn-primary' : 'btn-outline'}`}
                  onClick={() => setStudentType('individual')}
                  style={{ fontSize: '0.85rem', padding: '8px' }}
                >
                  👦 Individual Account
                </button>
                <button 
                  type="button" 
                  className={`btn ${studentType === 'team' ? 'btn-primary' : 'btn-outline'}`}
                  onClick={() => setStudentType('team')}
                  style={{ fontSize: '0.85rem', padding: '8px' }}
                >
                  👥 Team Account Creator
                </button>
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Full Name</label>
              <input type="text" className="form-input" placeholder="Alex Rivera" value={name} onChange={(e) => setName(e.target.value)} required />
            </div>

            <div className="form-group">
              <label className="form-label">Email Address</label>
              <input type="email" className="form-input" placeholder="alex@school.edu" value={email} onChange={(e) => setEmail(e.target.value)} required />
            </div>

            <div className="form-group">
              <label className="form-label">School Name</label>
              <input type="text" className="form-input" placeholder="Thomas Jefferson High" value={school} onChange={(e) => setSchool(e.target.value)} required />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
              <div className="form-group">
                <label className="form-label">Grade</label>
                <select className="form-select" value={grade} onChange={(e) => setGrade(e.target.value)}>
                  <option>9th Grade</option>
                  <option>10th Grade</option>
                  <option>11th Grade</option>
                  <option>12th Grade</option>
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">Age</label>
                <input type="number" className="form-input" min={13} max={20} value={age} onChange={(e) => { setAge(e.target.value); setErrorMsg(''); }} required />
              </div>
            </div>

            {/* Interest Tags */}
            <div className="form-group">
              <label className="form-label">Interests (Choose categories)</label>
              <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                {['coding', 'design', 'business', 'AI', 'social impact'].map(interest => {
                  const selected = interests.includes(interest);
                  return (
                    <button 
                      key={interest} 
                      type="button"
                      className={`btn btn-sm ${selected ? 'btn-secondary' : 'btn-outline'}`}
                      style={{ fontSize: '0.75rem', padding: '4px 10px' }}
                      onClick={() => handleInterestToggle(interest)}
                    >
                      {interest}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Skills */}
            <div className="form-group">
              <label className="form-label">Skills (Comma separated)</label>
              <input type="text" className="form-input" placeholder="React, Figma, Writing" value={skills} onChange={(e) => setSkills(e.target.value)} />
            </div>

            {/* Guardian signature if minor */}
            {parseInt(age) < 18 && (
              <div style={{ background: 'rgba(236,72,153,0.04)', border: '1px solid rgba(236,72,153,0.2)', padding: '16px', borderRadius: 'var(--radius-md)', marginBottom: '20px' }}>
                <span style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.85rem', fontWeight: 'bold', color: 'var(--color-accent)', marginBottom: '8px' }}>
                  <ShieldCheck size={16} /> Parent / Guardian Consent Required
                </span>
                <p className="text-secondary text-xs mb-4">
                  Under FTC guidelines, minors need legal guardian authorization before participating in challenge team boards and submission uploads.
                </p>
                <div className="form-group" style={{ marginBottom: '12px' }}>
                  <label className="form-label" style={{ fontSize: '0.8rem' }}>Guardian Name</label>
                  <input type="text" className="form-input" placeholder="Sofia Rivera" value={guardianName} onChange={(e) => setGuardianName(e.target.value)} required />
                </div>
                <div className="form-group" style={{ marginBottom: '0' }}>
                  <label className="form-label" style={{ fontSize: '0.8rem' }}>Guardian Email</label>
                  <input type="email" className="form-input" placeholder="sofia.rivera@gmail.com" value={guardianEmail} onChange={(e) => setGuardianEmail(e.target.value)} required />
                </div>
              </div>
            )}

            {/* Terms and conditions */}
            <div className="form-group" style={{ marginBottom: '24px' }}>
              <label className="checkbox-container">
                <input 
                  type="checkbox" 
                  checked={studentTermsAccepted} 
                  onChange={(e) => setStudentTermsAccepted(e.target.checked)} 
                />
                <span>
                  I accept the <a href="#terms" onClick={(e) => { e.preventDefault(); navigate('terms-page'); }} style={{ color: 'var(--color-primary)' }}>Terms of Service</a> and confirm all solutions I upload are my own original work.
                </span>
              </label>
            </div>

            <button type="submit" className="btn btn-primary" style={{ width: '100%' }}>
              Create Account & Onboard
            </button>
          </form>
        )}

        {/* 5. PARENT/GUARDIAN CONSENT INTERACTIVE PAGE */}
        {view === 'consent-page' && (
          <div className="anim-slide-up">
            <div style={{ textAlign: 'center', marginBottom: '24px' }}>
              <div style={{ width: '56px', height: '56px', borderRadius: '50%', background: 'rgba(236,72,153,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--color-accent)', margin: '0 auto 16px auto' }}>
                <ShieldCheck size={28} />
              </div>
              <h2 style={{ fontSize: '1.8rem' }}>Parent Guardian Consent</h2>
              <p className="text-secondary text-sm">Waiting for verification email authorization.</p>
            </div>

            <div className="steps-indicator">
              <div className="step-node completed"><Check size={16} /></div>
              <div className="step-node active">2</div>
              <div className="step-node">3</div>
            </div>

            <div style={{ padding: '20px', background: 'rgba(255,255,255,0.02)', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-glass)', marginBottom: '24px' }}>
              <h4 style={{ fontSize: '0.95rem', marginBottom: '8px' }}>Consent request sent!</h4>
              <p className="text-secondary text-xs">
                We sent a secure digital verification link to your parent/guardian email. They must review the terms of service and sign off.
              </p>
              
              <div style={{ marginTop: '16px', background: 'rgba(0,0,0,0.2)', padding: '12px', borderRadius: 'var(--radius-sm)', borderLeft: '3px solid var(--color-accent)' }}>
                <div style={{ fontWeight: 'bold', fontSize: '0.8rem', color: 'var(--color-accent)' }}>Simulated Email Outbox</div>
                <div className="text-muted text-xs mt-1">To: guardian@email.com</div>
                <div className="text-secondary text-xs mt-1">"SolveSprint Request: Please review and sign parent consent form for Alex..."</div>
              </div>
            </div>

            {/* Interactive Mock Button to Approve right now */}
            <button 
              onClick={() => {
                setSuccessMsg('Guardian signature verification successful! Student account activated.');
                setTimeout(() => {
                  setSuccessMsg('');
                  navigate('student-dashboard');
                }, 2000);
              }}
              className="btn btn-secondary" 
              style={{ width: '100%', marginBottom: '12px' }}
            >
              ⚡ Simulated Guardian Approval (Mock Sign-off)
            </button>

            <button 
              onClick={() => navigate('student-dashboard')}
              className="btn btn-outline" 
              style={{ width: '100%' }}
            >
              Skip to Dashboard (Pending State)
            </button>
          </div>
        )}

        {/* 6. COMPANY SIGNUP */}
        {view === 'company-signup' && (
          <form onSubmit={handleCompanySignup} className="anim-slide-up">
            <h2 style={{ fontSize: '1.8rem', marginBottom: '4px' }}>Company Registration</h2>
            <p className="text-secondary text-sm mb-6">Partner with high school engineers to solve real briefs.</p>

            <div className="form-group">
              <label className="form-label">Legal Business Name</label>
              <input type="text" className="form-input" placeholder="Linear Inc" value={businessName} onChange={(e) => setBusinessName(e.target.value)} required />
            </div>

            <div className="form-group">
              <label className="form-label">Company Website</label>
              <input type="url" className="form-input" placeholder="https://linear.app" value={website} onChange={(e) => setWebsite(e.target.value)} required />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
              <div className="form-group">
                <label className="form-label">Industry</label>
                <select className="form-select" value={industry} onChange={(e) => setIndustry(e.target.value)}>
                  <option>Software & Productivity</option>
                  <option>Artificial Intelligence</option>
                  <option>Sustainability & Ecology</option>
                  <option>Design & Creative Tech</option>
                  <option>Aerospace & Robotics</option>
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">Company Size</label>
                <select className="form-select" value={companySize} onChange={(e) => setCompanySize(e.target.value)}>
                  <option>1-10 employees</option>
                  <option>11-50 employees</option>
                  <option>51-200 employees</option>
                  <option>200+ employees</option>
                </select>
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Primary Contact Person</label>
              <input type="text" className="form-input" placeholder="Elena Rostova (VP of Product)" value={contactPerson} onChange={(e) => setContactPerson(e.target.value)} required />
            </div>

            <div className="form-group">
              <label className="form-label">Challenge Goals / Brief Summary</label>
              <textarea className="form-textarea" placeholder="We want high schoolers to design our mobile workspace layout..." value={goals} onChange={(e) => setGoals(e.target.value)}></textarea>
            </div>

            <div className="form-group" style={{ marginBottom: '24px' }}>
              <label className="checkbox-container">
                <input 
                  type="checkbox" 
                  checked={companyTermsAccepted} 
                  onChange={(e) => setCompanyTermsAccepted(e.target.checked)} 
                />
                <span>
                  I accept the <a href="#terms" onClick={(e) => { e.preventDefault(); navigate('terms-page'); }} style={{ color: 'var(--color-secondary)' }}>Corporate Sponsorship Terms</a> and promise to fulfill challenge prize awards.
                </span>
              </label>
            </div>

            <button type="submit" className="btn btn-primary" style={{ width: '100%' }}>
              Create Company Account &Onboard
            </button>
          </form>
        )}

        {/* 7. COMPANY VERIFICATION STEP */}
        {view === 'company-verification' && (
          <div className="anim-slide-up">
            <div style={{ textAlign: 'center', marginBottom: '24px' }}>
              <div style={{ width: '56px', height: '56px', borderRadius: '50%', background: 'rgba(139,92,246,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--color-primary)', margin: '0 auto 16px auto' }}>
                <Upload size={28} />
              </div>
              <h2 style={{ fontSize: '1.8rem' }}>Identity Verification</h2>
              <p className="text-secondary text-sm">Upload business credentials to publish challenges.</p>
            </div>

            <div style={{ padding: '32px', background: 'rgba(255,255,255,0.01)', border: '2px dashed var(--border-glass)', borderRadius: 'var(--radius-md)', textAlign: 'center', marginBottom: '24px', cursor: 'pointer' }} onClick={() => setUploadMockDoc('business_license_proof.pdf')}>
              <FileText size={40} style={{ color: 'var(--text-muted)', marginBottom: '12px' }} />
              {uploadMockDoc ? (
                <div>
                  <span className="badge badge-green" style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                    <Check size={12} /> {uploadMockDoc}
                  </span>
                  <p className="text-secondary text-xs mt-2">Click to replace document</p>
                </div>
              ) : (
                <div>
                  <p className="font-semibold text-sm">Drag & drop EIN registration or business license PDF</p>
                  <p className="text-muted text-xs mt-1">PDF, PNG up to 10MB</p>
                </div>
              )}
            </div>

            <button 
              onClick={() => {
                if (!uploadMockDoc) {
                  setErrorMsg('Please upload a verification document or click mock uploader.');
                  return;
                }
                setErrorMsg('');
                setSuccessMsg('Business documents submitted to Admin review queue!');
                setTimeout(() => {
                  setSuccessMsg('');
                  navigate('company-dashboard');
                }, 2000);
              }}
              className="btn btn-primary" 
              style={{ width: '100%', marginBottom: '12px' }}
            >
              Submit for Admin Review
            </button>

            <button 
              onClick={() => navigate('company-dashboard')}
              className="btn btn-outline" 
              style={{ width: '100%' }}
            >
              Skip to Console Dashboard
            </button>
          </div>
        )}

      </div>
    </div>
  );
}
