import React, { useState, useRef, useEffect } from 'react';
import {
  Sparkles,
  Send,
  Calendar,
  CheckSquare,
  Clock,
  Check
} from 'lucide-react';
import { useLifeOps } from '../context/LifeOpsContext';
import { useNavigate } from 'react-router-dom';

const SUGGESTED_PROMPTS = [
  'What should I focus on today?',
  'What tasks are overdue?',
  'Summarize my day',
  'Find free time tomorrow',
  'What needs my attention?',
  'How productive was I this week?'
];

export const Assistant = () => {
  const {
    chatMessages,
    sendChatMessage,
    scheduleTaskOnCalendar,
    createTaskFromEmail,
    emails
  } = useLifeOps();

  const [inputText, setInputText] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [scheduledCards, setScheduledCards] = useState({});
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);
  const navigate = useNavigate();

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [chatMessages, isGenerating]);

  const handleSend = async (e) => {
    e?.preventDefault();
    if (!inputText.trim() || isGenerating) return;

    const query = inputText;
    setInputText('');
    setIsGenerating(true);
    await sendChatMessage(query);
    setIsGenerating(false);
  };

  const handlePromptClick = async (prompt) => {
    if (isGenerating) return;
    setIsGenerating(true);
    await sendChatMessage(prompt);
    setIsGenerating(false);
  };

  const handleCardSchedule = (card) => {
    scheduleTaskOnCalendar({ title: card.taskTitle || 'Focus Session' });
    setScheduledCards((prev) => ({ ...prev, [card.id]: true }));
  };

  const handleCreateTaskFromCard = (card) => {
    const targetEmail = emails.find((e) => e.importance === 'High') || emails[0];
    createTaskFromEmail(targetEmail);
    setScheduledCards((prev) => ({ ...prev, [card.id]: true }));
  };

  return (
    <div className="flex flex-col h-[calc(100vh-8rem)] animate-fade-in max-w-4xl mx-auto">
      {/* Header and Capability Bar */}
      <div className="pb-3 border-b border-gray-200 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <div>
          <h1 className="text-xl font-semibold text-gray-900 tracking-tight flex items-center gap-2">
            LifeOps Assistant
            <span className="text-[10px] font-medium bg-[#F5F5F5] text-black px-2 py-0.5 rounded border border-[#E5E5E5]">
              Copilot
            </span>
          </h1>
          <p className="text-xs text-gray-500 mt-0.5">
            Your personal operations copilot with multi-domain context awareness.
          </p>
        </div>

        <div className="text-[11px] text-gray-400 flex items-center gap-1.5">
          <span>Connected context:</span>
          <span className="font-mono text-gray-600">Tasks · Calendar · Email · Docs</span>
        </div>
      </div>

      {/* Main Conversation Stream */}
      <div className="flex-1 overflow-y-auto py-5 space-y-5">
        {chatMessages.map((msg) => {
          const isUser = msg.sender === 'user';
          return (
            <div
              key={msg.id}
              className={`flex flex-col ${isUser ? 'items-end' : 'items-start'}`}
            >
              <div className="flex items-center gap-1.5 mb-1 text-[11px] text-gray-400">
                <span className="font-medium text-gray-600">{isUser ? 'You' : 'LifeOps'}</span>
                <span>·</span>
                <span>{msg.timestamp}</span>
              </div>

              <div
                className={`p-3.5 rounded-lg text-xs leading-relaxed max-w-2xl ${
                  isUser
                    ? 'bg-black text-white'
                    : 'bg-gray-50 border border-gray-200 text-gray-800'
                }`}
              >
                <p className="whitespace-pre-line">{msg.text}</p>
              </div>

              {/* Rich Action Cards */}
              {!isUser && msg.actionCards && msg.actionCards.length > 0 && (
                <div className="mt-2.5 space-y-2 w-full max-w-md">
                  {msg.actionCards.map((card) => {
                    const isHandled = scheduledCards[card.id];

                    return (
                      <div
                        key={card.id}
                        className="p-3.5 rounded-lg bg-white border border-[#E5E5E5] text-left space-y-2"
                      >
                        <div className="flex items-center justify-between">
                          <span className="text-[11px] font-bold text-black uppercase tracking-wider">
                            {card.title}
                          </span>
                          {card.priority && (
                            <span className="text-[10px] font-bold text-black bg-white border border-[#E5E5E5] px-1.5 py-0.2 rounded">
                              {card.priority}
                            </span>
                          )}
                        </div>

                        {card.timeWindow && (
                          <div className="text-xs font-semibold text-gray-900 flex items-center gap-1.5">
                            <Clock className="w-3.5 h-3.5 text-black" />
                            <span>{card.timeWindow}</span>
                          </div>
                        )}

                        {card.taskTitle && (
                          <p className="text-xs text-gray-700 font-medium">
                            {card.taskTitle}
                          </p>
                        )}

                        {card.sender && (
                          <div className="text-xs text-gray-600">
                            <span className="font-semibold text-gray-900">{card.sender}: </span>
                            <span>{card.summary}</span>
                          </div>
                        )}

                        {/* Action Buttons */}
                        <div className="pt-2 border-t border-[#E5E5E5] flex items-center gap-2">
                          {isHandled ? (
                            <div className="flex items-center gap-1 text-xs text-[#555555] font-medium">
                              <Check className="w-3.5 h-3.5" />
                              <span>Action scheduled</span>
                            </div>
                          ) : card.type === 'schedule_plan' ? (
                            <>
                              <button
                                onClick={() => handleCardSchedule(card)}
                                className="px-3 py-1.5 rounded-md bg-[#111111] hover:bg-black text-white text-xs font-medium transition-colors shadow-subtle"
                              >
                                Schedule this
                              </button>
                              <button
                                onClick={() => setScheduledCards((prev) => ({ ...prev, [card.id]: true }))}
                                className="px-2.5 py-1.5 rounded-md border border-gray-200 bg-white text-gray-600 hover:bg-gray-50 text-xs transition-colors"
                              >
                                Dismiss
                              </button>
                            </>
                          ) : (
                            <>
                              <button
                                onClick={() => handleCreateTaskFromCard(card)}
                                className="px-3 py-1.5 rounded-md bg-[#111111] hover:bg-black text-white text-xs font-medium transition-colors shadow-subtle"
                              >
                                Create task
                              </button>
                              <button
                                onClick={() => navigate('/email')}
                                className="px-2.5 py-1.5 rounded-md border border-gray-200 bg-white text-gray-600 hover:bg-gray-50 text-xs transition-colors"
                              >
                                View email
                              </button>
                            </>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}

        {isGenerating && (
          <div className="flex items-center gap-2 text-xs text-gray-400 py-2">
            <Sparkles className="w-3.5 h-3.5 text-black animate-spin" />
            <span>LifeOps is analyzing your context...</span>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Suggested Prompts */}
      <div className="py-2">
        <div className="flex items-center gap-1.5 overflow-x-auto scrollbar-none pb-1">
          {SUGGESTED_PROMPTS.map((prompt) => (
            <button
              key={prompt}
              onClick={() => handlePromptClick(prompt)}
              disabled={isGenerating}
              className="text-xs px-2.5 py-1 rounded-full border border-gray-200 bg-white hover:bg-gray-50 text-gray-600 hover:text-gray-900 whitespace-nowrap transition-colors"
            >
              {prompt}
            </button>
          ))}
        </div>
      </div>

      {/* Input Bar */}
      <form onSubmit={handleSend} className="pt-2">
        <div className="flex items-center gap-2 border border-gray-200 rounded-lg p-1.5 bg-white focus-within:border-black shadow-subtle">
          <input
            ref={inputRef}
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder="Ask LifeOps anything about your day, tasks, meetings, or schedule..."
            disabled={isGenerating}
            className="flex-1 bg-transparent text-xs text-gray-900 placeholder-gray-400 focus:outline-none px-2 py-1.5"
          />
          <button
            type="submit"
            disabled={!inputText.trim() || isGenerating}
            className="px-3 py-1.5 rounded-md bg-[#111111] hover:bg-black text-white font-medium text-xs transition-colors disabled:opacity-40"
          >
            Send
          </button>
        </div>
      </form>
    </div>
  );
};
