import React from 'react';
import { X } from 'lucide-react';
import { useLifeOps } from '../../context/LifeOpsContext';

export const EmailSummaryModal = ({ email, isOpen, onClose }) => {
  const { createTaskFromEmail, addEmailToCalendar } = useLifeOps();

  if (!isOpen || !email) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900/30 backdrop-blur-xs animate-fade-in"
      onClick={onClose}
    >
      <div
        className="w-full max-w-lg bg-white border border-gray-200 rounded-lg shadow-modal overflow-hidden flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="px-5 py-3.5 border-b border-gray-200 flex items-center justify-between">
          <h2 className="text-sm font-semibold text-gray-900">Email Intelligence Summary</h2>
          <button onClick={onClose} className="p-1 rounded text-gray-400 hover:text-gray-600">
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content */}
        <div className="p-5 space-y-4 text-xs text-gray-700">
          <div>
            <div className="text-sm font-semibold text-gray-900">{email.subject}</div>
            <div className="text-[11px] text-gray-500 mt-0.5">
              From: {email.sender} &lt;{email.senderEmail}&gt;
            </div>
          </div>

          <div className="p-3.5 rounded-md bg-[#F9FAFB] border border-[#E5E5E5] space-y-1">
            <span className="text-[11px] font-semibold text-black block">AI Detected Action</span>
            <p className="text-xs text-[#555555] leading-normal">{email.aiDetectedAction}</p>
          </div>

          <div>
            <div className="text-[11px] font-medium text-gray-400 mb-1">Message Preview</div>
            <div className="p-3 rounded-md border border-gray-100 bg-gray-50/50 text-gray-700 leading-relaxed text-[11px]">
              {email.preview}
            </div>
          </div>

          <div className="pt-2 border-t border-gray-100 flex items-center justify-end gap-2">
            <button
              onClick={() => {
                createTaskFromEmail(email);
                onClose();
              }}
              className="px-3 py-1.5 rounded-md bg-[#111111] hover:bg-black text-white font-medium text-xs transition-colors"
            >
              Create Task
            </button>
            <button
              onClick={() => {
                addEmailToCalendar(email);
                onClose();
              }}
              className="px-3 py-1.5 rounded-md border border-gray-200 bg-white text-gray-700 hover:bg-gray-50 font-medium text-xs transition-colors"
            >
              Add to Calendar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
