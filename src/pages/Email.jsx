import React, { useState } from 'react';
import { Search, Sparkles } from 'lucide-react';
import { useLifeOps } from '../context/LifeOpsContext';
import { EmailSummaryModal } from '../components/email/EmailSummaryModal';

export const Email = () => {
  const { emails, createTaskFromEmail, addEmailToCalendar, markEmailAsRead } = useLifeOps();

  const [activeTab, setActiveTab] = useState('Action Required');
  const [selectedEmail, setSelectedEmail] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');

  const sections = ['Action Required', 'Important', 'Waiting for Reply', 'Informational'];

  const filteredEmails = emails.filter((em) => {
    if (activeTab && em.section !== activeTab) return false;
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      return (
        em.subject.toLowerCase().includes(q) ||
        em.sender.toLowerCase().includes(q) ||
        em.preview.toLowerCase().includes(q)
      );
    }
    return true;
  });

  return (
    <div className="space-y-6 pb-16 animate-fade-in max-w-5xl mx-auto">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900 tracking-tight flex items-center gap-2">
            Email Intelligence
            <span className="text-[10px] font-medium bg-[#F5F5F5] text-gray-600 px-2 py-0.5 rounded border border-[#E5E5E5]">
              Demo dataset · MCP connector pending
            </span>
          </h1>
          <p className="text-xs text-gray-500 mt-1">
            Focus on actionable emails, detected deadlines, and automated follow-ups.
          </p>
        </div>

        <div className="flex items-center gap-2 px-3 py-1.5 rounded-md border border-gray-200 bg-white sm:w-64">
          <Search className="w-3.5 h-3.5 text-gray-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search email triage..."
            className="w-full bg-transparent text-gray-900 placeholder-gray-400 focus:outline-none text-xs"
          />
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-1 border-b border-gray-200 pb-px text-xs">
        {sections.map((section) => {
          const count = emails.filter((e) => e.section === section).length;
          const isSelected = activeTab === section;

          return (
            <button
              key={section}
              onClick={() => setActiveTab(section)}
              className={`px-3 py-2 border-b-2 font-medium transition-colors flex items-center gap-1.5 ${
                isSelected
                  ? 'border-black text-black font-semibold'
                  : 'border-transparent text-gray-500 hover:text-gray-900'
              }`}
            >
              <span>{section}</span>
              <span className="text-[10px] text-gray-400">({count})</span>
            </button>
          );
        })}
      </div>

      {/* Email List */}
      <div className="border border-gray-200 rounded-lg divide-y divide-gray-100 bg-white">
        {filteredEmails.map((email) => {
          return (
            <div
              key={email.id}
              className={`p-4 transition-colors hover:bg-gray-50/60 space-y-2 ${
                !email.read ? 'bg-[#F9FAFB]' : ''
              }`}
            >
              {/* Row Header */}
              <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-1">
                <div className="flex items-baseline gap-2">
                  <span className="text-xs font-semibold text-gray-900">{email.subject}</span>
                  <span className="text-[11px] text-gray-500">{email.sender}</span>
                </div>
                <div className="text-[11px] text-gray-400 flex-shrink-0">
                  {email.time}
                </div>
              </div>

              {/* Snippet */}
              <p className="text-xs text-gray-600 leading-normal line-clamp-2">
                {email.preview}
              </p>

              {/* AI detected banner row */}
              {email.aiDetectedAction && (
                <div className="p-2.5 rounded-md bg-gray-50 border border-gray-100 flex items-start gap-2 text-xs">
                  <Sparkles className="w-3.5 h-3.5 text-black mt-0.5 flex-shrink-0" />
                  <div className="flex-1">
                    <span className="font-medium text-gray-700">AI detected: </span>
                    <span className="text-gray-600">{email.aiDetectedAction}</span>
                  </div>
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex items-center gap-2 pt-1">
                <button
                  onClick={() => createTaskFromEmail(email)}
                  className="px-2.5 py-1 rounded border border-gray-200 bg-white hover:bg-gray-50 text-[11px] font-medium text-black transition-colors"
                >
                  Create task
                </button>

                <button
                  onClick={() => addEmailToCalendar(email)}
                  className="px-2.5 py-1 rounded border border-gray-200 bg-white hover:bg-gray-50 text-[11px] font-medium text-gray-700 transition-colors"
                >
                  Add to calendar
                </button>

                <button
                  onClick={() => setSelectedEmail(email)}
                  className="px-2.5 py-1 rounded text-[11px] text-gray-500 hover:text-gray-800 transition-colors"
                >
                  Summarize
                </button>

                {!email.read && (
                  <button
                    onClick={() => markEmailAsRead(email.id)}
                    className="ml-auto text-[11px] text-gray-400 hover:text-gray-600"
                  >
                    Mark read
                  </button>
                )}
              </div>
            </div>
          );
        })}

        {filteredEmails.length === 0 && (
          <div className="py-12 text-center text-xs text-gray-400">
            No emails in this queue.
          </div>
        )}
      </div>

      <EmailSummaryModal
        email={selectedEmail}
        isOpen={!!selectedEmail}
        onClose={() => setSelectedEmail(null)}
      />
    </div>
  );
};
