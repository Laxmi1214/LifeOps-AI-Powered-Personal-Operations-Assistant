import React from 'react';
import { X, Sparkles, Cpu, Workflow, ArrowRight } from 'lucide-react';

export const DemoNotesModal = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900/30 backdrop-blur-xs animate-fade-in"
      onClick={onClose}
    >
      <div
        className="w-full max-w-xl bg-white border border-gray-200 rounded-lg shadow-modal overflow-hidden flex flex-col max-h-[85vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="px-5 py-3.5 border-b border-gray-200 flex items-center justify-between bg-white">
          <div className="flex items-center gap-2">
            <h2 className="text-sm font-semibold text-gray-900">LifeOps Demo & Architecture Guide</h2>
            <span className="text-[10px] bg-white text-black font-bold px-2 py-0.5 rounded border border-[#E5E5E5]">
              Hackathon
            </span>
          </div>
          <button onClick={onClose} className="p-1 rounded text-gray-400 hover:text-gray-600">
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto p-5 space-y-4 text-xs text-gray-700 leading-normal">
          {/* Core Idea */}
          <div className="p-3.5 rounded-lg bg-[#F9FAFB] border border-[#E5E5E5] space-y-1">
            <div className="font-bold text-black text-xs">
              "LifeOps doesn't just manage your tasks. It manages the context around your tasks."
            </div>
            <p className="text-[11px] text-[#555555] leading-relaxed">
              Instead of 8 disconnected apps, LifeOps unifies tasks, schedule, email, knowledge, meetings, commitments, and analytics into one intelligent operational layer.
            </p>
          </div>

          {/* Cross-Module Workflows */}
          <div className="space-y-2">
            <h3 className="font-semibold text-gray-900 text-xs">Interactive Cross-Module Flows</h3>
            <div className="space-y-2">
              <div className="p-2.5 rounded-md border border-gray-200 bg-white">
                <span className="font-semibold text-gray-900 block mb-0.5">1. Email → Task</span>
                <span className="text-gray-500 text-[11px]">
                  Go to <strong>Email</strong> and click <code>[Create Task]</code> on the urgent interview confirmation.
                </span>
              </div>

              <div className="p-2.5 rounded-md border border-gray-200 bg-white">
                <span className="font-semibold text-gray-900 block mb-0.5">2. Meeting → Task</span>
                <span className="text-gray-500 text-[11px]">
                  Open <strong>Meetings</strong> and click <code>[Add Action Items to Tasks]</code> to extract deliverables directly.
                </span>
              </div>

              <div className="p-2.5 rounded-md border border-gray-200 bg-white">
                <span className="font-semibold text-gray-900 block mb-0.5">3. AI Plan My Day</span>
                <span className="text-gray-500 text-[11px]">
                  On the <strong>Overview</strong> page, click <code>[Plan my day]</code> to allocate deep focus during the 2–4 PM free window.
                </span>
              </div>

              <div className="p-2.5 rounded-md border border-gray-200 bg-white">
                <span className="font-semibold text-gray-900 block mb-0.5">4. Subscriptions → Reminder</span>
                <span className="text-gray-500 text-[11px]">
                  In <strong>Bills & Subscriptions</strong>, click <code>[Set Reminder]</code> on Netflix to trigger renewal alerts.
                </span>
              </div>
            </div>
          </div>

          {/* Architecture Topology */}
          <div className="p-3 rounded-md bg-gray-50 border border-gray-200 space-y-1.5 font-mono text-[11px] text-gray-700">
            <div className="font-semibold font-sans text-gray-900 text-xs mb-1">Future MCP Architecture</div>
            <div>Frontend UI (React 19) → AI Agent Core → MCP Client → Streamable HTTP → LifeOps MCP Server → Connectors</div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-5 py-3 border-t border-gray-200 bg-gray-50/50 flex items-center justify-end">
          <button
            onClick={onClose}
            className="px-3.5 py-1.5 rounded-md bg-[#111111] hover:bg-black text-white font-medium text-xs transition-colors"
          >
            Got it
          </button>
        </div>
      </div>
    </div>
  );
};
