export const initialTasks = [
  {
    id: 't-1',
    title: 'Complete hackathon prototype for LifeOps',
    description: 'Finalize core UI components, cross-module action cards, and Amazon hackathon demo flows.',
    priority: 'HIGH',
    deadline: 'Today',
    dueDate: '2026-10-07',
    dueTime: '6:00 PM',
    category: 'Project',
    status: 'pending',
    source: 'Project',
    isAiGenerated: true,
    estimatedMinutes: 120,
    tags: ['hackathon', 'demo-critical', 'frontend']
  },
  {
    id: 't-2',
    title: 'Review project architecture & MCP specification',
    description: 'Ensure Streamable HTTP connector and MCP client schemas match tools specification.',
    priority: 'MEDIUM',
    deadline: 'Tomorrow',
    dueDate: '2026-10-08',
    dueTime: '11:00 AM',
    category: 'Engineering',
    status: 'pending',
    source: 'Email',
    isAiGenerated: false,
    estimatedMinutes: 45,
    tags: ['mcp', 'architecture']
  },
  {
    id: 't-3',
    title: 'Respond to Technical Assessment confirmation',
    description: 'Confirm interview availability for Friday morning slot with hiring team.',
    priority: 'HIGH',
    deadline: 'Tomorrow',
    dueDate: '2026-10-08',
    dueTime: '5:00 PM',
    category: 'Personal',
    status: 'pending',
    source: 'Email',
    isAiGenerated: true,
    estimatedMinutes: 15,
    tags: ['interview', 'urgent']
  },
  {
    id: 't-4',
    title: 'Organize saved technical documents and research papers',
    description: 'Archive obsolete drafts and tag knowledge items in LifeOps Document index.',
    priority: 'LOW',
    deadline: 'This week',
    dueDate: '2026-10-10',
    dueTime: '4:00 PM',
    category: 'Operations',
    status: 'pending',
    source: 'Manual',
    isAiGenerated: false,
    estimatedMinutes: 30,
    tags: ['cleanup', 'docs']
  },
  {
    id: 't-5',
    title: 'Sync with frontend team on design token system',
    description: 'Align dark-mode color palette, typography hierarchy, and glassmorphism levels.',
    priority: 'MEDIUM',
    deadline: 'Today',
    dueDate: '2026-10-07',
    dueTime: '1:30 PM',
    category: 'Project',
    status: 'completed',
    source: 'Meeting',
    isAiGenerated: false,
    estimatedMinutes: 30,
    tags: ['design-system']
  },
  {
    id: 't-6',
    title: 'Implement Recharts analytics dashboard views',
    description: 'Add weekly productivity curves, completion ratios, and category breakdowns.',
    priority: 'HIGH',
    deadline: 'Today',
    dueDate: '2026-10-07',
    dueTime: '12:00 PM',
    category: 'Engineering',
    status: 'completed',
    source: 'Project',
    isAiGenerated: false,
    estimatedMinutes: 90,
    tags: ['charts', 'analytics']
  },
  {
    id: 't-7',
    title: 'Review cloud database backup configurations',
    description: 'Verify automated snapshots in AWS us-east-1 and test restore policy.',
    priority: 'LOW',
    deadline: 'Yesterday',
    dueDate: '2026-10-06',
    dueTime: '3:00 PM',
    category: 'Operations',
    status: 'completed',
    source: 'Manual',
    isAiGenerated: false,
    estimatedMinutes: 20,
    tags: ['devops', 'backup']
  },
  {
    id: 't-8',
    title: 'Update monthly subscriptions audit sheet',
    description: 'Check active SaaS seat licenses and cancel inactive cloud test instances.',
    priority: 'LOW',
    deadline: 'Oct 05',
    dueDate: '2026-10-05',
    dueTime: '5:00 PM',
    category: 'Operations',
    status: 'completed',
    source: 'AI Suggested',
    isAiGenerated: true,
    estimatedMinutes: 25,
    tags: ['finance', 'subscriptions']
  }
];

export const initialCalendarEvents = [
  {
    id: 'ev-1',
    title: 'DSA Practice & Algorithmic Problem Solving',
    date: '2026-10-07',
    startTime: '09:00',
    endTime: '10:30',
    displayTime: '09:00 AM – 10:30 AM',
    category: 'Personal',
    color: '#06b6d4',
    location: 'Focus Space / LeetCode',
    participants: ['Alex Rivera'],
    description: 'Graph algorithms, topological sort, and dynamic programming revision.'
  },
  {
    id: 'ev-2',
    title: 'LifeOps Core Architecture & MCP Sync',
    date: '2026-10-07',
    startTime: '11:00',
    endTime: '12:00',
    displayTime: '11:00 AM – 12:00 PM',
    category: 'Meeting',
    color: '#6366f1',
    location: 'Amazon Chime / Video Call',
    participants: ['Alex Rivera', 'Dev Lead Sarah', 'Architect Chen'],
    description: 'Review Streamable HTTP tool calls, security sandbox boundaries, and latency budgets.'
  },
  {
    id: 'ev-3',
    title: 'Deep Work: Hackathon Prototype Implementation',
    date: '2026-10-07',
    startTime: '14:00',
    endTime: '16:00',
    displayTime: '02:00 PM – 04:00 PM',
    category: 'Focus',
    color: '#8b5cf6',
    location: 'Personal Operations Workspace',
    participants: ['Alex Rivera'],
    description: 'Protected focus window scheduled by LifeOps. Focus on task management and cross-module actions.'
  },
  {
    id: 'ev-4',
    title: 'System Design & Technical Interview Preparation',
    date: '2026-10-07',
    startTime: '17:00',
    endTime: '18:00',
    displayTime: '05:00 PM – 06:00 PM',
    category: 'Personal',
    color: '#10b981',
    location: 'Virtual Mock Room',
    participants: ['Alex Rivera', 'Mentor Elena'],
    description: 'High-throughput event-driven microservices architecture walkthrough.'
  },
  {
    id: 'ev-5',
    title: 'Hackathon Submission Deadline',
    date: '2026-10-08',
    startTime: '18:00',
    endTime: '18:30',
    displayTime: '06:00 PM – 06:30 PM',
    category: 'Deadline',
    color: '#f43f5e',
    location: 'Hackathon Portal',
    participants: ['All Team Members'],
    description: 'Final code freeze and video presentation upload.'
  }
];

export const freeTimeSlots = [
  {
    id: 'slot-1',
    day: 'Tomorrow, Oct 8',
    startTime: '10:30 AM',
    endTime: '11:30 AM',
    duration: '1h 00m',
    label: 'Morning Window',
    recommendedFocus: 'Review Documentation',
    efficiencyScore: 92
  },
  {
    id: 'slot-2',
    day: 'Tomorrow, Oct 8',
    startTime: '02:00 PM',
    endTime: '04:00 PM',
    duration: '2h 00m',
    label: 'Prime Deep Focus Window',
    recommendedFocus: 'Hackathon Polish & Testing',
    efficiencyScore: 98
  },
  {
    id: 'slot-3',
    day: 'Tomorrow, Oct 8',
    startTime: '06:30 PM',
    endTime: '07:30 PM',
    duration: '1h 00m',
    label: 'Evening Buffer',
    recommendedFocus: 'Submission Verification',
    efficiencyScore: 85
  }
];

export const initialEmails = [
  {
    id: 'em-1',
    sender: 'Talent Acquisition Team',
    senderEmail: 'recruiting@techsummit.io',
    senderInitials: 'TA',
    subject: 'Technical Interview Confirmation & Schedule Availability',
    preview: 'Hi Alex, we were impressed with your background. Please confirm your availability for the Senior Ops Architect round this Friday before 5 PM...',
    time: '42 mins ago',
    date: 'Oct 7, 2026',
    section: 'Action Required',
    importance: 'High',
    aiDetectedAction: 'Requires response before Friday, Oct 9 at 5:00 PM.',
    deadline: 'Oct 09, 5:00 PM',
    read: false,
    suggestedTaskTitle: 'Reply to Talent Acquisition with Friday availability slots'
  },
  {
    id: 'em-2',
    sender: 'Cloudflare Operations',
    senderEmail: 'notifications@cloudflare.com',
    senderInitials: 'CF',
    subject: 'Security Alert: Origin Certificate Expiring in 5 Days',
    preview: 'Your origin certificate for api.lifeops.internal will expire on Oct 12, 2026. Action required to prevent SSL connection errors...',
    time: '2 hours ago',
    date: 'Oct 7, 2026',
    section: 'Action Required',
    importance: 'High',
    aiDetectedAction: 'Renew SSL certificate on API server before Oct 12.',
    deadline: 'Oct 12, 2026',
    read: false,
    suggestedTaskTitle: 'Renew SSL certificate for api.lifeops.internal'
  },
  {
    id: 'em-3',
    sender: 'Marcus Vance (VP Eng)',
    senderEmail: 'marcus.v@company.org',
    senderInitials: 'MV',
    subject: 'Q4 Product Roadmap & Tooling Strategy Alignment',
    preview: 'Alex, took a look at the LifeOps personal operations architecture memo. Love the unified context approach. Let us align during Thursday sync...',
    time: '4 hours ago',
    date: 'Oct 7, 2026',
    section: 'Important',
    importance: 'Normal',
    aiDetectedAction: 'Add agenda topic to Thursday 11 AM Sync.',
    deadline: 'Oct 08, 11:00 AM',
    read: true,
    suggestedTaskTitle: 'Prepare 3-slide overview of LifeOps context graph'
  },
  {
    id: 'em-4',
    sender: 'DevOps Billing Desk',
    senderEmail: 'billing@cloudscale.net',
    senderInitials: 'DB',
    subject: 'Monthly Invoice #INV-2026-981 ready for review',
    preview: 'Your billing statement for Sep 2026 is ready. Total charges: $148.20. Auto-charge scheduled for Oct 10, 2026...',
    time: 'Yesterday',
    date: 'Oct 6, 2026',
    section: 'Waiting for Reply',
    importance: 'Normal',
    aiDetectedAction: 'Audit line-item bandwidth charges before auto-debit.',
    deadline: 'Oct 10, 2026',
    read: true,
    suggestedTaskTitle: 'Audit CloudScale bandwidth charges'
  },
  {
    id: 'em-5',
    sender: 'Substack AI Weekly',
    senderEmail: 'digest@newsletter.ai',
    senderInitials: 'SW',
    subject: 'The Shift to Multi-Agent Workspaces: MCP, Tools & Context',
    preview: 'This week in AI engineering: why standalone chatbots are failing and how contextual operations assistants are winning enterprise users...',
    time: 'Yesterday',
    date: 'Oct 6, 2026',
    section: 'Informational',
    importance: 'Low',
    aiDetectedAction: 'Informational only. 6 min read.',
    deadline: null,
    read: true,
    suggestedTaskTitle: null
  }
];

export const initialDocuments = [
  {
    id: 'doc-1',
    title: 'LifeOps_System_Architecture.pdf',
    type: 'PDF',
    size: '3.4 MB',
    lastUpdated: 'Today, 10:15 AM',
    category: 'Architecture',
    aiSummary: 'Outlines the 8 core operational domains, MCP Streamable HTTP tool binding protocols, and context graph data models.',
    keyPoints: [
      'Separation of UI layer and Agent execution kernel',
      'Event-driven cross-module trigger contracts',
      'Local encrypted credential storage for OAuth tokens'
    ],
    pagesCount: 14
  },
  {
    id: 'doc-2',
    title: 'Amazon_Hackathon_Judging_Rubric.docx',
    type: 'DOCX',
    size: '1.2 MB',
    lastUpdated: 'Yesterday, 4:20 PM',
    category: 'Specs',
    aiSummary: 'Hackathon evaluation focuses on innovation (30%), practical real-world impact (30%), user interface & experience polish (25%), and technical architecture (15%).',
    keyPoints: [
      'Working interactive UI with clear domain value',
      'Unified contextual experience over disconnected apps',
      'Clarity of AI copilot integration points'
    ],
    pagesCount: 6
  },
  {
    id: 'doc-3',
    title: 'MCP_Streamable_HTTP_Specs.yaml',
    type: 'YAML',
    size: '48 KB',
    lastUpdated: 'Oct 05, 2026',
    category: 'Architecture',
    aiSummary: 'Defines OpenAPI compliant schemas for Calendar, Gmail, Document search, and Task manager tool endpoints.',
    keyPoints: [
      'Streaming chunks with server-sent events (SSE)',
      'Token limit safeguards per tool call',
      'JSON-RPC 2.0 transport compatibility'
    ],
    pagesCount: 1
  },
  {
    id: 'doc-4',
    title: 'Personal_Operations_Quarterly_Budget.xlsx',
    type: 'SHEET',
    size: '820 KB',
    lastUpdated: 'Oct 02, 2026',
    category: 'Finance',
    aiSummary: 'Consolidated tracking of personal digital SaaS commitments, internet infrastructure, and cloud development compute costs.',
    keyPoints: [
      'Total monthly recurring commitments: ₹3,245',
      'Annual savings opportunity: ₹4,800 by switching to annual billing',
      'Renewals peak in second week of October'
    ],
    pagesCount: 3
  }
];

export const initialMeetings = [
  {
    id: 'meet-1',
    title: 'Hackathon Team Sprint & Prototype Freeze',
    date: 'Oct 07, 2026',
    time: '11:00 AM – 12:00 PM',
    duration: '60 mins',
    status: 'Past',
    participants: [
      { name: 'Alex Rivera', role: 'Product & Frontend', avatar: 'AR' },
      { name: 'Chen Wei', role: 'AI Agent Architect', avatar: 'CW' },
      { name: 'Sarah Jenkins', role: 'DevOps & MCP Lead', avatar: 'SJ' }
    ],
    summary: 'Team aligned on the hackathon presentation flow. Agreed to prioritize a polished dark-first UI before hooking up live MCP agent pipelines.',
    keyDecisions: [
      'Use MCP Streamable HTTP for remote tool communication.',
      'Maintain dark-first sleek aesthetic inspired by modern AI productivity tooling.',
      'Simulate cross-module actions cleanly in mock layer so reviewers can test full flows.'
    ],
    actionItems: [
      { id: 'act-1', text: 'Complete frontend prototype with all 8 operational domains', completed: true, assignee: 'Alex Rivera' },
      { id: 'act-2', text: 'Finalize MCP tool specification schema document', completed: false, assignee: 'Sarah Jenkins' },
      { id: 'act-3', text: 'Prepare 3-minute video presentation and screen recording', completed: false, assignee: 'Chen Wei' }
    ],
    deadlines: ['Demo recording: Thursday 4 PM', 'Hackathon submission: Friday 6 PM']
  },
  {
    id: 'meet-2',
    title: 'Design Review: LifeOps AI Assistant Experience',
    date: 'Oct 08, 2026',
    time: '03:00 PM – 03:45 PM',
    duration: '45 mins',
    status: 'Upcoming',
    participants: [
      { name: 'Alex Rivera', role: 'Product Designer', avatar: 'AR' },
      { name: 'Maya Lin', role: 'UX Research', avatar: 'ML' }
    ],
    summary: 'Review of the AI Assistant conversational UI, suggested action chips, and contextual card layouts.',
    keyDecisions: [],
    actionItems: [
      { id: 'act-4', text: 'Draft high-fidelity action card states', completed: false, assignee: 'Alex Rivera' },
      { id: 'act-5', text: 'Collect feedback on command palette shortcuts', completed: false, assignee: 'Maya Lin' }
    ],
    deadlines: ['Design sign-off: Oct 08']
  }
];

export const initialReminders = [
  {
    id: 'rem-1',
    title: 'Your project deadline is tomorrow at 6:00 PM',
    triggerTime: 'Tomorrow, 5:00 PM',
    triggerDate: '2026-10-08',
    relatedTask: 'Complete hackathon prototype for LifeOps',
    relatedCalendarEvent: 'Hackathon Submission Deadline',
    status: 'active',
    isSmartSuggestion: false,
    reason: 'Critical milestone countdown'
  },
  {
    id: 'rem-2',
    title: 'You are free from 2–4 PM today. Schedule focused prototype work?',
    triggerTime: 'Today, 1:45 PM',
    triggerDate: '2026-10-07',
    relatedTask: 'Complete hackathon prototype for LifeOps',
    relatedCalendarEvent: 'Deep Work: Hackathon Prototype Implementation',
    status: 'active',
    isSmartSuggestion: true,
    reason: 'AI detected 2-hour uninterrupted calendar window'
  },
  {
    id: 'rem-3',
    title: 'Respond to Technical Assessment interview invitation',
    triggerTime: 'Tomorrow, 10:00 AM',
    triggerDate: '2026-10-08',
    relatedTask: 'Respond to Technical Assessment confirmation',
    relatedCalendarEvent: null,
    status: 'active',
    isSmartSuggestion: false,
    reason: 'Email action detected with Oct 9 deadline'
  },
  {
    id: 'rem-4',
    title: 'Netflix subscription renews in 3 days (₹649)',
    triggerTime: 'Oct 09, 9:00 AM',
    triggerDate: '2026-10-09',
    relatedTask: null,
    relatedCalendarEvent: null,
    status: 'active',
    isSmartSuggestion: true,
    reason: 'Financial commitment recurring renewal alert'
  }
];

export const initialSubscriptions = [
  {
    id: 'sub-1',
    name: 'Netflix 4K Premium',
    category: 'Entertainment',
    cost: 649,
    formattedCost: '₹649',
    cycle: 'Monthly',
    nextRenewal: 'Oct 10, 2026',
    renewalDaysLeft: 3,
    status: 'Active',
    paymentMethod: 'HDFC Visa •••• 4091',
    icon: 'tv'
  },
  {
    id: 'sub-2',
    name: 'AWS Cloud Storage & S3',
    category: 'Developer Tools',
    cost: 130,
    formattedCost: '₹130',
    cycle: 'Monthly',
    nextRenewal: 'Oct 12, 2026',
    renewalDaysLeft: 5,
    status: 'Active',
    paymentMethod: 'ICICI Master •••• 8820',
    icon: 'cloud'
  },
  {
    id: 'sub-3',
    name: 'High-Speed Fiber Internet',
    category: 'Utilities',
    cost: 799,
    formattedCost: '₹799',
    cycle: 'Monthly',
    nextRenewal: 'Oct 15, 2026',
    renewalDaysLeft: 8,
    status: 'Active',
    paymentMethod: 'UPI Auto-pay',
    icon: 'wifi'
  },
  {
    id: 'sub-4',
    name: 'Spotify Family Subscription',
    category: 'Entertainment',
    cost: 179,
    formattedCost: '₹179',
    cycle: 'Monthly',
    nextRenewal: 'Oct 22, 2026',
    renewalDaysLeft: 15,
    status: 'Active',
    paymentMethod: 'UPI Auto-pay',
    icon: 'music'
  },
  {
    id: 'sub-5',
    name: 'GitHub Copilot Enterprise',
    category: 'Developer Tools',
    cost: 850,
    formattedCost: '₹850',
    cycle: 'Monthly',
    nextRenewal: 'Oct 28, 2026',
    renewalDaysLeft: 21,
    status: 'Active',
    paymentMethod: 'Corporate Card •••• 1092',
    icon: 'code'
  },
  {
    id: 'sub-6',
    name: 'Notion AI Workspace',
    category: 'Productivity',
    cost: 638,
    formattedCost: '₹638',
    cycle: 'Monthly',
    nextRenewal: 'Nov 02, 2026',
    renewalDaysLeft: 26,
    status: 'Active',
    paymentMethod: 'HDFC Visa •••• 4091',
    icon: 'file-text'
  }
];

export const productivityMetrics = {
  score: 82,
  previousScore: 72,
  changePercent: '+14%',
  completedTasks: 31,
  totalTasksThisWeek: 36,
  completionRate: 87,
  focusTime: '18h 40m',
  targetFocusTime: '20h 00m',
  onTimeRate: 86,
  
  weeklyTrend: [
    { day: 'Thu', score: 68, focusHours: 3.2, completed: 4, target: 4.0 },
    { day: 'Fri', score: 72, focusHours: 3.8, completed: 5, target: 4.0 },
    { day: 'Sat', score: 60, focusHours: 2.0, completed: 3, target: 3.0 },
    { day: 'Sun', score: 55, focusHours: 1.5, completed: 2, target: 2.0 },
    { day: 'Mon', score: 79, focusHours: 4.2, completed: 7, target: 4.0 },
    { day: 'Tue', score: 84, focusHours: 4.6, completed: 8, target: 4.0 },
    { day: 'Wed (Today)', score: 82, focusHours: 4.3, completed: 5, target: 4.0 }
  ],

  taskStatusDistribution: [
    { name: 'Completed', count: 31, color: '#10b981' },
    { name: 'Pending', count: 5, color: '#6366f1' },
    { name: 'Overdue', count: 2, color: '#f43f5e' }
  ],

  categoryDistribution: [
    { name: 'Project & Engineering', value: 42, color: '#6366f1' },
    { name: 'Meeting Operations', value: 24, color: '#8b5cf6' },
    { name: 'Email Intelligence', value: 18, color: '#06b6d4' },
    { name: 'Documentation & Knowledge', value: 16, color: '#10b981' }
  ],

  aiInsights: [
    {
      id: 'ins-1',
      type: 'positive',
      title: 'Momentum Boost',
      text: 'Your productivity increased 14% this week. You completed 5 high-priority items ahead of schedule.',
      icon: 'trending-up'
    },
    {
      id: 'ins-2',
      type: 'peak',
      title: 'Peak Focus Window',
      text: 'You complete the most tasks between 9:00 AM and 12:00 PM. LifeOps has auto-reserved this slot for deep work.',
      icon: 'clock'
    },
    {
      id: 'ins-3',
      type: 'bottleneck',
      title: 'Attention Bottleneck',
      text: 'Documentation tasks are currently your largest source of overdue work (avg 1.8 days delay).',
      icon: 'alert-triangle'
    },
    {
      id: 'ins-4',
      type: 'recommendation',
      title: 'Optimized Recommendation',
      text: 'Schedule a 90-minute focus block on Thursday morning for pending documentation before the hackathon freeze.',
      icon: 'zap'
    }
  ]
};

export const initialNotifications = [
  {
    id: 'notif-1',
    category: 'urgent',
    title: 'Interview Response Deadline',
    message: 'Talent Acquisition requires your response before Friday 5:00 PM.',
    time: '25m ago',
    read: false,
    badgeColor: 'bg-rose-500'
  },
  {
    id: 'notif-2',
    category: 'tasks',
    title: 'High Priority Task Due Today',
    message: '"Complete hackathon prototype for LifeOps" due at 6:00 PM.',
    time: '1h ago',
    read: false,
    badgeColor: 'bg-amber-500'
  },
  {
    id: 'notif-3',
    category: 'calendar',
    title: 'Upcoming Calendar Event',
    message: '"Deep Work: Hackathon Prototype Implementation" starts at 2:00 PM.',
    time: '2h ago',
    read: false,
    badgeColor: 'bg-indigo-500'
  },
  {
    id: 'notif-4',
    category: 'bills',
    title: 'Subscription Renewal Alert',
    message: 'Netflix renews in 3 days (₹649 auto-charge).',
    time: '5h ago',
    read: true,
    badgeColor: 'bg-cyan-500'
  },
  {
    id: 'notif-5',
    category: 'ai',
    title: 'LifeOps Context Optimization',
    message: '2-hour free window identified between 2 PM and 4 PM today.',
    time: 'Today',
    read: true,
    badgeColor: 'bg-purple-500'
  }
];

export const initialAssistantMessages = [
  {
    id: 'msg-1',
    sender: 'user',
    timestamp: '09:15 AM',
    text: 'What should I focus on today?'
  },
  {
    id: 'msg-2',
    sender: 'assistant',
    timestamp: '09:15 AM',
    text: "Good morning Alex! You have 3 high-priority tasks and an architecture sync at 11:00 AM. Your hackathon prototype is the most time-sensitive deliverable due today at 6:00 PM. I recommend dedicating your 2:00 PM – 4:00 PM open window to prototype completion.",
    actionCards: [
      {
        id: 'card-1',
        type: 'schedule_plan',
        title: 'Suggested Focus Plan',
        timeWindow: '2:00 PM – 4:00 PM',
        taskTitle: 'Complete Hackathon Prototype for LifeOps',
        priority: 'HIGH',
        category: 'Project Work',
        actions: ['Schedule to Calendar', 'Dismiss']
      },
      {
        id: 'card-2',
        type: 'email_action',
        title: 'Pending Email Action Detected',
        sender: 'Talent Acquisition Team',
        summary: 'Requires interview slot confirmation before Friday 5 PM.',
        actions: ['Draft Response', 'Create Task']
      }
    ]
  }
];
