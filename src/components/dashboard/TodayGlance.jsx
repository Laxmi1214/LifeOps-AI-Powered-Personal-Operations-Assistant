import React from 'react';
import { useLifeOps } from '../../context/LifeOpsContext';
import { useNavigate } from 'react-router-dom';

export const TodayGlance = () => {
  const { tasks, calendarEvents, emails } = useLifeOps();
  const navigate = useNavigate();

  const totalTasks = tasks.length;
  const completedTasks = tasks.filter((t) => t.status === 'completed').length;
  const todayEvents = calendarEvents.filter((e) => e.date === '2026-10-07');
  const needAttention = emails.filter((e) => e.section === 'Action Required').length;

  return (
    <div className="py-2.5 px-4 rounded-lg bg-gray-50/80 border border-gray-200 text-xs flex flex-wrap items-center gap-x-6 gap-y-2 text-gray-600">
      <button
        onClick={() => navigate('/tasks')}
        className="flex items-center gap-1.5 hover:text-gray-900 transition-colors"
      >
        <span className="font-semibold text-gray-900">{totalTasks}</span>
        <span>Tasks</span>
      </button>

      <span className="text-gray-300">·</span>

      <button
        onClick={() => navigate('/tasks')}
        className="flex items-center gap-1.5 hover:text-gray-900 transition-colors"
      >
        <span className="font-semibold text-gray-900">{completedTasks}</span>
        <span>Completed</span>
      </button>

      <span className="text-gray-300">·</span>

      <button
        onClick={() => navigate('/calendar')}
        className="flex items-center gap-1.5 hover:text-gray-900 transition-colors"
      >
        <span className="font-semibold text-gray-900">{todayEvents.length}</span>
        <span>Calendar Events</span>
      </button>

      <span className="text-gray-300">·</span>

      <button
        onClick={() => navigate('/email')}
        className="flex items-center gap-1.5 hover:text-gray-900 transition-colors"
      >
        <span className="font-semibold text-blue-600">{needAttention}</span>
        <span>Need Attention</span>
      </button>
    </div>
  );
};
