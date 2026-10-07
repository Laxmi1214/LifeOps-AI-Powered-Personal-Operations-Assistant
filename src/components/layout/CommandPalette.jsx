import React, { useState, useEffect, useRef } from 'react';
import { Search, CheckSquare, Calendar, Mail, FileText, Video, Sparkles, X, ArrowRight, CornerDownLeft } from 'lucide-react';
import { useLifeOps } from '../../context/LifeOpsContext';
import { useNavigate } from 'react-router-dom';

export const CommandPalette = () => {
  const {
    isCommandPaletteOpen,
    setIsCommandPaletteOpen,
    tasks,
    calendarEvents,
    emails,
    documents,
    setIsQuickAssistantOpen
  } = useLifeOps();

  const [search, setSearch] = useState('');
  const inputRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (isCommandPaletteOpen) {
      setTimeout(() => inputRef.current?.focus(), 50);
    } else {
      setSearch('');
    }
  }, [isCommandPaletteOpen]);

  if (!isCommandPaletteOpen) return null;

  const query = search.trim().toLowerCase();

  const matchingTasks = tasks
    .filter((t) => t.title.toLowerCase().includes(query) || t.category.toLowerCase().includes(query))
    .slice(0, 3);

  const matchingEvents = calendarEvents
    .filter((e) => e.title.toLowerCase().includes(query))
    .slice(0, 2);

  const matchingEmails = emails
    .filter((e) => e.subject.toLowerCase().includes(query) || e.sender.toLowerCase().includes(query))
    .slice(0, 2);

  const matchingDocs = documents
    .filter((d) => d.title.toLowerCase().includes(query) || d.category.toLowerCase().includes(query))
    .slice(0, 2);

  const handleSelect = (route) => {
    navigate(route);
    setIsCommandPaletteOpen(false);
  };

  const handleQuickAsk = () => {
    setIsCommandPaletteOpen(false);
    setIsQuickAssistantOpen(true);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-start justify-center pt-24 px-4 bg-gray-900/30 backdrop-blur-xs"
      onClick={() => setIsCommandPaletteOpen(false)}
    >
      <div
        className="w-full max-w-xl bg-white border border-gray-200 rounded-lg shadow-modal overflow-hidden flex flex-col max-h-[70vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Search Header */}
        <div className="p-3 border-b border-gray-200 flex items-center gap-2.5 bg-white">
          <Search className="w-4 h-4 text-gray-400 flex-shrink-0" />
          <input
            ref={inputRef}
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search tasks, calendar, emails, documents..."
            className="w-full bg-transparent text-sm text-gray-900 placeholder-gray-400 focus:outline-none"
          />
          {search && (
            <button onClick={() => setSearch('')} className="text-gray-400 hover:text-gray-600">
              <X className="w-3.5 h-3.5" />
            </button>
          )}
          <span className="text-[10px] text-gray-400 border border-gray-200 rounded px-1.5 py-0.5">
            ESC
          </span>
        </div>

        {/* Results Body */}
        <div className="flex-1 overflow-y-auto p-2 space-y-3 text-xs">
          {/* Quick AI Action */}
          <div>
            <button
              onClick={handleQuickAsk}
              className="w-full flex items-center justify-between p-2 rounded-md hover:bg-blue-50/70 text-gray-700 hover:text-blue-700 transition-colors"
            >
              <div className="flex items-center gap-2">
                <Sparkles className="w-3.5 h-3.5 text-blue-600" />
                <span className="font-medium text-xs">Ask LifeOps: "{search || 'What should I focus on?'}"</span>
              </div>
              <CornerDownLeft className="w-3 h-3 text-gray-400" />
            </button>
          </div>

          {/* Quick Navigations */}
          {!search && (
            <div>
              <div className="px-2 mb-1 text-[10px] font-semibold text-gray-400 uppercase tracking-wider">
                Quick Jump
              </div>
              <div className="grid grid-cols-2 gap-1">
                {[
                  { name: 'Overview', path: '/', icon: ArrowRight },
                  { name: 'Tasks', path: '/tasks', icon: CheckSquare },
                  { name: 'Calendar', path: '/calendar', icon: Calendar },
                  { name: 'Email', path: '/email', icon: Mail },
                  { name: 'Documents', path: '/documents', icon: FileText },
                  { name: 'Productivity', path: '/analytics', icon: ArrowRight }
                ].map((item) => {
                  const Icon = item.icon;
                  return (
                    <button
                      key={item.path}
                      onClick={() => handleSelect(item.path)}
                      className="flex items-center gap-2 p-1.5 rounded-md hover:bg-gray-100/70 text-gray-600 hover:text-gray-900 transition-colors text-left"
                    >
                      <Icon className="w-3.5 h-3.5 text-gray-400" />
                      <span className="truncate text-xs">{item.name}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Tasks Results */}
          {matchingTasks.length > 0 && (
            <div>
              <div className="px-2 mb-1 text-[10px] font-semibold text-gray-400 uppercase tracking-wider flex items-center gap-1.5">
                <CheckSquare className="w-3 h-3 text-gray-400" />
                <span>Tasks</span>
              </div>
              <div className="space-y-0.5">
                {matchingTasks.map((t) => (
                  <button
                    key={t.id}
                    onClick={() => handleSelect('/tasks')}
                    className="w-full flex items-center justify-between p-1.5 rounded-md hover:bg-gray-50 transition-colors text-left"
                  >
                    <span className="text-gray-800 truncate text-xs">{t.title}</span>
                    <span className="text-[10px] text-gray-400 ml-2">{t.priority}</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Calendar Results */}
          {matchingEvents.length > 0 && (
            <div>
              <div className="px-2 mb-1 text-[10px] font-semibold text-gray-400 uppercase tracking-wider flex items-center gap-1.5">
                <Calendar className="w-3 h-3 text-gray-400" />
                <span>Calendar</span>
              </div>
              <div className="space-y-0.5">
                {matchingEvents.map((e) => (
                  <button
                    key={e.id}
                    onClick={() => handleSelect('/calendar')}
                    className="w-full flex items-center justify-between p-1.5 rounded-md hover:bg-gray-50 transition-colors text-left"
                  >
                    <span className="text-gray-800 truncate text-xs">{e.title}</span>
                    <span className="text-[10px] text-gray-400 ml-2">{e.displayTime}</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Email Results */}
          {matchingEmails.length > 0 && (
            <div>
              <div className="px-2 mb-1 text-[10px] font-semibold text-gray-400 uppercase tracking-wider flex items-center gap-1.5">
                <Mail className="w-3 h-3 text-gray-400" />
                <span>Email</span>
              </div>
              <div className="space-y-0.5">
                {matchingEmails.map((em) => (
                  <button
                    key={em.id}
                    onClick={() => handleSelect('/email')}
                    className="w-full flex items-center justify-between p-1.5 rounded-md hover:bg-gray-50 transition-colors text-left"
                  >
                    <span className="text-gray-800 truncate text-xs">{em.subject}</span>
                    <span className="text-[10px] text-gray-400 ml-2">{em.sender}</span>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Footer shortcuts */}
        <div className="px-3 py-2 border-t border-gray-100 bg-gray-50 text-[11px] text-gray-400 flex items-center justify-between">
          <span>Search across LifeOps operations</span>
          <span className="text-gray-500">Press ESC to exit</span>
        </div>
      </div>
    </div>
  );
};
