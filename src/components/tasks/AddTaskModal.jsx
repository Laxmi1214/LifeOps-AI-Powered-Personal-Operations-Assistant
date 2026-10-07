import React, { useState } from 'react';
import { X } from 'lucide-react';
import { useLifeOps } from '../../context/LifeOpsContext';

export const AddTaskModal = ({ isOpen, onClose }) => {
  const { addTask, createReminderForTask } = useLifeOps();

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState('HIGH');
  const [dueDate, setDueDate] = useState('2026-10-07');
  const [dueTime, setDueTime] = useState('18:00');
  const [category, setCategory] = useState('Project');
  const [enableReminder, setEnableReminder] = useState(true);

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title.trim()) return;

    const newTask = addTask({
      title,
      description,
      priority,
      dueDate,
      dueTime,
      deadline: dueDate === '2026-10-07' ? 'Today' : 'Upcoming',
      category,
      source: 'Manual'
    });

    if (enableReminder) {
      createReminderForTask(newTask);
    }

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
        {/* Header */}
        <div className="px-5 py-3.5 border-b border-gray-200 flex items-center justify-between">
          <h2 className="text-sm font-semibold text-gray-900">New Task</h2>
          <button onClick={onClose} className="p-1 rounded text-gray-400 hover:text-gray-600">
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-5 space-y-3.5 text-xs">
          <div>
            <label className="block text-xs font-medium text-gray-800 mb-1">
              Title
            </label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g., Complete MCP connector integration"
              className="w-full border border-gray-200 rounded-md px-3 py-1.5 text-gray-900 placeholder-gray-400 focus:outline-none focus:border-blue-500 text-xs"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-800 mb-1">
              Description
            </label>
            <textarea
              rows={2}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Notes or deliverables..."
              className="w-full border border-gray-200 rounded-md px-3 py-1.5 text-gray-900 placeholder-gray-400 focus:outline-none focus:border-blue-500 text-xs"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-gray-800 mb-1">
                Priority
              </label>
              <select
                value={priority}
                onChange={(e) => setPriority(e.target.value)}
                className="w-full border border-gray-200 rounded-md px-3 py-1.5 text-gray-900 focus:outline-none focus:border-blue-500 text-xs"
              >
                <option value="HIGH">High</option>
                <option value="MEDIUM">Medium</option>
                <option value="LOW">Low</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-800 mb-1">
                Category
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full border border-gray-200 rounded-md px-3 py-1.5 text-gray-900 focus:outline-none focus:border-blue-500 text-xs"
              >
                <option value="Project">Project</option>
                <option value="Engineering">Engineering</option>
                <option value="Operations">Operations</option>
                <option value="Personal">Personal</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-gray-800 mb-1">
                Due Date
              </label>
              <input
                type="date"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
                className="w-full border border-gray-200 rounded-md px-3 py-1.5 text-gray-900 focus:outline-none focus:border-blue-500 text-xs"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-800 mb-1">
                Due Time
              </label>
              <input
                type="time"
                value={dueTime}
                onChange={(e) => setDueTime(e.target.value)}
                className="w-full border border-gray-200 rounded-md px-3 py-1.5 text-gray-900 focus:outline-none focus:border-blue-500 text-xs"
              />
            </div>
          </div>

          <div className="flex items-center justify-between p-2.5 rounded-md border border-gray-100 bg-gray-50/50">
            <span className="text-gray-700">Set reminder for this task</span>
            <input
              type="checkbox"
              checked={enableReminder}
              onChange={(e) => setEnableReminder(e.target.checked)}
              className="rounded border-gray-300 text-blue-600 focus:ring-0 w-4 h-4 cursor-pointer"
            />
          </div>

          {/* Footer */}
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
              Create Task
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
