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
    <div className="p-4 rounded-lg bg-[#F7F7F7] border border-[#DDDDDD] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
      <div className="space-y-1">
        <div className="flex items-center gap-1.5 text-xs font-semibold text-black">
          <Sparkles className="w-3.5 h-3.5 text-black" />
          <span>LifeOps Insight</span>
        </div>
        <p className="text-xs text-gray-700 leading-relaxed">
          You have 3 unfinished tasks today. Your project prototype is the highest priority, and you have an open 2-hour window between 2 PM and 4 PM.
        </p>
      </div>

      <div className="flex-shrink-0">
        {isPlanned ? (
          <div className="flex items-center gap-1.5 text-xs font-medium text-black px-3 py-1.5 bg-[#F5F5F5] rounded-md">
            <Check className="w-3.5 h-3.5" />
            <span>Focus scheduled (2–4 PM)</span>
          </div>
        ) : (
          <button
            onClick={handlePlan}
            className="px-3.5 py-1.5 rounded-md bg-[#111111] hover:bg-black text-white text-xs font-medium transition-colors shadow-subtle active:scale-[0.98]"
          >
            Plan my day
          </button>
        )}
      </div>
    </div>
  );
};
