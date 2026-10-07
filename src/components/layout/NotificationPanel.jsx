import React, { useState } from 'react';
import { Clock, X, ShieldAlert, CheckSquare, Calendar, Mail, CreditCard, Sparkles } from 'lucide-react';
import { useLifeOps } from '../../context/LifeOpsContext';
import { useNavigate } from 'react-router-dom';

const CATEGORY_TABS = [
  { id: 'all', label: 'All' },
  { id: 'urgent', label: 'Urgent' },
  { id: 'tasks', label: 'Tasks' },
  { id: 'calendar', label: 'Calendar' },
  { id: 'email', label: 'Email' },
  { id: 'bills', label: 'Bills' },
];

export const NotificationPanel = ({ onClose }) => {
  const { notifications, markNotificationAsRead, clearAllNotifications } = useLifeOps();
  const [activeCategory, setActiveCategory] = useState('all');
  const navigate = useNavigate();

  const filtered = notifications.filter((notif) => {
    if (activeCategory === 'all') return true;
    return notif.category === activeCategory;
  });

  const handleNotificationClick = (notif) => {
    markNotificationAsRead(notif.id);
    if (notif.category === 'tasks') navigate('/tasks');
    else if (notif.category === 'calendar') navigate('/calendar');
    else if (notif.category === 'email' || notif.category === 'urgent') navigate('/email');
    else if (notif.category === 'bills') navigate('/subscriptions');
    else if (notif.category === 'ai') navigate('/assistant');
    onClose();
  };

  return (
    <div className="absolute right-0 mt-2 w-80 rounded-lg bg-white border border-gray-200 shadow-dropdown z-50 overflow-hidden">
      {/* Header */}
      <div className="px-3.5 py-2.5 border-b border-gray-100 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="font-semibold text-xs text-gray-900">Notifications</span>
          {notifications.filter((n) => !n.read).length > 0 && (
            <span className="text-[10px] bg-[#111111] text-white font-medium px-1.5 py-0.2 rounded">
              {notifications.filter((n) => !n.read).length} new
            </span>
          )}
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={clearAllNotifications}
            className="text-[11px] text-gray-500 hover:text-gray-800 transition-colors"
          >
            Mark all read
          </button>
          <button
            onClick={onClose}
            className="p-1 rounded hover:bg-gray-100 text-gray-400 hover:text-gray-600"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-1 px-3 py-1.5 border-b border-gray-100 bg-gray-50/50 text-[11px]">
        {CATEGORY_TABS.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveCategory(tab.id)}
            className={`px-2 py-0.5 rounded font-medium transition-colors ${
              activeCategory === tab.id
                ? 'bg-white text-gray-900 shadow-subtle border border-gray-200'
                : 'text-gray-500 hover:text-gray-800'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Notifications List */}
      <div className="max-h-72 overflow-y-auto divide-y divide-gray-100">
        {filtered.length === 0 ? (
          <div className="py-6 text-center text-xs text-gray-400">
            No notifications.
          </div>
        ) : (
          filtered.map((item) => (
            <div
              key={item.id}
              onClick={() => handleNotificationClick(item)}
              className={`p-3 hover:bg-gray-50 transition-colors cursor-pointer text-left ${
                !item.read ? 'bg-[#F9FAFB]' : ''
              }`}
            >
              <div className="flex items-center justify-between mb-0.5">
                <h4 className="text-xs font-medium text-gray-900 truncate">{item.title}</h4>
                <span className="text-[10px] text-gray-400">
                  {item.time}
                </span>
              </div>
              <p className="text-[11px] text-gray-500 leading-normal line-clamp-2">{item.message}</p>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
