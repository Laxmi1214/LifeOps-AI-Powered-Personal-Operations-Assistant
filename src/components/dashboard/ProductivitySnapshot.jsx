import React from 'react';
import { ResponsiveContainer, AreaChart, Area, XAxis, Tooltip } from 'recharts';
import { useLifeOps } from '../../context/LifeOpsContext';
import { useNavigate } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';

const CustomMiniTooltip = ({ active, payload }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white border border-gray-200 px-2 py-1 rounded shadow-dropdown text-[10px]">
        <div className="font-medium text-gray-900">{payload[0].payload.day}</div>
        <div className="text-black font-semibold">{payload[0].value}%</div>
      </div>
    );
  }
  return null;
};

export const ProductivitySnapshot = () => {
  const { productivityMetrics } = useLifeOps();
  const navigate = useNavigate();

  const miniTrendData = productivityMetrics.weeklyTrend.map((t) => ({
    day: t.day.split(' ')[0],
    score: t.score
  }));

  return (
    <div className="border border-gray-200 rounded-lg p-5 bg-white space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
            Productivity Summary
          </h2>
          <div className="flex items-baseline gap-2 mt-1">
            <span className="text-2xl font-bold text-gray-900">82%</span>
            <span className="text-xs font-bold text-black">+14% vs last week</span>
          </div>
        </div>
        <button
          onClick={() => navigate('/analytics')}
          className="text-xs text-black hover:text-gray-700 font-medium flex items-center gap-1 group"
        >
          <span>Full report</span>
          <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
        </button>
      </div>

      <div className="grid grid-cols-3 gap-4 pt-2 border-t border-gray-100 text-xs">
        <div>
          <div className="text-gray-400 text-[11px]">Tasks completed</div>
          <div className="font-semibold text-gray-900 mt-0.5">8 of 10 today</div>
        </div>
        <div>
          <div className="text-gray-400 text-[11px]">Focus time</div>
          <div className="font-semibold text-gray-900 mt-0.5">4h 20m logged</div>
        </div>
        <div>
          <div className="text-gray-400 text-[11px]">On-time completion</div>
          <div className="font-semibold text-gray-900 mt-0.5">86% rate</div>
        </div>
      </div>

      {/* Clean mini trend line */}
      <div className="h-16 w-full pt-1">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={miniTrendData} margin={{ top: 0, right: 0, left: 0, bottom: 0 }}>
            <XAxis dataKey="day" hide />
            <Tooltip content={<CustomMiniTooltip />} />
            <Area
              type="monotone"
              dataKey="score"
              stroke="#111111"
              strokeWidth={1.5}
              fillOpacity={0.06}
              fill="#111111"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};
