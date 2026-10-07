import React, { useState } from 'react';
import { X } from 'lucide-react';
import { useLifeOps } from '../../context/LifeOpsContext';

export const ScheduleModal = ({ isOpen, onClose }) => {
  const { addCalendarEvent } = useLifeOps();

  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('Focus');
  const [date, setDate] = useState('2026-10-08');
  const [startTime, setStartTime] = useState('14:00');
  const [endTime, setEndTime] = useState('16:00');
  const [location, setLocation] = useState('Focus Room');
  const [description, setDescription] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title.trim()) return;

    addCalendarEvent({
      title,
      category,
      date,
      startTime,
      endTime,
      displayTime: `${startTime} – ${endTime}`,
      location,
      color: '#2563EB',
      description
    });

    setTitle('');
    setDescription('');
    onClose();
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900/30 backdrop-blur-xs animate-fade-in"
      onClick={onClose}
    >
      <div
        className="w-full max-w-md bg-white border border-gray-200 rounded-lg shadow-modal overflow-hidden flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="px-5 py-3.5 border-b border-gray-200 flex items-center justify-between">
          <h2 className="text-sm font-semibold text-gray-900">Schedule Event</h2>
          <button onClick={onClose} className="p-1 rounded text-gray-400 hover:text-gray-600">
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-5 space-y-3.5 text-xs">
          <div>
            <label className="block text-xs font-medium text-gray-800 mb-1">
              Event Title
            </label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g., Focus: Complete documentation"
              className="w-full border border-gray-200 rounded-md px-3 py-1.5 text-gray-900 placeholder-gray-400 focus:outline-none focus:border-blue-500 text-xs"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-gray-800 mb-1">
                Category
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full border border-gray-200 rounded-md px-3 py-1.5 text-gray-900 focus:outline-none focus:border-blue-500 text-xs"
              >
                <option value="Focus">Focus Session</option>
                <option value="Meeting">Meeting</option>
                <option value="Deadline">Deadline</option>
                <option value="Personal">Personal</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-800 mb-1">
                Date
              </label>
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full border border-gray-200 rounded-md px-3 py-1.5 text-gray-900 focus:outline-none focus:border-blue-500 text-xs"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-gray-800 mb-1">
                Start Time
              </label>
              <input
                type="time"
                value={startTime}
                onChange={(e) => setStartTime(e.target.value)}
                className="w-full border border-gray-200 rounded-md px-3 py-1.5 text-gray-900 focus:outline-none focus:border-blue-500 text-xs"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-800 mb-1">
                End Time
              </label>
              <input
                type="time"
                value={endTime}
                onChange={(e) => setEndTime(e.target.value)}
                className="w-full border border-gray-200 rounded-md px-3 py-1.5 text-gray-900 focus:outline-none focus:border-blue-500 text-xs"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-800 mb-1">
              Location / Link
            </label>
            <input
              type="text"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              placeholder="e.g., Focus Room / Meet Link"
              className="w-full border border-gray-200 rounded-md px-3 py-1.5 text-gray-900 placeholder-gray-400 focus:outline-none focus:border-blue-500 text-xs"
            />
          </div>

          <div className="pt-2 flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-3 py-1.5 rounded-md border border-gray-200 text-gray-600 hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-3.5 py-1.5 rounded-md bg-blue-600 hover:bg-blue-700 text-white font-medium transition-colors"
            >
              Schedule
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
