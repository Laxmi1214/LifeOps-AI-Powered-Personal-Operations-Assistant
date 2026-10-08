import React from 'react';
import { ArrowRight } from 'lucide-react';
import { useLifeOps } from '../../context/LifeOpsContext';
import { useNavigate } from 'react-router-dom';

export const UpcomingSchedule = () => {
  const { calendarEvents } = useLifeOps();
  const navigate = useNavigate();

  const todaySchedule = calendarEvents
    .filter((e) => e.date === '2026-10-07' || e.date?.toLowerCase() === 'today')
    .sort((a, b) => a.startTime.localeCompare(b.startTime));

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <h2 className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
          Today's Schedule
        </h2>
        <button
          onClick={() => navigate('/calendar')}
          className="text-xs text-black hover:underline font-medium flex items-center gap-1 group"
        >
          <span>Open calendar</span>
          <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
        </button>
      </div>

      <div className="border border-gray-200 rounded-lg p-4 bg-white">
        <div className="relative pl-6 space-y-4 before:absolute before:left-2 before:top-2 before:bottom-2 before:w-px before:bg-gray-200">
          {todaySchedule.map((event) => (
            <div key={event.id} className="relative group">
              {/* Dot on timeline */}
              <div className="absolute -left-[1.65rem] top-1 w-2 h-2 rounded-full bg-black ring-4 ring-white" />

              <div>
                <div className="flex items-baseline gap-2">
                  <span className="text-xs font-semibold text-gray-900">{event.startTime}</span>
                  <span className="text-xs font-medium text-gray-800">{event.title}</span>
                </div>
                <div className="text-[11px] text-gray-500 mt-0.5">
                  {event.displayTime} · {event.category}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
