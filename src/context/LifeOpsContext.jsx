import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  initialTasks,
  initialCalendarEvents,
  initialEmails,
  initialDocuments,
  initialMeetings,
  initialReminders,
  initialSubscriptions,
  productivityMetrics,
  initialNotifications,
  initialAssistantMessages,
  freeTimeSlots
} from '../data/mockData';
import { emailService, meetingService, subscriptionService, aiAssistantService } from '../services/mockServices';

const LifeOpsContext = createContext();

export const LifeOpsProvider = ({ children }) => {
  // Operational State
  const [tasks, setTasks] = useState(initialTasks);
  const [calendarEvents, setCalendarEvents] = useState(initialCalendarEvents);
  const [emails, setEmails] = useState(initialEmails);
  const [documents, setDocuments] = useState(initialDocuments);
  const [meetings, setMeetings] = useState(initialMeetings);
  const [reminders, setReminders] = useState(initialReminders);
  const [subscriptions, setSubscriptions] = useState(initialSubscriptions);
  const [notifications, setNotifications] = useState(initialNotifications);
  const [chatMessages, setChatMessages] = useState(initialAssistantMessages);
  const [availableSlots, setAvailableSlots] = useState(freeTimeSlots);

  // Global UI State
  const [isCommandPaletteOpen, setIsCommandPaletteOpen] = useState(false);
  const [isQuickAssistantOpen, setIsQuickAssistantOpen] = useState(false);
  const [toasts, setToasts] = useState([]);
  const [selectedMeeting, setSelectedMeeting] = useState(null);
  const [selectedDoc, setSelectedDoc] = useState(null);

  // Toast Helper
  const showToast = (message, type = 'info', actionTitle = null, onAction = null) => {
    const id = `toast-${Date.now()}-${Math.random()}`;
    const newToast = { id, message, type, actionTitle, onAction };
    setToasts((prev) => [...prev, newToast]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4500);
  };

  const removeToast = (id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  // Keyboard shortcut for Cmd/Ctrl + K
  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setIsCommandPaletteOpen((prev) => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // 1. Task Operations
  const toggleTaskStatus = (taskId) => {
    setTasks((prev) =>
      prev.map((task) => {
        if (task.id === taskId) {
          const newStatus = task.status === 'completed' ? 'pending' : 'completed';
          showToast(
            newStatus === 'completed' ? `Completed: "${task.title}"` : `Reopened: "${task.title}"`,
            newStatus === 'completed' ? 'success' : 'info'
          );
          return { ...task, status: newStatus };
        }
        return task;
      })
    );
  };

  const addTask = (newTask) => {
    const created = {
      id: `t-${Date.now()}`,
      status: 'pending',
      source: 'Manual',
      isAiGenerated: false,
      ...newTask
    };
    setTasks((prev) => [created, ...prev]);
    showToast(`Task created: "${created.title}"`, 'success');
    return created;
  };

  const deleteTask = (taskId) => {
    const target = tasks.find((t) => t.id === taskId);
    setTasks((prev) => prev.filter((t) => t.id !== taskId));
    showToast(`Deleted task: "${target?.title || 'Task'}"`, 'info');
  };

  // 2. Calendar Operations
  const addCalendarEvent = (eventData) => {
    const newEv = {
      id: `ev-${Date.now()}`,
      category: 'Focus',
      color: '#6366f1',
      participants: ['Alex Rivera'],
      ...eventData
    };
    setCalendarEvents((prev) => [...prev, newEv]);
    showToast(`Scheduled: "${newEv.title}" for ${newEv.startTime || 'specified time'}`, 'success');
    return newEv;
  };

  const scheduleTimeSlot = (slot) => {
    const newEv = {
      id: `ev-${Date.now()}`,
      title: `Focus: ${slot.recommendedFocus || 'Deep Work'}`,
      date: '2026-10-08',
      startTime: slot.startTime.split(' ')[0],
      endTime: slot.endTime.split(' ')[0],
      displayTime: `${slot.startTime} – ${slot.endTime}`,
      category: 'Focus',
      color: '#8b5cf6',
      location: 'LifeOps Focus Suite',
      participants: ['Alex Rivera'],
      description: `Auto-scheduled in prime window (${slot.duration}). Efficiency score: ${slot.efficiencyScore}%`
    };
    setCalendarEvents((prev) => [...prev, newEv]);
    setAvailableSlots((prev) => prev.filter((s) => s.id !== slot.id));
    showToast(`Scheduled focus block: "${newEv.title}" (${slot.startTime} – ${slot.endTime})`, 'success');
  };

  // 3. Email Operations
  const markEmailAsRead = (emailId) => {
    setEmails((prev) =>
      prev.map((em) => (em.id === emailId ? { ...em, read: true } : em))
    );
  };

  // Cross-Module Flow: Email -> Task
  const createTaskFromEmail = async (email) => {
    const newTask = await emailService.convertEmailToTask(email);
    setTasks((prev) => [newTask, ...prev]);
    markEmailAsRead(email.id);
    showToast(`Created task from email: "${newTask.title}"`, 'success');
  };

  // Cross-Module Flow: Email -> Calendar
  const addEmailToCalendar = (email) => {
    const newEv = {
      id: `ev-${Date.now()}`,
      title: `Follow up: ${email.subject}`,
      date: '2026-10-09',
      startTime: '10:00',
      endTime: '10:45',
      displayTime: '10:00 AM – 10:45 AM',
      category: 'Meeting',
      color: '#6366f1',
      location: 'Email Sync / Video Room',
      participants: ['Alex Rivera', email.sender],
      description: `Action detected: ${email.aiDetectedAction}`
    };
    setCalendarEvents((prev) => [...prev, newEv]);
    markEmailAsRead(email.id);
    showToast(`Event added to Calendar: "${newEv.title}"`, 'success');
  };

  // 4. Meeting Operations & Cross-Module Meeting -> Tasks
  const addMeetingActionItemsToTasks = async (meeting) => {
    const extractedTasks = await meetingService.extractTasksFromMeeting(meeting);
    setTasks((prev) => [...extractedTasks, ...prev]);
    showToast(`Added ${extractedTasks.length} action items to Tasks from "${meeting.title}"!`, 'success');
  };

  // 5. Reminders Operations
  const snoozeReminder = (reminderId, duration = '1 hour') => {
    setReminders((prev) =>
      prev.map((r) => (r.id === reminderId ? { ...r, status: 'snoozed', triggerTime: `Snoozed (${duration})` } : r))
    );
    showToast(`Reminder snoozed for ${duration}`, 'info');
  };

  const completeReminder = (reminderId) => {
    setReminders((prev) =>
      prev.map((r) => (r.id === reminderId ? { ...r, status: 'completed' } : r))
    );
    showToast(`Reminder marked complete!`, 'success');
  };

  const deleteReminder = (reminderId) => {
    setReminders((prev) => prev.filter((r) => r.id !== reminderId));
    showToast(`Reminder dismissed`, 'info');
  };

  // Cross-Module Flow: Task -> Reminder
  const createReminderForTask = (task) => {
    const newRem = {
      id: `rem-task-${Date.now()}`,
      title: `Upcoming Task Deadline: ${task.title}`,
      triggerTime: task.dueTime ? `Today, ${task.dueTime}` : 'Tomorrow morning',
      triggerDate: task.dueDate || '2026-10-08',
      relatedTask: task.title,
      relatedCalendarEvent: null,
      status: 'active',
      isSmartSuggestion: false,
      reason: `Contextual deadline reminder created from Tasks`
    };
    setReminders((prev) => [newRem, ...prev]);
    showToast(`Reminder set for task "${task.title}"`, 'success');
  };

  // Cross-Module Flow: Task -> Calendar (Schedule Focused Work)
  const scheduleTaskOnCalendar = (task) => {
    const newEv = {
      id: `ev-${Date.now()}`,
      title: `Focus Session: ${task.title}`,
      date: '2026-10-07',
      startTime: '14:00',
      endTime: '16:00',
      displayTime: '02:00 PM – 04:00 PM',
      category: 'Focus',
      color: '#8b5cf6',
      location: 'LifeOps Focus Suite',
      participants: ['Alex Rivera'],
      description: `Dedicated work slot for priority task: ${task.title}`
    };
    setCalendarEvents((prev) => [...prev, newEv]);
    showToast(`Scheduled focused work on Calendar for "${task.title}" (2:00 PM – 4:00 PM)`, 'success');
  };

  // Cross-Module Flow: Subscription -> Reminder
  const setReminderForSubscription = async (sub) => {
    const newRem = await subscriptionService.createRenewalReminder(sub);
    setReminders((prev) => [newRem, ...prev]);
    showToast(`Renewal reminder created for ${sub.name} (renews in ${sub.renewalDaysLeft} days)`, 'success');
  };

  const addSubscription = (newSub) => {
    const created = {
      id: `sub-${Date.now()}`,
      formattedCost: `₹${newSub.cost}`,
      renewalDaysLeft: 30,
      status: 'Active',
      ...newSub
    };
    setSubscriptions((prev) => [created, ...prev]);
    showToast(`Added subscription: ${created.name}`, 'success');
    return created;
  };

  // AI Plan My Day Trigger (from Dashboard AI Insight Card)
  const planMyDay = () => {
    const focusEv = {
      id: `ev-focus-${Date.now()}`,
      title: 'LifeOps Optimized: Hackathon Prototype Sprint',
      date: '2026-10-07',
      startTime: '14:00',
      endTime: '16:00',
      displayTime: '02:00 PM – 04:00 PM',
      category: 'Focus',
      color: '#8b5cf6',
      location: 'Deep Work Sandbox',
      participants: ['Alex Rivera'],
      description: 'Auto-optimized by LifeOps AI engine to clear top high-priority prototype tasks before 6 PM.'
    };
    setCalendarEvents((prev) => {
      if (prev.some((e) => e.title.includes('Prototype Sprint'))) return prev;
      return [...prev, focusEv];
    });
    showToast('LifeOps has optimized your schedule! 2:00 PM – 4:00 PM reserved for Prototype Sprint.', 'success');
  };

  // AI Assistant Chat Send
  const sendChatMessage = async (text) => {
    if (!text.trim()) return;

    const userMsg = {
      id: `msg-${Date.now()}`,
      sender: 'user',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      text: text
    };

    setChatMessages((prev) => [...prev, userMsg]);

    // Query mock AI Assistant service
    const response = await aiAssistantService.generateResponse(text);

    const assistantMsg = {
      id: `msg-${Date.now()}-ai`,
      sender: 'assistant',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      text: response.text,
      actionCards: response.actionCards
    };

    setChatMessages((prev) => [...prev, assistantMsg]);
  };

  // Notification actions
  const markNotificationAsRead = (id) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
  };

  const clearAllNotifications = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
    showToast('All notifications marked as read', 'info');
  };

  const unreadNotificationCount = notifications.filter((n) => !n.read).length;

  return (
    <LifeOpsContext.Provider
      value={{
        // Data states
        tasks,
        setTasks,
        calendarEvents,
        emails,
        documents,
        meetings,
        reminders,
        subscriptions,
        notifications,
        chatMessages,
        availableSlots,
        productivityMetrics,

        // Actions
        toggleTaskStatus,
        addTask,
        deleteTask,
        addCalendarEvent,
        scheduleTimeSlot,
        markEmailAsRead,
        createTaskFromEmail,
        addEmailToCalendar,
        addMeetingActionItemsToTasks,
        snoozeReminder,
        completeReminder,
        deleteReminder,
        createReminderForTask,
        scheduleTaskOnCalendar,
        setReminderForSubscription,
        addSubscription,
        planMyDay,
        sendChatMessage,

        // Modals & Drawers
        selectedMeeting,
        setSelectedMeeting,
        selectedDoc,
        setSelectedDoc,
        isCommandPaletteOpen,
        setIsCommandPaletteOpen,
        isQuickAssistantOpen,
        setIsQuickAssistantOpen,

        // Toasts & Notifications
        toasts,
        showToast,
        removeToast,
        markNotificationAsRead,
        clearAllNotifications,
        unreadNotificationCount
      }}
    >
      {children}
    </LifeOpsContext.Provider>
  );
};

export const useLifeOps = () => {
  const context = useContext(LifeOpsContext);
  if (!context) {
    throw new Error('useLifeOps must be used within a LifeOpsProvider');
  }
  return context;
};
