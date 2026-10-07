import React, { useState } from 'react';
import { X } from 'lucide-react';
import { useLifeOps } from '../../context/LifeOpsContext';

export const AddSubscriptionModal = ({ isOpen, onClose }) => {
  const { addSubscription } = useLifeOps();

  const [name, setName] = useState('');
  const [cost, setCost] = useState('');
  const [category, setCategory] = useState('Developer Tools');
  const [cycle, setCycle] = useState('Monthly');
  const [nextRenewal, setNextRenewal] = useState('2026-10-25');
  const [paymentMethod, setPaymentMethod] = useState('Credit Card');

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name.trim() || !cost) return;

    addSubscription({
      name,
      cost: Number(cost),
      category,
      cycle,
      nextRenewal,
      paymentMethod
    });

    setName('');
    setCost('');
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
          <h2 className="text-sm font-semibold text-gray-900">Add Subscription or Bill</h2>
          <button onClick={onClose} className="p-1 rounded text-gray-400 hover:text-gray-600">
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-5 space-y-3.5 text-xs">
          <div>
            <label className="block text-xs font-medium text-gray-800 mb-1">
              Service / Bill Name
            </label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g., GitHub Copilot, Fiber Internet"
              className="w-full border border-gray-200 rounded-md px-3 py-1.5 text-gray-900 placeholder-gray-400 focus:outline-none focus:border-blue-500 text-xs"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-gray-800 mb-1">
                Amount (₹)
              </label>
              <input
                type="number"
                required
                value={cost}
                onChange={(e) => setCost(e.target.value)}
                placeholder="649"
                className="w-full border border-gray-200 rounded-md px-3 py-1.5 text-gray-900 placeholder-gray-400 focus:outline-none focus:border-blue-500 text-xs"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-800 mb-1">
                Cycle
              </label>
              <select
                value={cycle}
                onChange={(e) => setCycle(e.target.value)}
                className="w-full border border-gray-200 rounded-md px-3 py-1.5 text-gray-900 focus:outline-none focus:border-blue-500 text-xs"
              >
                <option value="Monthly">Monthly</option>
                <option value="Annual">Annual</option>
              </select>
            </div>
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
                <option value="Developer Tools">Developer Tools</option>
                <option value="Entertainment">Entertainment</option>
                <option value="Utilities">Utilities</option>
                <option value="Productivity">Productivity</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-800 mb-1">
                Next Renewal Date
              </label>
              <input
                type="date"
                value={nextRenewal}
                onChange={(e) => setNextRenewal(e.target.value)}
                className="w-full border border-gray-200 rounded-md px-3 py-1.5 text-gray-900 focus:outline-none focus:border-blue-500 text-xs"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-800 mb-1">
              Payment Method
            </label>
            <input
              type="text"
              value={paymentMethod}
              onChange={(e) => setPaymentMethod(e.target.value)}
              placeholder="e.g., Credit Card •••• 4091"
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
              Add Commitment
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
