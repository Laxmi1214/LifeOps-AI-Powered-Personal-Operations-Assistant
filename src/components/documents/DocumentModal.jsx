import React from 'react';
import { X } from 'lucide-react';
import { useLifeOps } from '../../context/LifeOpsContext';
import { useNavigate } from 'react-router-dom';

export const DocumentModal = ({ doc, isOpen, onClose }) => {
  const { sendChatMessage } = useLifeOps();
  const navigate = useNavigate();

  if (!isOpen || !doc) return null;

  const handleAskLifeOps = () => {
    onClose();
    sendChatMessage(`Can you summarize "${doc.title}" and highlight actionable points?`);
    navigate('/assistant');
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900/30 backdrop-blur-xs animate-fade-in"
      onClick={onClose}
    >
      <div
        className="w-full max-w-lg bg-white border border-gray-200 rounded-lg shadow-modal overflow-hidden flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="px-5 py-3.5 border-b border-gray-200 flex items-center justify-between">
          <h2 className="text-sm font-semibold text-gray-900">{doc.title}</h2>
          <button onClick={onClose} className="p-1 rounded text-gray-400 hover:text-gray-600">
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="p-5 space-y-4 text-xs text-gray-700">
          <div className="p-3.5 rounded-md bg-[#F9FAFB] border border-[#E5E5E5] space-y-1">
            <span className="text-[11px] font-semibold text-black block">AI Summary</span>
            <p className="text-xs text-[#555555] leading-normal">{doc.aiSummary}</p>
          </div>

          {doc.keyPoints && doc.keyPoints.length > 0 && (
            <div>
              <div className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider mb-2">
                Key Points
              </div>
              <ul className="space-y-1.5 list-disc pl-4 text-gray-700 text-xs">
                {doc.keyPoints.map((point, idx) => (
                  <li key={idx}>{point}</li>
                ))}
              </ul>
            </div>
          )}

          <div className="pt-2 border-t border-gray-100 flex items-center justify-between text-[11px] text-gray-500">
            <span>{doc.type} · {doc.size} · {doc.category}</span>
            <button
              onClick={handleAskLifeOps}
              className="px-3 py-1.5 rounded-md bg-[#111111] hover:bg-black text-white font-medium text-xs transition-colors"
            >
              Ask LifeOps about this Doc
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
