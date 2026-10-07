import React, { useState } from 'react';
import { Sparkles, X, Send, ExternalLink } from 'lucide-react';
import { useLifeOps } from '../../context/LifeOpsContext';
import { useNavigate } from 'react-router-dom';

export const QuickAssistantDrawer = () => {
  const {
    isQuickAssistantOpen,
    setIsQuickAssistantOpen,
    chatMessages,
    sendChatMessage,
    scheduleTaskOnCalendar
  } = useLifeOps();

  const [input, setInput] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();

  if (!isQuickAssistantOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!input.trim() || isSubmitting) return;

    const query = input;
    setInput('');
    setIsSubmitting(true);
    await sendChatMessage(query);
    setIsSubmitting(false);
  };

  const handlePromptClick = async (prompt) => {
    if (isSubmitting) return;
    setIsSubmitting(true);
    await sendChatMessage(prompt);
    setIsSubmitting(false);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex justify-end bg-gray-900/20 backdrop-blur-xs animate-fade-in"
      onClick={() => setIsQuickAssistantOpen(false)}
    >
      <div
        className="w-full max-w-md bg-white border-l border-gray-200 h-full flex flex-col shadow-modal animate-slide-up"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-3.5 border-b border-gray-200 flex items-center justify-between bg-white">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-blue-600" />
            <h3 className="text-sm font-semibold text-gray-900">LifeOps Assistant</h3>
          </div>
          <div className="flex items-center gap-1">
            <button
              onClick={() => {
                setIsQuickAssistantOpen(false);
                navigate('/assistant');
              }}
              title="Open full page"
              className="p-1 rounded text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors"
            >
              <ExternalLink className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => setIsQuickAssistantOpen(false)}
              className="p-1 rounded text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Messages Body */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4 text-xs">
          {chatMessages.map((msg) => {
            const isUser = msg.sender === 'user';
            return (
              <div
                key={msg.id}
                className={`flex flex-col ${isUser ? 'items-end' : 'items-start'}`}
              >
                <div className="flex items-center gap-1.5 mb-1 text-[11px] text-gray-400">
                  <span>{isUser ? 'You' : 'LifeOps'}</span>
                  <span>·</span>
                  <span>{msg.timestamp}</span>
                </div>
                <div
                  className={`p-3 rounded-lg max-w-[90%] leading-relaxed ${
                    isUser
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-50 border border-gray-200 text-gray-800'
                  }`}
                >
                  <p className="whitespace-pre-line">{msg.text}</p>
                </div>

                {/* Rich Action Cards in drawer */}
                {!isUser && msg.actionCards && msg.actionCards.length > 0 && (
                  <div className="mt-2 w-full max-w-[90%] space-y-2">
                    {msg.actionCards.map((card) => (
                      <div
                        key={card.id}
                        className="p-3 rounded-lg bg-blue-50/50 border border-blue-100 text-left"
                      >
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-[10px] font-semibold text-blue-700 uppercase tracking-wider">
                            {card.title}
                          </span>
                          {card.priority && (
                            <span className="text-[9px] px-1.5 py-0.2 rounded bg-red-50 text-red-700 border border-red-100 font-medium">
                              {card.priority}
                            </span>
                          )}
                        </div>
                        {card.timeWindow && (
                          <div className="text-xs font-semibold text-gray-900">{card.timeWindow}</div>
                        )}
                        {card.taskTitle && (
                          <div className="text-[11px] text-gray-600 mb-2">{card.taskTitle}</div>
                        )}
                        <button
                          onClick={() => {
                            scheduleTaskOnCalendar({ title: card.taskTitle || 'Focused Session' });
                            setIsQuickAssistantOpen(false);
                          }}
                          className="px-2.5 py-1 rounded bg-blue-600 hover:bg-blue-700 text-white text-[11px] font-medium transition-colors"
                        >
                          Schedule
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Quick Prompts */}
        <div className="px-3.5 py-2 border-t border-gray-100 bg-gray-50/50">
          <div className="text-[10px] text-gray-400 font-medium mb-1">Suggested Prompts</div>
          <div className="flex flex-wrap gap-1">
            {[
              'What should I focus on today?',
              'Find free time tomorrow',
              'Summarize my day'
            ].map((p) => (
              <button
                key={p}
                onClick={() => handlePromptClick(p)}
                disabled={isSubmitting}
                className="text-[10px] px-2 py-0.5 rounded border border-gray-200 bg-white hover:bg-gray-50 text-gray-600 transition-colors"
              >
                {p}
              </button>
            ))}
          </div>
        </div>

        {/* Input Bar */}
        <form onSubmit={handleSubmit} className="p-3 border-t border-gray-200 bg-white">
          <div className="flex items-center gap-2 border border-gray-200 rounded-md px-3 py-1.5 focus-within:border-blue-500">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask LifeOps anything..."
              className="w-full bg-transparent text-xs text-gray-900 placeholder-gray-400 focus:outline-none"
            />
            <button
              type="submit"
              disabled={!input.trim() || isSubmitting}
              className="p-1 rounded bg-blue-600 hover:bg-blue-700 text-white disabled:opacity-40 transition-colors"
            >
              <Send className="w-3 h-3" />
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
