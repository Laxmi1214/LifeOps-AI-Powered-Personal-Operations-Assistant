import React from 'react';
import {
  Check,
  Trash2,
  Clock,
  Sparkles
} from 'lucide-react';
import { useLifeOps } from '../context/LifeOpsContext';

export const Reminders = () => {
  const {
    reminders,
    snoozeReminder,
    completeReminder,
    deleteReminder
  } = useLifeOps();

  const activeReminders = reminders.filter((r) => r.status !== 'completed');
  const completedReminders = reminders.filter((r) => r.status === 'completed');

  return (
    <div className="space-y-6 pb-16 animate-fade-in max-w-5xl mx-auto">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-semibold text-gray-900 tracking-tight">Reminders</h1>
        <p className="text-xs text-gray-500 mt-1">
          Contextual schedule nudges, deadlines, and renewal reminders.
        </p>
      </div>

      {/* Active Reminders List */}
      <div className="space-y-3">
        <h2 className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
          Active Reminders ({activeReminders.length})
        </h2>

        <div className="border border-gray-200 rounded-lg divide-y divide-gray-100 bg-white">
          {activeReminders.map((rem) => {
            const isSmart = rem.isSmartSuggestion;

            return (
              <div
                key={rem.id}
                className="p-3.5 flex items-start justify-between gap-3 hover:bg-gray-50/70 transition-colors"
              >
                <div className="space-y-0.5">
                  <div className="text-[11px] text-gray-400 font-medium flex items-center gap-1.5">
                    {isSmart && <Sparkles className="w-3 h-3 text-black" />}
                    <span>{rem.triggerTime}</span>
                    {rem.status === 'snoozed' && (
                      <span className="text-black font-semibold">(Snoozed)</span>
                    )}
                  </div>
                  <div className="text-xs font-medium text-gray-900">{rem.title}</div>
                  {rem.reason && (
                    <div className="text-[11px] text-gray-500">{rem.reason}</div>
                  )}
                </div>

                <div className="flex items-center gap-1 pt-1">
                  <button
                    onClick={() => snoozeReminder(rem.id, '1 hour')}
                    className="px-2 py-1 rounded border border-gray-200 bg-white hover:bg-gray-50 text-[11px] text-gray-600 transition-colors"
                  >
                    Snooze
                  </button>
                  <button
                    onClick={() => completeReminder(rem.id)}
                    className="p-1 text-gray-400 hover:text-black rounded"
                    title="Mark complete"
                  >
                    <Check className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => deleteReminder(rem.id)}
                    className="p-1 text-gray-400 hover:text-red-600 rounded"
                    title="Dismiss"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            );
          })}

          {activeReminders.length === 0 && (
            <div className="py-8 text-center text-xs text-gray-400">
              No active reminders.
            </div>
          )}
        </div>
      </div>

      {/* Completed Reminders */}
      {completedReminders.length > 0 && (
        <div className="space-y-3">
          <h2 className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
            Completed ({completedReminders.length})
          </h2>

          <div className="border border-gray-200 rounded-lg divide-y divide-gray-100 bg-white opacity-60">
            {completedReminders.map((rem) => (
              <div key={rem.id} className="p-3 flex items-center justify-between text-xs">
                <span className="line-through text-gray-500">{rem.title}</span>
                <span className="text-[11px] text-gray-400">{rem.triggerTime}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
