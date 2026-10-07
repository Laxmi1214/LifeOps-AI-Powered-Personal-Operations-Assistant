import React, { useState } from 'react';
import { Sparkles, Check } from 'lucide-react';
import { useLifeOps } from '../../context/LifeOpsContext';

export const AiInsightCard = () => {
  const { planMyDay } = useLifeOps();
  const [isPlanned, setIsPlanned] = useState(false);

  const handlePlan = () => {
    planMyDay();
    setIsPlanned(true);
  };

  return (
    <div className="p-4 rounded-lg bg-blue-50/50 border border-blue-100/80 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
      <div className="space-y-1">
        <div className="flex items-center gap-1.5 text-xs font-semibold text-blue-800">
          <Sparkles className="w-3.5 h-3.5 text-blue-600" />
          <span>LifeOps Insight</span>
        </div>
        <p className="text-xs text-gray-700 leading-relaxed">
          You have 3 unfinished tasks today. Your project prototype is the highest priority, and you have an open 2-hour window between 2 PM and 4 PM.
        </p>
      </div>

      <div className="flex-shrink-0">
        {isPlanned ? (
          <div className="flex items-center gap-1.5 text-xs font-medium text-blue-700 px-3 py-1.5 bg-blue-100/60 rounded-md">
            <Check className="w-3.5 h-3.5" />
            <span>Focus scheduled (2–4 PM)</span>
          </div>
        ) : (
          <button
            onClick={handlePlan}
            className="px-3.5 py-1.5 rounded-md bg-blue-600 hover:bg-blue-700 text-white text-xs font-medium transition-colors shadow-subtle active:scale-[0.98]"
          >
            Plan my day
          </button>
        )}
      </div>
    </div>
  );
};
