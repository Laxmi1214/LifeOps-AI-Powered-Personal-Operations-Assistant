import React, { useState, useRef, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { Search, Bell, Sparkles } from 'lucide-react';
import { useLifeOps } from '../../context/LifeOpsContext';
import { NotificationPanel } from './NotificationPanel';

const PAGE_META = {
  '/': { title: 'Overview', subtitle: "Here's what needs your attention today." },
  '/assistant': { title: 'LifeOps Assistant', subtitle: 'Your personal operations copilot' },
  '/tasks': { title: 'Tasks', subtitle: 'Everything you need to get done.' },
  '/calendar': { title: 'Calendar', subtitle: 'Unified schedule and focus blocking' },
  '/email': { title: 'Email Intelligence', subtitle: 'Actionable email triage and detected tasks' },
  '/documents': { title: 'Documents', subtitle: 'Personal knowledge library with AI summaries' },
  '/meetings': { title: 'Meetings', subtitle: 'Synthesized decisions and action items' },
  '/reminders': { title: 'Reminders', subtitle: 'Contextual reminders and schedule nudges' },
  '/subscriptions': { title: 'Bills & Subscriptions', subtitle: 'Financial commitments and renewals' },
  '/analytics': { title: 'Productivity', subtitle: 'Time and attention analytics' },
};

export const Topbar = () => {
  const location = useLocation();
  const { unreadNotificationCount, setIsCommandPaletteOpen, setIsQuickAssistantOpen } = useLifeOps();
  const [isNotifOpen, setIsNotifOpen] = useState(false);
  const notifRef = useRef(null);

  const meta = PAGE_META[location.pathname] || {
    title: 'LifeOps Workspace',
    subtitle: 'Unified Personal Operations Assistant'
  };

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (notifRef.current && !notifRef.current.contains(e.target)) {
        setIsNotifOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <header className="h-14 px-8 border-b border-gray-200 bg-white sticky top-0 z-30 flex items-center justify-between">
      {/* Page Title & Contextual Subtitle */}
      <div>
        <h1 className="text-base font-semibold text-gray-900 tracking-tight leading-none">
          {meta.title}
        </h1>
      </div>

      {/* Right Action Tools */}
      <div className="flex items-center gap-3">
        {/* Global Search Button */}
        <button
          onClick={() => setIsCommandPaletteOpen(true)}
          className="flex items-center gap-2 px-2.5 py-1.5 rounded-md border border-gray-200 bg-gray-50/50 hover:bg-gray-100/70 text-gray-500 hover:text-gray-800 transition-colors text-xs group"
        >
          <Search className="w-3.5 h-3.5 text-gray-400 group-hover:text-gray-600" />
          <span className="hidden sm:inline">Search...</span>
          <kbd className="hidden sm:inline text-[10px] text-gray-400 bg-white border border-gray-200 rounded px-1.5 py-0.2">
            ⌘K
          </kbd>
        </button>

        {/* Notification Bell Dropdown */}
        <div className="relative" ref={notifRef}>
          <button
            onClick={() => setIsNotifOpen((prev) => !prev)}
            className="relative p-1.5 rounded-md hover:bg-gray-100 text-gray-500 hover:text-gray-700 transition-colors"
            aria-label="Notifications"
          >
            <Bell className="w-4 h-4" />
            {unreadNotificationCount > 0 && (
              <span className="absolute top-1 right-1 w-2 h-2 bg-black rounded-full"></span>
            )}
          </button>

          {isNotifOpen && <NotificationPanel onClose={() => setIsNotifOpen(false)} />}
        </div>

        {/* Primary CTA: "Ask LifeOps" (Clean, solid blue, professional) */}
        <button
          onClick={() => setIsQuickAssistantOpen(true)}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-[#111111] hover:bg-black text-white text-xs font-medium transition-colors shadow-subtle active:scale-[0.98]"
        >
          <Sparkles className="w-3.5 h-3.5" />
          <span>Ask LifeOps</span>
        </button>

        {/* User Profile Avatar */}
        <div className="flex items-center pl-2 border-l border-gray-200">
          <div className="w-7 h-7 rounded-full bg-gray-100 text-gray-700 font-medium text-xs flex items-center justify-center border border-gray-200">
            AR
          </div>
        </div>
      </div>
    </header>
  );
};
