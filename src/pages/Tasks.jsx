import React, { useState } from 'react';
import {
  Plus,
  Search,
  Check,
  Calendar,
  BellRing,
  Trash2,
  Clock,
  Sparkles
} from 'lucide-react';
import { useLifeOps } from '../context/LifeOpsContext';
import { AddTaskModal } from '../components/tasks/AddTaskModal';

export const Tasks = () => {
  const {
    tasks,
    toggleTaskStatus,
    deleteTask,
    scheduleTaskOnCalendar,
    createReminderForTask
  } = useLifeOps();

  const [isAddOpen, setIsAddOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [priorityFilter, setPriorityFilter] = useState('ALL');
  const [categoryFilter, setCategoryFilter] = useState('ALL');
  const [statusFilter, setStatusFilter] = useState('ALL');

  // Filter tasks
  const filteredTasks = tasks.filter((t) => {
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      const match =
        t.title.toLowerCase().includes(q) ||
        t.category.toLowerCase().includes(q) ||
        (t.description && t.description.toLowerCase().includes(q));
      if (!match) return false;
    }

    if (priorityFilter !== 'ALL' && t.priority !== priorityFilter) return false;
    if (categoryFilter !== 'ALL' && t.category !== categoryFilter) return false;
    if (statusFilter !== 'ALL' && t.status !== statusFilter) return false;

    return true;
  });

  const todayTasks = filteredTasks.filter(
    (t) => t.status === 'pending' && (t.deadline === 'Today' || t.dueDate === '2026-10-07')
  );

  const upcomingTasks = filteredTasks.filter(
    (t) =>
      t.status === 'pending' &&
      t.deadline !== 'Today' &&
      t.deadline !== 'Yesterday' &&
      t.dueDate > '2026-10-07'
  );

  const overdueTasks = filteredTasks.filter(
    (t) => t.status === 'pending' && (t.deadline === 'Yesterday' || t.dueDate < '2026-10-07')
  );

  const completedTasks = filteredTasks.filter((t) => t.status === 'completed');

  const renderTaskTable = (taskList) => {
    return (
      <div className="border border-gray-200 rounded-lg overflow-hidden bg-white">
        <div className="grid grid-cols-12 gap-2 px-4 py-2 border-b border-gray-100 bg-gray-50/70 text-[11px] font-semibold text-gray-400 uppercase tracking-wider">
          <div className="col-span-6 sm:col-span-6">Task</div>
          <div className="col-span-2 hidden sm:block">Priority</div>
          <div className="col-span-2 hidden sm:block">Due</div>
          <div className="col-span-2 hidden sm:block">Category</div>
          <div className="col-span-6 sm:col-span-2 text-right">Actions</div>
        </div>

        <div className="divide-y divide-gray-100 text-xs">
          {taskList.map((task) => {
            const isCompleted = task.status === 'completed';
            const isHigh = task.priority === 'HIGH';
            const isMed = task.priority === 'MEDIUM';

            return (
              <div
                key={task.id}
                className="grid grid-cols-12 gap-2 px-4 py-3 items-center hover:bg-gray-50/70 transition-colors group"
              >
                {/* Task Name & Checkbox */}
                <div className="col-span-6 sm:col-span-6 flex items-start gap-2.5 min-w-0 pr-2">
                  <button
                    onClick={() => toggleTaskStatus(task.id)}
                    className={`w-4 h-4 mt-0.5 rounded border flex items-center justify-center transition-colors flex-shrink-0 ${
                      isCompleted
                        ? 'bg-black border-black text-white'
                        : 'border-gray-300 hover:border-black bg-white'
                    }`}
                  >
                    {isCompleted && <Check className="w-3 h-3 stroke-[3]" />}
                  </button>

                  <div className="min-w-0">
                    <span
                      className={`font-medium ${
                        isCompleted ? 'line-through text-gray-400' : 'text-gray-900'
                      }`}
                    >
                      {task.title}
                    </span>
                    {task.description && (
                      <p className="text-[11px] text-gray-500 truncate mt-0.5">
                        {task.description}
                      </p>
                    )}
                  </div>
                </div>

                {/* Priority */}
                <div className="col-span-2 hidden sm:block">
                  <span
                    className={`text-xs ${
                      isHigh
                        ? 'text-black font-bold'
                        : isMed
                        ? 'text-[#555555] font-medium'
                        : 'text-[#888888] font-medium'
                    }`}
                  >
                    {task.priority === 'HIGH' ? 'High' : task.priority === 'MEDIUM' ? 'Medium' : 'Low'}
                  </span>
                </div>

                {/* Due */}
                <div className="col-span-2 hidden sm:block text-gray-600 text-[11px]">
                  {task.deadline}
                </div>

                {/* Category */}
                <div className="col-span-2 hidden sm:block text-gray-500 text-[11px]">
                  {task.category}
                </div>

                {/* Actions */}
                <div className="col-span-6 sm:col-span-2 flex items-center justify-end gap-1">
                  {!isCompleted && (
                    <>
                      <button
                        onClick={() => scheduleTaskOnCalendar(task)}
                        title="Schedule Focus Session"
                        className="px-2 py-1 rounded text-[11px] text-black hover:bg-[#F3F3F3] transition-colors font-medium"
                      >
                        Schedule
                      </button>
                      <button
                        onClick={() => createReminderForTask(task)}
                        title="Set Reminder"
                        className="p-1 text-gray-400 hover:text-gray-600 rounded"
                      >
                        <BellRing className="w-3.5 h-3.5" />
                      </button>
                    </>
                  )}
                  <button
                    onClick={() => deleteTask(task.id)}
                    title="Delete task"
                    className="p-1 text-gray-400 hover:text-black rounded"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-6 pb-16 animate-fade-in max-w-5xl mx-auto">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900 tracking-tight">Tasks</h1>
          <p className="text-xs text-gray-500 mt-1">
            Manage deliverables, assign priorities, and schedule focused work.
          </p>
        </div>

        <button
          onClick={() => setIsAddOpen(true)}
          className="self-start sm:self-auto flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-[#111111] hover:bg-black text-white text-xs font-medium transition-colors shadow-subtle"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>New task</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-md border border-gray-200 bg-white sm:w-64">
          <Search className="w-3.5 h-3.5 text-gray-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Filter tasks..."
            className="w-full bg-transparent text-gray-900 placeholder-gray-400 focus:outline-none text-xs"
          />
        </div>

        <div className="flex items-center gap-2">
          <select
            value={priorityFilter}
            onChange={(e) => setPriorityFilter(e.target.value)}
            className="px-2.5 py-1.5 rounded-md border border-gray-200 bg-white text-gray-700 text-xs focus:outline-none"
          >
            <option value="ALL">All priorities</option>
            <option value="HIGH">High priority</option>
            <option value="MEDIUM">Medium priority</option>
            <option value="LOW">Low priority</option>
          </select>

          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="px-2.5 py-1.5 rounded-md border border-gray-200 bg-white text-gray-700 text-xs focus:outline-none"
          >
            <option value="ALL">All categories</option>
            <option value="Project">Project</option>
            <option value="Engineering">Engineering</option>
            <option value="Operations">Operations</option>
            <option value="Personal">Personal</option>
          </select>
        </div>
      </div>

      {/* Task Sections */}
      <div className="space-y-6">
        {todayTasks.length > 0 && (
          <div className="space-y-2">
            <h2 className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
              Today ({todayTasks.length})
            </h2>
            {renderTaskTable(todayTasks)}
          </div>
        )}

        {upcomingTasks.length > 0 && (
          <div className="space-y-2">
            <h2 className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
              Upcoming ({upcomingTasks.length})
            </h2>
            {renderTaskTable(upcomingTasks)}
          </div>
        )}

        {overdueTasks.length > 0 && (
          <div className="space-y-2">
            <h2 className="text-xs font-bold text-black uppercase tracking-wider">
              Overdue ({overdueTasks.length})
            </h2>
            {renderTaskTable(overdueTasks)}
          </div>
        )}

        {completedTasks.length > 0 && (
          <div className="space-y-2">
            <h2 className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
              Completed ({completedTasks.length})
            </h2>
            {renderTaskTable(completedTasks)}
          </div>
        )}

        {filteredTasks.length === 0 && (
          <div className="py-12 text-center text-xs text-gray-400 border border-gray-200 rounded-lg bg-white">
            No tasks match your filters.
          </div>
        )}
      </div>

      <AddTaskModal isOpen={isAddOpen} onClose={() => setIsAddOpen(false)} />
    </div>
  );
};
