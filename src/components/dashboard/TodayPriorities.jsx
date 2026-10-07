import React from 'react';
import { Check, ArrowRight } from 'lucide-react';
import { useLifeOps } from '../../context/LifeOpsContext';
import { useNavigate } from 'react-router-dom';

export const TodayPriorities = () => {
  const { tasks, toggleTaskStatus } = useLifeOps();
  const navigate = useNavigate();

  const priorityOrder = { HIGH: 1, MEDIUM: 2, LOW: 3 };
  const sortedFocusTasks = [...tasks]
    .filter((t) => t.status === 'pending')
    .sort((a, b) => priorityOrder[a.priority] - priorityOrder[b.priority])
    .slice(0, 4);

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <h2 className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
          Today's Focus
        </h2>
        <button
          onClick={() => navigate('/tasks')}
          className="text-xs text-black hover:underline font-medium flex items-center gap-1 group"
        >
          <span>View all</span>
          <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
        </button>
      </div>

      <div className="border border-gray-200 rounded-lg divide-y divide-gray-100 bg-white">
        {sortedFocusTasks.map((task, index) => {
          const isHigh = task.priority === 'HIGH';

          return (
            <div
              key={task.id}
              className="p-3.5 flex items-start justify-between gap-3 hover:bg-gray-50/60 transition-colors"
            >
              <div className="flex items-start gap-3 min-w-0">
                <button
                  onClick={() => toggleTaskStatus(task.id)}
                  className={`w-4 h-4 mt-0.5 rounded border flex items-center justify-center transition-colors flex-shrink-0 ${
                    task.status === 'completed'
                      ? 'bg-black border-black text-white'
                      : 'border-gray-300 hover:border-gray-400 bg-white'
                  }`}
                >
                  {task.status === 'completed' && <Check className="w-3 h-3 stroke-[3]" />}
                </button>

                <div className="min-w-0">
                  <div className="text-xs font-medium text-gray-900 truncate">
                    {task.title}
                  </div>
                  <div className="text-[11px] text-gray-500 mt-0.5 flex items-center gap-2">
                    {isHigh && (
                      <span className="text-black font-bold">High priority</span>
                    )}
                    {isHigh && <span>·</span>}
                    <span>Due {task.deadline.toLowerCase()}</span>
                    <span>·</span>
                    <span>{task.category}</span>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
