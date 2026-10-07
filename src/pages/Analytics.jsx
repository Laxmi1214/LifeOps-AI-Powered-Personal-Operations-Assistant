import React from 'react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  PieChart,
  Pie,
  Cell,
  CartesianGrid
} from 'recharts';
import {
  Sparkles
} from 'lucide-react';
import { useLifeOps } from '../context/LifeOpsContext';

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white border border-gray-200 p-2.5 rounded shadow-dropdown text-xs space-y-0.5">
        <div className="font-semibold text-gray-900">{label}</div>
        {payload.map((entry, idx) => (
          <div key={idx} className="text-gray-600 font-mono text-[11px]">
            {entry.name}: {entry.value}
            {entry.unit || ''}
          </div>
        ))}
      </div>
    );
  }
  return null;
};

export const Analytics = () => {
  const { productivityMetrics } = useLifeOps();

  const {
    score,
    completedTasks,
    completionRate,
    focusTime,
    changePercent,
    weeklyTrend,
    taskStatusDistribution,
    categoryDistribution,
    aiInsights
  } = productivityMetrics;

  // Clean, restrained colors for categories (no neon rainbows)
  const categoryColors = ['#2563EB', '#475569', '#64748B', '#94A3B8'];

  return (
    <div className="space-y-6 pb-16 animate-fade-in max-w-5xl mx-auto">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-semibold text-gray-900 tracking-tight">Productivity</h1>
        <p className="text-xs text-gray-500 mt-1">
          Understand how you spend your time and attention velocity.
        </p>
      </div>

      {/* Top 4 Metrics Row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="p-4 rounded-lg border border-gray-200 bg-white space-y-1">
          <div className="text-[11px] font-medium text-gray-400">Productivity Score</div>
          <div className="text-2xl font-bold text-gray-900">{score}%</div>
          <div className="text-[11px] text-black font-medium">{changePercent} vs last week</div>
        </div>

        <div className="p-4 rounded-lg border border-gray-200 bg-white space-y-1">
          <div className="text-[11px] font-medium text-gray-400">Tasks Completed</div>
          <div className="text-2xl font-bold text-gray-900">{completedTasks}</div>
          <div className="text-[11px] text-gray-500">36 total this week</div>
        </div>

        <div className="p-4 rounded-lg border border-gray-200 bg-white space-y-1">
          <div className="text-[11px] font-medium text-gray-400">Completion Rate</div>
          <div className="text-2xl font-bold text-gray-900">{completionRate}%</div>
          <div className="text-[11px] text-gray-500">86% on-time</div>
        </div>

        <div className="p-4 rounded-lg border border-gray-200 bg-white space-y-1">
          <div className="text-[11px] font-medium text-gray-400">Focus Time</div>
          <div className="text-2xl font-bold text-gray-900">{focusTime}</div>
          <div className="text-[11px] text-gray-500">Target: 20h</div>
        </div>
      </div>

      {/* Row 1 Charts: Weekly Trend & Focus Hours */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Weekly Trend */}
        <div className="p-5 rounded-lg border border-gray-200 bg-white space-y-3">
          <div>
            <h3 className="text-xs font-semibold text-gray-900 uppercase tracking-wider">
              Weekly Productivity Trend
            </h3>
            <p className="text-[11px] text-gray-400">Composite score (0–100%)</p>
          </div>

          <div className="h-56 w-full pt-2">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={weeklyTrend} margin={{ top: 5, right: 5, left: -25, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#F3F4F6" vertical={false} />
                <XAxis dataKey="day" stroke="#9CA3AF" fontSize={11} tickLine={false} />
                <YAxis stroke="#9CA3AF" fontSize={11} domain={[50, 100]} tickLine={false} />
                <Tooltip content={<CustomTooltip />} />
                <Area
                  type="monotone"
                  dataKey="score"
                  name="Score"
                  stroke="#2563EB"
                  strokeWidth={2}
                  fillOpacity={0.06}
                  fill="#2563EB"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Daily Focus Hours */}
        <div className="p-5 rounded-lg border border-gray-200 bg-white space-y-3">
          <div>
            <h3 className="text-xs font-semibold text-gray-900 uppercase tracking-wider">
              Focus Hours vs Target
            </h3>
            <p className="text-[11px] text-gray-400">Logged deep work hours per day</p>
          </div>

          <div className="h-56 w-full pt-2">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={weeklyTrend} margin={{ top: 5, right: 5, left: -25, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#F3F4F6" vertical={false} />
                <XAxis dataKey="day" stroke="#9CA3AF" fontSize={11} tickLine={false} />
                <YAxis stroke="#9CA3AF" fontSize={11} tickLine={false} />
                <Tooltip content={<CustomTooltip />} />
                <Bar dataKey="focusHours" name="Focus" fill="#2563EB" radius={[4, 4, 0, 0]} />
                <Bar dataKey="target" name="Target" fill="#E5E7EB" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Row 2: Status Breakdown, Category Distribution, and AI Insights */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Category Distribution */}
        <div className="p-5 rounded-lg border border-gray-200 bg-white space-y-3">
          <div>
            <h3 className="text-xs font-semibold text-gray-900 uppercase tracking-wider">
              Category Distribution
            </h3>
            <p className="text-[11px] text-gray-400">Attention by operational domain</p>
          </div>

          <div className="h-44 w-full flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={categoryDistribution}
                  cx="50%"
                  cy="50%"
                  innerRadius={45}
                  outerRadius={65}
                  dataKey="value"
                >
                  {categoryDistribution.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={categoryColors[index % categoryColors.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className="space-y-1 text-xs">
            {categoryDistribution.map((item, idx) => (
              <div key={item.name} className="flex items-center justify-between text-[11px]">
                <div className="flex items-center gap-1.5">
                  <span
                    className="w-2 h-2 rounded-full"
                    style={{ backgroundColor: categoryColors[idx % categoryColors.length] }}
                  />
                  <span className="text-gray-600 truncate">{item.name}</span>
                </div>
                <span className="font-medium text-gray-900">{item.value}%</span>
              </div>
            ))}
          </div>
        </div>

        {/* Task Velocity Status */}
        <div className="p-5 rounded-lg border border-gray-200 bg-white space-y-3">
          <div>
            <h3 className="text-xs font-semibold text-gray-900 uppercase tracking-wider">
              Completed vs Pending
            </h3>
            <p className="text-[11px] text-gray-400">Task velocity breakdown</p>
          </div>

          <div className="h-44 w-full pt-1">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={taskStatusDistribution} margin={{ top: 5, right: 5, left: -25, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#F3F4F6" vertical={false} />
                <XAxis dataKey="name" stroke="#9CA3AF" fontSize={11} tickLine={false} />
                <YAxis stroke="#9CA3AF" fontSize={11} tickLine={false} />
                <Tooltip />
                <Bar dataKey="count" name="Count" fill="#2563EB" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="p-2.5 rounded bg-gray-50 border border-gray-100 text-center text-[11px] text-gray-600">
            31 items completed · 5 pending
          </div>
        </div>

        {/* AI Productivity Insights */}
        <div className="p-5 rounded-lg border border-gray-200 bg-white space-y-3">
          <div className="flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-black" />
            <h3 className="text-xs font-semibold text-gray-900 uppercase tracking-wider">
              Productivity Insights
            </h3>
          </div>

          <div className="space-y-2.5">
            {aiInsights.map((insight) => (
              <div key={insight.id} className="space-y-0.5 border-b border-gray-100 pb-2 last:border-0 last:pb-0">
                <div className="text-xs font-medium text-gray-900">{insight.title}</div>
                <p className="text-[11px] text-gray-600 leading-normal">{insight.text}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
