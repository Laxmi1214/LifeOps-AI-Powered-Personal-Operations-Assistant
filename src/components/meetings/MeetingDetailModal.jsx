import React, { useState } from 'react';
import { X, Check } from 'lucide-react';
import { useLifeOps } from '../../context/LifeOpsContext';

export const MeetingDetailModal = ({ meeting, isOpen, onClose }) => {
  const { addMeetingActionItemsToTasks } = useLifeOps();
  const [hasAdded, setHasAdded] = useState(false);

  if (!isOpen || !meeting) return null;

  const handleAddActionItems = () => {
    addMeetingActionItemsToTasks(meeting);
    setHasAdded(true);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900/30 backdrop-blur-xs animate-fade-in"
      onClick={onClose}
    >
      <div
        className="w-full max-w-lg bg-white border border-gray-200 rounded-lg shadow-modal overflow-hidden flex flex-col max-h-[85vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="px-5 py-3.5 border-b border-gray-200 flex items-center justify-between">
          <div>
            <h2 className="text-sm font-semibold text-gray-900">{meeting.title}</h2>
            <div className="text-[11px] text-gray-500 mt-0.5">
              {meeting.date} · {meeting.time} ({meeting.duration})
            </div>
          </div>
          <button onClick={onClose} className="p-1 rounded text-gray-400 hover:text-gray-600">
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto p-5 space-y-4 text-xs text-gray-700">
          {/* Summary */}
          <div className="p-3.5 rounded-md bg-[#F9FAFB] border border-[#E5E5E5] space-y-1">
            <span className="text-[11px] font-semibold text-black block">Meeting Summary</span>
            <p className="text-xs text-[#555555] leading-normal">{meeting.summary}</p>
          </div>

          {/* Decisions */}
          {meeting.keyDecisions && meeting.keyDecisions.length > 0 && (
            <div>
              <div className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider mb-2">
                Decisions
              </div>
              <ul className="space-y-1.5 list-disc pl-4 text-gray-800 text-xs">
                {meeting.keyDecisions.map((dec, idx) => (
                  <li key={idx}>{dec}</li>
                ))}
              </ul>
            </div>
          )}

          {/* Action Items */}
          {meeting.actionItems && meeting.actionItems.length > 0 && (
            <div>
              <div className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider mb-2">
                Action Items ({meeting.actionItems.length})
              </div>
              <div className="border border-gray-200 rounded-md divide-y divide-gray-100">
                {meeting.actionItems.map((item) => (
                  <div key={item.id} className="p-2.5 flex items-center justify-between text-xs">
                    <span className="text-gray-800">{item.text}</span>
                    <span className="text-[11px] text-gray-500">{item.assignee}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Participants */}
          <div>
            <div className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider mb-2">
              Participants ({meeting.participants.length})
            </div>
            <div className="flex flex-wrap gap-1.5">
              {meeting.participants.map((p) => (
                <span
                  key={p.name}
                  className="px-2 py-1 rounded bg-gray-100 text-gray-700 text-[11px]"
                >
                  {p.name} ({p.role})
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-5 py-3 border-t border-gray-200 bg-gray-50/50 flex items-center justify-end gap-2">
          {hasAdded ? (
            <div className="flex items-center gap-1.5 text-xs text-black font-medium px-3 py-1.5 bg-[#F9FAFB] rounded-md border border-[#E5E5E5]">
              <Check className="w-3.5 h-3.5" />
              <span>Added to tasks</span>
            </div>
          ) : (
            <button
              onClick={handleAddActionItems}
              className="px-3.5 py-1.5 rounded-md bg-[#111111] hover:bg-black text-white font-medium text-xs transition-colors"
            >
              Add Action Items to Tasks
            </button>
          )}
          <button
            onClick={onClose}
            className="px-3 py-1.5 rounded-md border border-gray-200 bg-white text-gray-700 hover:bg-gray-50 text-xs transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
