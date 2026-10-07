import React, { useState } from 'react';
import { Plus, BellRing, Check } from 'lucide-react';
import { useLifeOps } from '../context/LifeOpsContext';
import { AddSubscriptionModal } from '../components/subscriptions/AddSubscriptionModal';

export const Subscriptions = () => {
  const { subscriptions, setReminderForSubscription } = useLifeOps();
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [reminderSetIds, setReminderSetIds] = useState({});

  const totalMonthly = subscriptions.reduce((acc, curr) => acc + (curr.cost || 0), 0);
  const upcomingThisWeek = subscriptions
    .filter((s) => s.renewalDaysLeft <= 7)
    .reduce((acc, curr) => acc + (curr.cost || 0), 0);

  const handleSetReminder = (sub) => {
    setReminderForSubscription(sub);
    setReminderSetIds((prev) => ({ ...prev, [sub.id]: true }));
  };

  return (
    <div className="space-y-6 pb-16 animate-fade-in max-w-5xl mx-auto">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900 tracking-tight">Bills & Subscriptions</h1>
          <p className="text-xs text-gray-500 mt-1">
            Track recurring commitments and automated renewal reminders.
          </p>
        </div>

        <button
          onClick={() => setIsAddOpen(true)}
          className="self-start sm:self-auto flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-blue-600 hover:bg-blue-700 text-white text-xs font-medium transition-colors shadow-subtle"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Add subscription</span>
        </button>
      </div>

      {/* Small Minimal Summary Row */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 border border-gray-200 rounded-lg p-4 bg-white text-xs">
        <div>
          <div className="text-gray-400 text-[11px]">Monthly commitments</div>
          <div className="text-xl font-bold text-gray-900 mt-0.5">
            ₹{totalMonthly.toLocaleString()}
          </div>
          <div className="text-[11px] text-gray-500">{subscriptions.length} active services</div>
        </div>

        <div>
          <div className="text-gray-400 text-[11px]">Upcoming this week</div>
          <div className="text-xl font-bold text-gray-900 mt-0.5">
            ₹{upcomingThisWeek.toLocaleString()}
          </div>
          <div className="text-[11px] text-gray-500">
            {subscriptions.filter((s) => s.renewalDaysLeft <= 7).length} renewals due
          </div>
        </div>

        <div className="col-span-2 sm:col-span-1">
          <div className="text-gray-400 text-[11px]">Next renewal</div>
          <div className="text-sm font-semibold text-gray-900 mt-1">
            {subscriptions[0]?.name}
          </div>
          <div className="text-[11px] text-gray-500">
            {subscriptions[0]?.nextRenewal} ({subscriptions[0]?.renewalDaysLeft}d left)
          </div>
        </div>
      </div>

      {/* Commitments Table / List */}
      <div className="space-y-3">
        <h2 className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
          All Recurring Commitments
        </h2>

        <div className="border border-gray-200 rounded-lg overflow-hidden bg-white">
          <div className="grid grid-cols-12 gap-2 px-4 py-2 border-b border-gray-100 bg-gray-50/70 text-[11px] font-semibold text-gray-400 uppercase tracking-wider">
            <div className="col-span-4 sm:col-span-4">Service</div>
            <div className="col-span-2 hidden sm:block">Category</div>
            <div className="col-span-2 sm:col-span-2">Amount</div>
            <div className="col-span-3 sm:col-span-2">Renews</div>
            <div className="col-span-3 sm:col-span-2 text-right">Actions</div>
          </div>

          <div className="divide-y divide-gray-100 text-xs">
            {subscriptions.map((sub) => {
              const isReminderSet = reminderSetIds[sub.id];

              return (
                <div
                  key={sub.id}
                  className="grid grid-cols-12 gap-2 px-4 py-3 items-center hover:bg-gray-50/70 transition-colors"
                >
                  <div className="col-span-4 sm:col-span-4 min-w-0">
                    <span className="font-medium text-gray-900 block truncate">{sub.name}</span>
                    <span className="text-[11px] text-gray-400 block truncate">{sub.paymentMethod}</span>
                  </div>

                  <div className="col-span-2 hidden sm:block text-gray-500 text-[11px]">
                    {sub.category}
                  </div>

                  <div className="col-span-2 sm:col-span-2 font-medium text-gray-900">
                    {sub.formattedCost}
                    <span className="text-[11px] text-gray-400 font-normal"> /mo</span>
                  </div>

                  <div className="col-span-3 sm:col-span-2 text-gray-600 text-[11px]">
                    <div>{sub.nextRenewal}</div>
                    <div className="text-[10px] text-gray-400">in {sub.renewalDaysLeft} days</div>
                  </div>

                  <div className="col-span-3 sm:col-span-2 flex items-center justify-end">
                    {isReminderSet ? (
                      <span className="flex items-center gap-1 text-[11px] text-emerald-700 font-medium">
                        <Check className="w-3 h-3" />
                        <span>Reminder set</span>
                      </span>
                    ) : (
                      <button
                        onClick={() => handleSetReminder(sub)}
                        className="px-2.5 py-1 rounded border border-gray-200 bg-white hover:bg-gray-50 text-[11px] text-gray-700 font-medium transition-colors"
                      >
                        Set reminder
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      <AddSubscriptionModal isOpen={isAddOpen} onClose={() => setIsAddOpen(false)} />
    </div>
  );
};
