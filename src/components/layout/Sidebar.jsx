import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  Bot,
  CheckSquare,
  Calendar,
  Mail,
  FileText,
  Video,
  BellRing,
  CreditCard,
  BarChart3,
  Settings,
  HelpCircle
} from 'lucide-react';
import { useLifeOps } from '../../context/LifeOpsContext';

export const Sidebar = ({ onOpenDemoNotes, onOpenSettings }) => {
  const { tasks, emails, reminders } = useLifeOps();

  const pendingTasksCount = tasks.filter((t) => t.status === 'pending').length;
  const unreadEmailsCount = emails.filter((e) => !e.read).length;
  const activeRemindersCount = reminders.filter((r) => r.status === 'active').length;

  const navSections = [
    {
      title: 'OVERVIEW',
      items: [
        { label: 'Overview', to: '/', icon: LayoutDashboard },
        { label: 'Assistant', to: '/assistant', icon: Bot },
        { label: 'Tasks', to: '/tasks', icon: CheckSquare, badge: pendingTasksCount },
        { label: 'Calendar', to: '/calendar', icon: Calendar }
      ]
    },
    {
      title: 'INTELLIGENCE',
      items: [
        { label: 'Email', to: '/email', icon: Mail, badge: unreadEmailsCount },
        { label: 'Documents', to: '/documents', icon: FileText },
        { label: 'Meetings', to: '/meetings', icon: Video }
      ]
    },
    {
      title: 'PERSONAL',
      items: [
        { label: 'Reminders', to: '/reminders', icon: BellRing, badge: activeRemindersCount },
        { label: 'Bills & Subscriptions', to: '/subscriptions', icon: CreditCard },
        { label: 'Productivity', to: '/analytics', icon: BarChart3 }
      ]
    }
  ];

  return (
    <aside className="w-60 flex-shrink-0 bg-[#FBFBFC] border-r border-gray-200 flex flex-col h-screen select-none sticky top-0">
      {/* Brand Header */}
      <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="w-6 h-6 rounded-md bg-blue-600 flex items-center justify-center text-white font-bold text-xs">
            L
          </div>
          <span className="font-semibold text-sm tracking-tight text-gray-900 font-sans">
            LifeOps
          </span>
          <span className="text-[10px] font-medium bg-gray-100 text-gray-600 px-1.5 py-0.5 rounded border border-gray-200">
            AI
          </span>
        </div>
      </div>

      {/* Navigation Sections */}
      <div className="flex-1 overflow-y-auto px-3 py-3 space-y-5">
        {navSections.map((section) => (
          <div key={section.title}>
            <div className="px-2.5 mb-1 text-[11px] font-medium tracking-wider text-gray-400 uppercase">
              {section.title}
            </div>
            <div className="space-y-0.5">
              {section.items.map((item) => {
                const Icon = item.icon;
                return (
                  <NavLink
                    key={item.to}
                    to={item.to}
                    end={item.to === '/'}
                    className={({ isActive }) =>
                      `group flex items-center justify-between px-2.5 py-1.5 rounded-md text-xs font-normal transition-colors ${
                        isActive
                          ? 'bg-blue-50/80 text-blue-700 font-medium'
                          : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100/60'
                      }`
                    }
                  >
                    {({ isActive }) => (
                      <>
                        <div className="flex items-center gap-2.5">
                          <Icon
                            className={`w-4 h-4 transition-colors ${
                              isActive
                                ? 'text-blue-600'
                                : 'text-gray-400 group-hover:text-gray-600'
                            }`}
                          />
                          <span>{item.label}</span>
                        </div>
                        {item.badge !== undefined && item.badge > 0 && (
                          <span
                            className={`px-1.5 py-0.2 text-[10px] rounded font-medium ${
                              isActive
                                ? 'bg-blue-100/80 text-blue-800'
                                : 'bg-gray-100 text-gray-500'
                            }`}
                          >
                            {item.badge}
                          </span>
                        )}
                      </>
                    )}
                  </NavLink>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      {/* Bottom Section */}
      <div className="p-3 border-t border-gray-100 space-y-1">
        <button
          onClick={onOpenSettings}
          className="w-full flex items-center gap-2.5 px-2.5 py-1.5 rounded-md text-xs text-gray-600 hover:text-gray-900 hover:bg-gray-100/60 transition-colors"
        >
          <Settings className="w-4 h-4 text-gray-400" />
          <span>Settings</span>
        </button>
        <button
          onClick={onOpenDemoNotes}
          className="w-full flex items-center gap-2.5 px-2.5 py-1.5 rounded-md text-xs text-gray-600 hover:text-gray-900 hover:bg-gray-100/60 transition-colors"
        >
          <HelpCircle className="w-4 h-4 text-gray-400" />
          <span>Demo Guide</span>
        </button>

        {/* User Profile */}
        <div className="pt-2 mt-1 border-t border-gray-100 flex items-center gap-2.5 px-2">
          <div className="w-6 h-6 rounded-full bg-gray-200 text-gray-700 flex items-center justify-center font-medium text-[11px]">
            AR
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-xs font-medium text-gray-900 truncate">Alex Rivera</p>
            <p className="text-[10px] text-gray-500 truncate">alex@lifeops.ai</p>
          </div>
        </div>
      </div>
    </aside>
  );
};
