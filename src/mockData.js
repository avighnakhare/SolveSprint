// SolveSprint Mock Database & State Store

export const initialCompanies = [
  {
    id: "co_linear",
    businessName: "Linear Inc",
    logo: "⚡",
    website: "https://linear.app",
    verificationStatus: "verified",
    contactPerson: "Elena Rostova",
    industry: "Software & Productivity",
    termsAccepted: true,
    activeChallenges: 2,
    history: "Founded in 2019, Linear builds tools for modern software development teams.",
    analytics: { views: 1840, submissions: 98, completionRate: 78 }
  },
  {
    id: "co_openai",
    businessName: "OpenAI",
    logo: "🤖",
    website: "https://openai.com",
    verificationStatus: "verified",
    contactPerson: "Aris Thorne",
    industry: "Artificial Intelligence",
    termsAccepted: true,
    activeChallenges: 1,
    history: "Leading research and deployment organization for artificial intelligence.",
    analytics: { views: 5420, submissions: 312, completionRate: 64 }
  },
  {
    id: "co_patagonia",
    businessName: "Patagonia",
    logo: "🏔️",
    website: "https://patagonia.com",
    verificationStatus: "verified",
    contactPerson: "Markus Vance",
    industry: "Sustainability & Retail",
    termsAccepted: true,
    activeChallenges: 1,
    history: "An outdoor apparel brand dedicated to saving our home planet.",
    analytics: { views: 980, submissions: 42, completionRate: 85 }
  },
  {
    id: "co_figma",
    businessName: "Figma",
    logo: "🎨",
    website: "https://figma.com",
    verificationStatus: "pending",
    contactPerson: "Claire Dutoit",
    industry: "Design & Creative Tech",
    termsAccepted: true,
    activeChallenges: 0,
    history: "Collaborative interface design tool built for the web.",
    analytics: { views: 0, submissions: 0, completionRate: 0 }
  },
  {
    id: "co_spacex",
    businessName: "SpaceX",
    logo: "🚀",
    website: "https://spacex.com",
    verificationStatus: "verified",
    contactPerson: "Gwynne S.",
    industry: "Aerospace",
    termsAccepted: true,
    activeChallenges: 1,
    history: "Designing, manufacturing and launching advanced rockets and spacecraft.",
    analytics: { views: 8200, submissions: 489, completionRate: 52 }
  }
];

export const initialStudents = [
  {
    id: "st_alex",
    name: "Alex Rivera",
    email: "alex@rivera.edu",
    role: "student",
    type: "individual",
    school: "Thomas Jefferson High School for Science and Technology",
    grade: "11th Grade",
    interests: ["coding", "AI", "product"],
    skills: ["React", "Python", "UX Design", "Figma"],
    XP: 2450,
    badges: ["Blitz Coder", "Problem Solver", "Team Catalyst"],
    teams: ["t_cyberdevs"],
    submissions: ["sub_1"],
    portfolio: ["port_1", "port_2"],
    rank: 12,
    termsAccepted: true,
    parentConsentStatus: "approved",
    guardianName: "Sofia Rivera",
    guardianEmail: "sofia.rivera@gmail.com",
    streak: 5,
    watchlist: ["ch_openai_ai_agent"]
  },
  {
    id: "st_sarah",
    name: "Sarah Chen",
    email: "sarah.chen@high.edu",
    role: "student",
    type: "team",
    school: "Stuyvesant High School",
    grade: "12th Grade",
    interests: ["business", "social impact", "product"],
    skills: ["Financial Analysis", "Presentation Deck", "Market Research"],
    XP: 3820,
    badges: ["Grandmaster", "Pitch King", "Impact Maker"],
    teams: ["t_greenminds"],
    submissions: ["sub_2"],
    portfolio: ["port_3"],
    rank: 3,
    termsAccepted: true,
    parentConsentStatus: "approved",
    guardianName: "Wei Chen",
    guardianEmail: "wei.chen@gmail.com",
    streak: 12,
    watchlist: ["ch_patagonia_carbon"]
  },
  {
    id: "st_marcus",
    name: "Marcus Vance Jr.",
    email: "marcus.v@academy.org",
    role: "student",
    type: "individual",
    school: "Exeter Academy",
    grade: "10th Grade",
    interests: ["design", "coding"],
    skills: ["HTML", "CSS", "UI Animation", "Photoshop"],
    XP: 950,
    badges: ["Rising Star", "Visual Wizard"],
    teams: [],
    submissions: [],
    portfolio: [],
    rank: 45,
    termsAccepted: false,
    parentConsentStatus: "pending",
    guardianName: "Marcus Vance Sr.",
    guardianEmail: "mvance@patagonia.com",
    streak: 1,
    watchlist: []
  }
];

export const initialTeams = [
  {
    id: "t_cyberdevs",
    name: "CyberDevs",
    logo: "🛸",
    members: ["st_alex"],
    invites: ["st_marcus"],
    reputationScore: 85,
    chat: [
      { sender: "Alex Rivera", text: "Hey! Welcome to the team discussion.", time: "10:14 AM" },
      { sender: "Alex Rivera", text: "Let's work on the Linear Issue Tracker challenge.", time: "10:15 AM" }
    ],
    sharedFiles: [
      { name: "InitialMockup.pdf", size: "2.4 MB", uploadedBy: "Alex Rivera" }
    ]
  },
  {
    id: "t_greenminds",
    name: "Green Minds",
    logo: "🌿",
    members: ["st_sarah"],
    invites: [],
    reputationScore: 95,
    chat: [
      { sender: "Sarah Chen", text: "Excited to design this circular packaging concept!", time: "09:30 AM" }
    ],
    sharedFiles: [
      { name: "Patagonia_Proposal_Draft.pdf", size: "5.1 MB", uploadedBy: "Sarah Chen" }
    ]
  }
];

export const initialChallenges = [
  {
    id: "ch_linear_tracker",
    title: "Re-imagining the Mobile Issue Tracker",
    summary: "Design a high-fidelity mobile workspace concept for developers to manage code reviews and active sprints on the go.",
    companyId: "co_linear",
    companyName: "Linear Inc",
    companyLogo: "⚡",
    category: "Design",
    deadline: "2026-06-30T23:59:59Z", // Weekly challenge
    prize: "$1,500 Cash + Linear Team Mentorship",
    requirements: "Open to all High School students globally. Team size 1-3. PDF Pitch Deck and interactive prototype link.",
    eligibility: "All Grades (9-12)",
    difficulty: "Advanced",
    type: "Team or Individual",
    attachments: [
      { name: "Linear_Brand_Guidelines.pdf", size: "3.5 MB" },
      { name: "Mobile_User_Research_Data.csv", size: "1.2 MB" }
    ],
    rubric: {
      "UI/UX Visual Premiumness": 30,
      "Mobile-First Interaction Innovation": 30,
      "Technical Feasibility & Implementation Logic": 20,
      "Quality of Final Pitch Deck Presentation": 20
    },
    status: "active",
    views: 1420,
    submissionsCount: 24,
    tags: ["Product Design", "Mobile", "Workspace", "Interactive Mockup"],
    createdAt: "2026-06-22T08:00:00Z",
    problemBackground: "Linear is known for its blazing fast speed and premium, mouse-free desktop experience. However, developers frequently need to review high-priority issues, approve PRs, or check sprint progress on the go. Mobile interfaces are traditionally cluttered and slow. Your job is to make issues management fast and beautiful on mobile screens.",
    deliverables: "1) A 10-slide deck covering problem analysis, UX decisions, and mockup slides. 2) A link to a clickable Figma prototype. 3) A 2-minute video presentation showing the prototype walkthrough."
  },
  {
    id: "ch_openai_ai_agent",
    title: "AI Assistant for Local High School Tutors",
    summary: "Build or design an autonomous OpenAI agent helper that analyzes high school syllabi and recommends personalized micro-lessons.",
    companyId: "co_openai",
    companyName: "OpenAI",
    companyLogo: "🤖",
    category: "Coding",
    deadline: "2026-06-28T23:59:59Z",
    prize: "$2,500 + Invitation to OpenAI DevDay",
    requirements: "Individual participation. Prototype code link (GitHub) and slide deck.",
    eligibility: "Juniors & Seniors (11-12)",
    difficulty: "Expert",
    type: "Individual Only",
    attachments: [
      { name: "OpenAI_API_Assistant_Specs.pdf", size: "1.8 MB" }
    ],
    rubric: {
      "AI Prompt Engineering & Correctness": 40,
      "Practical Utility for Tutors": 30,
      "Code Efficiency & Security": 20,
      "Originality & Novelty": 10
    },
    status: "active",
    views: 3120,
    submissionsCount: 45,
    tags: ["AI Agent", "Python", "Education Tech", "OpenAI API"],
    createdAt: "2026-06-21T09:00:00Z",
    problemBackground: "High school peer tutors spend hours preparing materials. Large Language Models can generate personalized worksheets, but standard ChatGPT prompts lack context about localized school syllabi. Design a framework or build a streamlit/react application that takes a syllabus PDF and builds custom-made micro-quizzes.",
    deliverables: "1) GitHub Repository containing code. 2) Operational System Prompt file. 3) Executive summary of agent pipeline."
  },
  {
    id: "ch_patagonia_carbon",
    title: "Circular Eco-Packaging Campaign Challenge",
    summary: "Develop a community circular collection strategy and packaging system design for Patagonia outdoor clothing repairs.",
    companyId: "co_patagonia",
    companyName: "Patagonia",
    companyLogo: "🏔️",
    category: "Social Impact",
    deadline: "2026-07-05T23:59:59Z",
    prize: "$1,000 Gear Voucher + Patagonia Eco Internship",
    requirements: "Team only (2-4 members). Detailed case study document and graphical poster assets.",
    eligibility: "All Grades (9-12)",
    difficulty: "Intermediate",
    type: "Team Only",
    attachments: [
      { name: "WornWear_Packaging_CurrentSpecs.pdf", size: "6.2 MB" }
    ],
    rubric: {
      "Environmental Circularity Impact": 40,
      "Community Action Feasibility": 30,
      "Visual Design Assets quality": 20,
      "Cost Efficiency": 10
    },
    status: "active",
    views: 890,
    submissionsCount: 12,
    tags: ["Circular Economy", "Sustainability", "Campaign Strategy", "Graphic Design"],
    createdAt: "2026-06-20T12:00:00Z",
    problemBackground: "Patagonia's Worn Wear program repairs thousands of jackets yearly. However, getting garments to repair centers in carbon-neutral envelopes remains a barrier. Create a low-impact local packaging bag structure using biodegradable materials and outline a local community drop-box collection strategy.",
    deliverables: "1) Sustainability impact analysis report (max 5 pages PDF). 2) 3D concept graphics of packaging. 3) Marketing blueprint for high-school environment launch."
  },
  {
    id: "ch_spacex_colonize",
    title: "Mars Colony Smart-Grid Logistics Strategy",
    summary: "Plan the resource allocation, storage layouts, and backup logistics routing for early Mars water ice harvesting operations.",
    companyId: "co_spacex",
    companyName: "SpaceX",
    companyLogo: "🚀",
    category: "Business",
    deadline: "2026-07-10T23:59:59Z",
    prize: "VIP Launch Invite in Boca Chica + SpaceX Flight Jacket",
    requirements: "Team or Individual. Analytical spreadsheet model and Slide Deck.",
    eligibility: "Seniors Only (12th Grade)",
    difficulty: "Expert",
    type: "Team or Individual",
    attachments: [
      { name: "Mars_Water_Harvest_Rates.csv", size: "400 KB" },
      { name: "SmartGrid_Payload_Constraints.docx", size: "850 KB" }
    ],
    rubric: {
      "Mathematical Operations Modeling": 40,
      "Risk Mitigation Planning": 30,
      "Logistics Viability": 20,
      "Clarity of Presentation": 10
    },
    status: "active",
    views: 4120,
    submissionsCount: 18,
    tags: ["Logistics", "Operations Research", "Mars Colony", "Excel Model"],
    createdAt: "2026-06-19T06:00:00Z",
    problemBackground: "Early Mars settlements will rely heavily on automated mining crawlers harvesting local water ice deposits. Water is processed into fuel (methane and liquid oxygen). Develop a resource scheduling algorithm or spreadsheet model that optimizes solar power charge cycles and logistics runs against unpredictable Martian dust storms.",
    deliverables: "1) Excel/Google Sheet model with clear equations. 2) Pitch presentation analyzing storm scenarios (max 12 slides PDF)."
  },
  {
    id: "ch_figma_edu",
    title: "UI Design Course for High Schoolers",
    summary: "Design a 4-week interactive syllabus and visual interactive templates to teach typography, layout and design thinking inside high school clubs.",
    companyId: "co_figma",
    companyName: "Figma",
    companyLogo: "🎨",
    category: "Design",
    deadline: "2026-06-15T23:59:59Z",
    prize: "Figma Pro Licenses + Figma Merch Kit",
    requirements: "Individual. Interactive Figma Community Template.",
    eligibility: "All Grades (9-12)",
    difficulty: "Intermediate",
    type: "Individual Only",
    attachments: [],
    rubric: {},
    status: "closed",
    views: 1200,
    submissionsCount: 38,
    tags: ["Design Education", "Figma Template", "Typography"],
    createdAt: "2026-05-10T08:00:00Z",
    problemBackground: "Closed challenge.",
    deliverables: "Syllabus template."
  }
];

export const initialSubmissions = [
  {
    id: "sub_1",
    challengeId: "ch_linear_tracker",
    studentId: "st_alex",
    teamId: "t_cyberdevs",
    title: "Linear Flow - Swipe-First Developer Workspace",
    summary: "A gesture-driven mobile workspace optimized for quick code review approvals and task prioritizing, minimizing taps.",
    problemUnderstanding: "Developers need to triage items while on subways or walking, not sit in heavy boards. Tap-heavy UIs are frustrating on mobile.",
    proposedSolution: "Swipe-right to approve code, swipe-left to delay. Quick code highlight reviews with tap-to-expand comments. Keyboard shortcuts optimized for touch bars.",
    feasibility: "Built as a React Native wrapper using native gestures. Designed components map directly to Linear's public SDK.",
    expectedImpact: "Saves mobile developers 15-20 minutes daily on triage work, increasing daily engagement by 35%.",
    prototypeLink: "https://figma.com/proto/linear-flow-alex",
    codeLink: "https://github.com/alexrivera/linear-flow",
    aiToolsUsed: "Used v0 for early CSS layout structures and ChatGPT for regex code blocks.",
    filesAttached: ["Linear_Flow_Proposal.pdf", "Interactive_UX_Map.png"],
    status: "finalist", // draft, submitted, finalist, winner, rejected
    scoreBreakdown: {
      "UI/UX Visual Premiumness": 28,
      "Mobile-First Interaction Innovation": 27,
      "Technical Feasibility & Implementation Logic": 18,
      "Quality of Final Pitch Deck Presentation": 17
    },
    totalScore: 90,
    judgeComments: "Incredibly slick interface. The gesture swipe logic fits Linear's keyboard-centric desktop philosophy very naturally. Keep it up!",
    createdAt: "2026-06-21T18:30:00Z",
    termsAccepted: true,
    parentConsentApproved: true
  },
  {
    id: "sub_2",
    challengeId: "ch_patagonia_carbon",
    studentId: "st_sarah",
    teamId: "t_greenminds",
    title: "CyclePack - Biodegradable Repairs Return System",
    summary: "A locally sourced organic envelope manufactured using crop waste that doubles as a return carrier envelope for repaired garments.",
    problemUnderstanding: "Garment repair shipping envelopes are currently single-use or high-emission plastics. Shipping creates unnecessary footprint.",
    proposedSolution: "Created envelope made of cornstarch-derived polylactic acid (PLA) and wheat straw. Envelopes include an embedded return label pocket.",
    feasibility: "Manufactured from standard agricultural waste streams at low thermal loads. Envelope degrades safely within 90 days in local soils.",
    expectedImpact: "Replaces 120,000 plastic shipping sleeves per year, saving approximately 4.8 tons of CO2 equivalents.",
    prototypeLink: "",
    codeLink: "",
    aiToolsUsed: "None.",
    filesAttached: ["CyclePack_Patagonia_CaseStudy.pdf"],
    status: "winner",
    scoreBreakdown: {
      "Environmental Circularity Impact": 38,
      "Community Action Feasibility": 28,
      "Visual Design Assets quality": 19,
      "Cost Efficiency": 9
    },
    totalScore: 94,
    judgeComments: "Outstanding design details and scientific logic. This is ready for real manufacturing tests. Superb job, Sarah Chen and Green Minds!",
    createdAt: "2026-06-20T17:15:00Z",
    termsAccepted: true,
    parentConsentApproved: true
  }
];

export const initialNotifications = [
  {
    id: "n_1",
    studentId: "st_alex",
    companyId: null,
    title: "Submission Status Updated!",
    message: "Your submission for 'Linear Mobile Tracker' has been shortlisted as a FINALIST!",
    read: false,
    date: "2026-06-22T14:30:00Z",
    type: "result"
  },
  {
    id: "n_2",
    studentId: "st_alex",
    companyId: null,
    title: "Team Invitation Received",
    message: "You have been invited by Marcus Vance Jr. to join the SpaceX Logistics team.",
    read: false,
    date: "2026-06-22T12:00:00Z",
    type: "team"
  },
  {
    id: "n_3",
    studentId: "st_alex",
    companyId: null,
    title: "Parent Consent Approved",
    message: "Your guardian Sofia Rivera has signed the consent form. Your account is fully active!",
    read: true,
    date: "2026-06-21T09:15:00Z",
    type: "consent"
  },
  {
    id: "n_4",
    studentId: null,
    companyId: "co_linear",
    title: "New Submission",
    message: "CyberDevs team submitted a solution for your mobile issue tracker challenge.",
    read: false,
    date: "2026-06-21T18:30:00Z",
    type: "submission"
  }
];

export const initialActivity = [
  { id: "a_1", text: "⚡ Linear Inc posted a new challenge: 'Re-imagining the Mobile Issue Tracker' with $1,500 prize pool!", date: "12 hours ago" },
  { id: "a_2", text: "🌿 Team Green Minds submitted their circular carbon packaging proposal for Patagonia.", date: "1 day ago" },
  { id: "a_3", text: "🏆 Sarah Chen won 1st Place ($1,000 + Internship) in Patagonia Eco Campaign challenge!", date: "2 days ago" },
  { id: "a_4", text: "🤖 OpenAI posted a new challenge: AI Assistant for High School Tutors.", date: "2 days ago" },
  { id: "a_5", text: "🔥 Alex Rivera achieved a 5-day challenge log streak!", date: "3 hours ago" }
];
