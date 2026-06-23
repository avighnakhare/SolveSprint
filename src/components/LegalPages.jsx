import React from 'react';
import { ShieldCheck, FileText, ArrowLeft } from 'lucide-react';

export default function LegalPages({ view, navigate }) {
  return (
    <div className="container py-16 anim-fade-in" style={{ maxWidth: '800px' }}>
      
      <button onClick={() => navigate('landing')} className="btn btn-outline btn-sm mb-8" style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
        <ArrowLeft size={16} /> Back to Home
      </button>

      {view === 'terms-page' && (
        <div className="glass-panel" style={{ padding: '40px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '24px' }}>
            <FileText size={32} className="text-gradient-violet-cyan" />
            <h1 style={{ fontSize: '2.2rem' }}>Platform Terms & Conditions</h1>
          </div>

          <div className="text-secondary text-sm" style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <p><strong>Last Updated: June 22, 2026</strong></p>
            <p>Welcome to SolveSprint ("SolveSprint", "we", "us", or "our"). By registering an account, creating or joining teams, posting challenges, or submitting solutions, you agree to comply with the terms set forth below.</p>
            
            <h4 style={{ color: 'var(--text-primary)', fontSize: '1rem', marginTop: '12px' }}>1. Student Eligibility & Minor Restrictions</h4>
            <p>SolveSprint is designed exclusively for high school students in grades 9 through 12. If you are under the age of 18, you must secure digital authorization from your parent or legal guardian before participating in team chats, uploading documents, or receiving challenge prize funds. If we detect minor participation without verified guardian consent, we reserve the right to suspend the account.</p>

            <h4 style={{ color: 'var(--text-primary)', fontSize: '1rem', marginTop: '12px' }}>2. Intellectual Property (IP) & Solutions Ownership</h4>
            <p>All solutions, mockups, written documents, or code repositories uploaded to the platform remain the intellectual property of the student or student team who authored them. However, by uploading a solution, students grant the sponsoring corporate partner a non-exclusive, worldwide, royalty-free license to review, grade, display, and prototype the solution for evaluation purposes.</p>

            <h4 style={{ color: 'var(--text-primary)', fontSize: '1rem', marginTop: '12px' }}>3. Academic Integrity & Originality</h4>
            <p>All challenge submissions must represent the student's or student team's original work. Plagiarism, copying pre-existing codebases, or using unauthorized third-party content will result in immediate disqualification. Students must declare any generative AI tools (such as ChatGPT, Copilot, or Claude) utilized during creation in the AI usage disclosure dropdown.</p>

            <h4 style={{ color: 'var(--text-primary)', fontSize: '1rem', marginTop: '12px' }}>4. Corporate Sponsor Verification & Prize Pools</h4>
            <p>Companies hosting sprints must supply valid tax identity (EIN) or business registration. Verified companies promise to distribute cash, internships, or mentorship rewards directly to winning students within seven (7) days of winner announcements.</p>
          </div>
        </div>
      )}

      {view === 'privacy-page' && (
        <div className="glass-panel" style={{ padding: '40px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '24px' }}>
            <ShieldCheck size={32} className="text-gradient-violet-cyan" />
            <h1 style={{ fontSize: '2.2rem' }}>Privacy & Minor Protection Policy</h1>
          </div>

          <div className="text-secondary text-sm" style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <p><strong>Last Updated: June 22, 2026</strong></p>
            <p>SolveSprint takes student safety and privacy extremely seriously, aligning directly with the Children's Online Privacy Protection Act (COPPA) guidelines.</p>
            
            <h4 style={{ color: 'var(--text-primary)', fontSize: '1rem', marginTop: '12px' }}>1. Information We Collect from Students</h4>
            <p>During student signup, we collect names, email addresses, school names, grades, ages, and profile skills. For minors under 18, we collect the parent or legal guardian's name and email address to solicit verifiable consent before activating interactive features.</p>

            <h4 style={{ color: 'var(--text-primary)', fontSize: '1rem', marginTop: '12px' }}>2. How Consent Works</h4>
            <p>When a minor creates an account, we immediately email their parent/guardian a consent verification link. Interactive services (posting comments, uploading files, join alliances, messaging) are locked until the parent clicks the verification link and signs the signature block. Parents can request profile deletion at any time by contacting safety@solvesprint.com.</p>

            <h4 style={{ color: 'var(--text-primary)', fontSize: '1rem', marginTop: '12px' }}>3. Data Sharing Restrictions</h4>
            <p>SolveSprint never sells student data to third parties. Sponsoring companies only see student profile information once a student joins their challenge or submits a project. Student profiles are not indexable by public search engines.</p>
          </div>
        </div>
      )}

    </div>
  );
}
