import React from 'react';
import { TodayGlance } from '../components/dashboard/TodayGlance';
import { TodayPriorities } from '../components/dashboard/TodayPriorities';
import { UpcomingSchedule } from '../components/dashboard/UpcomingSchedule';
import { AiInsightCard } from '../components/dashboard/AiInsightCard';
import { ProductivitySnapshot } from '../components/dashboard/ProductivitySnapshot';
import { Plus } from 'lucide-react';

export const Dashboard = ({ onOpenAddTask }) => {
  return (
    <div className="space-y-7 pb-16 animate-fade-in max-w-5xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900 tracking-tight">
            Good morning, Alex.
          </h1>
          <p className="text-xs text-gray-500 mt-1">
            Here's what needs your attention today. Wednesday, October 7.
          </p>
        </div>

        <button
          onClick={onOpenAddTask}
          className="self-start sm:self-auto flex items-center gap-1.5 px-3 py-1.5 rounded-md border border-gray-200 bg-white hover:bg-gray-50 text-gray-700 text-xs font-medium transition-colors shadow-subtle"
        >
          <Plus className="w-3.5 h-3.5 text-gray-500" />
          <span>New task</span>
        </button>
      </div>

      {/* 1. At a Glance — Compact Horizontal Metrics Row */}
      <TodayGlance />

      {/* 2. LifeOps Insight — Subtle Blue Banner */}
      <AiInsightCard />

      {/* 3. Today's Focus and Today's Schedule side by side */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
        <TodayPriorities />
        <UpcomingSchedule />
      </div>

      {/* 4. Productivity Summary */}
      <ProductivitySnapshot />
    </div>
  );
};
