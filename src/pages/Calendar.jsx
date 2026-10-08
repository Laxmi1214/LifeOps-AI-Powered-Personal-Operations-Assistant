import React, { useState } from 'react';
import {
  ChevronLeft,
  ChevronRight,
  Plus,
  Clock,
  Sparkles,
  MapPin
} from 'lucide-react';
import { useLifeOps } from '../context/LifeOpsContext';
import { ScheduleModal } from '../components/calendar/ScheduleModal';

const EVENT_PILL_STYLES = {
  Meeting: 'border-l-2 border-black bg-white text-black',
  Focus: 'border-l-2 border-[#555555] bg-white text-black',
  Deadline: 'border-l-2 border-black bg-white text-black font-semibold',
  Personal: 'border-l-2 border-[#888888] bg-white text-[#555555]'
};

export const Calendar = () => {
  const { calendarEvents, availableSlots, scheduleTimeSlot } = useLifeOps();
  const [viewMode, setViewMode] = useState('week');
  const [isScheduleOpen, setIsScheduleOpen] = useState(false);

  const daysOfWeek = [
    { name: 'Mon', date: 'Oct 05', full: '2026-10-05', isToday: false },
    { name: 'Tue', date: 'Oct 06', full: '2026-10-06', isToday: false },
    { name: 'Wed', date: 'Oct 07', full: '2026-10-07', isToday: true },
    { name: 'Thu', date: 'Oct 08', full: '2026-10-08', isToday: false },
    { name: 'Fri', date: 'Oct 09', full: '2026-10-09', isToday: false },
    { name: 'Sat', date: 'Oct 10', full: '2026-10-10', isToday: false },
    { name: 'Sun', date: 'Oct 11', full: '2026-10-11', isToday: false }
  ];

  return (
    <div className="space-y-6 pb-16 animate-fade-in max-w-5xl mx-auto">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900 tracking-tight">Calendar</h1>
          <p className="text-xs text-gray-500 mt-1">
            Schedule meetings, review focus blocks, and reserve free windows.
          </p>
        </div>

        <div className="flex items-center gap-2">
          {/* View switcher */}
          <div className="flex rounded-md border border-gray-200 bg-gray-50 p-0.5 text-xs">
            {['month', 'week', 'day'].map((mode) => (
              <button
                key={mode}
                onClick={() => setViewMode(mode)}
                className={`px-2.5 py-1 rounded capitalize font-medium transition-colors ${
                  viewMode === mode
                    ? 'bg-white text-gray-900 shadow-subtle'
                    : 'text-gray-500 hover:text-gray-900'
                }`}
              >
                {mode}
              </button>
            ))}
          </div>

          <button
            onClick={() => setIsScheduleOpen(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-[#111111] hover:bg-black text-white text-xs font-medium transition-colors shadow-subtle"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Schedule</span>
          </button>
        </div>
      </div>

      {/* Main Grid: Calendar Area + Right Sidebar "Available Time" */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 items-start">
        {/* Left 3 Columns: Calendar Grid */}
        <div className="lg:col-span-3 space-y-4">
          {/* Week Date Header Bar */}
          <div className="border border-gray-200 rounded-lg p-3 bg-white flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold text-gray-900">October 5 – 11, 2026</span>
              <span className="text-[11px] text-gray-400">· Week 41</span>
            </div>
            <div className="flex items-center gap-1">
              <button className="p-1 rounded hover:bg-gray-100 text-gray-500">
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button className="px-2 py-0.5 text-xs text-gray-600 hover:bg-gray-100 rounded font-medium">
                Today
              </button>
              <button className="p-1 rounded hover:bg-gray-100 text-gray-500">
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Week View */}
          {viewMode === 'week' && (
            <div className="border border-gray-200 rounded-lg bg-white overflow-hidden">
              {/* Day Headers */}
              <div className="grid grid-cols-7 border-b border-gray-200 divide-x divide-gray-100 text-center text-xs">
                {daysOfWeek.map((day) => (
                  <div
                    key={day.full}
                    className={`py-2 px-1 ${
                      day.isToday ? 'bg-[#F3F3F3]' : 'bg-white'
                    }`}
                  >
                    <div className="text-[10px] font-medium text-gray-400 uppercase">{day.name}</div>
                    <div className={`font-semibold mt-0.5 ${day.isToday ? 'text-black' : 'text-[#555555]'}`}>
                      {day.date.split(' ')[1]}
                    </div>
                  </div>
                ))}
              </div>

              {/* Event Rows */}
              <div className="p-4 space-y-2.5">
                <div className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider mb-2">
                  Scheduled Events
                </div>

                <div className="space-y-2">
                  {calendarEvents.map((ev) => {
                    const pillClass = EVENT_PILL_STYLES[ev.category] || EVENT_PILL_STYLES.Focus;

                    return (
                      <div
                        key={ev.id}
                        className={`p-3 rounded-md border border-gray-100 ${pillClass} transition-colors flex items-start justify-between gap-3`}
                      >
                        <div className="min-w-0">
                          <div className="flex items-baseline gap-2">
                            <span className="text-xs font-semibold text-gray-900">{ev.title}</span>
                            <span className="text-[11px] text-gray-500">{ev.category}</span>
                          </div>
                          <div className="text-[11px] text-gray-500 mt-0.5 flex items-center gap-2">
                            <span>{ev.date} · {ev.displayTime}</span>
                            {ev.location && (
                              <>
                                <span>·</span>
                                <span className="flex items-center gap-1">
                                  <MapPin className="w-3 h-3 text-gray-400" />
                                  {ev.location}
                                </span>
                              </>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {/* Month view representation */}
          {viewMode === 'month' && (
            <div className="border border-gray-200 rounded-lg p-4 bg-white space-y-3">
              <div className="grid grid-cols-7 gap-1 text-center text-xs">
                {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((d) => (
                  <div key={d} className="font-semibold text-gray-400 text-[10px] py-1">{d}</div>
                ))}
                {Array.from({ length: 31 }, (_, i) => i + 1).map((day) => {
                  const isCurrent = day === 7;
                  const hasEvents = day === 7 || day === 8;
                  return (
                    <div
                      key={day}
                      className={`h-12 p-1 border rounded text-left flex flex-col justify-between ${
                        isCurrent
                          ? 'border-black bg-black font-semibold text-white'
                          : 'border-[#E5E5E5] text-[#555555]'
                      }`}
                    >
                      <span className="text-[10px]">{day}</span>
                      {hasEvents && <div className={`w-1.5 h-1.5 rounded-full ${isCurrent ? 'bg-white' : 'bg-black'}`} />}
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Day view */}
          {viewMode === 'day' && (
            <div className="border border-gray-200 rounded-lg p-4 bg-white divide-y divide-gray-100">
              {calendarEvents
                .filter((e) => e.date === '2026-10-07' || e.date?.toLowerCase() === 'today')
                .map((ev) => (
                  <div key={ev.id} className="py-2.5 flex items-center justify-between">
                    <div>
                      <div className="text-xs font-semibold text-gray-900">{ev.title}</div>
                      <div className="text-[11px] text-gray-500">{ev.displayTime}</div>
                    </div>
                    <span className="text-[11px] text-gray-500">{ev.category}</span>
                  </div>
                ))}
            </div>
          )}
        </div>

        {/* Right Column: "Available Time" Card */}
        <div className="space-y-4">
          <div className="border border-gray-200 rounded-lg p-4 bg-white space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-semibold text-gray-900">
                Available Time
              </h3>
              <span className="text-[10px] text-gray-400">Tomorrow</span>
            </div>

            <p className="text-[11px] text-gray-500 leading-normal">
              Unallocated calendar windows detected for focus work:
            </p>

            <div className="space-y-2">
              {availableSlots.map((slot) => (
                <div
                  key={slot.id}
                  className="p-2.5 rounded-md border border-gray-100 bg-gray-50/50 space-y-1.5"
                >
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-medium text-gray-900">{slot.startTime} – {slot.endTime}</span>
                    <span className="text-[10px] text-gray-500 font-mono">{slot.duration}</span>
                  </div>

                  <div className="text-[11px] text-gray-600">
                    {slot.recommendedFocus}
                  </div>

                  <button
                    onClick={() => scheduleTimeSlot(slot)}
                    className="w-full text-center px-2 py-1 rounded border border-gray-200 bg-white hover:bg-gray-50 text-[11px] font-medium text-black transition-colors"
                  >
                    Schedule focus block
                  </button>
                </div>
              ))}

              {availableSlots.length === 0 && (
                <div className="text-xs text-gray-400 py-3 text-center">
                  All detected slots scheduled.
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <ScheduleModal isOpen={isScheduleOpen} onClose={() => setIsScheduleOpen(false)} />
    </div>
  );
};
