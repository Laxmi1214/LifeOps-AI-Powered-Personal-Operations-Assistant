/**
 * LifeOps Service Abstraction Layer
 * 
 * DESIGN RATIONALE:
 * In the next phase, these services will connect via:
 * UI -> AI Agent -> MCP Client -> Streamable HTTP -> LifeOps MCP Server -> Connectors.
 * 
 * Keeping this layer cleanly decoupled allows instant replacement with live MCP tool callers
 * without altering any UI components.
 */

import {
  initialTasks,
  initialCalendarEvents,
  initialEmails,
  initialDocuments,
  initialMeetings,
  initialReminders,
  initialSubscriptions,
  productivityMetrics,
  initialAssistantMessages
} from '../data/mockData';

// Simulated network / MCP latency
const simulateLatency = (ms = 180) => new Promise(resolve => setTimeout(resolve, ms));

export const taskService = {
  async getTasks() {
    await simulateLatency();
    return [...initialTasks];
  },
  
  async createTask(newTask) {
    await simulateLatency();
    return {
      id: `t-${Date.now()}`,
      status: 'pending',
      source: 'Manual',
      isAiGenerated: false,
      ...newTask
    };
  },

  async toggleTaskStatus(taskId, currentStatus) {
    await simulateLatency(100);
    return {
      taskId,
      newStatus: currentStatus === 'completed' ? 'pending' : 'completed'
    };
  }
};

export const calendarService = {
  async getEvents() {
    await simulateLatency();
    return [...initialCalendarEvents];
  },

  async scheduleEvent(event) {
    await simulateLatency();
    return {
      id: `ev-${Date.now()}`,
      ...event
    };
  }
};

export const emailService = {
  async getEmails() {
    await simulateLatency();
    return [...initialEmails];
  },

  async convertEmailToTask(email) {
    await simulateLatency();
    return {
      id: `t-${Date.now()}`,
      title: email.suggestedTaskTitle || `Follow up: ${email.subject}`,
      description: `Action detected from email: "${email.subject}" (${email.sender}). AI Note: ${email.aiDetectedAction}`,
      priority: email.importance === 'High' ? 'HIGH' : 'MEDIUM',
      deadline: email.deadline || 'This week',
      dueDate: '2026-10-09',
      dueTime: '5:00 PM',
      category: 'Operations',
      status: 'pending',
      source: 'Email',
      isAiGenerated: true,
      tags: ['email-triage', 'lifeops-action']
    };
  }
};

export const meetingService = {
  async getMeetings() {
    await simulateLatency();
    return [...initialMeetings];
  },

  async extractTasksFromMeeting(meeting) {
    await simulateLatency();
    return meeting.actionItems.map((item, idx) => ({
      id: `t-meet-${Date.now()}-${idx}`,
      title: item.text,
      description: `Action item extracted from meeting: "${meeting.title}" on ${meeting.date}. Assigned to: ${item.assignee}.`,
      priority: 'HIGH',
      deadline: 'Upcoming',
      dueDate: '2026-10-09',
      dueTime: '4:00 PM',
      category: 'Project',
      status: 'pending',
      source: 'Meeting',
      isAiGenerated: true,
      tags: ['meeting-action', 'mcp-sync']
    }));
  }
};

export const documentService = {
  async getDocuments() {
    await simulateLatency();
    return [...initialDocuments];
  },

  async summarizeDocument(docId) {
    await simulateLatency(300);
    const doc = initialDocuments.find(d => d.id === docId);
    return {
      docId,
      title: doc?.title,
      summary: doc?.aiSummary,
      keyPoints: doc?.keyPoints || []
    };
  }
};

export const reminderService = {
  async getReminders() {
    await simulateLatency();
    return [...initialReminders];
  },

  async createReminder(reminder) {
    await simulateLatency();
    return {
      id: `rem-${Date.now()}`,
      status: 'active',
      ...reminder
    };
  }
};

export const subscriptionService = {
  async getSubscriptions() {
    await simulateLatency();
    return [...initialSubscriptions];
  },

  async createRenewalReminder(subscription) {
    await simulateLatency();
    return {
      id: `rem-sub-${Date.now()}`,
      title: `${subscription.name} renews in ${subscription.renewalDaysLeft} days (${subscription.formattedCost})`,
      triggerTime: `2 days before ${subscription.nextRenewal}`,
      triggerDate: '2026-10-09',
      relatedTask: null,
      relatedCalendarEvent: null,
      status: 'active',
      isSmartSuggestion: true,
      reason: `Automated financial commitment alert for ${subscription.name}`
    };
  }
};

export const analyticsService = {
  async getProductivityData() {
    await simulateLatency();
    return productivityMetrics;
  }
};

export const aiAssistantService = {
  async getChatHistory() {
    await simulateLatency(100);
    return [...initialAssistantMessages];
  },

  async generateResponse(query, conversationId = 'default-session') {
    try {
      const res = await fetch('/api/agent/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: query,
          conversation_id: conversationId,
        }),
      });
      if (res.ok) {
        const data = await res.json();
        return {
          text: data.message,
          actionCards: (data.actions || []).map((card) => ({
            id: card.id || `card-${Date.now()}`,
            type: card.type || 'schedule_plan',
            title: card.title,
            timeWindow: card.timeWindow,
            taskTitle: card.taskTitle,
            priority: card.priority,
            requires_confirmation: card.requires_confirmation,
            action: card.action,
            sender: card.sender,
            summary: card.summary,
            actions: ['Schedule this', 'Dismiss']
          })),
          intent: data.intent,
          toolCalls: data.tool_calls,
          requiresConfirmation: data.requires_confirmation,
          pendingAction: data.pending_action,
          conversationId: data.conversation_id
        };
      }
    } catch (err) {
      console.warn('LifeOps agent API call error, falling back:', err);
    }

    await simulateLatency(450);
    const normalized = query.toLowerCase();

    if (normalized.includes('focus') || normalized.includes('today') || normalized.includes('priority')) {
      return {
        text: "Analyzing your personal context... You have 3 pending tasks for today. The most time-critical is 'Complete hackathon prototype for LifeOps' (HIGH, due 6:00 PM). You have an open focus window between 2:00 PM and 4:00 PM where no meetings are scheduled.",
        actionCards: [
          {
            id: `card-${Date.now()}-1`,
            type: 'schedule_plan',
            title: 'Recommended Deep Work Block',
            timeWindow: '2:00 PM – 4:00 PM (Today)',
            taskTitle: 'Complete Hackathon Prototype for LifeOps',
            priority: 'HIGH',
            category: 'Project Work',
            actions: ['Schedule to Calendar', 'Dismiss']
          }
        ]
      };
    }

    if (normalized.includes('overdue')) {
      return {
        text: "You currently have 1 overdue item: 'Cloud database backup review' (marked complete yesterday). All your active items are scheduled on track. The next urgent item is your Technical Interview confirmation due by tomorrow 5 PM.",
        actionCards: [
          {
            id: `card-${Date.now()}-2`,
            type: 'email_action',
            title: 'Upcoming Urgent Deadline',
            sender: 'Talent Acquisition Team',
            summary: 'Interview slot confirmation deadline: Oct 9, 5:00 PM.',
            actions: ['View Email', 'Create Task']
          }
        ]
      };
    }

    if (normalized.includes('summarize') || normalized.includes('day')) {
      return {
        text: "Here is your operational snapshot for today, Oct 7:\n\n• 3 Calendar events scheduled (Next: Deep Work at 2:00 PM)\n• 4 Emails requiring attention (1 urgent recruiting reply)\n• 1 High priority project prototype due at 6:00 PM\n• Productivity Score currently at 82% (trending +14% higher than last week).",
        actionCards: [
          {
            id: `card-${Date.now()}-3`,
            type: 'schedule_plan',
            title: 'Schedule Focus Block',
            timeWindow: '2:00 PM – 4:00 PM',
            taskTitle: 'Focus Session: Prototype Polish',
            priority: 'HIGH',
            category: 'Deep Work',
            actions: ['Schedule to Calendar', 'Dismiss']
          }
        ]
      };
    }

    if (normalized.includes('free time') || normalized.includes('tomorrow')) {
      return {
        text: "I analyzed your calendar for tomorrow (Thursday, Oct 8). You have 3 prime unallocated windows:\n\n1. 10:30 AM – 11:30 AM (1h 00m)\n2. 2:00 PM – 4:00 PM (2h 00m, highest focus score)\n3. 6:30 PM – 7:30 PM (1h 00m buffer)\n\nWould you like me to protect the 2:00 PM window for presentation rehearsal?",
        actionCards: [
          {
            id: `card-${Date.now()}-4`,
            type: 'schedule_plan',
            title: 'Block Protected Time Tomorrow',
            timeWindow: 'Tomorrow, 2:00 PM – 4:00 PM',
            taskTitle: 'Presentation Rehearsal & Video Recording',
            priority: 'HIGH',
            category: 'Deep Focus',
            actions: ['Schedule to Calendar', 'Dismiss']
          }
        ]
      };
    }

    if (normalized.includes('productive') || normalized.includes('week') || normalized.includes('analytics')) {
      return {
        text: "Your weekly productivity score is 82%, an increase of 14% over last week. You have maintained 18h 40m of deep focus and completed 31 tasks with an 87% on-time completion rate. Your highest peak velocity occurs between 9:00 AM and 12:00 PM.",
        actionCards: []
      };
    }

    // Default intelligent assistant fallback
    return {
      text: `Understood: "${query}". I reviewed your connected operational domains (Tasks, Calendar, Email, Docs, Meetings, Reminders, and Subscriptions). Everything is aligned with your current priorities. You can ask me to schedule blocks, extract action items, or summarize documents.`,
      actionCards: [
        {
          id: `card-${Date.now()}-def`,
          type: 'schedule_plan',
          title: 'Quick Operations Suggestion',
          timeWindow: 'Today @ 2:00 PM',
          taskTitle: 'LifeOps Operations Review',
          priority: 'MEDIUM',
          category: 'Operations',
          actions: ['Schedule to Calendar', 'Dismiss']
        }
      ]
    };
  }
};
