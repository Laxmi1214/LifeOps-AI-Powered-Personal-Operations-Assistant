import React from 'react';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';
import { useLifeOps } from '../../context/LifeOpsContext';

export const ToastContainer = () => {
  const { toasts, removeToast } = useLifeOps();

  if (toasts.length === 0) return null;

  return (
    <div className="fixed bottom-5 right-5 z-50 flex flex-col gap-2 max-w-sm pointer-events-none">
      {toasts.map((toast) => {
        let Icon = Info;
        let iconColor = 'text-black';

        if (toast.type === 'success') {
          Icon = CheckCircle2;
          iconColor = 'text-black';
        } else if (toast.type === 'warning') {
          Icon = AlertCircle;
          iconColor = 'text-black';
        }

        return (
          <div
            key={toast.id}
            className="pointer-events-auto flex items-start gap-2.5 p-3 rounded-md bg-white border border-gray-200 shadow-dropdown text-xs animate-slide-up"
          >
            <Icon className={`w-4 h-4 mt-0.5 flex-shrink-0 ${iconColor}`} />
            <div className="flex-1 min-w-0">
              <p className="text-gray-900 font-medium leading-snug">{toast.message}</p>
              {toast.actionTitle && toast.onAction && (
                <button
                  onClick={() => {
                    toast.onAction();
                    removeToast(toast.id);
                  }}
                  className="mt-1 text-[11px] font-semibold text-black hover:text-black font-bold underline underline-offset-2"
                >
                  {toast.actionTitle}
                </button>
              )}
            </div>
            <button
              onClick={() => removeToast(toast.id)}
              className="text-gray-400 hover:text-gray-600 p-0.5"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        );
      })}
    </div>
  );
};
