import React, { useState, useEffect } from 'react';
import { 
  initialStudents, 
  initialCompanies, 
  initialChallenges, 
  initialSubmissions, 
  initialTeams, 
  initialNotifications, 
  initialActivity 
} from './mockData';

// Component Imports
import { Header, Footer, RoleSwitcher, NotificationPanel } from './components/Common';
import LandingPage from './components/LandingPage';
import AuthPages from './components/AuthPages';
import ChallengeFeed from './components/ChallengeFeed';
import ChallengeDetail from './components/ChallengeDetail';
import StudentDashboard from './components/StudentDashboard';
import CompanyDashboard from './components/CompanyDashboard';
import Portfolio from './components/Portfolio';
import Leaderboard from './components/Leaderboard';
import AdminPanel from './components/AdminPanel';
import LegalPages from './components/LegalPages';

export default function App() {
  // Global States (Mock Databases)
  const [students, setStudents] = useState(initialStudents);
  const [companies, setCompanies] = useState(initialCompanies);
  const [challenges, setChallenges] = useState(initialChallenges);
  const [submissions, setSubmissions] = useState(initialSubmissions);
  const [teams, setTeams] = useState(initialTeams);
  const [notifications, setNotifications] = useState(initialNotifications);
  const [activity, setActivity] = useState(initialActivity);

  // Navigation State
  const [page, setPage] = useState('landing'); // landing, login, challenges, etc.
  const [currentUser, setCurrentUser] = useState(null); // Logged in user details
  const [showNotifications, setShowNotifications] = useState(false);

  // Scroll to top on page navigation
  const navigate = (targetPage) => {
    setPage(targetPage);
    window.scrollTo(0, 0);
    setShowNotifications(false);
  };

  // Notification actions
  const unreadNotifications = notifications.filter(n => {
    if (!currentUser) return false;
    if (currentUser.role === 'student' && n.studentId === currentUser.id) return !n.read;
    if (currentUser.role === 'company' && n.companyId === currentUser.id) return !n.read;
    return false;
  });

  const handleMarkNotificationRead = (notifId) => {
    setNotifications(prev => prev.map(n => n.id === notifId ? { ...n, read: true } : n));
  };

  // Student registrations logic
  const handleRegisterStudent = (newStudent) => {
    setStudents(prev => [...prev, newStudent]);
    // Post notification update
    const textLog = `👦 ${newStudent.name} created a new student account!`;
    setActivity(prev => [{ id: `act_${Date.now()}`, text: textLog, date: "Just now" }, ...prev]);
  };

  // Company registrations logic
  const handleRegisterCompany = (newCompany) => {
    setCompanies(prev => [...prev, newCompany]);
    // Post moderation notice to Admin notifications
    const newNotif = {
      id: `n_admin_${Date.now()}`,
      studentId: null,
      companyId: null,
      title: "Admin Review Required",
      message: `Verify new corporate registration request for ${newCompany.businessName}`,
      read: false,
      date: new Date().toISOString(),
      type: "verification"
    };
    setNotifications(prev => [newNotif, ...prev]);
  };

  // Company post challenge logic
  const handlePostChallenge = (newCh) => {
    setChallenges(prev => [newCh, ...prev]);
    // Post notifications
    if (newCh.status === 'active') {
      const textLog = `⚡ ${newCh.companyName} published a new challenge: '${newCh.title}'!`;
      setActivity(prev => [{ id: `act_${Date.now()}`, text: textLog, date: "Just now" }, ...prev]);
    } else {
      // Pending review notif to Admin panel
      const adminNotif = {
        id: `n_ch_verify_${Date.now()}`,
        studentId: null,
        companyId: null,
        title: "Sprint Approval Request",
        message: `Company ${newCh.companyName} requested publishing authorization for: ${newCh.title}`,
        read: false,
        date: new Date().toISOString(),
        type: "approval"
      };
      setNotifications(prev => [adminNotif, ...prev]);
    }
  };

  // Student joins challenge
  const handleJoinChallenge = (challengeId, studentId) => {
    setStudents(prev => prev.map(s => {
      if (s.id === studentId) {
        return {
          ...s,
          watchlist: [...(s.watchlist || []), challengeId]
        };
      }
      return s;
    }));
  };

  // Create team
  const handleCreateTeam = (newTeam) => {
    setTeams(prev => [...prev, newTeam]);
    const textLog = `👥 New alliance '${newTeam.name}' formed!`;
    setActivity(prev => [{ id: `act_${Date.now()}`, text: textLog, date: "Just now" }, ...prev]);
  };

  // Send team message chat
  const handleSendTeamMessage = (teamId, message) => {
    setTeams(prev => prev.map(t => {
      if (t.id === teamId) {
        return {
          ...t,
          chat: [...t.chat, message]
        };
      }
      return t;
    }));
  };

  // Student submits solution
  const handleSubmitSolution = (newSub) => {
    setSubmissions(prev => [newSub, ...prev]);
    
    // Increment submission count in challenges
    setChallenges(prev => prev.map(c => {
      if (c.id === newSub.challengeId) {
        return { ...c, submissionsCount: c.submissionsCount + 1 };
      }
      return c;
    }));

    // Notify company
    const challengeObj = challenges.find(c => c.id === newSub.challengeId);
    const coNotif = {
      id: `n_sub_${Date.now()}`,
      studentId: null,
      companyId: challengeObj.companyId,
      title: "Challenge Submission Received",
      message: `A new solution project was uploaded for '${challengeObj.title}'`,
      read: false,
      date: new Date().toISOString(),
      type: "submission"
    };
    setNotifications(prev => [coNotif, ...prev]);

    // Update Activity
    const studentObj = students.find(s => s.id === newSub.studentId);
    const textLog = `🚀 Submission uploaded for ${challengeObj.title}!`;
    setActivity(prev => [{ id: `act_${Date.now()}`, text: textLog, date: "Just now" }, ...prev]);

    // Give Student +200 XP for participation!
    setStudents(prev => prev.map(s => {
      if (s.id === newSub.studentId) {
        return { ...s, XP: s.XP + 200 };
      }
      return s;
    }));
  };

  // Company evaluates solution (assign scores, winners, comments)
  const handleEvaluateSubmission = (subId, updateData) => {
    setSubmissions(prev => prev.map(s => {
      if (s.id === subId) {
        // Find student, add XP if finalist or winner
        const xpReward = updateData.status === 'winner' ? 1000 : updateData.status === 'finalist' ? 300 : 0;
        
        // Notify Student
        const subStudentNotif = {
          id: `n_eval_${Date.now()}`,
          studentId: s.studentId,
          companyId: null,
          title: updateData.status === 'winner' ? "🏆 1ST PLACE WINNER!" : "🏅 Shortlisted Finalist!",
          message: `Your project was rated ${updateData.totalScore}/100 and updated to ${updateData.status}!`,
          read: false,
          date: new Date().toISOString(),
          type: "result"
        };
        setNotifications(prevNotif => [subStudentNotif, ...prevNotif]);

        // Reward Student XP
        setStudents(prevSt => prevSt.map(st => {
          if (st.id === s.studentId) {
            // Add XP, check badges
            const badgesArr = [...(st.badges || [])];
            if (updateData.status === 'winner' && !badgesArr.includes('Champion')) {
              badgesArr.push('Champion');
            }
            return {
              ...st,
              XP: st.XP + xpReward,
              badges: badgesArr
            };
          }
          return st;
        }));

        // If winner, publish to activity feed
        if (updateData.status === 'winner') {
          const studentObj = students.find(stud => stud.id === s.studentId);
          const chObj = challenges.find(ch => ch.id === s.challengeId);
          const textLog = `🏆 ${studentObj?.name || 'Student'} won 1st place in ${chObj?.title}!`;
          setActivity(prevAct => [{ id: `act_${Date.now()}`, text: textLog, date: "Just now" }, ...prevAct]);
        }

        return {
          ...s,
          ...updateData
        };
      }
      return s;
    }));
  };

  // Admin approves company
  const handleVerifyCompany = (coId, status) => {
    setCompanies(prev => prev.map(c => {
      if (c.id === coId) {
        // Send notification to company
        const coNotif = {
          id: `n_co_verify_${Date.now()}`,
          studentId: null,
          companyId: coId,
          title: status === 'verified' ? "✅ Company Verified!" : "❌ Verification Denied",
          message: status === 'verified' 
            ? "Your identity documents were approved. You can now publish active challenges!" 
            : "Review document logs or contact Admin support.",
          read: false,
          date: new Date().toISOString(),
          type: "verification"
        };
        setNotifications(prevNotif => [coNotif, ...prevNotif]);

        return { ...c, verificationStatus: status };
      }
      return c;
    }));
  };

  // Admin approves pending challenge
  const handleVerifyChallenge = (chId, status) => {
    setChallenges(prev => prev.map(ch => {
      if (ch.id === chId) {
        // Send notif to company
        const coNotif = {
          id: `n_ch_verify_${Date.now()}`,
          studentId: null,
          companyId: ch.companyId,
          title: "Sprint Challenge Status Update",
          message: `Your challenge: '${ch.title}' has been APPROVED and published live to feed.`,
          read: false,
          date: new Date().toISOString(),
          type: "approval"
        };
        setNotifications(prevNotif => [coNotif, ...prevNotif]);

        // Publish to Activity
        const textLog = `⚡ ${ch.companyName} published a new challenge: '${ch.title}'!`;
        setActivity(prevAct => [{ id: `act_${Date.now()}`, text: textLog, date: "Just now" }, ...prevAct]);

        return { ...ch, status: status };
      }
      return ch;
    }));
  };

  // Render Page Selection Routing
  const renderPage = () => {
    // 1. DYNAMIC MATCHES: challenge-<id>
    if (page.startsWith('challenge-')) {
      const chId = page.substring(10);
      const ch = challenges.find(c => c.id === chId);
      return (
        <ChallengeDetail 
          challenge={ch}
          currentUser={currentUser}
          teams={teams}
          students={students}
          onSubmitSolution={handleSubmitSolution}
          onJoinChallenge={handleJoinChallenge}
          onCreateTeam={handleCreateTeam}
          onSendTeamMessage={handleSendTeamMessage}
          navigate={navigate}
        />
      );
    }

    // 2. DYNAMIC MATCHES: portfolio-<id>
    if (page.startsWith('portfolio-')) {
      const stId = page.substring(10);
      return (
        <Portfolio 
          studentId={stId}
          students={students}
          submissions={submissions}
          challenges={challenges}
          navigate={navigate}
        />
      );
    }

    switch (page) {
      case 'landing':
        return <LandingPage navigate={navigate} challenges={challenges} />;
      
      // Auth Flow Pages
      case 'login':
      case 'forgot-password':
      case 'role-selection':
      case 'student-signup':
      case 'consent-page':
      case 'company-signup':
      case 'company-verification':
        return (
          <AuthPages 
            view={page} 
            navigate={navigate} 
            setCurrentUser={setCurrentUser}
            mockStudents={students}
            mockCompanies={companies}
            onRegisterStudent={handleRegisterStudent}
            onRegisterCompany={handleRegisterCompany}
          />
        );

      case 'challenges':
        return (
          <ChallengeFeed 
            challenges={challenges} 
            navigate={navigate} 
            currentUser={currentUser}
          />
        );

      case 'student-dashboard':
        return (
          <StudentDashboard 
            currentUser={currentUser} 
            challenges={challenges} 
            submissions={submissions} 
            teams={teams}
            students={students}
            navigate={navigate}
          />
        );

      case 'company-dashboard':
        return (
          <CompanyDashboard 
            currentUser={currentUser} 
            challenges={challenges} 
            submissions={submissions} 
            onPostChallenge={handlePostChallenge}
            onEvaluateSubmission={handleEvaluateSubmission}
            navigate={navigate}
          />
        );

      case 'admin-panel':
        return (
          <AdminPanel 
            companies={companies}
            challenges={challenges}
            students={students}
            submissions={submissions}
            onVerifyCompany={handleVerifyCompany}
            onVerifyChallenge={handleVerifyChallenge}
          />
        );

      case 'leaderboards':
        return (
          <Leaderboard 
            students={students} 
            teams={teams}
            navigate={navigate}
          />
        );

      case 'terms-page':
      case 'privacy-page':
        return <LegalPages view={page} navigate={navigate} />;

      default:
        return (
          <div className="container py-16 text-center">
            <h2>Under Development</h2>
            <p className="text-secondary text-sm mt-2">This route segment will expand in subsequent development updates.</p>
            <button onClick={() => navigate('landing')} className="btn btn-primary mt-6">Return Home</button>
          </div>
        );
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      
      {/* Header Panel */}
      <Header 
        currentUser={currentUser} 
        setCurrentUser={setCurrentUser} 
        navigate={navigate} 
        unreadCount={unreadNotifications.length}
        toggleNotifications={() => setShowNotifications(!showNotifications)}
      />

      {/* Notification overlay panel */}
      {showNotifications && (
        <NotificationPanel 
          notifications={currentUser ? notifications.filter(n => 
            (currentUser.role === 'student' && n.studentId === currentUser.id) ||
            (currentUser.role === 'company' && n.companyId === currentUser.id)
          ) : []}
          onClose={() => setShowNotifications(false)}
          onMarkRead={handleMarkNotificationRead}
        />
      )}

      {/* SPA Render Workspace Content */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
        {renderPage()}
      </div>

      {/* Footer widgets */}
      <Footer navigate={navigate} />

      {/* Debug Role Switcher Floating */}
      <RoleSwitcher 
        currentRole={currentUser?.role} 
        mockStudents={students} 
        mockCompanies={companies} 
        setCurrentUser={setCurrentUser} 
        navigate={navigate} 
      />

    </div>
  );
}
